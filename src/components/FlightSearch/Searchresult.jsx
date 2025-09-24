// src/pages/Searchresult.jsx
import React, { useState } from "react";
import HotelForm from "../LandingPages/HotelForm";
import FlightForm from "../LandingPages/FlightForm";

export default function Searchresult() {
  const [activeTab] = useState("flight");
  const [formZ, setFormZ] = useState(20);

  const PopperContainer = ({ children }) => (
    <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 99999 }}>
      {children}
    </div>
  );

  return (
    <section>
      <div
        className={`max-w-[1240px] px-8 mx-auto relative`}
        style={{ zIndex: formZ }}
      >
        <div className="bg-white pt-14 pb-4">
          {activeTab === "flight" && (
            <FlightForm
              showMissingHint={true} // 👈 hide the “Missing: …” helper on this page
              PopperContainer={PopperContainer}
              onFocus={() => setFormZ(50)}
              onBlur={() => setFormZ(20)}
            />
          )}
          {activeTab === "hotel" && (
            <HotelForm PopperContainer={PopperContainer} />
          )}
        </div>
      </div>
    </section>
  );
}
