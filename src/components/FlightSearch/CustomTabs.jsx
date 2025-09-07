import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import exm from "../LandingPages/assets/exm.png";

export default function CustomTabs() {
    const [activeTab, setActiveTab] = useState("details");

    const tabs = [
        { id: "details", label: "Flight Details" },
        { id: "baggage", label: "Baggage" },
        { id: "policy", label: "Policy" },
    ];

    return (
        <div className="w-full bg-white rounded-full ">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200  ">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 text-sm font-medium py-2 text-center transition-all rounded-t-sm
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
            <div className=" text-sm text-gray-700">
                {activeTab === "details" && (
                    <div>
                        <h2 className="font-semibold mb-2">Flight Details</h2>
                        <p>Show departure, arrival, airline, and routes here.</p>
                    </div>
                )}

                {activeTab === "baggage" && (
                    <div>
                        <h2 className="font-semibold mb-2">Baggage Information</h2>
                        <p>Details about checked and cabin baggage policies.</p>
                        

                        <div className="flex items-center gap-2 py-2  text-xs text-gray-600">
                <img src={exm} alt="icon" className="w-4 h-4" />
                <p>Every metric is counted per traveller.</p>
              </div>
                    </div>
                )}

                {activeTab === "policy" && (
                    <div>
                        <p className="pt-3">Refunds and Date Changes are done as per the following policies:</p>
                        <p className="py-2">Refund is calculated by deducting Airline’s fee and FT fee from the paid amount.</p>
                        <p>Date Change fee is calculated by adding Airline’s fee, fare difference and FT fee.</p>
                        <p className="py-2">*Fees are shown for all travellers.</p>
                        <p >*FT Convenience fee is non-refundable.</p>
                        <p className="py-2">*We cannot guarantee the accuracy of airline refund/date change fees as they are subject to change without prior notice</p>
                   
                        <div className="flex gap-2 text-red-500 text-[14px] pb-4">
                            <AiOutlineQuestionCircle size={18} className="text-red-500" />
                            <p >Learn More</p>
                        </div>     
                    </div>
                )}
            </div>
        </div>
    );
}
