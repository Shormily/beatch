// src/pages/Flights/Dropdownmenu.jsx
"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Props:
 *  - bounds: { priceMin, priceMax, layMin, layMax, airlines: [{code, price}] }
 *  - value: {
 *      price: [min, max],
 *      layoverHours: [min, max],
 *      stops: { nonstop: bool, one: bool, twoPlus: bool },
 *      airlines: Set<string>
 *    }
 *  - onChange: (nextFilters) => void
 */
export default function Dropdownmenu({ bounds, value, onChange }) {
  const { priceMin, priceMax, layMin, layMax, airlines } = bounds || {
    priceMin: 0,
    priceMax: 1,
    layMin: 0,
    layMax: 24,
    airlines: [],
  };

  // Controlled updaters
  const setPrice = (idx, v) => {
    const minGap = 1; // prevent overlap
    const [lo, hi] = value.price;

    if (idx === 0) {
      const nextLo = Math.min(
        Math.max(priceMin, Number(v)),
        (hi ?? priceMax) - minGap
      );
      onChange({ ...value, price: [nextLo, hi] });
    } else {
      const nextHi = Math.max(
        Math.min(priceMax, Number(v)),
        (lo ?? priceMin) + minGap
      );
      onChange({ ...value, price: [lo, nextHi] });
    }
  };
  const setLayover = (idx, v) => {
    const next = [...value.layoverHours];
    next[idx] = v;
    if (next[0] > next[1]) [next[0], next[1]] = [next[1], next[0]];
    onChange({ ...value, layoverHours: next });
  };

  const toggleStop = (k) =>
    onChange({ ...value, stops: { ...value.stops, [k]: !value.stops[k] } });

  const toggleAirline = (code) => {
    const next = new Set(value.airlines);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    onChange({ ...value, airlines: next });
  };

  // Local accordion UI only
  const [open, setOpen] = useState(null);
  const toggleAccordion = (i) => setOpen(open === i ? null : i);

  const priceSpan = Math.max(priceMax - priceMin, 1);
  const laySpan = Math.max(1, layMax - layMin);

  return (
    <div className="w-full max-w-xs bg-white p-4 rounded-2xl shadow">
      {/* Price Range */}
      <div className="mb-4">
        <h3 className="font-medium text-gray-800 flex items-center justify-between">
          Price Range
        </h3>

        <div className="relative w-full h-1.5 bg-white rounded-lg mt-4">
          {/* active range bar */}
          <div
            className="absolute h-1.5 bg-red-500 rounded-lg pointer-events-none"
            style={{
              left: `${((value.price[0] - priceMin) / priceSpan) * 100}%`,
              right: `${
                100 - ((value.price[1] - priceMin) / priceSpan) * 100
              }%`,
            }}
          />

          {/* MIN thumb */}
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            step={1}
            value={value.price[0]}
            onChange={(e) => setPrice(0, e.target.value)}
            className="absolute w-full h-1.5 bg-transparent appearance-none"
            style={{ zIndex: 2 }} // under MAX so MAX stays draggable
          />

          {/* MAX thumb */}
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            step={1}
            value={value.price[1]}
            onChange={(e) => setPrice(1, e.target.value)}
            className="absolute w-full h-1.5 bg-transparent appearance-none"
            style={{ zIndex: 3 }} // put this ABOVE the MIN input
          />
        </div>

        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>৳ {Number(value.price[0]).toLocaleString()}</span>
          <span>৳ {Number(value.price[1]).toLocaleString()}</span>
        </div>
      </div>

      {/* Accordions */}
      <div className="space-y-2">
        {/* Stops */}
        <div className="bg-white overflow-hidden">
          <button
            onClick={() => toggleAccordion(0)}
            className="flex text-[14px] justify-between items-center w-full px-4 py-3 text-gray-700 font-medium"
          >
            Stops
            <ChevronDown
              size={20}
              className={`transition-transform ${
                open === 0 ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`transition-all overflow-hidden ${
              open === 0 ? "max-h-40" : "max-h-0"
            }`}
          >
            <div className="px-4 pb-3 text-sm text-gray-700 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value.stops.nonstop}
                  onChange={() => toggleStop("nonstop")}
                />
                Non-stop
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value.stops.one}
                  onChange={() => toggleStop("one")}
                />
                1 stop
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value.stops.twoPlus}
                  onChange={() => toggleStop("twoPlus")}
                />
                2+ stops
              </label>
            </div>
          </div>
        </div>

        {/* Airlines */}
        <div className="bg-white overflow-hidden">
          <button
            onClick={() => toggleAccordion(1)}
            className="flex text-[14px] justify-between items-center w-full px-4 py-3 text-gray-700 font-medium"
          >
            Airlines
            <ChevronDown
              size={20}
              className={`transition-transform ${
                open === 1 ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <div
          className={`transition-all overflow-hidden ${
            open === 1 ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="px-4 pb-3 text-sm text-gray-700 space-y-2">
            {airlines.length === 0 && (
              <div className="text-xs text-gray-500">No airlines</div>
            )}
            {airlines.map((a) => (
              <label key={a.code} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value.airlines.has(a.code)}
                    onChange={() => toggleAirline(a.code)}
                  />
                  <span className="text-[12px] font-semibold text-gray-600">
                    {a.code}
                  </span>
                </div>
                <span className="text-gray-700 text-[12px]">
                  ৳ {Number(a.price ?? 0).toLocaleString()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Layover Time (total hours) */}
        <div className="bg-white overflow-hidden">
          <button
            onClick={() => toggleAccordion(2)}
            className="flex text-[14px] justify-between items-center w-full px-4 py-3 text-gray-700 font-medium"
          >
            Layover Time
            <ChevronDown
              size={20}
              className={`transition-transform ${
                open === 2 ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`transition-all overflow-hidden ${
              open === 2 ? "max-h-40" : "max-h-0"
            }`}
          >
            <div className="px-4 pb-3 text-sm text-gray-700">
              <div className="relative w-full h-1.5 bg-white rounded-lg mt-4">
                <div
                  className="absolute h-1.5 bg-red-500 rounded-lg pointer-events-none"
                  style={{
                    left: `${
                      ((value.layoverHours[0] - layMin) /
                        Math.max(1, laySpan)) *
                      100
                    }%`,
                    right: `${
                      100 -
                      ((value.layoverHours[1] - layMin) /
                        Math.max(1, laySpan)) *
                        100
                    }%`,
                  }}
                />
                <input
                  type="range"
                  min={layMin}
                  max={layMax}
                  step={1}
                  value={value.layoverHours[0]}
                  onChange={(e) => setLayover(0, Number(e.target.value))}
                  className="absolute w-full h-1.5 bg-transparent appearance-none"
                  style={{ zIndex: 2 }}
                />
                <input
                  type="range"
                  min={layMin}
                  max={layMax}
                  step={1}
                  value={value.layoverHours[1]}
                  onChange={(e) => setLayover(1, Number(e.target.value))}
                  className="absolute w-full h-1.5 bg-transparent appearance-none"
                  style={{ zIndex: 1 }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{value.layoverHours[0]} hrs</span>
                <span>{value.layoverHours[1]}+ hrs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
