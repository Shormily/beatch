// src/components/AirportSelect.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { BiSolidPlaneAlt } from "react-icons/bi";

export default function AirportSelect({ label, value, onChange, placeholder = "Airport/City" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(value || "");
  const [airports, setAirports] = useState([]);   // 🔹 state for API data
  const boxRef = useRef(null);

  // Fetch airports from API
  useEffect(() => {
    async function fetchAirports() {
      try {
        const res = await fetch("https://ota-api.a4aero.com/api/settings/airports");
        const json = await res.json();
        setAirports(json.data || []);
      } catch (error) {
        console.error("Airport API Error:", error);
      }
    }
    fetchAirports();
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, []);

  // Filter logic
  const filtered = airports.filter(
    (a) =>
      a.name?.toLowerCase().includes(q.toLowerCase()) ||
      a.cityName?.toLowerCase().includes(q.toLowerCase()) ||
      a.code?.toLowerCase().includes(q.toLowerCase())
  );

  const selectedAirport = airports.find(
    (a) => `${a.cityName}, ${a.countryName}`.toLowerCase() === q.toLowerCase()
  );

  return (
    <div className="relative" ref={boxRef}>
      <div
        className="h-20 border border-gray-300 rounded-lg px-3 pt-2 pb-4 bg-white transition flex flex-col"
      >
        {/* Label */}
        <span className="text-[12px] text-gray-500">{label}</span>

        {/* Input */}
        <div className={`flex-1 flex ${!selectedAirport?.name ? "items-center" : "items-start"}`}>
          <input
            className="outline-none bg-transparent font-normal placeholder-gray-600 text-[14px] w-full"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
          />
        </div>

        {/* Airport Name */}
        {selectedAirport?.name && (
          <span className="text-[12px] text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {selectedAirport.name}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <>
          {/* Desktop */}
          <div
            className="hidden md:block absolute top-full left-0 mt-2 z-50 
               w-[420px] max-h-[400px] overflow-y-auto
               border border-gray-200 rounded-xl shadow-xl bg-white"
          >
            {filtered.length ? (
              filtered.map((a, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const v = `${a.cityName}, ${a.countryName}`;
                    setQ(v);
                    onChange?.(v);
                    setOpen(false);
                  }}
                  className="w-full text-left flex flex-col items-start gap-2 px-6 py-5 border-b border-gray-100 hover:bg-red-50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-red-500">
                        <BiSolidPlaneAlt size={22} />
                      </span>
                      <span className="font-semibold text-base">
                        {a.cityName}, {a.countryName}
                      </span>
                    </div>
                    <span className="text-base font-bold text-gray-700">
                      {a.code}
                    </span>
                  </div>
                  <div className="pl-8 text-sm text-gray-500">{a.name}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">No results</div>
            )}
          </div>

          {/* Mobile Drawer */}
          <div
            className="fixed md:hidden inset-0 z-48 bg-black/40 flex items-end"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slideUp shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* drag handle */}
              <div
                className="w-full flex justify-center py-2 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>

              {/* search */}
              <div className="px-6 pb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Airport/City"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-full text-[13px] rounded-md px-4 py-5 font-semibold pr-10 border border-gray-200 
                       text-gray-900 placeholder-gray-400
                       focus:outline-none focus:border-blue-400 focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
