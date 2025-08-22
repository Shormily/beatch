import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoSwapHorizontal } from "react-icons/io5";
import FirsttripCalendarClone from "./calender";
import AirportSelect from "./AirportSelect";

export default function FlightForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="p-6 relative">
      {/* Trip type */}
      <div className="flex flex-wrap gap-6 mb-5 text-[14px]">
        {["One Way", "Round Trip", "Multi City"].map((trip, i) => (
          <label key={i} className="flex items-center gap-2 cursor-pointer font-semibold">
            <input type="radio" name="trip" defaultChecked={i === 0} className="w-5 h-5 accent-red-600" />
            {trip}
          </label>
        ))}
      </div>

      {/* Inputs */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* From + To */}
        <div className="lg:basis-[35%] grid grid-cols-1 sm:grid-cols-2 gap-4 relative min-w-[250px]">
          <AirportSelect label="From" value={from} onChange={setFrom} />
          <AirportSelect label="To" value={to} onChange={setTo} />
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
            className="w-full lg:w-24 h-16 rounded-md bg-red-700 hover:bg-red-500 text-white flex items-center justify-center gap-2"
            title="Search"
          >
            <CiSearch className="inline-block" size={32} />
            <span className="lg:hidden font-semibold">Search</span>
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
  );
}
