// src/components/HeroSection.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import video2 from "../../../assets/video2.mp4";
import FlightImg from "../../../assets/Flight.png";
import HotelImg from "../../../assets/Hotel.png";
import { CiSearch } from "react-icons/ci";
import { IoSwapHorizontal, IoClose } from "react-icons/io5";
import { BiSolidPlaneAlt } from "react-icons/bi";
import FirsttripCalendarClone from "./calender";

/* ------ mock airport list ------ */
const AIRPORTS = [
  { city: "Dhaka", country: "Bangladesh", code: "DAC", name: "Hazrat Shahjalal International Airport" },
  { city: "Chattogram", country: "Bangladesh", code: "CGP", name: "Shah Amanat International Airport" },
  { city: "Cox's Bazar", country: "Bangladesh", code: "CXB", name: "Cox's Bazar Airport" },
  { city: "Jashore", country: "Bangladesh", code: "JSR", name: "Jashore Airport" },
  { city: "Rajshahi", country: "Bangladesh", code: "RJH", name: "Shah Mokhdum Airport" },
  { city: "Saidpur", country: "Bangladesh", code: "SPD", name: "Saidpur Airport" },
  { city: "Sylhet Osmani", country: "Bangladesh", code: "ZYL", name: "Osmani International Airport" },
];

