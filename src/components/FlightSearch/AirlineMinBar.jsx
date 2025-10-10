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
      className="h-10 w-10 object-contain bg-gray-50 rounded-md border border-gray-200 p-1"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://via.placeholder.com/24x24.png?text=?";
      }}
    />
  );
}

// Local, component-scoped styles to force overlay-like scrollbars
const OverlayScrollbarStyles = () => (
  <style>{`
    /* Hide scrollbar but keep scrolling (WebKit) */
    .overlay-scroll::-webkit-scrollbar { display: none; height: 0; }
    /* Hide scrollbar (Firefox) */
    .overlay-scroll { scrollbar-width: none; }
    /* Reserve gutter if a UA still draws a scrollbar, avoiding layout shift */
    .overlay-scroll { scrollbar-gutter: stable both-edges; }
  `}</style>
);

export default function AirlineMinBar({ items = [], selected, onToggle }) {
  const scrollerRef = useRef(null);

  const scrollBy = (dx) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <div className=" bg-white rounded-2xl overflow-hidden">
      <OverlayScrollbarStyles />

      <div className="relative">
        {/* Left chevron */}
        <button
          type="button"
          onClick={() => scrollBy(-280)}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 z-10 h-8 w-8 grid place-items-center bg-white rounded-full hover:bg-red-500 hover:text-white cursor-pointer"
          aria-label="Scroll left"
        >
          <LuChevronLeft size={24} />
        </button>

        {/* Scroller */}
        <div
          ref={scrollerRef}
          className="overlay-scroll overflow-x-auto whitespace-nowrap px-10"
          style={{
            scrollBehavior: "smooth",
            // lock in a stable height so content doesn't jump
            // (tall enough for buttons + internal padding)
            minHeight: 64,
          }}
        >
          <div className="inline-flex gap-3 py-2">
            {items.map(({ code, count, price }) => {
              const isActive = selected?.has(code);
              return (
                <button
                  key={code}
                  onClick={() => onToggle(code)}
                  className={`inline-flex items-center gap-3 rounded-lg cursor-pointer pr-10 pl-2 py-2 transition border
                    ${
                      isActive
                        ? "bg-red-50 border-red-600 text-red-600"
                        : "bg-white border-transparent hover:border-red-500 hover:bg-red-50/40 text-gray-700"
                    }`}
                >
                  <AirlineLogo code={code} />
                  <div className="text-left leading-tight">
                    <div className="text-xs font-semibold">
                      {code}{" "}
                      <span
                        className={isActive ? "text-red-500" : "text-gray-500"}
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

        {/* Right chevron */}
        <button
          type="button"
          onClick={() => scrollBy(280)}
          className="absolute right-2 top-1/2 -translate-y-1/2  text-gray-500 z-10 h-8 w-8 grid place-items-center bg-white rounded-full hover:bg-red-500 hover:text-white cursor-pointer"
          aria-label="Scroll right"
        >
          <LuChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
