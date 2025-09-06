import React, { useState } from 'react';
import HotelForm from '../LandingPages/HotelForm';
import FlightForm from '../LandingPages/FlightForm';

const Searchresult = () => {
  const [activeTab,] = useState("flight");
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
    <>
      {/* Form section result */}
      <section className=' '>
        <div
          className={`max-w-[1240px] px-8 mx-auto relative z-[${formZ}]
                      -mt-8 sm:-mt-4 md:-mt-8 lg:-mt-10 xl:-mt-14 transition-all
                      lg:-mt-12 xl:-mt-16 `}
        >
          <div className="bg-white pt-14 pb-4   ">
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

    </>
  );
};

export default Searchresult;