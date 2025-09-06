"use client";
import React, { useEffect, useState } from "react";
import { FcAlarmClock } from "react-icons/fc";
import { IoAirplaneOutline } from "react-icons/io5";
// import next from "./assets/next.png";
import next from "../LandingPages/assets/next.png";
import prev from "../LandingPages/assets/prev.png";
import { FaRegClock } from "react-icons/fa";
import FlightTabs from "./FlightTab";

// Mock Airlines & Flights
const MOCK_FLIGHTS = [
  {
    id: 1,
    airline: "US Bangla Airlines",
    logo: "🛫",
    departTime: "07:30",
    departAirport: "DAC",
    arriveTime: "08:35",
    arriveAirport: "CXB",
    duration: "1h 5m",
    stops: "Non-stop",
    refundable: true,
    seats: 5,
    price: 9770,
  },
  {
    id: 2,
    airline: "Air Astra",
    logo: "🛫",
    departTime: "17:00",
    departAirport: "DAC",
    arriveTime: "18:05",
    arriveAirport: "CXB",
    duration: "1h 5m",
    stops: "Non-stop",
    refundable: true,
    seats: 3,
    price: 9770,
  },
];

export default function FlightSearchPage() {
  const totalTime = 30 * 60; // 30 minutes
  const [timeLeft, setTimeLeft] = useState(totalTime);


  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Progress (0-100)
  const progress = (timeLeft / totalTime) * 100;

  return (
    <section className="bg-slate-100">
      <div className="max-w-[1200px] m-auto">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          {/* Left Sidebar */}
          <aside className="w-full md:w-72 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] flex items-center text-gray-800 gap-2">
                <FcAlarmClock size={25} /> Time Remaining
              </h3>
              <span className="font-murecho font-semibold text-[17px]">
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-red-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-1.5 bg-red-700 transition-all duration-500 pulse-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>



            {/* Departure */}
            <div className="bg-white rounded-full px-1.5 py-1.5 mb-3 flex items-center justify-between shadow">
              {/* Left Arrow */}
              <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200">
                <img src={prev} alt="next" className="h-4" />
              </button>

              {/* Center Text */}
              <div className="">
                <p className="text-xs ">Departure</p>
                <p className="text-gray-500 text-center text-[14px]">07 Sep, Sunday</p>
              </div>

              {/* Right Arrow */}
              <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200">
                <img src={next} alt="prev" className="h-4" />
              </button>
            </div>

            <div className="bg-white rounded-full px-1.5 py-1.5 mb-3 flex items-center justify-between shadow">
              {/* Left Arrow */}
              <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200">
                <img src={prev} alt="next" className="h-4" />
              </button>

              {/* Center Text */}
              <div className="">
                <p className="text-xs ">Return</p>
                <p className="text-gray-500 text-center text-[14px]">10 Sep, Wednesday</p>
              </div>

              {/* Right Arrow */}
              <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200">
                <img src={next} alt="prev" className="h-4" />
              </button>
            </div>

          </aside>

          {/* Right Section */}
          <main className="flex-1">
            <p className="text-[14px] font-semibold mt-5  mb-4">
              Showing 89 Flights & 4 Airlines
            </p>
            {/* Tabs */}
            <div className=" gap-2 mb-4">
              
            <FlightTabs/>
              
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              {MOCK_FLIGHTS.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white border rounded-lg shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  {/* Left Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{flight.logo}</span>
                      <h4 className="font-semibold">{flight.airline}</h4>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <p className="font-bold">{flight.departTime}</p>
                        <p className="text-gray-500">{flight.departAirport}</p>
                      </div>
                      <div className="flex flex-col items-center text-gray-500">
                        <IoAirplaneOutline className="text-xl" />
                        <span className="text-xs">{flight.duration}</span>
                      </div>
                      <div>
                        <p className="font-bold">{flight.arriveTime}</p>
                        <p className="text-gray-500">{flight.arriveAirport}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{flight.stops}</p>
                  </div>

                  {/* Right Section */}
                  <div className="text-right mt-3 md:mt-0">
                    {flight.refundable && (
                      <p className="text-xs text-orange-500 font-medium">
                        Partially Refundable
                      </p>
                    )}
                    <p className="text-xs text-red-600">
                      {flight.seats} seat(s) left
                    </p>
                    <p className="text-xl font-bold text-red-600">
                      BDT {flight.price}
                    </p>
                    <div className="flex gap-2 justify-end mt-2">
                      <button className="px-3 py-1 text-sm border rounded-lg">
                        View Prices
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg">
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
