// src/components/calender.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isValid } from "date-fns";

// ---- helpers ----------------------------------------------------------
const fmtWeekday = (date) => (date ? format(date, "EEEE") : "");

// Try multiple incoming formats safely
const parseIn = (v, fallback) => {
  if (!v) return fallback;
  if (v instanceof Date && isValid(v)) return v;

  // Try ISO first
  if (typeof v === "string") {
    // 1) ISO yyyy-MM-dd
    const iso = parse(v, "yyyy-MM-dd", new Date());
    if (isValid(iso)) return stripTime(iso);

    // 2) Label like "15 Sep, 2025"
    const label = parse(v, "dd LLL, yyyy", new Date());
    if (isValid(label)) return stripTime(label);

    // 3) Fallback to Date()
    const d = new Date(v);
    if (isValid(d)) return stripTime(d);
  }

  return fallback;
};

const stripTime = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

// Emit ISO date in local calendar (no timezone offset applied)
const toIso = (date) => (date ? format(date, "yyyy-MM-dd") : "");

// ---- component --------------------------------------------------------
export default function FirsttripCalendarClone({
  disableReturn = false,
  onChange, // ({ departureDate, returnDate })
  defaultDeparture, // Date | "YYYY-MM-DD" | "15 Sep, 2025"
  defaultReturn, // Date | "YYYY-MM-DD" | "15 Sep, 2025"
  minDepartureDate, // Date (optional)
  PopperContainer: ExternalPopper, // optional popper container from parent
}) {
  const today = useMemo(() => stripTime(new Date()), []);

  // Initial range (3-day default gap if return allowed)
  const [range, setRange] = useState(() => {
    const start = parseIn(defaultDeparture, today);
    const endBase = stripTime(new Date(start.getTime() + 3 * 86400000));
    const end = disableReturn ? null : parseIn(defaultReturn, endBase);
    return { startDate: start, endDate: end };
  });

  // Sync when props default* change (e.g., loaded from Redux/persist)
  useEffect(() => {
    const start = parseIn(defaultDeparture, today);
    const endBase = stripTime(new Date(start.getTime() + 3 * 86400000));
    const end = disableReturn ? null : parseIn(defaultReturn, endBase);
    setRange({ startDate: start, endDate: end });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDeparture, defaultReturn, disableReturn]);

  // keep endDate >= startDate
  useEffect(() => {
    setRange((r) => {
      if (!r.startDate) return r;
      if (!r.endDate) return r;
      if (r.endDate < r.startDate) {
        return { ...r, endDate: r.startDate };
      }
      return r;
    });
  }, [range.startDate]);

  // Clear return when one-way toggles on
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

  // Default centered popper (used if ExternalPopper not provided)
  const FallbackPopper = ({ children }) => (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        width: "90%",
        maxWidth: "400px",
      }}
    >
      {children}
    </div>
  );

  const PopperWrapper = ExternalPopper || FallbackPopper;

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
              onChange={(date) =>
                setRange((r) => ({ ...r, startDate: stripTime(date) }))
              }
              dateFormat="MM/dd/yyyy"
              calendarClassName="custom-calendar"
              popperContainer={PopperWrapper}
              className="font-semibold text-sm pb-1 bg-transparent outline-none w-full cursor-pointer"
              popperPlacement="bottom"
              minDate={minDepartureDate ? stripTime(minDepartureDate) : today}
              // improve keyboard/screen reader
              ariaLabelledBy="dep-label"
            />
            <span id="dep-label" className="text-[12px] text-gray-500">
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
              onChange={(date) =>
                setRange((r) => ({ ...r, endDate: stripTime(date) }))
              }
              dateFormat="MM/dd/yyyy"
              calendarClassName="custom-calendar"
              popperContainer={PopperWrapper}
              className="font-semibold text-sm bg-transparent outline-none w-full cursor-pointer"
              popperPlacement="bottom"
              minDate={range.startDate || today}
              disabled={disableReturn}
              placeholderText={disableReturn ? "One-way" : "Select return"}
              ariaLabelledBy="ret-label"
            />
            <span id="ret-label" className="text-[12px] text-gray-500">
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
