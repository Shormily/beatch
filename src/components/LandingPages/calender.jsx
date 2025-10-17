// src/LandingPages/calender.jsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import {
  addDays,
  format,
  isValid,
  parse,
  startOfDay,
  isBefore,
  isEqual,
  isWithinInterval,
} from "date-fns";

/* ---------- helpers ---------- */

/* ---------- helpers ---------- */
const disabledStyle = {
  filter: "grayscale(1)",
  opacity: 0.45,
  cursor: "not-allowed",
  pointerEvents: "none",
};

const strip = (d) => {
  if (!(d instanceof Date) || !isValid(d)) return null;
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const toIso = (d) => (d ? format(d, "yyyy-MM-dd") : "");
const parseIn = (v, fb) => {
  if (!v) return fb || null;
  if (v instanceof Date) return strip(v) || fb || null;
  if (typeof v === "string") {
    const iso = parse(v, "yyyy-MM-dd", new Date());
    if (isValid(iso)) return strip(iso);
    const any = new Date(v);
    if (isValid(any)) return strip(any);
  }
  return fb || null;
};
const monthsFor = (oneWay) =>
  typeof window !== "undefined" && window.innerWidth < 640 ? 1 : oneWay ? 1 : 2;

/* ---------- component ---------- */
export default function FirsttripCalendarClone({
  disableReturn = false,
  departureISO,
  returnISO,
  onDatesChange,
  defaultDeparture,
  defaultReturn,
  minDepartureDate,
  autoOpenAt = null,
  onPromoteRoundTrip,
  onRequestOneWayClear,
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const minDate = useMemo(
    () => strip(minDepartureDate ?? null) || today,
    [minDepartureDate, today]
  );

  const isControlled =
    typeof departureISO === "string" || typeof returnISO === "string";

  const s0 = isControlled
    ? parseIn(departureISO, today)
    : parseIn(defaultDeparture, today);
  const e0 = disableReturn
    ? null
    : isControlled
    ? parseIn(returnISO, null)
    : parseIn(defaultReturn, null);

  const [startDate, setStartDate] = useState(s0);
  const [endDate, setEndDate] = useState(e0);
  const [open, setOpen] = useState(false);
  const [months, setMonths] = useState(monthsFor(disableReturn));
  const [activeSide, setActiveSide] = useState("start"); // 'start' | 'end'

  const containerRef = useRef(null);
  const popRef = useRef(null);
  const openingRef = useRef(false);
  const prevDisableRef = useRef(disableReturn);

  // Reset interaction state when switching modes (one-way <-> round-trip)
  useEffect(() => {
    setOpen(false);
    setActiveSide("start");
    openingRef.current = false;
  }, [disableReturn]);

  // sync controlled props
  useEffect(() => {
    if (!isControlled) return;
    setStartDate(parseIn(departureISO, today));
    setEndDate(disableReturn ? null : parseIn(returnISO, null));
  }, [isControlled, departureISO, returnISO, disableReturn, today]);

  // close on outside click / Esc
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (openingRef.current) {
        openingRef.current = false;
        return;
      }
      const root = containerRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const id = setTimeout(() => {
      document.addEventListener("mousedown", onDoc);
      document.addEventListener("keydown", onKey);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // responsive months
  useEffect(() => {
    const onResize = () => setMonths(monthsFor(disableReturn));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [disableReturn]);

  useEffect(() => {
    if (isControlled) return;
    setStartDate(parseIn(defaultDeparture, today));
    setEndDate(disableReturn ? null : parseIn(defaultReturn, null));
  }, [isControlled, defaultDeparture, defaultReturn, disableReturn, today]);

  useEffect(() => {
    if (startDate && endDate && isBefore(endDate, startDate)) {
      setEndDate(startDate);
    }
  }, [startDate, endDate]);

  // bubble up
  useEffect(() => {
    if (!onDatesChange) return;
    const depISO = toIso(startDate);
    const retISO = disableReturn ? "" : toIso(endDate);
    onDatesChange({ departureISO: depISO, returnISO: retISO });
  }, [startDate, endDate, disableReturn, onDatesChange]);

  useEffect(() => {
    if (!autoOpenAt) return;
    setActiveSide(autoOpenAt === "end" ? "end" : "start");
    setOpen(true);
  }, [autoOpenAt]);

  useEffect(() => {
    const prev = prevDisableRef.current;
    if (prev === true && disableReturn === false) {
      if (!endDate) {
        let candidate = addDays(today, 3);
        // must not be before minDate
        if (isBefore(candidate, minDate)) candidate = addDays(minDate, 3);
        // must not be before start date (if user already picked a future departure)
        const baseStart = startDate || minDate || today;
        if (isBefore(candidate, baseStart)) candidate = addDays(baseStart, 3);
        setEndDate(candidate);
        // also reflect immediately upstream
        onDatesChange?.({
          departureISO: toIso(startDate || baseStart),
          returnISO: toIso(candidate),
        });
      }
      // optionally open picker on Return (parent may also set autoOpenAt='end')
      setActiveSide("end");
    }
    prevDisableRef.current = disableReturn;
  }, [disableReturn, endDate, startDate, minDate, today, onDatesChange]);

  /* ================= ONE-WAY ================= */
  if (disableReturn) {
    const oneStr = startDate ? format(startDate, "d LLL, yyyy") : "";

    const Pill = ({ label, dateStr, muted, onClick }) => (
      <button
        type="button"
        onMouseDown={() => {
          openingRef.current = true;
          onClick?.();
        }}
        className={`flex-1 h-20 border border-gray-300 rounded-lg px-3 text-left bg-white hover:bg-gray-50 cursor-pointer transition ${
          muted ? "opacity-60" : ""
        }`}
      >
        <div className="text-[11px] text-gray-500">{label}</div>
        <div className="font-semibold select-none caret-transparent">
          {dateStr || (muted ? "One-way" : "—")}
        </div>
        <div className="text-[11px] text-gray-500 -mt-0.5">
          {dateStr ? format(new Date(dateStr), "EEEE") : ""}
        </div>
      </button>
    );

    return (
      <div ref={containerRef} className="relative">
        <div className="flex gap-2 ">
          <Pill
            label="Departure"
            dateStr={oneStr}
            onClick={() => setOpen(true)}
          />
          {/* Clicking the muted Return pill promotes to round-trip */}
          <Pill
            label="Return"
            dateStr=""
            muted
            onClick={() => {
              onPromoteRoundTrip && onPromoteRoundTrip();
            }}
          />
        </div>

        {open && (
          <div
            ref={popRef}
            className="absolute z-50 mt-2 w-[90vw] sm:w-[360px]  bg-white border border-gray-200 rounded-2xl shadow-xl p-3"
          >
            <DayPicker
              mode="single"
              selected={startDate || undefined}
              onSelect={(d) => {
                const s = strip(d ?? null);
                if (!s || isBefore(s, minDate)) return;
                setStartDate(s);
                setOpen(false);
                onDatesChange?.({ departureISO: toIso(s), returnISO: "" });
              }}
              fromDate={minDate}
              numberOfMonths={1}
              pagedNavigation
              fixedWeeks
              showOutsideDays
              /* NEW: gray out past dates */
              disabled={[{ before: minDate }]}
              modifiersStyles={{ disabled: disabledStyle }}
            />
          </div>
        )}
      </div>
    );
  }

  /* ================= ROUND-TRIP ================= */
  const depStr = startDate ? format(startDate, "d LLL, yyyy") : "";
  const retStr = endDate ? format(endDate, "d LLL, yyyy") : "";

  const Pill = ({ label, dateStr, onClick, onClear }) => (
    <div className="relative flex-1">
      <button
        type="button"
        onMouseDown={() => {
          openingRef.current = true;
          onClick();
          setOpen(true);
        }}
        className={`w-full h-20 border border-gray-300 rounded-lg px-3 py-2 text-left bg-white transition`}
      >
        <div className="text-[11px] text-gray-500">{label}</div>
        <div className="font-semibold select-none caret-transparent">
          {dateStr || "—"}
        </div>
        <div className="text-[11px] text-gray-500 -mt-0.5">
          {dateStr ? format(new Date(dateStr), "EEEE") : ""}
        </div>
      </button>

      {/* ❌ Small clear (X) button on the Return pill */}
      {label === "Return" && dateStr && (
        <button
          type="button"
          aria-label="Clear return date"
          title="Clear return date"
          onMouseDown={(e) => {
            e.stopPropagation();
            openingRef.current = false;
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClear?.();
          }}
          className="absolute right-2 top-2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm leading-none grid place-items-center"
        >
          ×
        </button>
      )}
    </div>
  );

  const isMiddle = (day) =>
    !!(
      startDate &&
      endDate &&
      isWithinInterval(day, { start: startDate, end: endDate }) &&
      !isEqual(day, startDate) &&
      !isEqual(day, endDate)
    );

  const modifiers = {
    rangeMiddle: isMiddle,
    rangeStart: (day) => !!(startDate && isEqual(day, startDate)),
    rangeEnd: (day) => !!(endDate && isEqual(day, endDate)),
  };

  const modifiersStyles = {
    rangeMiddle: { backgroundColor: "#fee2e2", borderRadius: 8 },
    rangeStart: {
      backgroundColor: "#dc2626",
      color: "#fff",
      borderRadius: 9999,
      fontWeight: 700,
    },
    rangeEnd: {
      backgroundColor: "#dc2626",
      color: "#fff",
      borderRadius: 9999,
      fontWeight: 700,
    },
  };

  const disabledDays = [
    { before: minDate },
    activeSide === "end" && startDate ? { before: startDate } : null,
  ].filter(Boolean);

  const commit = (s, e) => {
    setStartDate(s);
    setEndDate(e);
    onDatesChange?.({
      departureISO: toIso(s),
      returnISO: toIso(e),
    });
  };

  const handlePick = (day) => {
    const d = strip(day ?? null);
    if (!d || isBefore(d, minDate)) return;

    if (activeSide === "start") {
      if (endDate && isBefore(endDate, d)) {
        commit(d, null);
      } else {
        commit(d, endDate);
      }
      setActiveSide("end");
    } else {
      if (!startDate || isBefore(d, startDate)) {
        commit(d, null);
        setActiveSide("end");
      } else {
        commit(startDate, d);
        setOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-2">
        <Pill
          label="Departure"
          dateStr={depStr}
          active={activeSide === "start"}
          onClick={() => setActiveSide("start")}
        />
        <Pill
          label="Return"
          dateStr={retStr}
          active={activeSide === "end"}
          onClick={() => setActiveSide("end")}
          onClear={() => {
            // 1) Clear local return date
            setEndDate(null);

            // 2) Tell parent to flip to ONE_WAY (changes radio + disables return)
            onRequestOneWayClear?.();

            // 3) Bubble up date change (empty return)
            onDatesChange?.({
              departureISO: toIso(startDate),
              returnISO: "",
            });

            // 4) Close popover and reset focus to Departure
            setOpen(false);
            setActiveSide("start");
          }}
        />
      </div>

      {open && (
        <div
          ref={popRef}
          className="absolute z-50 mt-2 w-[90vw] sm:w-[645px] bg-white border border-gray-200 rounded-2xl shadow-xl p-3"
        >
          {/* Header row with One-way clear button */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700 px-1">
              Select {activeSide === "start" ? "Departure" : "Return"} date
            </div>
            <button
              type="button"
              onClick={() => {
                // clear return & request one-way on parent
                onRequestOneWayClear && onRequestOneWayClear();
                // locally reset + close
                setEndDate(null);
                setActiveSide("start");
                setOpen(false);
                onDatesChange?.({
                  departureISO: toIso(startDate),
                  returnISO: "",
                });
              }}
              className="text-xs px-2 py-1 rounded-full border border-gray-300 hover:bg-gray-50"
              title="Clear return & set One-way"
            >
              Clear return • One-way
            </button>
          </div>

          <DayPicker
            mode="single"
            selected={[startDate, endDate].filter(Boolean)}
            onDayClick={handlePick}
            fromDate={minDate}
            numberOfMonths={months}
            pagedNavigation
            fixedWeeks
            showOutsideDays
            disabled={disabledDays}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
        </div>
      )}
    </div>
  );
}
