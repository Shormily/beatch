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
  if (!code) return null;

  return (
    <img
      src={`https://airlines.a4aero.com/images/${code}.png`}
      alt={code}
      className="h-6 w-6 object-contain bg-white rounded-md border border-gray-200 p-0.5 shadow-sm"
      onError={(e) => {
        // fallback if image not found
        e.target.onerror = null;
        e.target.src = "https://via.placeholder.com/24x24.png?text=?"; // optional fallback
      }}
    />
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
    <div className="w-full bg-white rounded-2xl">
      <div className="relative">
        <button
          type="button"
          onClick={() => scrollBy(-280)}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 z-10 h-8 w-8 grid place-items-center hover:bg-gray-50"
          aria-label="Scroll left"
        >
          <LuChevronLeft size={36} />
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
                  className={`inline-flex items-center gap-3 rounded-lg cursor-pointer  hover:border-red-600 hover:bg-red-50 text-gray-500  px-3 py-2  transition
                    ${
                      isActive
                        ? "bg-red-50 border border-red-600 text-red-600 "
                        : "bg-white hover:border-red-500 "
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
                        isActive ? "text-red-600" : "text-gray-900"
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
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 text-gray-500   grid place-items-center hover:bg-gray-50"
          aria-label="Scroll right"
        >
          <LuChevronRight size={36} />
        </button>
      </div>
    </div>
  );
}
