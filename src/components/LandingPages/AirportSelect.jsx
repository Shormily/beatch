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

// --- helpers ---
const extractIataFromLabel = (txt = "") => {
  const m = String(txt || "")
    .toUpperCase()
    .match(/\(([A-Z]{3})\)/);
  return m ? m[1] : "";
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

  // Use Redux when present; fallback to local JSON so lookups work on first paint
  const allAirports = useMemo(() => {
    const arr = airports && Array.isArray(airports) ? airports : [];
    const fallback = Array.isArray(bdAirportsData) ? bdAirportsData : [];
    return arr.length ? arr : fallback;
  }, [airports]);

  // Bangladesh subset (shown when not typing)
  const bdAirports = useMemo(
    () =>
      allAirports.filter((a) => (a.countryCode || "").toUpperCase() === "BD"),
    [allAirports]
  );

  // Debug: warn if nothing to show
  useEffect(() => {
    if (!allAirports.length) {
      console.warn(
        "[AirportSelect] No airports loaded. Check redux slice and /data/airports.json."
      );
    }
  }, [allAirports.length]);

  // Debug: print BD list once
  const printedRef = useRef(false);
  useEffect(() => {
    if (!printedRef.current && bdAirports.length) {
      printedRef.current = true;
      console.log(
        "🇧🇩 BD airports loaded:",
        JSON.stringify(bdAirports, null, 2)
      );
    }
  }, [bdAirports]);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(value || "");
  const [highlight, setHighlight] = useState(-1);

  // keep local q in sync with prop changes
  useEffect(() => {
    setQ(value || "");
  }, [value]);

  const boxRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const lastCommittedRef = useRef(q);
  useEffect(() => {
    lastCommittedRef.current = value || q;
  }, [value]);

  // Load airports if needed from redux
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
        // restore previous if user cleared and didn't pick
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

  // Pool selection: BD-only when not typing; ALL when typing (and threshold met)
  const usingAllAirports = useMemo(() => {
    const len = (debouncedQ || "").length;
    if (!debouncedQ) return false;
    if (minChars > 0 && len < minChars) return false;
    return true;
  }, [debouncedQ, minChars]);

  // Filter options
  const filtered = useMemo(() => {
    const pool = usingAllAirports ? allAirports : bdAirports;
    const exclude = (excludeCode || "").trim().toUpperCase();
    const base = exclude
      ? pool.filter((a) => (a.code || "").toUpperCase() !== exclude)
      : pool;

    // If nothing typed, show first page
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

  // keep highlight valid
  useEffect(() => {
    setHighlight((h) =>
      filtered.length ? Math.max(0, Math.min(h, filtered.length - 1)) : -1
    );
  }, [filtered.length]);

  // Resolve the selected airport by "(CODE)" first, then "City, Country"
  const selectedAirport = useMemo(() => {
    const label = (q || value || "").trim();
    // Try "(CODE)" format
    const code = extractIataFromLabel(label);
    if (code) {
      const byCode = allAirports.find(
        (a) => (a.code || "").toUpperCase() === code
      );
      if (byCode) return byCode;
    }
    // Fallback: "City, Country"
    const lc = label.toLowerCase();
    return (
      allAirports.find(
        (a) => `${a.cityName}, ${a.countryName}`.toLowerCase() === lc
      ) || null
    );
  }, [allAirports, q, value]);

  const selectAirport = useCallback(
    (a) => {
      // Use "City, Country" so resolver is consistent
      const v = `${a.cityName}, ${a.countryName}`;
      setQ(v);
      onChange?.(v);
      onSelect?.(a);
      lastCommittedRef.current = v;
      setOpen(false);
      inputRef.current?.blur();
    },
    [onChange, onSelect]
  );

  // Keyboard navigation
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

  // Ensure highlighted option is visible
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector(`[data-idx="${highlight}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const isLoading = status === "loading";
  const hasError = !!error;

  const handleFocus = () => {
    setOpen(true);
    // If user focuses on a committed value, clear for new typing
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
        className="h-20 border cursor-pointer pointer-events-auto border-gray-300 rounded-lg px-3 pt-2 pb-4 bg-white flex flex-col"
        role="combobox"
        aria-expanded={open}
        // 👇 This ensures clicking the card opens the list and focuses the input
        onClick={(e) => {
          if (e.target.tagName !== "INPUT") {
            setOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        <span className="text-[12px] text-gray-500">{label}</span>
        <div className="flex-1 flex items-start">
          <input
            className="outline-none bg-transparent text-[14px] w-full"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            ref={inputRef}
            onFocus={handleFocus}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
          />
        </div>
        {/* Always render the second line; empty string collapses visually if not found */}
        <span className="text-[12px] text-gray-500 truncate">
          {selectedAirport?.name || ""}
        </span>
      </div>

      {open && (
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
