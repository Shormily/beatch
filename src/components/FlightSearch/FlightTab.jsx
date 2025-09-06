"use client";
import React, { useState } from "react";
import cheapest from "../LandingPages/assets/cheapest.png";
import earliestWhite from "../LandingPages/assets/earliestWhite.png";
import fastest from "../LandingPages/assets/fastest.png";
import others from "../LandingPages/assets/others.png";

// Reusable Button
function FlightOptionButton({ active, title, time, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex py-2 w-full sm:w-48 items-center gap-4 rounded-xl px-2 transition 
        ${active ? "bg-red-50 border-b-2 border-red-600" : "bg-white"}`}
    >
      {/* Left Icon Section */}
      <div
        className={`p-3 rounded-lg flex items-center justify-center
          ${active ? "bg-red-600 text-white" : "bg-slate-100 text-black"}`}
      >
        <img src={icon} alt={title} className="h-6 w-6" />
      </div>

      {/* Text Section */}
      <div
        className={`text-left font-medium 
          ${active ? "text-red-600" : "text-black"}`}
      >
        <p>{title}</p>
        <p className="text-sm">{time}</p>
      </div>
    </button>
  );
}

export default function FlightTabs() {
  const [activeTab, setActiveTab] = useState("earliest");

  return (
    <div className="flex flex-wrap gap-4">
      <FlightOptionButton
        title="Earliest"
        time="07:20"
        icon={earliestWhite}
        active={activeTab === "earliest"}
        onClick={() => setActiveTab("earliest")}
      />
      <FlightOptionButton
        title="Cheapest"
        time="09:15"
        icon={cheapest}
        active={activeTab === "cheapest"}
        onClick={() => setActiveTab("cheapest")}
      />
      <FlightOptionButton
        title="Fastest"
        time="11:45"
        icon={fastest}
        active={activeTab === "fastest"}
        onClick={() => setActiveTab("fastest")}
      />
      <FlightOptionButton
        title="Others"
        time="Anytime"
        icon={others}
        active={activeTab === "others"}
        onClick={() => setActiveTab("others")}
      />
    </div>
  );
}
