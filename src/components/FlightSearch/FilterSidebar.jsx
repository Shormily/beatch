"use client";
import React, { useEffect, useState } from "react";
import { FcAlarmClock } from "react-icons/fc";
import { IoAirplaneOutline } from "react-icons/io5";
import next from "../LandingPages/assets/next.png";
import prev from "../LandingPages/assets/prev.png";
import { FaRegClock } from "react-icons/fa";
import FlightTabs from "./FlightTab";
import Dropdownmenu from "./Dropdownmenu";
import FlightCard from "./FlightCard";



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
          <Dropdownmenu/>
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
            
              <FlightCard/>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
