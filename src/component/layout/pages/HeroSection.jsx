"use client";
import React, { useState } from "react";
import video2 from "../../../assets/video2.mp4";
import Tabs from "./Tabs";
import FlightForm from "./FlightForm";
import HotelForm from "./HotelForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("flight");
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
  });

  // Form wrapper z-index state
  const [formZ, setFormZ] = useState(20);

  // ✅ PopperContainer with high z-index for calendar
  const PopperContainer = ({ children }) => (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        zIndex: 99999, // always above Tabs
      }}
    >
      {children}
    </div>
  );

  return (
    <section className="relative">

      {/* Background video */}
      <div className={`relative w-full flex items-start justify-center overflow-hidden
        h-[39vh] sm:h-[20vh] md:h-[26vh] lg:h-[26vh] xl:h-[39vh]
        min-h-[300px] sm:min-h-[200px] md:min-h-[250px] lg:min-h-[200px] xl:min-h-[300px]
        sm:block hidden
        [@media(min-width:1024px)_and_(max-width:1366px)]:h-[0vh]
        [@media(min-width:1024px)_and_(max-width:1366px)]:min-h-[200px]`}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={video2}
          autoPlay
          loop
          muted
        />
        <div className="absolute inset-0 bg-black/14 " />
        <div className="relative z-20 w-full max-w-[1200px] mx-auto text-white px-8 pt-14">
          <h1 className="text-5xl font-bold">
            Create A New Story With Every Trip
          </h1>
          <p className="text-lg mt-2">
            Flight, Hotel, Holidays & Visa at your fingertips
          </p>
        </div>
      </div>

      {/* Tabs wrapper */}
      <div className="bg-gradient-to-b from-red-50 to-gray-100 pt-4">
        <div className="max-w-[1200px] mx-auto px-8 pt-0 lg:pt-8">
          <div className="bg-white rounded-xl shadow-lg max-w-[360px] mx-auto relative z-30
            -mt-20 sm:-mt-20 md:-mt-20 lg:-mt-24 xl:-mt-28 mt-6 sm:mt-0 transition-all
            lg:-mt-2 xl:-mt-2"
          >
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>

      {/* Form */}
      <div
        className={`max-w-[1240px] px-8 mx-auto relative z-[${formZ}]
          -mt-8 sm:-mt-4 md:-mt-8 lg:-mt-10 xl:-mt-14 transition-all
          lg:-mt-12 xl:-mt-16`}
      >
        <div className="bg-white py-4 rounded-xl shadow-md">
          {activeTab === "flight" && (
            <FlightForm
              range={range}
              setRange={setRange}
              PopperContainer={PopperContainer}
              onFocus={() => setFormZ(50)}    // Input focus -> z-index 50
              onBlur={() => setFormZ(20)}     // Input blur -> z-index 20
            />
          )}
          {activeTab === "hotel" && (
            <HotelForm
              range={range}
              setRange={setRange}
              PopperContainer={PopperContainer}
              onFocus={() => setFormZ(50)}
              onBlur={() => setFormZ(20)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
