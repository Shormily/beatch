// FlightCard.jsx
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

/* =============== helpers =============== */
const fmtTime = (t) =>
  t
    ? String(t)
        .padStart(4, "0")
        .replace(/(\d{2})(\d{2})/, "$1:$2")
    : "";
const safe = (v, d = "") => (v === undefined || v === null || v === "" ? d : v);

// Put near your other helpers

// Nice label normalizer
const cabinLabel = (raw) => {
  if (!raw) return "Economy";
  const v = String(raw).trim();

  // UI labels first
  const lower = v.toLowerCase();
  if (lower === "economy") return "Economy";
  if (lower === "premium economy") return "Premium Economy";
  if (lower === "business" || lower === "business class") return "Business";
  if (lower === "first" || lower === "first class") return "First";

  // API tokens (common cases)
  if (v === "PremiumEconomy") return "Premium Economy";
  if (v.toUpperCase() === "ECONOMY") return "Economy";
  if (v.toUpperCase() === "BUSINESS") return "Business";
  if (v.toUpperCase() === "FIRST") return "First";

  // Booking/cabin codes
  const up = v.toUpperCase();
  if (up === "Y") return "Economy";
  if (up === "C" || up === "J") return "Business";
  if (up === "F") return "First";

  // fuzzy
  if (lower.includes("premium")) return "Premium Economy";
  if (lower.includes("business")) return "Business";
  if (lower.includes("first")) return "First";

  return "Economy";
};

// Pull a representative cabin from the first segment we find
const extractCabinFromSegments = (flight) => {
  const legs = getLegs(flight);
  for (const leg of legs) {
    const segs = leg?.flightSegments || [];
    for (const s of segs) {
      // prefer explicit cabinType, then code, then booking class
      if (s?.cabinType) return s.cabinType; // e.g. "BUSINESS"
      if (s?.cabinTypeCode) return s.cabinTypeCode; // e.g. "C"
      if (s?.bookingClass) return s.bookingClass; // e.g. "D"
    }
  }
  return null;
};

// pick legs (outbound/return)
const getLegs = (flight) => {
  if (Array.isArray(flight?.flights) && flight.flights.length)
    return flight.flights;
  if (Array.isArray(flight?.raw?.flights) && flight.raw.flights.length)
    return flight.raw.flights;
  const segs =
    flight?.segments || flight?.raw?.flights?.[0]?.flightSegments || [];
  return segs.length ? [{ flightSegments: segs }] : [];
};

const firstLastSeg = (leg) => {
  const segs = Array.isArray(leg?.flightSegments) ? leg.flightSegments : [];
  const first = segs[0] || {};
  const last = segs.length ? segs[segs.length - 1] : {};
  return { segs, first, last };
};

const seatsLeftFromFlight = (flight) => {
  const legs = getLegs(flight);
  for (const leg of legs) {
    const { segs } = firstLastSeg(leg);
    const found = segs.find((s) => Number(s?.numberOfSeats) > 0)?.numberOfSeats;
    if (found) return found;
  }
  return null;
};

const isRefundable = (flight) =>
  flight?.fares?.[0]?.passengerFares?.[0]?.refundable ??
  flight?.raw?.fares?.[0]?.passengerFares?.[0]?.refundable ??
  flight?.raw?.totalFare?.refundable ??
  false;

// pax helpers
const getPassengerFares = (flight) =>
  flight?.fares?.[0]?.passengerFares ||
  flight?.raw?.fares?.[0]?.passengerFares ||
  [];
const bdtPart = (pf, type) =>
  Number(
    pf?.referanceFares?.find((r) => r.currency === "BDT" && r.type === type)
      ?.amount ?? 0
  );
const buildPaxMap = (flight) => {
  const list = getPassengerFares(flight);
  const map = {};
  list.forEach((pf) => {
    const key = pf.passengerType; // ADT / CHD / INF
    if (!map[key]) map[key] = { quantity: 0, base: 0, tax: 0 };
    map[key].quantity += Number(pf.quantity || 0);
    map[key].base += bdtPart(pf, "FARE");
    map[key].tax += bdtPart(pf, "TAX");
  });
  return map;
};
const paxLabel = (t) =>
  t === "ADT" ? "Adult" : t === "CHD" ? "Child" : t === "INF" ? "Infant" : t;

