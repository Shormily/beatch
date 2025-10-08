// src/LandingPages/AirportSelect.jsx
"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { loadAirports } from "../../redux/slices/airportsSlice";
import bdAirportsData from "../../data/airports.json";

/* ---------------- helpers ---------------- */

// Extract IATA like "(DAC)" from a label if present
const extractIataFromLabel = (txt = "") => {
  const m = String(txt || "")
    .toUpperCase()
    .match(/\(([A-Z]{3})\)/);
  return m ? m[1] : "";
};

// Normalize any incoming value to just the city part.
// "City, Country" -> "City"
// "City"          -> "City"
const toCityOnly = (v = "") => {
  const s = String(v || "").trim();
  const m = /^([^,]+),\s*(.+)$/.exec(s);
  return m ? m[1].trim() : s;
};

export default function AirportSelect({
  label = "From",
  value = "",
  onChange,
  onSelect,
  placeholder = "Airport / City",
  className = "",
  maxResults = 20,
  minChars = 0,
  debounceMs = 300,
  clearOnFocus = true,
  excludeCode,
  disabled = false,
}) {
  const dispatch = useDispatch();
  const {
    items: airports,
    status,
    error,
  } = useSelector((s) => s.airports) || {
    items: [],
    status: "idle",
    error: null,
  };

  // Prefer Redux airports; fall back to bundled JSON so it works on first paint
  const allAirports = useMemo(() => {
    const arr = Array.isArray(airports) ? airports : [];
    const fallback = Array.isArray(bdAirportsData) ? bdAirportsData : [];
    return arr.length ? arr : fallback;
  }, [airports]);

  // Bangladesh subset (used when not actively typing)
  const bdAirports = useMemo(
    () =>
      allAirports.filter((a) => (a.countryCode || "").toUpperCase() === "BD"),
    [allAirports]
  );

  // Local state
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(toCityOnly(value) || ""); // 👈 city-only in the input
  const [highlight, setHighlight] = useState(-1);

  // Keep local input synced with parent value (as city only)
  useEffect(() => {
    setQ(toCityOnly(value) || "");
  }, [value]);

  // Refs
  const boxRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const lastCommittedRef = useRef(q);

  useEffect(() => {
    lastCommittedRef.current = toCityOnly(value || q || "");
  }, [value, q]);

  // Load airports via Redux on mount (if not already)
  useEffect(() => {
    if ((status === "idle" || status === "failed") && !airports?.length) {
      dispatch(loadAirports());
    }
  }, [dispatch, status, airports?.length]);

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
        if ((q ?? "") === "" && (value ?? "") !== "") {
          setQ(lastCommittedRef.current || "");
        }
      }
    };
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, [q, value]);

  // Debounce query
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ((q || "").trim()), debounceMs);
    return () => clearTimeout(t);
  }, [q, debounceMs]);

  // Decide whether to search all airports or just BD
  const usingAllAirports = useMemo(() => {
    const len = (debouncedQ || "").length;
    if (!debouncedQ) return false;
    if (minChars > 0 && len < minChars) return false;
    return true;
  }, [debouncedQ, minChars]);

  // Filter options based on query and exclude code
  const filtered = useMemo(() => {
    const pool = usingAllAirports ? allAirports : bdAirports;
    const exclude = (excludeCode || "").trim().toUpperCase();
    const base = exclude
      ? pool.filter((a) => (a.code || "").toUpperCase() !== exclude)
      : pool;

    const needle = (debouncedQ || "").toLowerCase();
    if (!needle) return base.slice(0, maxResults);

    const starts = [];
    const includes = [];
    for (const a of base) {
      const fCode = (a.code || "").toLowerCase();
      const fName = (a.name || "").toLowerCase();
      const fCity = (a.cityName || "").toLowerCase();
      const fCountry = (a.countryName || "").toLowerCase();

      if (
        fCode.startsWith(needle) ||
        fName.startsWith(needle) ||
        fCity.startsWith(needle) ||
        fCountry.startsWith(needle)
      ) {
        starts.push(a);
      } else if (
        fCode.includes(needle) ||
        fName.includes(needle) ||
        fCity.includes(needle) ||
        fCountry.includes(needle)
      ) {
        includes.push(a);
      }
      if (starts.length + includes.length >= maxResults) break;
    }
    return [...starts, ...includes].slice(0, maxResults);
  }, [
    usingAllAirports,
    allAirports,
    bdAirports,
    excludeCode,
    debouncedQ,
    maxResults,
  ]);

  // Keep highlight index valid
  useEffect(() => {
    setHighlight((h) =>
      filtered.length ? Math.max(0, Math.min(h, filtered.length - 1)) : -1
    );
  }, [filtered.length]);

  // Resolve the selected airport for the subtitle line:
  // 1) try by (CODE) if input carries it, 2) by "City, Country", 3) exact city-only match (unique)
  const selectedAirport = useMemo(() => {
    const label = (q || value || "").trim();

    const byCode = (() => {
      const code = extractIataFromLabel(label);
      if (!code) return null;
      return (
        allAirports.find((a) => (a.code || "").toUpperCase() === code) || null
      );
    })();
    if (byCode) return byCode;

    const byCityCountry =
      allAirports.find(
        (a) =>
          `${a.cityName}, ${a.countryName}`.toLowerCase() ===
          label.toLowerCase()
      ) || null;
    if (byCityCountry) return byCityCountry;

    const exactCity = allAirports.filter(
      (a) => (a.cityName || "").toLowerCase() === label.toLowerCase()
    );
    if (exactCity.length === 1) return exactCity[0];

    return null;
  }, [allAirports, q, value]);

  // Selection handler — commit city only to the input/parent, but pass full airport object via onSelect
  const selectAirport = useCallback(
    (a) => {
      const v = a.cityName; // 👈 city only
      setQ(v);
      onChange?.(v);
      onSelect?.(a);
      lastCommittedRef.current = v;
      setOpen(false);
      inputRef.current?.blur();
    },
    [onChange, onSelect]
  );

  // Keyboard nav
  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min((h < 0 ? -1 : h) + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && filtered.length && highlight >= 0) {
        e.preventDefault();
        selectAirport(filtered[highlight]);
      }
    } else if (e.key === "Escape") {
      if ((q ?? "") === "" && (value ?? "") !== "") {
        setQ(lastCommittedRef.current || "");
      }
      setOpen(false);
    }
  };

  // Ensure the highlighted option stays in view
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector(`[data-idx="${highlight}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const isLoading = status === "loading";
  const hasError = !!error;

  const handleFocus = () => {
    if (disabled) return;
    setOpen(true);
    if (
      clearOnFocus &&
      q &&
      q.trim() === (lastCommittedRef.current || "").trim()
    ) {
      setQ("");
    }
  };

  return (
    <div className={`relative ${className}`} ref={boxRef}>
      <div
        className={`h-20 border rounded-lg bg-white flex flex-col py-2 px-4 ${
          disabled ? "opacity-60 pointer-events-none" : "cursor-pointer"
        } border-gray-300`}
        role="combobox"
        aria-expanded={open}
        onClick={(e) => {
          if (disabled) return;
          if (e.target.tagName !== "INPUT") {
            setOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        <span className="text-xs text-gray-500">{label}</span>

        {/* City-only input */}
        <div className="flex-1 flex items-start">
          <input
            className="outline-none bg-transparent text-base text-stone-800 font-semibold w-full"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            ref={inputRef}
            onFocus={handleFocus}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>

        {/* Second line: airport name (subtitle) */}
        <span className="text-sm text-gray-500 truncate">
          {selectedAirport?.name || ""}
        </span>
      </div>

      {open && !disabled && (
        <div
          className="absolute top-full left-0 mt-2 z-50 w-[420px] max-h-[400px] overflow-y-auto border border-gray-200 rounded-xl shadow-xl bg-white"
          ref={listRef}
        >
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500">
              Loading airports…
            </div>
          )}
          {hasError && (
            <div className="px-4 py-3 text-sm text-red-500">{error}</div>
          )}
          {!isLoading && !hasError && filtered.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">No results</div>
          )}

          {!isLoading &&
            !hasError &&
            filtered.map((a, i) => (
              <button
                key={`${a.code}-${i}`}
                data-idx={i}
                onMouseDown={(e) => e.preventDefault()} // keep focus on input
                onClick={() => selectAirport(a)}
                className={`w-full text-left flex flex-col items-start gap-2 px-6 py-5 border-b border-gray-100 transition ${
                  i === highlight ? "bg-red-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span className="text-red-500">
                      <BiSolidPlaneAlt size={22} />
                    </span>
                    <span className="font-semibold text-base">
                      {a.cityName}, {a.countryName}
                    </span>
                  </div>
                  <span className="text-base font-bold text-gray-700">
                    {a.code}
                  </span>
                </div>
                <div className="pl-8 text-sm text-gray-500">{a.name}</div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
