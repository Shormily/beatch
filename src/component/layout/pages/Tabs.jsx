import React from "react";
import FlightImg from "../../../assets/Flight.png";
import HotelImg from "../../../assets/Hotel.png";

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="rounded-md overflow-hidden">
      <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 p-2">
        {/* Flight tab */}
        <button
          onClick={() => setActiveTab("flight")}
          className={`flex items-center justify-center gap-2 w-[120px] sm:w-[140px] md:w-[160px] lg:w-auto 
            px-2 sm:px-4 md:px-6 lg:px-10 py-2 rounded-lg font-medium transition
            ${activeTab === "flight"
              ? "bg-red-50 text-red-600 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <img src={FlightImg} alt="flight" className="h-6 sm:h-7 md:h-9 lg:h-10 w-6 sm:w-7 md:w-9 lg:w-10" />
          <span className="text-sm sm:text-base">Flight</span>
        </button>

        {/* Hotel tab */}
        <button
          onClick={() => setActiveTab("hotel")}
          className={`flex items-center justify-center gap-2 w-[120px] sm:w-[140px] md:w-[160px] lg:w-auto 
            px-2 sm:px-4 md:px-6 lg:px-10 py-2 rounded-lg font-medium transition
            ${activeTab === "hotel"
              ? "bg-red-50 text-red-600 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <img src={HotelImg} alt="hotel" className="h-6 sm:h-7 md:h-9 lg:h-10 w-6 sm:w-7 md:w-9 lg:w-10" />
          <span className="text-sm sm:text-base">Hotel</span>
        </button>
      </div>
    </div>
  );
}
