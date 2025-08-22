import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { AiOutlineSwap } from "react-icons/ai";
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
    <div className="px-3 pt-7 pb-2 relative">
      {/* Trip type */}
      <div className="flex gap-2 mb-5 flex-nowrap overflow-x-auto">
        {["One Way", "Round Trip", "Multi City"].map((trip, i) => (
          <label
            key={i}
            className="flex items-center gap-1 cursor-pointer font-normal sm:text-[8px] lg:text-[14px] md:text-[14px]"
          >
            <input
              type="radio"
              name="trip"
              defaultChecked={i === 0}
              className=" sm:w-3 sm:h-3 lg:w-4 lg:h-4  accent-red-600 font-bold"
            />
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
            flex w-10 h-10 rounded-full bg-red-700 text-white items-center justify-center shadow-lg z-20"
            title="Swap"
          >
            <AiOutlineSwap className="text-xl" />
          </button>
        </div>

        {/* Departure + Return */}
        <div className="flex-1 min-w-[250px]">
          <FirsttripCalendarClone />
        </div>

        {/* Traveller */}
        <div className="lg:basis-[20%] min-w-[180px] h-20 border border-gray-300 rounded-lg px-4 pt-2 pb-1 flex flex-col justify-between">
          <span className="text-[12px] text-gray-500">Traveller, Class</span>
          <div>
            <p className="font-semibold leading-4 pb-2">1 Traveller</p>
            <p className="text-[12px] text-gray-500">Economy</p>
          </div>
        </div>

        {/* SMALL SCREEN Fare Type (Above Search Button) */}
        <div className="flex flex-wrap text-[14px] gap-6 mt-4 cursor-pointer font-normal lg:hidden">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="fare"
              defaultChecked
              className="w-4 h-4 accent-red-600"
            />
            Regular Fare
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="fare"
              className="w-4 h-4 accent-red-600"
            />
            Student Fare
          </label>
        </div>

        {/* Search button */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end flex-shrink-0 mt-4 lg:mt-0">
          <button
            className="w-32 sm:w-36 md:w-40 lg:w-24 h-20 rounded-md bg-red-700 hover:bg-red-500 text-white flex items-center justify-center gap-2"
            title="Search"
          >
            <CiSearch className="inline-block" size={40} />
            <span className="lg:hidden font-semibold text-sm">Search</span>
          </button>
        </div>
      </div>

      {/* LARGE SCREEN Fare Type (Stays below on large screens) */}
      <div className="hidden lg:flex flex-wrap text-[14px] gap-6 mt-5 cursor-pointer font-normal">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="fare"
            defaultChecked
            className="w-4 h-4 accent-red-600"
          />
          Regular Fare
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="fare"
            className="w-4 h-4 accent-red-600"
          />
          Student Fare
        </label>
      </div>
    </div>
  );
}
