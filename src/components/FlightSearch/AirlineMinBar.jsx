import React, { useRef } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

// tiny local formatter (kept here to avoid import spaghetti)
const formatBDT = (v) => {
  if (!Number.isFinite(v)) return "—";
  try {
    return `৳ ${v.toLocaleString("en-BD")}`;
  } catch {
    return `৳ ${v}`;
  }
};

// simple logo placeholder; replace with your real logos if you have them
function AirlineLogo({ code }) {
  return (
    <div className="h-6 w-6 grid place-items-center rounded-md bg-gray-100 border border-gray-200 text-[10px] font-semibold text-gray-700">
      {code?.slice(0, 2) || "??"}
    </div>
  );
}

export default function AirlineMinBar({ items = [], selected, onToggle }) {
  const scrollerRef = useRef(null);

  const scrollBy = (dx) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      <div className="relative">
        <button
          type="button"
          onClick={() => scrollBy(-280)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow border border-gray-200 grid place-items-center hover:bg-gray-50"
          aria-label="Scroll left"
        >
          <LuChevronLeft />
        </button>

        <div
          ref={scrollerRef}
          className="overflow-x-auto whitespace-nowrap scrollbar-hide px-10"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="inline-flex gap-3 py-2">
            {items.map(({ code, count, price }) => {
              const isActive = selected?.has(code);
              return (
                <button
                  key={code}
                  onClick={() => onToggle(code)}
                  className={`inline-flex items-center gap-3 rounded-2xl border px-3 py-2 shadow-sm transition
                    ${
                      isActive
                        ? "bg-red-600 border-red-600 text-white"
                        : "bg-white border-gray-200 hover:border-gray-300 text-gray-800"
                    }`}
                >
                  <AirlineLogo code={code} />
                  <div className="text-left leading-tight">
                    <div className="text-xs font-semibold">
                      {code}{" "}
                      <span
                        className={isActive ? "text-red-50" : "text-gray-500"}
                      >
                        ({count})
                      </span>
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        isActive ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatBDT(price)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollBy(280)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow border border-gray-200 grid place-items-center hover:bg-gray-50"
          aria-label="Scroll right"
        >
          <LuChevronRight />
        </button>
      </div>
    </div>
  );
}
