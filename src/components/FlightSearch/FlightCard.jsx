// FlightCard.tsx
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

  // --- Fare Math from ADT in BDT (to match screenshots) ---
  const baseBDT =
    adt?.referanceFares?.find((r) => r.currency === "BDT" && r.type === "FARE")
      ?.amount ?? 0;

  const taxBDT =
    adt?.referanceFares?.find((r) => r.currency === "BDT" && r.type === "TAX")
      ?.amount ?? 0;

  const airFareBDT = baseBDT + taxBDT;

  // Change these if your promo is dynamic
  const promoCode = "FTEBLDOM18";
  const couponBDT = 1894; // use 1894 like your screenshot 2
  const totalBDT = Math.max(airFareBDT - couponBDT, 0);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden font-murecho shadow-sm relative">
      {/* Collapsed top chips row (left) */}
      <div className="pt-3 flex gap-3 px-4">
        <span className="text-red-700 flex items-center gap-1 px-2 bg-red-50 rounded-full text-[12px] font-medium">
          <RiMoneyRupeeCircleFill size={16} className="opacity-70" />
          {refundable ? "Partially Refundable" : "Non-refundable"}
        </span>

        {seatsLeft ? (
          <span className="text-red-700 flex items-center gap-1 px-2 bg-red-50 rounded-full text-[12px] font-medium">
            <MdAirlineSeatReclineNormal size={16} className="opacity-70" />
            {seatsLeft} seat(s) left
          </span>
        ) : null}

        {/* right coupon chip in collapsed header */}
        {!open && (
          <span className="ml-auto bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-2">
            <img src={coupon} alt="coupon" className="w-4 h-4" />
            <span>{promoCode}</span>
          </span>
        )}
      </div>

      {/* Main Row */}
      <div className="flex flex-col lg:flex-row items-stretch relative">
        {/* LEFT SIDE */}
        <div className="flex-1 p-4">
          {/* === Collapsed summary bar (like pic 1) === */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold overflow-hidden">
                <img
                  src={`https://airlines.a4aero.com/images/${airlineCode}.png`}
                  alt={airlineCode}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[14px] font-medium leading-4">{airlineName}</p>
            </div>

            {/* timeline */}
            <div className="flex items-center gap-6">
              {/* left time */}
              <div className="text-center">
                <p className="text-xs">{safe(depDate)}</p>
                <p className="font-semibold text-[18px] leading-none">
                  {fmtTime(depTime)}
                </p>
                <p className="text-xs text-gray-500">{depCode}</p>
              </div>

              {/* dashed route */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-600 opacity-70" />
                  <div className="w-36 border-t border-dashed border-gray-400 relative">
                    <img
                      src={planeImg}
                      alt="air route"
                      className="w-5 absolute left-1/2 -translate-x-1/2 -top-2"
                    />
                  </div>
                  <span className="h-2 w-2 rounded-full bg-sky-600 opacity-70" />
                </div>
                <p className="text-[11px] text-center mt-1">
                  {safe(duration, "—")}
                </p>
                <p className="text-xs text-gray-500">{stopText}</p>
              </div>

              {/* right time */}
              <div className="text-center">
                <p className="text-xs">{safe(arrDate)}</p>
                <p className="font-semibold text-[18px] leading-none">
                  {fmtTime(arrTime)}
                </p>
                <p className="text-xs text-gray-500">{arrCode}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-3" />

          {/* CONTROL BAR (toggle) */}
          {!open ? (
            <div className="mt-2 relative flex items-center">
              <span className="text-sky-900 flex gap-1 px-2 bg-blue-50 p-1 rounded-full">
                <BiLike size={18} />
                <span className="text-[12px] font-medium">Recommended</span>
              </span>

              <button
                onClick={() => setOpen(true)}
                className="absolute left-1/2 -translate-x-1/2 text-red-800 text-[14px] font-medium flex items-center gap-1"
              >
                <span>View Details</span>
                <ChevronDown size={18} />
              </button>
            </div>
          ) : (
            <>
              {/* === Expanded content (like pic 2) === */}
              <CustomTabs flight={flight} />
              <div className="border-t border-gray-200 my-6 mb-5" />
              <div className="mt-3 relative flex items-center pb-2">
                <span className="text-sky-900 flex gap-1 px-2 bg-blue-50 p-1 rounded-full">
                  <BiLike size={18} />
                  <span className="text-[12px] font-medium">Recommended</span>
                </span>

                <button
                  onClick={() => setOpen(false)}
                  className="absolute left-1/2 -translate-x-1/2 text-red-800 text-[14px] font-medium flex items-center gap-1"
                >
                  <span>Hide Details</span>
                  <ChevronUp size={18} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDE – Collapsed vs Expanded */}
        <aside className="lg:w-64 lg:self-stretch border-t lg:border-t-0 lg:border-l border-dashed border-gray-300 p-4 flex flex-col justify-between relative mb-6">
          {!open ? (
            // ===== Collapsed right (like pic 1) =====
            <div className="flex flex-col items-end">
              {/* <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-2">
                <img src={coupon} alt="coupon" className="w-4 h-4" />
                <span>{promoCode}</span>
              </span> */}

              <p className="text-red-600 text-2xl font-extrabold mt-2 leading-none">
                BDT {totalBDT.toLocaleString()}
              </p>
              <p className="text-xs line-through text-gray-400 mt-1">
                BDT {airFareBDT.toLocaleString()}
              </p>

              <div className="mt-4 flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="flex-1 h-10 rounded-full border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition"
                >
                  View Prices
                </button>
                <button
                  type="button"
                  className="flex-[1.2] h-10 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                >
                  Select
                </button>
              </div>
            </div>
          ) : (
            // ===== Expanded right (like pic 2) =====
            <>
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
                  <span className="font-medium">
                    BDT {taxBDT.toLocaleString()}
                  </span>
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

              {/* Keep your modal trigger if desired */}
              <div className="mt-3">
                <FareModalDemo flight={flight} />
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
