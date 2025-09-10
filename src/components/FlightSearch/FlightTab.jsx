"use client";
import React from "react";

/**
 * Props:
 *   sortKey: "best" | "cheapest" | "fastest"
 *   onChange: (key) => void
 *   counts?: { total: number }
 */
export default function FlightTabs({ sortKey, onChange, counts }) {
  const Tab = ({ k, label, sub }) => {
    const active = sortKey === k;
    return (
      <button
        onClick={() => onChange(k)}
        className={`px-4 py-2 rounded-full text-sm font-medium border transition
          ${
            active
              ? "bg-red-600 text-white border-red-600"
              : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
          }`}
      >
        <div className="flex flex-col leading-4">
          <span>{label}</span>
          {sub ? (
            <span
              className={`text-[10px] ${
                active ? "text-red-50" : "text-gray-500"
              }`}
            >
              {sub}
            </span>
          ) : null}
        </div>
      </button>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Tab k="best" label="Best" sub="Balance of price, duration & stops" />
      <Tab k="cheapest" label="Cheapest" sub="Lowest BDT total" />
      <Tab k="fastest" label="Fastest" sub="Shortest duration" />
      {typeof counts?.total === "number" && (
        <div className="ml-auto text-xs text-gray-500">
          {counts.total} result{counts.total === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}
