import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaLocationArrow, FaFlag } from "react-icons/fa";
import exm from "../LandingPages/assets/exm.png";
import { SlLocationPin } from "react-icons/sl";

export default function CustomTabs() {
  const [activeTab, setActiveTab] = useState("details");
  const [activeRoute, setActiveRoute] = useState("depart");

  const tabs = [
    { id: "details", label: "Flight Details" },
    { id: "baggage", label: "Baggage" },
    { id: "policy", label: "Policy" },
  ];

  return (
    <div className="w-full bg-white  ">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-sm font-medium py-2 text-center rounded-t-lg transition-all
                 ${activeTab === tab.id
                ? "text-red-600 border-b-2 border-red-500 bg-red-50"
                : "text-gray-600 hover:text-red-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="text-sm text-gray-700">
        {/* -------- Flight Details -------- */}
        {activeTab === "details" && (
          <div>
            {/* Radio Buttons */}
            <div className="flex items-center gap-6 py-4 pb-3  ">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="route"
                  value="depart"
                  checked={activeRoute === "depart"}
                  onChange={() => setActiveRoute("depart")}
                  className="accent-red-500"
                />
                <span
                  className={`${activeRoute === "depart" ? "text-red-700" : "text-black"
                    } font-medium`}
                >
                  DAC - CXB (Depart)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="route"
                  value="return"
                  checked={activeRoute === "return"}
                  onChange={() => setActiveRoute("return")}
                  className="accent-red-500"
                />
                <span
                  className={`${activeRoute === "return" ? "text-red-700" : "text-black"
                    } font-medium`}
                >
                  CXB - DAC (Return)
                </span>
              </label>
            </div>

            {/* Flight Info */}
            <div className=" ">
              <div className="flex gap-5 rounded-md p-2 bg-slate-100 items-center px-2">
                <div>
                  <p className="text-sm font-semibold justify-end flex">10:10</p>
                  <p className="text-xs text-gray-600">10 Sep,Wednesday</p>
                </div>

                <div className="flex justify-center">
                  <SlLocationPin size={20} className="text-gray-900" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Departure, Dhaka</p>
                  <p className="text-xs text-gray-600">DAC - Hazrat Shahjalal International Airport, Bangladesh (TD)</p>
                </div>
              </div>
              <div className="flex gap-5 rounded-md p-2 bg-white items-center ">
                <div>
                  <p className="text-sm font-semibold text-red-400 justify-end flex">Economy (I)</p>
                  <p className="text-xs text-gray-600">BS 151</p>
                </div>

                <div className="flex justify-center border h-9 mx-6 my-4 border-red ">
                 
                </div>

                <div>
                  <p className="text-sm font-semibold">

                    US Bangla Airlines</p>
                  <p className="text-xs text-gray-600">ATR 72 - 600</p>
                </div>
              </div>
              <div className="flex gap-5 rounded-md p-2 bg-slate-100 items-center ">
                <div>
                  <p className="text-sm font-semibold justify-end flex">10:10</p>
                  <p className="text-xs text-gray-600">10 Sep,Wednesday</p>
                </div>

                <div className="flex justify-center">
                  <SlLocationPin size={20} className="text-gray-900" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Arrival, Cox's Bazar</p>
                  <p className="text-xs text-gray-600">CXB - Cox's Bazar, Bangladesh</p>
                </div>
              </div>

              {/* Divider row */}

            </div>


          </div>
        )}

        {/* -------- Baggage -------- */}
        {activeTab === "baggage" && (
          <div>
            {/* Radio Buttons */}
            <div className="flex items-center gap-6 py-4 pb-3 ">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="route-bag"
                  value="depart"
                  checked={activeRoute === "depart"}
                  onChange={() => setActiveRoute("depart")}
                  className="accent-red-500"
                />
                <span
                  className={`${activeRoute === "depart" ? "text-red-700" : "text-black"
                    } font-medium`}
                >
                  DAC - CXB (Depart)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="route-bag"
                  value="return"
                  checked={activeRoute === "return"}
                  onChange={() => setActiveRoute("return")}
                  className="accent-red-500"
                />
                <span
                  className={`${activeRoute === "return" ? "text-red-700" : "text-black"
                    } font-medium`}
                >
                  CXB - DAC (Return)
                </span>
              </label>
            </div>

            {/* Main Baggage block (header + subrow) */}
            <div className="bg-gray-100 rounded-md overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-3 text-sm font-medium text-gray-600 pt-1">
                <div className="flex items-center  justify-center border-r border-white ">
                  Flight
                </div>
                <div className="flex items-center justify-center border-r border-white ">
                  Cabin
                </div>
                <div className="flex items-center justify-center ">
                  Checked-in
                </div>
              </div>

              {/* Sub-header row (e.g. Adult labels) */}
              <div className="grid grid-cols-3 text-sm text-center">
                <div className="flex items-center justify-center border-r border-white py-3"></div>
                <div className="flex items-center justify-center border-r border-white ">
                  Adult
                </div>
                <div className="flex items-center justify-center py-3">Adult</div>
              </div>
            </div>

            {/* Economy block (header + values) */}
            <div className="bg-slate-100 rounded-md overflow-hidden mt-4">
              {/* Economy header row */}
              <div className="grid grid-cols-3 text-sm font-medium text-gray-600">
                <div className="flex items-center justify-center border-r border-gray-300 pt-1">
                  Economy
                </div>
                <div className="flex items-center justify-center border-r border-gray-300 "></div>
                <div className="flex items-center justify-center "></div>
              </div>

              {/* Economy values row */}
              <div className="grid grid-cols-3 text-sm text-center">
                <div className="flex items-center justify-center border-r border-gray-300  font-semibold">
                  DAC - CXB
                </div>
                <div className="flex items-center justify-center border-r border-gray-300 ">
                  7kg
                </div>
                <div className="flex items-center justify-center py-3">
                  20kg
                </div>
              </div>
            </div>

            {/* Note / icon row */}
            <div className="flex items-center gap-2 py-3 text-xs text-gray-600">
              <img src={exm} alt="icon" className="w-4 h-4" />
              <p>Every metric is counted per traveller.</p>
            </div>
          </div>
        )}


        {/* -------- Policy -------- */}
        {activeTab === "policy" && (
          <div>
            <p className="pt-3">Refunds and Date Changes are done as per the following policies:</p>
            <p className="py-2">Refund is calculated by deducting Airline’s fee and FT fee from the paid amount.</p>
            <p>Date Change fee is calculated by adding Airline’s fee, fare difference and FT fee.</p>
            <p className="py-2 font-bold ">*Fees are shown for all travellers.</p>
            <p>*FT Convenience fee is non-refundable.</p>
            <p className="py-2">*We cannot guarantee the accuracy of airline refund/date change fees as they are subject to change without prior notice</p>

            <div className="flex gap-2 text-red-500 text-[14px] pb-4">
              <AiOutlineQuestionCircle size={18} className="text-red-500" />
              <p>Learn More</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
