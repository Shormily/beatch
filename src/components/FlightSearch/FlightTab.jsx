"use client";
import React, { useState } from "react";
import { FaRegClock } from "react-icons/fa";

// Reusable Button
function FlightOptionButton({ active, title, time, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 h-15 items-center gap-4 rounded-xl px-2 transition 
        ${active ? "bg-red-50 border-b-2 border-red-600" : "bg-white"}`}
    >
      {/* Left Icon Section */}
      <div
        className={`p-3 rounded-lg flex items-center justify-center
          ${active ? "bg-red-600 text-white" : "bg-slate-100 text-black"}`}
      >
        <FaRegClock size={20} />
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
    <div className="flex gap-4">
      <FlightOptionButton
        title="Earliest"
        time="07:20"
        active={activeTab === "earliest"}
        onClick={() => setActiveTab("earliest")}
      />
      <FlightOptionButton
        title="Cheapest"
        time="09:15"
        active={activeTab === "cheapest"}
        onClick={() => setActiveTab("cheapest")}
      />
      <FlightOptionButton
        title="Fastest"
        time="11:45"
        active={activeTab === "fastest"}
        onClick={() => setActiveTab("fastest")}
      />
     
     
    </div>
  );
}
