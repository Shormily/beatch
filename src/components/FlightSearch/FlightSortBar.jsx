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
import fastest from "../LandingPages/assets/fastest.png"
import cheapest from "../LandingPages/assets/cheapestWhite.png"
import earliest from "../LandingPages/assets/earliest.png"

export default function FlightSortBar({
  sortKey,
  onChange,
 
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
      { key: "best", label: "Best (Balanced)" },
      { key: "earliest", label: "Earliest (Overall)" },
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
    "flex items-center gap-3 rounded-lg  border-b-2 px-1 h-17 min-w-[208px]  transition";
  const inactive =
    "bg-white border-gray-200 hover:border-gray-300 text-gray-800";
  const active = "bg-red-50 border-red-600 text-red-600";

  const Sub = ({ children, active }) => (
    <span className={`text-xs ${active ? "text-red-600 font-semibold" : "text-black font-semibold"}`}>
      {children}
    </span>
  );

  return (
    <div className={`flex items-start gap-2 flex-wrap ${className}`}>
      {/* Cheapest */}
      <button
        onClick={() => onChange("cheapest")}
        className={`${pillBase} ${sortKey === "cheapest" ? active : inactive}`}
      >
        <span
          className={`grid place-items-center mx-1  rounded-full ${
            sortKey === "cheapest" ? "bg-white/15" : "bg-gray-100"
          }`}
        >
          <img
            src={cheapest}
            className={`${
              sortKey === "cheapest" ? "bg-red-600 w-12 h-13 p-3 rounded-md" : "text-black bg-slate-100 rounded-md w-12 h-13 p-3"
            }`}
          />
        </span>
        <div className="flex flex-col ">
          <span className="text- font-medium ">Cheapest</span>
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
          className={`grid place-items-center mx-1 rounded-full ${
            sortKey === "fastest" ? "bg-white/15" : "bg-gray-100"
          }`}
        >
          <img
            src={fastest}
            className={`${
              sortKey === "fastest" ? "bg-red-600 w-12 h-13 p-3 rounded-md" : "text-gray-700 bg-slate-100 rounded-md w-12 h-13 p-3"
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
          className={`grid place-items-center mx-1 rounded-full ${
            sortKey === "earliest" ? "bg-white/15" : "bg-gray-100"
          }`}
        >
          <img
            src={earliest}
            className={`${
              sortKey === "earliest" ? "bg-red-600 w-12 h-13 p-3 rounded-md" : "text-gray-700 bg-slate-100 rounded-md w-12 h-13 p-3"
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
      <div className="" />

      {/* More Sorts Dropdown */}
      <div className="relative">
        <button
          ref={btnRef}
          onClick={() => setOpen((v) => !v)}
          className={`${pillBase} ${inactive} min-w-[200px] justify-between`}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <div className="flex items-center ">
            <span className="text-sm font-semibold px-2">More Sorts</span>
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
      {/* {typeof counts?.total === "number" && (
        <div className="self-center text-xs text-gray-500 ml-2">
          {counts.total} result{counts.total === 1 ? "" : "s"}
        </div>
      )} */}
    </div>
  );
}
