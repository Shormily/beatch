import React from "react";
import { CiSearch } from "react-icons/ci";
import FirsttripCalendarClone from "./calender";

export default function HotelForm() {
  return (
    <div className="p-6 relative">
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {/* Destination */}
        <div className="flex-1 min-w-[250px] h-16 border border-gray-300 rounded-xl px-4 pt-2 pb-1 flex flex-col justify-between">
          <span className="text-[12px] text-gray-500">Destination</span>
          <input
            type="text"
            placeholder="Enter city or hotel"
            className="outline-none bg-transparent font-semibold placeholder-gray-400"
          />
        </div>

        {/* Check-in */}
        <div className="flex-1 min-w-[250px]">
          <FirsttripCalendarClone />
        </div>

        {/* Guests */}
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
  );
}
