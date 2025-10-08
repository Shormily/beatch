// src/components/FlightSortBar.jsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import fastest from "../LandingPages/assets/fastest.png";
import fastestWhite from "../LandingPages/assets/fastestWhite.png";
import cheapest from "../LandingPages/assets/cheapest.png";
import cheapestWhite from "../LandingPages/assets/cheapestWhite.png";
import earliest from "../LandingPages/assets/earliest.png";
import earliestWhitee from "../LandingPages/assets/earliestWhitee.png";

/* ---------------- skeleton bits ---------------- */
const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden ${className} bg-gray-200`}>
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.2s_infinite]" />
  </div>
);

function SkeletonPill() {
  return (
    <div className="min-w-[208px] h-[72px] rounded-2xl border border-sky-100 bg-sky-50 flex items-center gap-3 px-3">
      {/* left icon tile */}
      <div className="h-12 w-12 rounded-xl bg-white grid place-items-center">
        <Shimmer className="h-8 w-8 rounded-lg" />
      </div>

      {/* right text area */}
      <div className="flex-1">
        <Shimmer className="h-4 w-24 rounded-md mb-2" />
        <Shimmer className="h-3 w-20 rounded-md" />
      </div>
    </div>
  );
}

/* keyframes for shimmer (works with Tailwind) */
const ShimmerKeyframes = () => (
  <style>{`@keyframes shimmer{100%{transform:translateX(100%)}}`}</style>
);

/* ---------------- component ---------------- */
export default function FlightSortBar({
  sortKey,
  onChange,
  metrics,
  className = "",
  loading = false, // pass status === 'loading'
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // hooks always run
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

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
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
    "flex items-center gap-3 rounded-2xl border-b-2 px-1 h-[72px] min-w-[208px] transition";
  const inactive =
    "bg-white border-gray-200 hover:border-gray-300 text-gray-800";
  const active = "bg-red-50 border-red-600 text-red-600";

  const Sub = ({ children, active }) => (
    <span
      className={`text-xs ${
        active ? "text-red-600 font-semibold" : "text-black font-semibold"
      }`}
    >
      {children}
    </span>
  );

  /* --------- loading skeleton (after hooks) --------- */
  if (loading) {
    return (
      <>
        <ShimmerKeyframes />
        <div className={`flex items-start gap-2 flex-wrap ${className}`}>
          <SkeletonPill />
          <SkeletonPill />
          <SkeletonPill />
          <SkeletonPill />
        </div>
      </>
    );
  }

  /* --------- normal content --------- */
  return (
    <div className={`flex items-start gap-2 flex-wrap ${className}`}>
      <ShimmerKeyframes />

      {/* Cheapest */}
      <button
        onClick={() => onChange("cheapest")}
        className={`${pillBase} ${sortKey === "cheapest" ? active : inactive}`}
      >
        <span
          className={`grid place-items-center mx-1 rounded-xl ${
            sortKey === "cheapest" ? "bg-white/15" : "bg-gray-100"
          }`}
        >
          <img
            src={sortKey === "cheapest" ? cheapestWhite : cheapest}
            alt="Cheapest"
            className={`${
              sortKey === "cheapest"
                ? "bg-red-600 w-12 h-13 p-3 rounded-md"
                : "text-gray-700 bg-slate-200 rounded-md w-12 h-13 p-3"
            }`}
          />
        </span>
        <div className="flex flex-col">
          <span className="font-medium">Cheapest</span>
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
          className={`grid place-items-center mx-1 rounded-xl ${
            sortKey === "fastest" ? "bg-white/15" : "bg-gray-100"
          }`}
        >
          <img
            src={sortKey === "fastest" ? fastestWhite : fastest}
            className={`${
              sortKey === "fastest"
                ? "bg-red-600 w-12 h-13 p-3 rounded-md"
                : "text-gray-700 bg-slate-200 rounded-md w-12 h-13 p-3"
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
          className={`grid place-items-center mx-1 rounded-xl ${
            sortKey === "earliest" ? "bg-white/15" : "bg-gray-100"
          }`}
        >
          <img
            src={sortKey === "earliest" ? earliestWhitee : earliest}
            className={`${
              sortKey === "earliest"
                ? "bg-red-600 w-12 h-13 p-3 rounded-md"
                : "text-gray-700 bg-slate-200 rounded-md w-12 h-13 p-3"
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

      {/* More Sorts */}
      <div className="relative">
        <button
          ref={btnRef}
          onClick={() => setOpen((v) => !v)}
          className={`${pillBase} ${inactive} min-w-[200px] justify-between`}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <div className="flex items-center">
            <span className="text-sm font-semibold px-2">More Sorts</span>
          </div>
          <div className="px-4">
            {open ? <LuChevronUp /> : <LuChevronDown />}
          </div>
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
                  className={`w-full text-left px-4 py-3 text-sm transition flex items-center justify-between ${
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
    </div>
  );
}
