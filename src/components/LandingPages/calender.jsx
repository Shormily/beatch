"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import {
  format,
  isValid,
  parse,
  startOfDay,
  isBefore,
  isEqual,
  isWithinInterval,
} from "date-fns";

// helpers
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

export default function FirsttripCalendarClone({
  disableReturn = false, // one-way if true
  onChange, // ({ departureDate, returnDate })
  defaultDeparture, // Date | "yyyy-MM-dd"
  defaultReturn, // Date | "yyyy-MM-dd"
  minDepartureDate, // Date
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const minDate = useMemo(
    () => strip(minDepartureDate) || today,
    [minDepartureDate, today]
  );

  // seed
  const s0 = parseIn(defaultDeparture, today);
  const e0 = disableReturn ? null : parseIn(defaultReturn, null);

  const [startDate, setStartDate] = useState(s0);
  const [endDate, setEndDate] = useState(e0);
  const [open, setOpen] = useState(false);
  const [months, setMonths] = useState(monthsFor(disableReturn));
  const [activeSide, setActiveSide] = useState("start"); // "start" | "end"
  const popRef = useRef(null);

  // outside click closes
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // responsive months
  useEffect(() => {
    const onResize = () => setMonths(monthsFor(disableReturn));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [disableReturn]);

  // sync from props
  useEffect(() => {
    const s = parseIn(defaultDeparture, today);
    const e = disableReturn ? null : parseIn(defaultReturn, null);
    setStartDate(s);
    setEndDate(e);
  }, [defaultDeparture, defaultReturn, disableReturn, today]);

  // ensure end >= start
  useEffect(() => {
    if (startDate && endDate && isBefore(endDate, startDate))
      setEndDate(startDate);
  }, [startDate, endDate]);

  // bubble up
  useEffect(() => {
    onChange?.({
      departureDate: toIso(startDate),
      returnDate: disableReturn ? "" : toIso(endDate),
    });
  }, [startDate, endDate, disableReturn, onChange]);

  // ONE-WAY
  if (disableReturn) {
    const oneStr = startDate ? format(startDate, "d LLL, yyyy") : "";
    const Pill = ({ label, dateStr, muted }) => (
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex-1 border rounded-md px-3 py-2 text-left bg-white hover:bg-gray-50 transition ${
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
      <div className="relative">
        <div className="flex gap-2">
          <Pill label="Departure" dateStr={oneStr} />
          <Pill label="Return" dateStr="" muted />
        </div>

        {open && (
          <div
            ref={popRef}
            className="absolute z-50 mt-2 w-[90vw] sm:w-[360px] bg-white border border-gray-200 rounded-2xl shadow-xl p-3"
          >
            <DayPicker
              mode="single"
              selected={startDate || undefined}
              onSelect={(d) => {
                const s = strip(d);
                if (!s || isBefore(s, minDate)) return;
                setStartDate(s);
                setOpen(false);
              }}
              fromDate={minDate}
              numberOfMonths={months}
              pagedNavigation
              fixedWeeks
              showOutsideDays
            />
          </div>
        )}
      </div>
    );
  }

  // ROUND-TRIP (manual, but with VISIBLE range)
  const depStr = startDate ? format(startDate, "d LLL, yyyy") : "";
  const retStr = endDate ? format(endDate, "d LLL, yyyy") : "";

  const Pill = ({ label, dateStr, active, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-md px-3 py-2 text-left bg-white transition border ${
        active
          ? "border-red-500 ring-1 ring-red-200"
          : "border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className="text-[11px] text-gray-500">{label}</div>
      <div className="font-semibold select-none caret-transparent">
        {dateStr || "—"}
      </div>
      <div className="text-[11px] text-gray-500 -mt-0.5">
        {dateStr ? format(new Date(dateStr), "EEEE") : ""}
      </div>
    </button>
  );

  // modifiers to DRAW the range
  const isMiddle = (day) =>
    startDate &&
    endDate &&
    isWithinInterval(day, { start: startDate, end: endDate }) &&
    !isEqual(day, startDate) &&
    !isEqual(day, endDate);

  const modifiers = {
    rangeMiddle: isMiddle,
    rangeStart: (day) => startDate && isEqual(day, startDate),
    rangeEnd: (day) => endDate && isEqual(day, endDate),
  };

  // give styles for those modifiers so they actually show
  const modifiersStyles = {
    rangeMiddle: { backgroundColor: "#fee2e2", borderRadius: 8 }, // red-100
    rangeStart: {
      backgroundColor: "#dc2626",
      color: "#fff",
      borderRadius: 9999,
      fontWeight: 700,
    }, // red pill
    rangeEnd: {
      backgroundColor: "#dc2626",
      color: "#fff",
      borderRadius: 9999,
      fontWeight: 700,
    }, // red pill
  };

  const disabledDays = [
    { before: minDate },
    activeSide === "end" && startDate ? { before: startDate } : null,
  ].filter(Boolean);

  const handlePick = (day) => {
    const d = strip(day);
    if (!d || isBefore(d, minDate)) return;

    if (activeSide === "start") {
      setStartDate(d);
      if (endDate && isBefore(endDate, d)) setEndDate(undefined);
      setActiveSide("end");
    } else {
      if (!startDate || isBefore(d, startDate)) {
        setStartDate(d);
        setEndDate(undefined);
        setActiveSide("end");
      } else {
        setEndDate(d);
        setOpen(false);
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Pill
          label="Departure"
          dateStr={depStr}
          active={activeSide === "start"}
          onClick={() => {
            setActiveSide("start");
            setOpen(true);
          }}
        />
        <Pill
          label="Return"
          dateStr={retStr}
          active={activeSide === "end"}
          onClick={() => {
            setActiveSide("end");
            setOpen(true);
          }}
        />
      </div>

      {open && (
        <div
          ref={popRef}
          className="absolute z-50 mt-2 w-[90vw] sm:w-[680px] bg-white border border-gray-200 rounded-2xl shadow-xl p-3"
        >
          <DayPicker
            mode="single" // we write start/end ourselves
            selected={[startDate, endDate].filter(Boolean)}
            onDayClick={handlePick}
            fromDate={minDate}
            numberOfMonths={months} // 2 desktop, 1 mobile
            pagedNavigation
            fixedWeeks
            showOutsideDays
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
        </div>
      )}
    </div>
  );
}