/* --------- Airport Select (with mobile drawer) ---------- */
function AirportSelect({ label, value, onChange, placeholder = "Airport/City" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(value || "");
  const boxRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, []);

  const filtered = AIRPORTS.filter(
    (a) =>
      a.city.toLowerCase().includes(q.toLowerCase()) ||
      a.code.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="relative" ref={boxRef}>
      <div
        className="h-16 border border-gray-300 rounded-xl px-4 pt-2 pb-1 flex flex-col justify-between
               bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200 transition"
      >
        <span className="text-[12px] text-gray-500">{label}</span>
        <input
          className="outline-none bg-transparent font-semibold placeholder-gray-400"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
        />
      </div>

      {/* dropdown */}
      {open && (
        <>
          {/* Desktop Dropdown */}
          <div
            className="hidden md:block absolute top-full left-0 mt-2 z-50 
               w-[420px] max-h-[400px] overflow-y-auto
               border border-gray-200 rounded-xl shadow-xl bg-white"
          >
            {filtered.length ? (
              filtered.map((a) => (
                <button
                  key={a.code}
                  onClick={() => {
                    const v = `${a.city}, ${a.country}`;
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
                        {a.city}, {a.country}
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
          {/* Mobile Drawer */}
          {/* Mobile Drawer */}
          {open && (
            <div
              className="fixed md:hidden inset-0 z-48 bg-black/40 flex items-end"
              onClick={() => setOpen(false)}
            >
              <div
                className="w-full bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slideUp shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* drag handle bar */}
                <div
                  className="w-full flex justify-center py-2 cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>

                {/* search input box */}
                <div className="px-6 pb-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Airport/City"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      className="w-full text-[13px] rounded-md px-4 py-5 font-semibold pr-10 border border-gray-200 
                       text-slate-50 placeholder-gray-400
                       focus:outline-none focus:border-blue-400 focus:ring-0"
                    />

                  </div>
                </div>

                {/* airport list */}
                <div className=" mx-6 rounded rounded-lg mt-4 pb-6 border border-gray-200 ">
                  {filtered.length ? (
                    filtered.map((a) => (
                      <button
                        key={a.code}
                        onClick={() => {
                          const v = `${a.city}, ${a.country}`;
                          setQ(v);
                          onChange?.(v);
                          setOpen(false);
                        }}
                        className="w-full text-left flex flex-col items-start gap-1 px-4 py-4 
                         border-b border-gray-100 hover:bg-red-50 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between w-full ">
                          <div className="flex items-center gap-3">
                            <span className="text-red-500">
                              <BiSolidPlaneAlt size={20} />
                            </span>
                            <span className="font-semibold text-[13px] text-gray-800">
                              {a.city}, {a.country}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-gray-700">
                            {a.code}
                          </span>
                        </div>
                        <div className="pl-9 text-[12px] text-gray-500">{a.name}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">No results</div>
                  )}
                </div>
              </div>
            </div>
          )}



        </>
      )}
    </div>
  );
}

/* -------- Hero Section ---------- */
export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("flight");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <section className="relative">
      {/* ---------- Background video ---------- */}
      <div className="relative w-full h-[39vh] 
                sm:h-[20vh]      /* small tablets */
                md:h-[20vh]      /* standard iPad 768x1024 */
                lg:h-[20vh]      /* large iPad 820x1180 */
                xl:h-[27vh]      /* iPad Pro 1024x1366 */
                flex items-start justify-center overflow-hidden max-[754px]:hidden">

        <video
    className="absolute inset-0 w-full h-full object-cover"
    src={video2}
    autoPlay
    loop
    muted
  />

        <div className="absolute inset-0 bg-black/14 z-10" />

        <div className="relative z-20 w-full max-w-[1200px] mx-auto text-white px-4 pt-14">
          <h1 className="text-5xl font-bold">
            Create A New Story With Every Trip
          </h1>
          <p className="text-lg mt-2">
            Flight, Hotel, Holidays & Visa at your fingertips
          </p>
        </div>
      </div>


      {/* ------------ Tabs ------------ */}

      <div className=" bg-gradient-to-b from-red-50 to-gray-100  ">
        <div className="max-w-[1200px] mx-auto px-8 pt-8 lg:pt-0 ">
          <div className="relative z-0 md:z-0 lg:z-40 bg-white rounded-md shadow-lg max-w-[360px] xl:mt-[-100px] lg:mt-[-80px] 
           mx-auto">
            <div className="rounded-md overflow-hidden ">
              <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 p-2">
                <button
                  onClick={() => setActiveTab("flight")}
                  className={`flex items-center justify-center gap-2 w-[120px] sm:w-[140px] md:w-[160px] lg:w-auto 
                  px-2 sm:px-4 md:px-6 lg:px-10 py-2 rounded-lg font-medium transition
                  ${activeTab === "flight"
                      ? "bg-red-50 text-red-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <img src={FlightImg} alt="flight" className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 lg:h-10 lg:w-10" />
                  <span className="text-sm sm:text-base">Flight</span>
                </button>
                <button
                  onClick={() => setActiveTab("hotel")}
                  className={`flex items-center justify-center gap-2 w-[120px] sm:w-[140px] md:w-[160px] lg:w-auto 
                  px-2 sm:px-4 md:px-6 lg:px-10 py-2 rounded-lg font-medium transition
                  ${activeTab === "hotel"
                      ? "bg-red-50 text-red-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <img src={HotelImg} alt="hotel" className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 lg:h-10 lg:w-10" />
                  <span className="text-sm sm:text-base">Hotel</span>
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
      {/* ------------ Form ------------ */}
      <div className="max-w-[1240px]  px-8 z-30 mx-auto relative rounded-t-lg mt-0  lg:mt-[-30px]">
        <div className="bg-white py-4 rounded-lg  ">
          {activeTab === "flight" && (
            <div className="p-6 relative">
              {/* Trip type */}
              <div className="flex flex-wrap gap-6 mb-5 text-[14px]">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input type="radio" name="trip" defaultChecked className="w-5 h-5 accent-red-600" />
                  One Way
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input type="radio" name="trip" className="w-5 h-5 accent-red-600" />
                  Round Trip
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input type="radio" name="trip" className="w-5 h-5 accent-red-600" />
                  Multi City
                </label>
              </div>

              {/* Inputs */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* From + To */}
                <div className="lg:basis-[35%] grid grid-cols-1 sm:grid-cols-2 gap-4 relative min-w-[250px]">
                  <div className="relative">
                    <AirportSelect label="From" value={from} onChange={setFrom} />
                  </div>
                  <div className="relative">
                    <AirportSelect label="To" value={to} onChange={setTo} />
                  </div>
                  <button
                    type="button"
                    onClick={swap}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                    flex w-10 h-10 rounded-full bg-red-600 text-white items-center justify-center shadow-lg z-20"
                    title="Swap"
                  >
                    <IoSwapHorizontal className="text-xl" />
                  </button>
                </div>

                {/* Departure + Return */}
                <div className="flex-1 min-w-[250px]">
                  <FirsttripCalendarClone />
                </div>

                {/* Traveller */}
                <div className="lg:basis-[20%] min-w-[180px] h-16 border border-gray-300 rounded-xl px-4 pt-2 pb-1 flex flex-col justify-between">
                  <span className="text-[12px] text-gray-500">Traveller, Class</span>
                  <div>
                    <p className="font-semibold leading-4">1 Traveller</p>
                    <p className="text-xs text-gray-400">Economy</p>
                  </div>
                </div>

                {/* Search button */}
                <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                  <button
                    className="w-full lg:w-24 h-16 rounded-md bg-red-700 hover:bg-red-500 text-white flex items-center justify-center"
                    title="Search"
                  >
                    <CiSearch size={32} />
                  </button>
                </div>
              </div>

              {/* Fare type */}
              <div className="flex text-[14px] gap-6 mt-5 cursor-pointer font-semibold">
                <label className="flex items-center gap-2">
                  <input type="radio" name="fare" defaultChecked className="w-5 h-5 accent-red-600" />
                  Regular Fare
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="fare" className="w-5 h-5 accent-red-600" /> Student Fare
                </label>
              </div>
            </div>
          )}
          {activeTab === "hotel" && (
            <div className="p-6 relative">
              <div className="flex flex-col lg:flex-row gap-4 mt-4">
                {/* Destination */}
                <div className="flex-1 min-w-[250px] h-16 border border-gray-300 rounded-xl px-4 pt-2 pb-1 flex flex-col justify-between">
                  <span className="text-[12px] text-gray-500">Destination</span>
                  <input
                    type="text"
                    placeholder="Enter city or hotel"
                    className="outline-none bg-transparent font-semibold  placeholder-gray-400"
                  />
                </div>

                {/* Check-in */}
                <div className="flex-1 min-w-[250px]">
                  <FirsttripCalendarClone />
                </div>

                {/* Traveller */}
                <div className="lg:basis-[20%] min-w-[180px] h-16 border border-gray-300 rounded-xl px-4 pt-2 pb-1 flex flex-col justify-between">
                  <span className="text-[12px] text-gray-500">Guests</span>
                  <div>
                    <p className="font-semibold leading-4">2 Guests</p>
                    <p className="text-xs text-gray-400">1 Room</p>
                  </div>
                </div>

                {/* Search button */}
                <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                  <button
                    className="w-full lg:w-24 h-16 rounded-md bg-red-700 hover:bg-red-500 text-white flex items-center justify-center"
                    title="Search"
                  >
                    <CiSearch size={32} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------- animation css -------- */
const style = document.createElement("style");
style.innerHTML = `
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}
`;
document.head.appendChild(style);
