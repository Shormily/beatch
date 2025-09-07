import React, { useState } from "react";

export default function CustomTabs() {
  const [activeTab, setActiveTab] = useState("details");

  const tabs = [
    { id: "details", label: "Flight Details" },
    { id: "baggage", label: "Baggage" },
    { id: "policy", label: "Policy" },
  ];

  return (
    <div className="w-full bg-white rounded-md shadow-sm">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-sm font-medium py-2 text-center transition-all
              ${
                activeTab === tab.id
                  ? "text-red-600 border-b-2 border-red-500 bg-red-50"
                  : "text-gray-600 hover:text-red-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="p-4 text-sm text-gray-700">
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
          </div>
        )}

        {activeTab === "policy" && (
          <div>
            <h2 className="font-semibold mb-2">Cancellation Policy</h2>
            <p>Refund, cancellation, and reschedule policy information.</p>
          </div>
        )}
      </div>
    </div>
  );
}
