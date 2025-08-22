import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

// Helper
const fmtWeekday = (date) => format(new Date(date), "EEEE");

export default function FirsttripCalendarClone() {
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
  });

  // Custom Popper Container (Always screen center on small devices)
  const PopperContainer = ({ children }) => (
    <div
      style={{
        position: "fixed", // পুরো screen fix
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        width: "90%",      // small screen এ প্রায় full width
        maxWidth: "400px", // বড় screen এ সুন্দর দেখানোর জন্য limit
      }}
    >
      {children}
    </div>
  );

  return (
   <div className="basis-[35%] flex flex-col sm:flex-row gap-2 sm:gap-0">
  {/* Departure */}
  <div className="sm:w-1/2 w-full relative">
    <div
      className="h-20 border border-gray-300 rounded-lg sm:rounded-l-md sm:rounded-r-none px-4 pb-1 flex flex-col justify-between bg-white cursor-pointer"
      onClick={(e) => e.currentTarget.querySelector("input").focus()}
    >
      <label className="text-[12px] text-gray-500 pt-2">Departure</label>
      <div className="flex flex-col gap-0.5">
        <DatePicker
          selected={range.startDate}
          onChange={(date) => setRange({ ...range, startDate: date })}
          dateFormat="MM/dd/yyyy"
          calendarClassName="custom-calendar"
          popperContainer={PopperContainer}
          className="font-semibold text-sm pb-1 bg-transparent outline-none w-full cursor-pointer"
          popperPlacement="bottom"
        />
        <span className="text-[12px] text-gray-500">
          {fmtWeekday(range.startDate)}
        </span>
      </div>
    </div>
  </div>

  {/* Return */}
  <div className="sm:w-1/2 w-full relative">
    <div
      className="h-20 border border-gray-300 rounded-lg sm:rounded-r-md sm:rounded-l-none sm:border-l-0 px-4 pb-1 flex flex-col justify-between bg-white cursor-pointer"
      onClick={(e) => e.currentTarget.querySelector("input").focus()}
    >
      <label className="text-[12px] text-gray-500 pt-2">Return</label>
      <div className="flex flex-col gap-0.5">
        <DatePicker
          selected={range.endDate}
          onChange={(date) => setRange({ ...range, endDate: date })}
          dateFormat="MM/dd/yyyy"
          calendarClassName="custom-calendar"
          popperContainer={PopperContainer}
          className="font-semibold text-sm bg-transparent outline-none w-full cursor-pointer"
          popperPlacement="bottom"
        />
        <span className="text-[12px] text-gray-500">
          {fmtWeekday(range.endDate)}
        </span>
      </div>
    </div>
  </div>
</div>

  );
}