/* =============== row component =============== */
function TimelineRow({ leg }) {
  const { first, last } = firstLastSeg(leg);
  const airlineCode =
    first?.airline?.optAirlineCode || first?.airline?.code || "";
  const airlineName =
    first?.airline?.optAirline || first?.airline?.name || airlineCode;

  const depDate = safe(first?.departure?.depDate);
  const depTime = safe(first?.departure?.depTime);
  const depCode =
    first?.departure?.airport?.airportCode ||
    first?.departure?.airport?.cityCode ||
    "";

  const arrDate = safe(last?.arrival?.arrDate);
  const arrTime = safe(last?.arrival?.arrTime);
  const arrCode =
    last?.arrival?.airport?.airportCode ||
    last?.arrival?.airport?.cityCode ||
    "";

  const duration = leg?.totalElapsedTime || first?.elapsedTime || "";
  const stops =
    typeof leg?.totalStops === "number"
      ? leg.totalStops
      : Math.max(0, (leg?.flightSegments || []).length - 1);
  const stopText =
    stops === 0 ? "Non-stop" : stops === 1 ? "1 stop" : `${stops} stops`;

  return (
    <div className="w-full">
      <div className="grid grid-cols-[auto_1fr] items-center gap-1">
        <div className="flex w-fit items-center gap-3 ">
          <div className="aspect-square rounded-full bg-gray-100 overflow-hidden">
            <img
              src={`https://airlines.a4aero.com/images/${airlineCode}.png`}
              alt={airlineCode}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="leading-4">
            <p className="text-[14px] font-medium">{airlineName}</p>
          </div>
        </div>

        <div className="flex w-2/3 items-center justify-between">
          <div className="text-left ">
            <p className="text-sm text-gray-500 whitespace-nowrap font-semibold">
              {depDate}
            </p>
            <p className="font-semibold text-[20px] ">{fmtTime(depTime)}</p>
            <p className="text-sm text-gray-500 font-semibold">{depCode}</p>
          </div>

          <div className="flex flex-col items-center min-w-[240px]">
            <div className="text-[12px] font-medium text-gray-700 mb-1">
              {safe(duration, "—")}
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="" />
              <div className="justify-center items-center m-auto">
                <img src={planeImg} alt="air route" className="h-4 " />
              </div>
            </div>
            <div className="text-[12px] text-gray-500 mt-1">{stopText}</div>
          </div>

          <div className="text-right ml-3">
            <p className="text-sm text-gray-500 whitespace-nowrap font-semibold">
              {arrDate}
            </p>
            <p className="font-semibold text-[20px] leading-none">
              {fmtTime(arrTime)}
            </p>
            <p className="text-sm text-gray-500 font-semibold">{arrCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============== main =============== */
export default function FlightCard({ flight }) {
  const [open, setOpen] = useState(false);
  const legs = useMemo(() => getLegs(flight), [flight]);
  const isRoundTrip = legs.length >= 2;

  const seatsLeft = useMemo(() => seatsLeftFromFlight(flight), [flight]);
  const refundable = useMemo(() => isRefundable(flight), [flight]);

  const paxMap = useMemo(() => buildPaxMap(flight), [flight]);

  // traveler count
  const travelerCount = useMemo(
    () =>
      Object.values(paxMap).reduce(
        (sum, row) => sum + Number(row?.quantity || 0),
        0
      ),
    [paxMap]
  );

  const travelClass = useMemo(() => {
    // 1) Prefer UI label you passed along (if present)
    const preferred =
      flight?.travelClassLabel ||
      flight?.raw?.travelClassLabel ||
      flight?.raw?.criteria?.travelClassLabel ||
      flight?.raw?.searchRequest?.travelClassLabel;

    // 2) Otherwise fallback to API-level tokens and finally segment-level data
    const token =
      flight?.travelClass ||
      flight?.raw?.cabinClass ||
      flight?.raw?.criteria?.cabinClass ||
      flight?.raw?.searchRequest?.cabinClass ||
      extractCabinFromSegments(flight); // <- from the sample you shared

    return cabinLabel(preferred || token);
  }, [flight]);

  const airFareBDT =
    (paxMap.ADT?.base || 0) +
    (paxMap.ADT?.tax || 0) +
    (paxMap.CHD?.base || 0) +
    (paxMap.CHD?.tax || 0) +
    (paxMap.INF?.base || 0) +
    (paxMap.INF?.tax || 0);

  const promoCode = "FTEBLDOM18";
  const couponBDT = isRoundTrip ? 3895 : 1894;
  const totalBDT = Math.max(airFareBDT - couponBDT, 0);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl font-murecho relative">
      {/* header chips */}
      <div className="pt-3 flex px-4">
        <span className="text-red-700 flex items-center gap-1 px-2 bg-red-50 rounded-full text-[12px] font-medium">
          <RiMoneyRupeeCircleFill size={16} className="opacity-70" />
          {refundable ? "Partially Refundable" : "Non-refundable"}
        </span>

        {seatsLeft ? (
          <span className="ml-auto text-red-700 flex items-center gap-1 px-2 bg-red-50 rounded-full text-[12px] border border-red-700 font-medium">
            <MdAirlineSeatReclineNormal size={16} className="opacity-70" />
            {seatsLeft} seat(s) left
          </span>
        ) : (
          <span className="ml-auto" />
        )}

        {!open && (
          <span className="ml-2 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-2">
            <img src={coupon} alt="coupon" className="w-4 h-4" />
            <span>{promoCode}</span>
          </span>
        )}
      </div>

      {/* main row */}
      <div className="flex flex-col lg:flex-row items-stretch relative">
        {/* left side */}
        <div className="flex-1 p-5">
          {!isRoundTrip ? (
            <TimelineRow leg={legs[0]} />
          ) : (
            <div className="w-full">
              <TimelineRow leg={legs[0]} />
              <div className="border-t my-4 border-gray-200" />
              <TimelineRow leg={legs[1]} />
            </div>
          )}

          <div className="border-t border-gray-200 my-5" />

          {/* toggle */}
          {!open ? (
            <div className="relative flex items-center">
              <span className="text-sky-900 flex gap-1 px-2 bg-blue-50 p-1 rounded-full">
                <BiLike size={18} />
                <span className="text-[12px] font-medium">Recommended</span>
              </span>
              <button
                onClick={() => setOpen(true)}
                className="absolute left-1/2 -translate-x-1/2 text-red-800 text-[16px] font-medium flex items-center gap-1"
              >
                <span>View Details</span>
                <ChevronDown size={18} />
              </button>
            </div>
          ) : (
            <>
              <CustomTabs flight={flight} />
              <div className="border-t border-gray-200" />
              <div className="mt-3 relative flex items-center">
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

        {/* right side: price panel */}
        <aside className="lg:w-64 lg:self-stretch border-t lg:border-t-0 lg:border-l border-dashed border-gray-300 p-4 flex flex-col justify-between relative mb-6">
          <div className="size-6 bg-slate-200 rounded-full absolute -top-[48px] -left-[10px]" />
          <div className="size-6 bg-slate-200 rounded-full absolute -bottom-[35px] -left-[10px]" />

          {!open ? (
            <div className="flex flex-col items-end">
              <p className="text-red-600 text-2xl font-extrabold mt-2 leading-none">
                BDT {totalBDT.toLocaleString()}
              </p>
              <p className="text-xs line-through text-gray-400 mt-1">
                BDT {airFareBDT.toLocaleString()}
              </p>

              {/* NEW: class + traveler count (matches your screenshot) */}
              <p className="text-sm text-gray-700 mt-2">{travelClass}</p>
              <p className="text-sm text-gray-700">
                {travelerCount} {travelerCount === 1 ? "Traveler" : "Travelers"}
              </p>

              <div className="mt-4 flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="flex-1 h-10 rounded-full border border-red-700 text-red-700 text-sm font-medium hover:bg-red-50 transition"
                >
                  View Prices
                </button>
                <button
                  type="button"
                  className="flex-[1.2] h-10 rounded-full bg-red-700 text-white text-sm font-semibold hover:bg-red-700 transition"
                >
                  Select
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {["ADT", "CHD", "INF"].map((t) => {
                  const row = paxMap[t];
                  if (!row || row.quantity <= 0) return null;
                  return (
                    <div
                      key={t}
                      className="bg-slate-100 rounded-lg p-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-semibold text-[16px]">
                          {paxLabel(t)} X {row.quantity}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between font-medium text-gray-600">
                        <span>Base Fare</span>
                        <span className="font-medium">
                          BDT {row.base.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center font-medium justify-between text-gray-600">
                        <span>Tax</span>
                        <span className="font-medium">
                          BDT {row.tax.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="bg-slate-100 rounded-lg p-3 text-sm my-4 flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Air Fare</span>
                  <span className="font-semibold">
                    BDT {airFareBDT.toLocaleString()}
                  </span>
                </div>

                <div className="bg-slate-100 rounded-lg p-3 text-sm flex items-center justify-between">
                  <span className="text-orange-600 font-medium">Coupon</span>
                  <span className="font-semibold text-orange-600">
                    - BDT {couponBDT.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col items-end pt-2">
                  <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-2">
                    <img src={coupon} alt="coupon" className="w-4 h-4" />
                    <span>{promoCode}</span>
                  </span>
                  <p className="text-red-700 text-2xl font-extrabold mt-2 leading-none">
                    BDT {totalBDT.toLocaleString()}
                  </p>
                  <p className="text-xs line-through text-gray-400 mt-1">
                    BDT {airFareBDT.toLocaleString()}
                  </p>

                  {/* ALSO SHOW class + travelers in expanded view */}
                  <p className="text-sm text-gray-700 mt-2">{travelClass}</p>
                  <p className="text-sm text-gray-700">
                    {travelerCount}{" "}
                    {travelerCount === 1 ? "Traveler" : "Travelers"}
                  </p>
                </div>
              </div>

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
