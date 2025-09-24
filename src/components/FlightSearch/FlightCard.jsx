"use client";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import coupon from "../LandingPages/assets/coupon.png";
import planeImg from "../LandingPages/assets/plane.png";
import { BiLike } from "react-icons/bi";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import CustomTabs from "./CustomTabs";
import { Link } from "react-router-dom";

// Optional: if you have logos per airline code, map them here
// import MH from "../LandingPages/assets/MH.png";
// const AIRLINE_LOGOS = { MH };

const fmtTime = (t) =>
  t
    ? String(t)
        .padStart(4, "0")
        .replace(/(\d{2})(\d{2})/, "$1:$2")
    : "";
const safe = (v, d = "") => (v === undefined || v === null || v === "" ? d : v);

export default function FlightCard({ flight }) {
  const [open, setOpen] = useState(false);

  // Defensive parsing
  const validatingCarrier =
    flight?.validatingCarrier || flight?.raw?.validatingCarrier || "";

  const brandBDT = flight?.raw?.brands?.find((b) => b.currency === "BDT");
  const totalFareBDT = brandBDT?.totalFare;

  const refFareBDT =
    flight?.raw?.fares?.[0]?.passengerFares?.[0]?.referanceFares?.find(
      (rf) => rf.currency === "BDT" && rf.type === "FARE"
    );
  const priceCurrency =
    (brandBDT && "BDT") ||
    (refFareBDT && "BDT") ||
    flight?.raw?.totalFare?.currency ||
    "";
  const priceTotal =
    totalFareBDT ??
    refFareBDT?.amount ??
    flight?.raw?.totalFare?.totalFare ??
    null;

  const segments = useMemo(
    () => flight?.segments || flight?.raw?.flights?.[0]?.flightSegments || [],
    [flight]
  );
  const firstSeg = segments[0] || {};
  const lastSeg = segments[segments.length - 1] || {};

  const depDate = firstSeg?.departure?.depDate || "";
  const depTime = firstSeg?.departure?.depTime || "";
  const depCode = firstSeg?.departure?.airport?.airportCode || "";

  const arrDate = lastSeg?.arrival?.arrDate || "";
  const arrTime = lastSeg?.arrival?.arrTime || "";
  const arrCode = lastSeg?.arrival?.airport?.airportCode || "";

  const stops = Number(
    flight?.stops ??
      flight?.raw?.stops ??
      flight?.raw?.flights?.[0]?.totalStops ??
      0
  );
  const duration =
    flight?.duration || flight?.raw?.flights?.[0]?.totalElapsedTime || "";

  // Seats left — try to derive from the *first* segment numberOfSeats, fallback to 0/unknown
  const seatsLeft =
    segments.find((s) => Number(s?.numberOfSeats) > 0)?.numberOfSeats ?? null;

  // Refundability — derive from first passenger fare if available
  const refundable =
    flight?.raw?.fares?.[0]?.passengerFares?.[0]?.refundable ??
    flight?.raw?.totalFare?.refundable ??
    false;

  // Airline display
  const airlineCode =
    firstSeg?.airline?.optAirlineCode ||
    firstSeg?.airline?.code ||
    flight?.raw?.validatingCarrierCode ||
    "";
  const airlineName =
    firstSeg?.airline?.optAirline ||
    firstSeg?.airline?.name ||
    validatingCarrier ||
    airlineCode;

  // const airlineLogo = AIRLINE_LOGOS[airlineCode]; // if you have a map

  // Build a human text for stops
  const stopText =
    stops === 0 ? "Non-stop" : stops === 1 ? "1 stop" : `${stops} stops`;

  // Fare breakdown (very simple — customize as needed)
  const paxFares = flight?.raw?.fares?.[0]?.passengerFares || [];
  const adt = paxFares.find((p) => p.passengerType === "ADT");
  const chd = paxFares.find((p) => p.passengerType === "CHD");
  const inf = paxFares.find((p) => p.passengerType === "INF");

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden font-murecho shadow-sm relative">
      {/* Top Chips */}
      <div className="pt-3 flex gap-3 px-4">
        <button className="text-red-700 flex items-center gap-1 px-2 bg-red-50 rounded-full">
          <RiMoneyRupeeCircleFill size={18} />
          <span className="text-[12px] font-medium">
            {refundable ? "Refundable" : "Non-refundable"}
          </span>
        </button>

        {seatsLeft ? (
          <button className="text-red-700 flex items-center gap-1 px-2 bg-red-50 rounded-full">
            <MdAirlineSeatReclineNormal size={18} />
            <span className="text-[12px] font-medium">
              {seatsLeft} seat(s) left
            </span>
          </button>
        ) : null}
      </div>

      {/* Main Row */}
      <div className="flex flex-col lg:flex-row items-stretch relative">
        {/* LEFT SIDE */}
        <div className="flex-1 p-4">
          {/* OUTBOUND (this card shows one itinerary direction as provided) */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              {/* Airline logo or code bubble */}
              {/* {airlineLogo ? (
                <img src={airlineLogo} alt={airlineCode} className="w-8 h-8" />
              ) : ( */}
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                <img
                  src={`https://airlines.a4aero.com/images/${airlineCode}.png`}
                />
              </div>
              {/* )} */}
              <p className="text-[14px] font-medium leading-4">{airlineName}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div>
                <p className="text-xs">{safe(depDate)}</p>
                <p className="font-semibold">{fmtTime(depTime)}</p>
                <p className="text-xs text-gray-500">{depCode}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm">{safe(duration, "—")}</p>
                <img src={planeImg} alt="air route" className="w-36 py-2" />
                <p className="text-xs text-gray-500">{stopText}</p>
              </div>

              <div>
                <p className="text-xs">{safe(arrDate)}</p>
                <p className="font-semibold">{fmtTime(arrTime)}</p>
                <p className="text-xs text-gray-500">{arrCode}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-3" />

          {/* If you want to show connecting segments briefly */}
          {stops > 0 && (
            <div className="text-xs text-gray-600">
              Via{" "}
              {segments
                .slice(0, -1)
                .map(
                  (s) =>
                    s.arrival?.airport?.cityName ||
                    s.arrival?.airport?.airportCode
                )
                .filter(Boolean)
                .join(" · ")}
            </div>
          )}

          <div className="border-t border-gray-200 my-3 mb-5" />

          {/* CONTROL BAR (closed) */}
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
            {/* Tabs can consume 'flight' and 'segments' if you pass them in */}
            {/* Example: <CustomTabs flight={flight} segments={segments} /> */}
            <CustomTabs />

            <div className="border-t border-gray-200 my-6 mb-5" />

            {/* CONTROL BAR (open) */}
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
              {/* Example coupon chip — you can compute best promo here */}
              <button className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-2">
                <img src={coupon} alt="coupon" className="w-4 h-4" />
                <span>FLEX</span>
              </button>

              <p className="text-red-600 text-xl font-bold mt-2">
                {priceCurrency}{" "}
                {priceTotal != null ? Number(priceTotal).toLocaleString() : "—"}
              </p>
              {/* If you have original price, show strike-through; otherwise hide */}
              {/* <p className="text-xs line-through text-gray-400">{priceCurrency} 15,899</p> */}
              <p className="text-sm mt-1">
                {safe(flight?.raw?.flights?.[0]?.cabinClass, "Economy")}
              </p>
              {/* Compute travelers count if needed */}
              {/* <p className="text-xs text-gray-500">1 Traveler</p> */}
            </div>
          ) : (
            // expanded breakdown (uses first passenger fare if present)
            <div className="flex flex-col gap-2 items-end">
              {adt && (
                <div className="w-full bg-gray-100 rounded-md p-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Adult × {adt.quantity ?? 1}
                    </span>
                    <span className="font-medium">
                      {adt.currency || priceCurrency}{" "}
                      {Number(
                        adt.totalFare ?? adt.subTotalFare ?? 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              {chd && (
                <div className="w-full bg-gray-100 rounded-md p-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Child × {chd.quantity ?? 1}
                    </span>
                    <span className="font-medium">
                      {chd.currency || priceCurrency}{" "}
                      {Number(
                        chd.totalFare ?? chd.subTotalFare ?? 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              {inf && (
                <div className="w-full bg-gray-100 rounded-md p-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Infant × {inf.quantity ?? 1}
                    </span>
                    <span className="font-medium">
                      {inf.currency || priceCurrency}{" "}
                      {Number(
                        inf.totalFare ?? inf.subTotalFare ?? 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="text-right">
                <p className="text-red-600 text-xl font-bold leading-none">
                  {priceCurrency}{" "}
                  {priceTotal != null
                    ? Number(priceTotal).toLocaleString()
                    : "—"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {safe(flight?.raw?.flights?.[0]?.cabinClass, "Economy")}
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
        <div className="mt-3 flex gap-2">
  <button className="w-full bg-gray-100 text-[14px] p-2 font-medium rounded-full hover:bg-gray-200">
    View Prices
  </button>

  <Link
    to="/fare"
    className="w-full bg-red-600 text-[14px] text-white font-semibold rounded-full hover:bg-red-500 flex items-center justify-center"
  >
    Select
  </Link>
</div>


        </aside>
      </div>
    </div>
  );
}
