import FlightImg from "./assets/Flight.png";
import HotelImg from "./assets/Hotel.png";

export default function Tabs({ activeTab, setActiveTab }) {
    return (
       <div className="rounded-md overflow-hidden">
  <div className="flex justify-center sm:justify-start md:justify-center gap-2 p-2">
    {/* Flight tab */}
    <button
      onClick={() => setActiveTab("flight")}
      className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2
        w-[170px] sm:w-[110px] md:w-[170px]
        px-2 py-1 sm:py-2 rounded-md font-medium transition
        ${
          activeTab === "flight"
            ? "bg-red-50 text-red-600 shadow-sm"
            : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      <img
        src={FlightImg}
        alt="flight"
        className="h-8 w-8 sm:h-10 sm:w-10" /* 👈 ছোট screen এ icon ছোট */
      />
      <span className="text-[14px]">Flight</span>
    </button>

    {/* Hotel tab */}
    <button
      onClick={() => setActiveTab("hotel")}
      className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2
        w-[170px] sm:w-[110px] md:w-[170px]
        px-2 py-1 sm:py-2 rounded-md font-medium transition
        ${
          activeTab === "hotel"
            ? "bg-red-50 text-red-600 shadow-sm"
            : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      <img
        src={HotelImg}
        alt="hotel"
        className="h-8 w-8 sm:h-10 sm:w-10"
      />
      <span className="text-[14px]">Hotel</span>
    </button>
  </div>
</div>

    );
}
