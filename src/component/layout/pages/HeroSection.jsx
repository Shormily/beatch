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
        className="relative w-full h-[39vh] 
                sm:h-[20vh] md:h-[25vh] lg:h-[20vh] xl:h-[39vh] 
                flex items-start justify-center overflow-hidden max-[754px]:hidden"
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
          <h1 className="text-5xl font-bold">Create A New Story With Every Trip</h1>
          <p className="text-lg mt-2">Flight, Hotel, Holidays & Visa at your fingertips</p>
        </div>
      </div>

      {/* ------------ Tabs wrapper (3 line moved here) ------------ */}
      <div className="bg-gradient-to-b from-red-50 to-gray-100">
        <div className="max-w-[1200px] mx-auto px-8 pt-8 lg:pt-0">
          <div className="relative z-0 lg:z-40 bg-white sm:rounded-none lg:rounded-md shadow-lg max-w-[360px] xl:mt-[-100px] lg:mt-[-80px] mx-auto">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>

      {/* ------------ Form ------------ */}
      <div className="max-w-[1240px] px-8 z-30 mx-auto relative rounded-t-lg mt-0 lg:mt-[-30px]">
        <div className="bg-white py-4 rounded-lg">
          {activeTab === "flight" && <FlightForm />}
          {activeTab === "hotel" && <HotelForm />}
        </div>
      </div>
    </section>
  );
}
