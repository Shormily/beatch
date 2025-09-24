// src/components/FlightSortBar.jsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LuBadgeDollarSign,
  LuClock,
  LuSun,
  LuChevronDown,
  LuChevronUp,
} from "react-icons/lu";

export default function FlightSortBar({
  sortKey,
  onChange,
  counts,
  metrics,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!open) return;
      const t = e.target;
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        btnRef.current &&
        !btnRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const moreSorts = useMemo(
    () => [
      { key: "earliest", label: "Earliest" },
      { key: "earlyDeparture", label: "Early Departure" },
      { key: "lateDeparture", label: "Late Departure" },
      { key: "earlyArrival", label: "Early Arrival" },
      { key: "lateArrival", label: "Late Arrival" },
    ],
    []
  );

  const formatBDT = (v) => {
    if (v === undefined || v === null || v === "") return "—";
    if (typeof v === "string") return `৳ ${v}`;
    try {
      return `৳ ${v.toLocaleString("en-BD")}`;
    } catch {
      return `৳ ${v}`;
    }
  };

  const pillBase =
    "flex items-center gap-3 rounded-2xl border px-4 py-3 min-w-[150px] shadow-sm transition";
  const inactive =
    "bg-white border-gray-200 hover:border-gray-300 text-gray-800";
  const active = "bg-red-600 border-red-600 text-white";

  const Sub = ({ children, active }) => (
    <span className={`text-xs ${active ? "text-red-50" : "text-gray-500"}`}>
      {children}
    </span>
  );

  return (
    <div className={`flex items-start gap-3 flex-wrap ${className}`}>
      {/* Cheapest */}
      <button
        onClick={() => onChange("cheapest")}
        className={`${pillBase} ${sortKey === "cheapest" ? active : inactive}`}
      >
        <span
          className={`grid place-items-center h-7 w-7 rounded-full ${
            sortKey === "cheapest" ? "bg-white/15" : "bg-gray-100"
          }`}
        >
          <LuBadgeDollarSign
            size={18}
            className={`${
              sortKey === "cheapest" ? "text-white" : "text-gray-700"
            }`}
          />
        </span>
        <div className="flex flex-col leading-4">
          <span className="text-sm font-semibold">Cheapest</span>
          <Sub active={sortKey === "cheapest"}>
            {formatBDT(metrics?.cheapestPrice)}
          </Sub>
        </div>
      </button>

      {/* Fastest */}
      <button
        onClick={() => onChange("fastest")}
        className={`${pillBase} ${sortKey === "fastest" ? active : inactive}`}
      >
        <span
          className={`grid place-items-center h-7 w-7 rounded-full ${
            sortKey === "fastest" ? "bg-white/15" : "bg-gray-100"
          }`}
        >
          <LuClock
            size={18}
            className={`${
              sortKey === "fastest" ? "text-white" : "text-gray-700"
            }`}
          />
        </span>
        <div className="flex flex-col leading-4">
          <span className="text-sm font-semibold">Fastest</span>
          <Sub active={sortKey === "fastest"}>
            {metrics?.fastestDuration || "—"}
          </Sub>
        </div>
      </button>

      {/* Earliest */}
      <button
        onClick={() => onChange("earliest")}
        className={`${pillBase} ${sortKey === "earliest" ? active : inactive}`}
      >
        <span
          className={`grid place-items-center h-7 w-7 rounded-full ${
            sortKey === "earliest" ? "bg-white/15" : "bg-gray-100"
          }`}
        >
          <LuSun
            size={18}
            className={`${
              sortKey === "earliest" ? "text-white" : "text-gray-700"
            }`}
          />
        </span>
        <div className="flex flex-col leading-4">
          <span className="text-sm font-semibold">Earliest</span>
          <Sub active={sortKey === "earliest"}>
            {metrics?.earliestTime || "—"}
          </Sub>
        </div>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* More Sorts Dropdown */}
      <div className="relative">
        <button
          ref={btnRef}
          onClick={() => setOpen((v) => !v)}
          className={`${pillBase} ${inactive} min-w-[160px] justify-between`}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">More Sorts</span>
          </div>
          {open ? <LuChevronUp /> : <LuChevronDown />}
        </button>

        {open && (
          <div
            ref={menuRef}
            role="menu"
            className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-50"
          >
            {moreSorts.map(({ key, label }, idx) => {
              const isActive = sortKey === key;
              return (
                <button
                  key={key}
                  role="menuitem"
                  className={`w-full text-left px-4 py-3 text-sm transition flex items-center justify-between
                    ${
                      isActive
                        ? "bg-gray-50 text-gray-900"
                        : "hover:bg-gray-50 text-gray-800"
                    }`}
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  autoFocus={idx === 0}
                >
                  {label}
                  {isActive && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results count (optional) */}
      {typeof counts?.total === "number" && (
        <div className="self-center text-xs text-gray-500 ml-2">
          {counts.total} result{counts.total === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}
