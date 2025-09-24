// src/components/AirportSelect.jsx
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

export default function AirportSelect({
  label = "From",
  value = "",
  onChange, // (string) -> "City, Country"
  onSelect, // (airportObj) optional
  placeholder = "Airport / City",
  className = "",
  maxResults = 20,
  minChars = 0,
  debounceMs = 300,
  clearOnFocus = true, // clear the field when focusing/clicking
}) {
  const dispatch = useDispatch();
  const { items: airports, status, error } = useSelector((s) => s.airports);

  // Bangladesh airports
  const bdAirports = useMemo(
    () => airports.filter((a) => (a.countryCode || "").toUpperCase() === "BD"),
    [airports]
  );

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

  // remember the last committed value to restore if user cancels
  const lastCommittedRef = useRef(q);
  useEffect(() => {
    lastCommittedRef.current = value || q;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Load airports once
  useEffect(() => {
    if (status === "idle" || (status === "failed" && !airports.length)) {
      dispatch(loadAirports());
    }
  }, [dispatch, status, airports.length]);

  // Close on outside click (restore last value if user cleared and didn't pick)
  useEffect(() => {
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
        // If user cleared the field and didn't pick anything, revert
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

  // Decide base pool: BD-only when not typing/threshold not met; ALL when typing
  const usingAllAirports = useMemo(() => {
    const len = (debouncedQ || "").length;
    if (!debouncedQ) return false; // no typing -> BD only
    if (minChars > 0 && len < minChars) return false; // below threshold -> BD only
    return true; // typing & threshold met -> ALL
  }, [debouncedQ, minChars]);

  // Filter (startsWith priority, then includes)
  const filtered = useMemo(() => {
    const pool = usingAllAirports ? airports : bdAirports;

    const needle = (debouncedQ || "").toLowerCase();
    if (
      !needle ||
      (!usingAllAirports && minChars > 0 && needle.length < minChars)
    ) {
      return pool.slice(0, maxResults);
    }

    const starts = [];
    const includes = [];
    for (const a of pool) {
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
    debouncedQ,
    airports,
    bdAirports,
    maxResults,
    minChars,
    usingAllAirports,
  ]);

  // Keep highlight in bounds
  useEffect(() => {
    setHighlight((h) =>
      filtered.length ? Math.max(0, Math.min(h, filtered.length - 1)) : -1
    );
  }, [filtered.length]);

  // figure out selected airport from full label (consider ALL airports)
  const selectedAirport = useMemo(() => {
    const cand = airports.find(
      (a) =>
        `${a.cityName}, ${a.countryName}`.toLowerCase() ===
        (q || "").trim().toLowerCase()
    );
    return cand || null;
  }, [airports, q]);

  const selectAirport = useCallback(
    (a) => {
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
      // restore previous if user cleared and presses Esc
      if ((q ?? "") === "" && (value ?? "") !== "") {
        setQ(lastCommittedRef.current || "");
      }
      setOpen(false);
    }
  };

  // Scroll highlighted into view
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector(`[data-idx="${highlight}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const isLoading = status === "loading";
  const hasError = !!error;

  // Focus handler: show dropdown & optionally clear for fresh typing
  const handleFocus = () => {
    setOpen(true);
    if (clearOnFocus && q) {
      const committed = (lastCommittedRef.current || "").trim();
      if (q.trim() === committed) {
        setQ("");
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={boxRef}>
      <div
        className="h-20 border border-gray-300 rounded-lg px-3 pt-2 pb-4 bg-white transition flex flex-col"
        role="combobox"
        aria-expanded={open}
        aria-owns="airport-listbox"
        aria-haspopup="listbox"
      >
        {/* Label */}
        <span className="text-[12px] text-gray-500">{label}</span>

        {/* Input */}
        <div
          className={`flex-1 flex ${
            !selectedAirport?.name ? "items-center" : "items-start"
          }`}
        >
          <input
            ref={inputRef}
            className="outline-none bg-transparent font-normal placeholder-gray-600 text-[14px] w-full"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={handleFocus}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-autocomplete="list"
            aria-controls="airport-listbox"
            aria-activedescendant={
              open && highlight >= 0 ? `airport-option-${highlight}` : undefined
            }
          />
        </div>

        {/* Sublabel with airport name */}
        {selectedAirport?.name && (
          <span className="text-[12px] text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {selectedAirport.name}
          </span>
        )}
      </div>

      {/* Desktop dropdown */}
      {open && (
        <div
          className="hidden md:block absolute top-full left-0 mt-2 z-50 w-[420px] max-h-[400px] overflow-y-auto border border-gray-200 rounded-xl shadow-xl bg-white"
          id="airport-listbox"
          role="listbox"
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
            filtered.map((a, i) => {
              const isActive = i === highlight;
              return (
                <button
                  key={`${a.code}-${i}`}
                  id={`airport-option-${i}`}
                  data-idx={i}
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseDown={(e) => e.preventDefault()} // keep focus on input
                  onClick={() => selectAirport(a)}
                  className={`w-full text-left flex flex-col items-start gap-2 px-6 py-5 border-b border-gray-100 transition-all duration-200 ${
                    isActive ? "bg-red-50" : "hover:bg-gray-50"
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
              );
            })}
        </div>
      )}

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed md:hidden inset-0 z-40 bg-black/40 flex items-end"
          onClick={() => {
            setOpen(false);
            // restore if cleared and not selected
            if ((q ?? "") === "" && (value ?? "") !== "") {
              setQ(lastCommittedRef.current || "");
            }
          }}
        >
          <div
            className="w-full bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slideUp shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full flex justify-center py-2 cursor-pointer"
              onClick={() => {
                setOpen(false);
                if ((q ?? "") === "" && (value ?? "") !== "") {
                  setQ(lastCommittedRef.current || "");
                }
              }}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <div className="px-6 pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Airport / City"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onKeyDown}
                  onFocus={() => {
                    if (clearOnFocus && q.trim() === (value || "").trim()) {
                      setQ("");
                    }
                  }}
                  className="w-full text-[13px] rounded-md px-4 py-5 font-semibold pr-10 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-0"
                />
              </div>
            </div>

            <div
              className="divide-y divide-gray-100"
              ref={listRef}
              id="airport-listbox"
            >
              {isLoading && (
                <div className="px-6 py-4 text-sm text-gray-500">
                  Loading airports…
                </div>
              )}
              {hasError && (
                <div className="px-6 py-4 text-sm text-red-500">{error}</div>
              )}
              {!isLoading && !hasError && filtered.length === 0 && (
                <div className="px-6 py-4 text-sm text-gray-500">
                  No results
                </div>
              )}

              {!isLoading &&
                !hasError &&
                filtered.map((a, i) => {
                  const isActive = i === highlight;
                  return (
                    <button
                      key={`${a.code}-m-${i}`}
                      id={`airport-option-m-${i}`}
                      data-idx={i}
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setHighlight(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectAirport(a)}
                      className={`w-full text-left flex flex-col items-start gap-2 px-6 py-5 transition-all duration-200 ${
                        isActive ? "bg-red-50" : "hover:bg-gray-50"
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
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
