// src/components/calender.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isValid } from "date-fns";

// --- helpers ---
const stripTime = (d) => {
  if (!(d instanceof Date) || !isValid(d)) return null;
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const fmtWeekday = (date) => (date ? format(date, "EEEE") : "");
const toIso = (date) => (date ? format(date, "yyyy-MM-dd") : "");

// parse defaults that might be Date | "yyyy-MM-dd" | "dd LLL, yyyy"
const parseIn = (v, fallback) => {
  if (!v) return fallback;
  if (v instanceof Date && isValid(v)) return stripTime(v);

  if (typeof v === "string") {
    const iso = parse(v, "yyyy-MM-dd", new Date());
    if (isValid(iso)) return stripTime(iso);

    const label = parse(v, "dd LLL, yyyy", new Date());
    if (isValid(label)) return stripTime(label);

    const d = new Date(v);
    if (isValid(d)) return stripTime(d);
  }
  return fallback;
};

export default function FirsttripCalendarClone({
  disableReturn = false,
  onChange, // ({ departureDate, returnDate })
  defaultDeparture, // Date | "yyyy-MM-dd" | "15 Sep, 2025"
  defaultReturn, // Date | "yyyy-MM-dd" | "15 Sep, 2025"
  minDepartureDate, // Date (optional)
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // init state
  const [range, setRange] = useState(() => {
    const start = parseIn(defaultDeparture, today);
    const endBase = start ? new Date(start.getTime() + 3 * 86400000) : today;
    const end = disableReturn ? null : parseIn(defaultReturn, endBase);
    return { startDate: start, endDate: end };
  });

  // keep in sync if defaults change (e.g., restored from Redux persist)
  useEffect(() => {
    const start = parseIn(defaultDeparture, today);
    const endBase = start ? new Date(start.getTime() + 3 * 86400000) : today;
    const end = disableReturn ? null : parseIn(defaultReturn, endBase);
    setRange({ startDate: start, endDate: end });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDeparture, defaultReturn, disableReturn]);

  // ensure end >= start
  useEffect(() => {
    setRange((r) => {
      if (!r.startDate || !r.endDate) return r;
      return r.endDate < r.startDate ? { ...r, endDate: r.startDate } : r;
    });
  }, [range.startDate]);

  // clear return when one-way turns on
  useEffect(() => {
    if (disableReturn && range.endDate) {
      setRange((r) => ({ ...r, endDate: null }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableReturn]);

  // notify parent
  useEffect(() => {
    onChange?.({
      departureDate: toIso(range.startDate),
      returnDate: disableReturn ? "" : toIso(range.endDate),
    });
  }, [range.startDate, range.endDate, disableReturn, onChange]);

  // use a portal on small screens to avoid z-index/click issues
  const usePortal =
    typeof window !== "undefined" ? window.innerWidth < 640 : false;

  return (
    <div className="basis-[35%] flex flex-col sm:flex-row gap-4 sm:gap-0">
      {/* Departure */}
      <div className="sm:w-1/2 w-full relative sm:gap-4">
        <div
          className="h-20 border border-gray-300 rounded-lg sm:rounded-l-md sm:rounded-r-none px-4 pb-1 flex flex-col justify-between bg-white cursor-pointer"
          onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
        >
          <label className="text-[12px] text-gray-500 pt-2">Departure</label>
          <div className="flex flex-col gap-0.5">
            <DatePicker
              selected={range.startDate}
              onChange={(date) => {
                const clean = stripTime(date);
                if (!clean) return; // ignore null/invalid
                setRange((r) => ({
                  ...r,
                  startDate: clean,
                  // if return exists but now < new start, align it
                  endDate: r.endDate && r.endDate < clean ? clean : r.endDate,
                }));
              }}
              dateFormat="MM/dd/yyyy"
              className="font-semibold text-sm pb-1 bg-transparent outline-none w-full cursor-pointer"
              minDate={minDepartureDate ? stripTime(minDepartureDate) : today}
              shouldCloseOnSelect
              withPortal={usePortal}
            />
            <span className="text-[12px] text-gray-500">
              {fmtWeekday(range.startDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Return */}
      <div className="sm:w-1/2 w-full relative">
        <div
          className={`h-20 border border-gray-300 rounded-lg sm:rounded-r-md sm:rounded-l-none sm:border-l-0 px-4 pb-1 flex flex-col justify-between bg-white cursor-pointer ${
            disableReturn ? "opacity-50" : ""
          }`}
          onClick={(e) =>
            !disableReturn && e.currentTarget.querySelector("input")?.focus()
          }
        >
          <label className="text-[12px] text-gray-500 pt-2">Return</label>
          <div className="flex flex-col gap-0.5">
            <DatePicker
              selected={range.endDate}
              onChange={(date) => {
                const clean = stripTime(date);
                if (!clean) return; // ignore null/invalid
                setRange((r) => ({
                  ...r,
                  endDate:
                    r.startDate && clean < r.startDate ? r.startDate : clean,
                }));
              }}
              dateFormat="MM/dd/yyyy"
              className="font-semibold text-sm bg-transparent outline-none w-full cursor-pointer"
              minDate={range.startDate || today}
              disabled={disableReturn}
              placeholderText={disableReturn ? "One-way" : "Select return"}
              shouldCloseOnSelect
              withPortal={usePortal}
            />
            <span className="text-[12px] text-gray-500">
              {range.endDate
                ? fmtWeekday(range.endDate)
                : disableReturn
                ? "—"
                : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
