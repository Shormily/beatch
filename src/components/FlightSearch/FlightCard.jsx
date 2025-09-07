"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import BS from "../LandingPages/assets/BS.png";
import plane from "../LandingPages/assets/plane.png";

import CustomTabs from "./CustomTabs";

export default function FlightCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow border border-gray-200 overflow-hidden font-murecho">
      <div className="flex flex-col lg:flex-row">
        {/* -------- Left Section -------- */}
        <div className="flex-1 p-4">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 relative">
            {/* Flight Info */}
            <div className="flex items-center gap-3">
              <img src={BS} alt="Airline" className="w-8 h-8" />
              <div>
                <p className="text-[14px] font-medium leading-4">
                  US Bangla <br /> Airlines
                </p>
              </div>
            </div>

            {/* Timing */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div>
                <p className="text-xs">09 Sep, Tuesday</p>
                <p className="font-semibold">19:10</p>
                <p className="text-xs text-gray-500">DAC</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">1h 5m</p>
                <img src={plane} alt="Airline" className="w-40 py-2" />
                <p className="text-xs text-gray-500">Non-stop</p>
              </div>

              <div>
                <p className="text-xs">09 Sep, Tuesday</p>
                <p className="font-semibold">20:15</p>
                <p className="text-xs text-gray-500">CXB</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-3"></div>

          {/* Return Flight */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={BS} alt="Airline" className="w-8 h-8" />
              <div>
                <p className="text-[14px] font-medium leading-4">
                  US Bangla <br /> Airlines
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div>
                <p className="text-xs">12 Sep, Friday</p>
                <p className="font-semibold">09:05</p>
                <p className="text-xs text-gray-500">CXB</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">1h 5m</p>
                <img src={plane} alt="Airline" className="w-40 py-2" />
                <p className="text-xs text-gray-500">Non-stop</p>
              </div>

              <div>
                <p className="text-xs">12 Sep, Friday</p>
                <p className="font-semibold">10:10</p>
                <p className="text-xs text-gray-500">DAC</p>
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="mt-3">
            <button
              onClick={() => setOpen(!open)}
              className="text-blue-600 font-medium flex items-center justify-center gap-2 mx-auto"
            >
              {open ? (
                <>
                  Hide Details <ChevronUp size={18} />
                </>
              ) : (
                <>
                  View Details <ChevronDown size={18} />
                </>
              )}
            </button>
          </div>

          {/* Dropdown Details */}
          {open && (
            <div className="mt-3 ">
              <CustomTabs />
            </div>
          )}
        </div>

        {/* -------- Right Section -------- */}
        <div className="lg:w-56 border-t lg:border-t-0 lg:border-l border-dashed border-gray-400 flex flex-col justify-between p-4 text-center">
          <div>
            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-semibold">
              FTDOM17
            </span>
            <p className="text-red-600 text-xl font-bold mt-2">BDT 9,860</p>
            <p className="text-xs line-through text-gray-400">BDT 11,398</p>
            <p className="text-sm mt-1">Economy</p>
            <p className="text-xs text-gray-500">1 Traveler</p>
          </div>

          <div className="mt-3">
            <button className="w-full bg-gray-100 text-sm font-medium rounded-lg py-2 mb-2 hover:bg-gray-200">
              View Prices
            </button>
            <button className="w-full bg-red-600 text-white font-semibold rounded-lg py-2 hover:bg-red-500">
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
