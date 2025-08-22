"use client";
import React, { useState } from "react";
import video2 from "../../../assets/video2.mp4";
import Tabs from "./Tabs";
import FlightForm from "./FlightForm";
import HotelForm from "./HotelForm";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("flight");

  return (
    <section className="relative">
      {/* ---------- Background video ---------- */}
      <div
        className="
          relative w-full 
          h-[39vh] sm:h-[20vh] md:h-[25vh] lg:h-[20vh] xl:h-[39vh] 
          min-h-[300px] sm:min-h-[200px] md:min-h-[250px] lg:min-h-[200px] xl:min-h-[300px] 
          flex items-start justify-center overflow-hidden 
          sm:block hidden   /* 👈 sm এর নিচে video hide */
        "
      >
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={video2}
          autoPlay
          loop
          muted
        />
        <div className="absolute inset-0 bg-black/14 z-10" />
        <div className="relative z-20 w-full max-w-[1200px] mx-auto text-white px-4 pt-14">
          <h1 className="text-5xl font-bold">
            Create A New Story With Every Trip
          </h1>
          <p className="text-lg mt-2">
            Flight, Hotel, Holidays & Visa at your fingertips
          </p>
        </div>
      </div>

      {/* ------------ Tabs wrapper ------------ */}
      <div className="bg-gradient-to-b from-red-50 to-gray-100 pt-4">
        <div className="max-w-[1200px] mx-auto px-8 pt-0 lg:pt-8">
          <div
            className="
              bg-white rounded-md shadow-lg max-w-[360px] mx-auto
              relative 
              -mt-0 sm:-mt-10 md:-mt-16 lg:-mt-20 xl:-mt-24
              mt-6 sm:mt-0    /* 👈 ছোট screen এ normal margin */
              z-30
            "
          >
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>

      {/* ------------ Form ------------ */}
      <div
        className="
          max-w-[1240px] px-8 mx-auto relative rounded-t-lg 
          sm:-mt-6 md:-mt-8 lg:-mt-10 xl:-mt-12
          z-20
        "
      >
        <div className="bg-white py-4 rounded-lg shadow-md">
          {activeTab === "flight" && <FlightForm />}
          {activeTab === "hotel" && <HotelForm />}
        </div>
      </div>
    </section>
  );
}
