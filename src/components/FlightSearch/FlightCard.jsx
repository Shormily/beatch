// FlightCard.tsx / .jsx
"use client";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import coupon from "../LandingPages/assets/coupon.png";
import planeImg from "../LandingPages/assets/plane.png";
import { BiLike } from "react-icons/bi";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import CustomTabs from "./CustomTabs";
import FareModalDemo from "./FareModal";
// import { Link } from "react-router-dom"; // not used here

// Optional: if you have logos per airline code, map them here
// import MH from "../LandingPages/assets/MH.png";
// const AIRLINE_LOGOS = { MH };

const fmtTime = (t) =>
  t
    ? String(t)
        .padStart(4, "0")
        .replace(/(\d{2})(\d{2})/, "$1:$2")
    : "";
// eslint-disable-next-line no-undef
const safe = (v = 0) => (v === undefined || v === null || v === "" ? d : v);

export default function FlightCard({ flight }) {
  const [open, setOpen] = useState(false);

  // Defensive parsing
  const validatingCarrier =
    flight?.validatingCarrier || flight?.raw?.validatingCarrier || "";

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

  // Seats left — try to derive from the first segment numberOfSeats
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

  // Stops label
  const stopText =
    stops === 0 ? "Non-stop" : stops === 1 ? "1 stop" : `${stops} stops`;

  // Fare breakdown (raw)
  const paxFares = flight?.raw?.fares?.[0]?.passengerFares || [];
  const adt = paxFares.find((p) => p.passengerType === "ADT");

  // --- Screenshot-style Fare Math from ADT in BDT ---
  const baseBDT =
    adt?.referanceFares?.find((r) => r.currency === "BDT" && r.type === "FARE")
      ?.amount ?? 0;

  const taxBDT =
    adt?.referanceFares?.find((r) => r.currency === "BDT" && r.type === "TAX")
      ?.amount ?? 0;

  const airFareBDT = baseBDT + taxBDT;

  // Change these if your promo is dynamic
  const promoCode = "FTEBLDOM18";
  const couponBDT = 1534;
  const totalBDT = Math.max(airFareBDT - couponBDT, 0);

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
          {/* OUTBOUND */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              {/* Airline logo or code bubble */}
              {/* {AIRLINE_LOGOS[airlineCode] ? (
                <img src={AIRLINE_LOGOS[airlineCode]} alt={airlineCode} className="w-8 h-8" />
              ) : ( */}
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold overflow-hidden">
                <img
                  src={`https://airlines.a4aero.com/images/${airlineCode}.png`}
                  alt={airlineCode}
                  className="w-full h-full object-contain"
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

          {/* Connecting cities (if any) */}
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
            <CustomTabs />
            <div className="border-t border-gray-200 my-6 mb-5" />
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

        {/* RIGHT SIDE – Fare Summary (screenshot style) */}
        <aside className="lg:w-64 lg:self-stretch border-t lg:border-t-0 lg:border-l border-dashed border-gray-300 p-4 flex flex-col justify-between relative mb-6">
          {/* Breakdown cards */}
          <div className="space-y-2">
            <div className="bg-gray-50 rounded-md p-3 text-sm flex items-center justify-between">
              <span className="text-gray-600">
                Adult X {adt?.quantity ?? 1}
              </span>
            </div>

            <div className="bg-gray-50 rounded-md p-3 text-sm flex items-center justify-between">
              <span className="text-gray-600">Base Fare</span>
              <span className="font-medium">
                BDT {baseBDT.toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-50 rounded-md p-3 text-sm flex items-center justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">BDT {taxBDT.toLocaleString()}</span>
            </div>

            <div className="bg-gray-50 rounded-md p-3 text-sm flex items-center justify-between">
              <span className="text-gray-700 font-medium">Air Fare</span>
              <span className="font-semibold">
                BDT {airFareBDT.toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-50 rounded-md p-3 text-sm flex items-center justify-between">
              <span className="text-orange-600">Coupon</span>
              <span className="font-semibold text-orange-600">
                - BDT {couponBDT.toLocaleString()}
              </span>
            </div>

            {/* Code chip + totals */}
            <div className="flex flex-col items-end pt-2">
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-2">
                <img src={coupon} alt="coupon" className="w-4 h-4" />
                <span>{promoCode}</span>
              </span>

              <p className="text-red-600 text-2xl font-extrabold mt-2 leading-none">
                BDT {totalBDT.toLocaleString()}
              </p>
              <p className="text-xs line-through text-gray-400 mt-1">
                BDT {airFareBDT.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Optional modal trigger you already had */}
          <div className="mt-3">
            <FareModalDemo flight={flight} />
          </div>
        </aside>
      </div>
    </div>
  );
}
