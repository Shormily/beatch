// AirlineMinBarSkeleton.jsx
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

/* ----- minimal shimmer building blocks (no global css) ----- */
const Shimmer = () => (
  <svg
    className="absolute inset-0 h-full w-full"
    viewBox="0 0 400 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="skg">
        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.6)">
          <animate
            attributeName="offset"
            values="-0.5;1.5"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    <rect x="-120" y="0" width="640" height="100" fill="url(#skg)">
      <animate
        attributeName="x"
        values="-120;120"
        dur="1.4s"
        repeatCount="indefinite"
      />
    </rect>
  </svg>
);

const Box = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
    <Shimmer />
  </div>
);

export default function AirlineMinBarSkeleton({ count = 8 }) {
  return (
    <div className="w-full bg-white rounded-2xl">
      <div className="relative">
        {/* arrows (disabled look) */}
        <button
          type="button"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 grid place-items-center text-slate-300"
          aria-label="Scroll left"
          disabled
        >
          <LuChevronLeft size={36} />
        </button>

        <div className="overflow-x-hidden px-10">
          <div className="inline-flex gap-3 py-2">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-3 rounded-lg border border-slate-100 bg-white px-8 py-2"
              >
                {/* logo square */}
                <Box className="h-10 w-10 rounded-md" />
                {/* two lines */}
                <div className="space-y-2">
                  <Box className="h-3 w-20 rounded" />
                  <Box className="h-4 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 grid place-items-center text-slate-300"
          aria-label="Scroll right"
          disabled
        >
          <LuChevronRight size={36} />
        </button>
      </div>
    </div>
  );
}
