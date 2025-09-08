"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import BS from "../LandingPages/assets/BS.png";
import plane from "../LandingPages/assets/plane.png";
import coupon from "../LandingPages/assets/coupon.png";
import { BiLike } from "react-icons/bi";
import CustomTabs from "./CustomTabs";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdAirlineSeatReclineNormal } from "react-icons/md";

export default function FlightCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden font-murecho shadow-sm relative">
      {/* Top Chips */}
      <div className="pt-3 flex gap-3 px-4">
        <button className="text-red-700 flex items-center gap-1 px-2 bg-red-50 rounded-full">
          <RiMoneyRupeeCircleFill size={18} />
          <span className="text-[12px] font-medium">Partially Refundable</span>
        </button>
        <button className="text-red-700 flex items-center gap-1 px-2 bg-red-50 rounded-full">
          <MdAirlineSeatReclineNormal size={18} />
          <span className="text-[12px] font-medium">9 seat(s) left</span>
        </button>
      </div>

      {/* Main Row */}
      <div className="flex flex-col lg:flex-row items-stretch relative">
        {/* LEFT SIDE */}
        <div className="flex-1 p-4">
          {/* OUTBOUND */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={BS} alt="Airline" className="w-8 h-8" />
              <p className="text-[14px] font-medium leading-4">
                US Bangla <br /> Airlines
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div>
                <p className="text-xs">10 Sep, Wednesday</p>
                <p className="font-semibold">14:10</p>
                <p className="text-xs text-gray-500">DAC</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">1h 5m</p>
                <img src={plane} alt="Airline" className="w-36 py-2" />
                <p className="text-xs text-gray-500">Non-stop</p>
              </div>

              <div>
                <p className="text-xs">10 Sep, Wednesday</p>
                <p className="font-semibold">15:15</p>
                <p className="text-xs text-gray-500">CXB</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-3" />

          {/* RETURN */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={BS} alt="Airline" className="w-8 h-8" />
              <p className="text-[14px] font-medium leading-4">
                US Bangla <br /> Airlines
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div>
                <p className="text-xs">13 Sep, Saturday</p>
                <p className="font-semibold">11:25</p>
                <p className="text-xs text-gray-500">CXB</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">1h 5m</p>
                <img src={plane} alt="Airline" className="w-36 py-2" />
                <p className="text-xs text-gray-500">Non-stop</p>
              </div>

              <div>
                <p className="text-xs">13 Sep, Saturday</p>
                <p className="font-semibold">12:30</p>
                <p className="text-xs text-gray-500">DAC</p>
              </div>
            </div>
          </div>

          {/* CONTROL BAR (closed state) */}
          {!open && (
            <div className="mt-3 relative flex items-center">
              <button className="text-sky-900 flex gap-1 px-2 bg-blue-50 p-1 rounded-full">
                <BiLike size={18} />
                <span className="text-[12px] font-medium">Recommended</span>
              </button>

              <button
                onClick={() => setOpen(true)}
                className="absolute left-1/2 -translate-x-1/2 text-red-800 text-[14px] font-medium flex items-center gap-1"
              >
                <span>View Details</span>
                <ChevronDown size={18} />
              </button>
            </div>
          )}

          {/* DROPDOWN (open) */}
          <div
            className={`transition-all duration-700 ease-in-out overflow-hidden ${
              open ? "max-h-[2000px] mt-3" : "max-h-0"
            }`}
          >
            <CustomTabs />

            {/* CONTROL BAR (open state) */}
            <div className="mt-3 relative flex items-center pb-2">
              <button className="text-sky-900 flex gap-1 px-2 bg-blue-50 p-1 rounded-full">
                <BiLike size={18} />
                <span className="text-[12px] font-medium">Recommended</span>
              </button>

              <button
                onClick={() => setOpen(false)}
                className="absolute left-1/2 -translate-x-1/2 text-red-800 text-[14px] font-medium flex items-center gap-1"
              >
                <span>Hide Details</span>
                <ChevronUp size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – Fare Summary */}
        <aside className="lg:w-64 lg:self-stretch border-t lg:border-t-0 lg:border-l border-dashed border-gray-400 p-4 flex flex-col justify-between relative mb-6">
          {!open ? (
            // collapsed summary
            <div className="flex flex-col items-end">
              <button className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-2">
                <img src={coupon} alt="icon" className="w-4 h-4" />
                <span>FTDOM17</span>
              </button>

              <p className="text-red-600 text-xl font-bold mt-2">BDT 13,596</p>
              <p className="text-xs line-through text-gray-400">BDT 15,899</p>
              <p className="text-sm mt-1">Economy</p>
              <p className="text-xs text-gray-500">1 Traveler</p>
            </div>
          ) : (
            // expanded breakdown
            <div className="flex flex-col gap-2 items-end">
              <div className="w-full bg-gray-100 rounded-md p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Adult × 1</span>
                  <span className="font-medium">BDT 9,048</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">BDT 2,350</span>
                </div>
              </div>

              <div className="w-full bg-gray-100 rounded-md p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Air Fare</span>
                  <span className="font-semibold">BDT 11,398</span>
                </div>
              </div>

              <div className="w-full bg-gray-100 rounded-md p-2">
                <div className="flex items-center justify-between text-xs font-semibold text-orange-600">
                  <div className="flex items-center gap-2">
                    <img src={coupon} alt="icon" className="w-4 h-4" />
                    <span>Coupon</span>
                  </div>
                  <span>− BDT 1,538</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-gray-400 line-through">
                  BDT 11,398
                </p>
                <p className="text-red-600 text-xl font-bold leading-none">
                  BDT 9,860
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Economy • 1 Traveler
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-3 flex gap-2">
            <button className="w-full bg-gray-100 text-[14px] p-2 font-medium rounded-full hover:bg-gray-200">
              View Prices
            </button>
            <button className="w-full bg-red-600 text-[14px] text-white font-semibold rounded-full hover:bg-red-500">
              Select
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
