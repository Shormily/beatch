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
  {/* Background video */}
  <div
    className={`
      relative w-full flex items-start justify-center overflow-hidden
      h-[39vh] sm:h-[20vh] md:h-[26vh] lg:h-[26vh] xl:h-[39vh]
      min-h-[300px] sm:min-h-[200px] md:min-h-[250px] lg:min-h-[200px] xl:min-h-[300px]
      sm:block hidden
      /* iPad Pro (portrait & landscape) overrides */
      [@media(min-width:1024px)_and_(max-width:1366px)]:h-[0vh]
      [@media(min-width:1024px)_and_(max-width:1366px)]:min-h-[200px]
    `}
  >
    <video
      className="absolute inset-0 w-full h-full object-cover"
      src={video2}
      autoPlay
      loop
      muted
    />
    <div className="absolute inset-0 bg-black/14 z-10" />
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
    <div
      className={`
        bg-white rounded-md shadow-lg max-w-[360px] mx-auto relative z-30
        -mt-20 sm:-mt-20 md:-mt-20 lg:-mt-24 xl:-mt-28 mt-6 sm:mt-0
        transition-all

        /* For 1024px width (Lg) */
        lg:-mt-2

        /* For 1280px width (Xl) */
        xl:-mt-2
      `}
    >
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  </div>
</div>


  {/* Form */}
  <div
  className={`
    max-w-[1240px] px-8 mx-auto relative z-20
    -mt-8 sm:-mt-8 md:-mt-8 lg:-mt-10 xl:-mt-14
    transition-all

    /* For 1024px width (Lg) */
    lg:-mt-12

    /* For 1280px width (Xl) */
    xl:-mt-16
  `}
>
  <div className="bg-white py-4 rounded-xl shadow-md">
    {activeTab === "flight" && <FlightForm />}
    {activeTab === "hotel" && <HotelForm />}
  </div>
</div>

</section>

  );
}
