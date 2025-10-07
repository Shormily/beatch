// CustomTabs.jsx
"use client";
import React, { useMemo, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { SlLocationPin } from "react-icons/sl";

/* ------------------- helpers ------------------- */
const safe = (v, d = "—") =>
  v === undefined || v === null || v === "" ? d : v;
const pad4 = (t) => (t ? String(t).padStart(4, "0") : "");
const fmtTime = (t) => (t ? pad4(t).replace(/(\d{2})(\d{2})/, "$1:$2") : "—");
const fmtKg = (s) => {
  if (!s) return "0 kg";
  const m = String(s).match(/(\d+)/);
  const n = m ? Number(m[1]) : 0;
  return `${n} kg`;
};

const getLegs = (flight) =>
  Array.isArray(flight?.flights) && flight.flights.length
    ? flight.flights
    : Array.isArray(flight?.raw?.flights) && flight.raw.flights.length
    ? flight.raw.flights
    : [];

const firstLastSeg = (leg) => {
  const segs = Array.isArray(leg?.flightSegments) ? leg.flightSegments : [];
  const first = segs[0] || {};
  const last = segs.length ? segs[segs.length - 1] : {};
  return { segs, first, last };
};

const getPassengerFares = (flight) =>
  flight?.fares?.[0]?.passengerFares ??
  flight?.raw?.fares?.[0]?.passengerFares ??
  [];

/** Build baggage index: { ADT: { 'DAC-ZYL': {carryOn,checkedIn}, ... }, CHD: {...}, INF: {...} } */
const buildPaxBagIndex = (flight) => {
  const fares = getPassengerFares(flight);
  const idx = {};
  fares.forEach((pf) => {
    const t = pf.passengerType; // ADT/CHD/INF
    if (!idx[t]) idx[t] = {};
    (pf.baggages || []).forEach((b) => {
      const legId = b?.flightInfoId;
      if (!legId) return;
      if (!idx[t][legId])
        idx[t][legId] = { carryOn: "0 kg", checkedIn: "0 kg" };
      const typ = (b?.type || "").toLowerCase();
      if (typ === "carryon") idx[t][legId].carryOn = fmtKg(b?.description);
      if (typ === "checkedin") idx[t][legId].checkedIn = fmtKg(b?.description);
    });
  });
  return idx;
};

/* ------------------- component ------------------- */
export default function CustomTabs({ flight }) {
  const tabs = [
    { id: "details", label: "Flight Details" },
    { id: "baggage", label: "Baggage" },
    { id: "policy", label: "Policy" },
  ];

  const legs = useMemo(() => getLegs(flight), [flight]);
  const oneWayFallbackSegs = useMemo(
    () => flight?.raw?.flights?.[0]?.flightSegments || [],
    [flight]
  );

  // active leg & tab
  const [activeTab, setActiveTab] = useState("details");
  const [activeLeg, setActiveLeg] = useState(0);

  // selected leg (works for one-way too)
  const leg =
    legs.length > 0
      ? legs[Math.min(activeLeg, legs.length - 1)]
      : { flightSegments: oneWayFallbackSegs };

  const { segs, first, last } = firstLastSeg(leg);

  const depCity = first?.departure?.airport?.cityName;
  const depCode = first?.departure?.airport?.airportCode;
  const depName = first?.departure?.airport?.airportName;
  const depTerm = first?.departure?.airport?.terminal;
  const depDate = first?.departure?.depDate;
  const depTime = first?.departure?.depTime;

  const arrCity = last?.arrival?.airport?.cityName;
  const arrCode = last?.arrival?.airport?.airportCode;
  const arrName = last?.arrival?.airport?.airportName;
  const arrDate = last?.arrival?.arrDate;
  const arrTime = last?.arrival?.arrTime;

  const hasArrival = Boolean(arrCity || arrCode || arrName || arrTime);

  const cabin = safe(first?.cabinType, "Economy");
  const rbd = safe(first?.bookingClass); // e.g. Y, G…
  const airline = safe(first?.airline?.name);
  const flightNo = `${safe(first?.airline?.code)} ${safe(
    first?.airline?.flightNo
  )}`;
  const aircraft = safe(
    first?.airline?.aircraftTypeCode,
    first?.airline?.aircraftType
  );

  const totalStops =
    typeof leg?.totalStops === "number"
      ? leg.totalStops
      : Math.max(0, segs.length - 1);
  const duration = leg?.totalElapsedTime;

  // baggage lookup
  const paxBagIndex = useMemo(() => buildPaxBagIndex(flight), [flight]);
  const legId = leg?.flightInfoId || ""; // e.g. "DAC-ZYL"
  const bagCell = (pax) => {
    const entry = paxBagIndex?.[pax]?.[legId];
    return {
      carryOn: entry ? entry.carryOn : "0 kg",
      checkedIn: entry ? entry.checkedIn : "0 kg",
    };
  };
  const adt = bagCell("ADT");
  const chd = bagCell("CHD");
  const inf = bagCell("INF");

  return (
    <div className="w-full bg-white">
      {/* ===== Tabs Header ===== */}
      <div className="flex border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 text-sm font-medium py-2 text-center rounded-t-lg transition-all ${
              activeTab === t.id
                ? "text-red-600 border-b-2 border-red-500 bg-red-50"
                : "text-gray-600 hover:text-red-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== Leg radio toggle (if round trip) ===== */}
      {legs.length > 1 && (
        <div className="flex items-center gap-4 py-3 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="legSwitch"
              className="accent-red-600"
              checked={activeLeg === 0}
              onChange={() => setActiveLeg(0)}
            />
            <span>
              {safe(legs[0]?.flightSegments?.[0]?.departure?.airport?.cityCode)}{" "}
              -{" "}
              {safe(
                legs[0]?.flightSegments?.slice(-1)?.[0]?.arrival?.airport
                  ?.cityCode
              )}{" "}
              (Depart)
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="legSwitch"
              className="accent-red-600"
              checked={activeLeg === 1}
              onChange={() => setActiveLeg(1)}
              disabled={!legs[1]}
            />
            <span className={`${legs[1] ? "" : "opacity-50"}`}>
              {legs[1]
                ? `${safe(
                    legs[1]?.flightSegments?.[0]?.departure?.airport?.cityCode
                  )} - ${safe(
                    legs[1]?.flightSegments?.slice(-1)?.[0]?.arrival?.airport
                      ?.cityCode
                  )} (Return)`
                : "—"}
            </span>
          </label>
        </div>
      )}

      {/* ===== DETAILS ===== */}
      {activeTab === "details" && (
        <div className="pt-1 space-y-2">
          {/* Departure */}
          <div className="grid grid-cols-[96px_24px_1fr] items-center bg-slate-50 rounded-xl p-3">
            <div className="text-center">
              <p className="text-base font-semibold">{fmtTime(depTime)}</p>
              <p className="text-[11px] text-gray-500">{safe(depDate)}</p>
            </div>
            <div className="flex items-center justify-center">
              <SlLocationPin size={18} className="text-gray-700" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                Departure, {safe(depCity)}
              </p>
              <p className="text-[12px] text-gray-600 truncate">
                {safe(depCode)} - {safe(depName)}
                {depTerm ? `, (${depTerm})` : ""}
              </p>
            </div>
          </div>

          {/* Airline row with vertical divider & logo placeholder (kept your style) */}
          <div className="grid grid-cols-[96px_24px_1fr] items-stretch bg-white rounded-xl p-3">
            <div>
              <p className="text-sm font-semibold text-red-500">
                {cabin} {rbd ? `(${rbd})` : ""}
              </p>
              <p className="text-[12px] text-gray-600">{flightNo}</p>
            </div>
            <div className="relative flex items-center justify-center">
              <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gray-200" />
              {/* you can optionally render the airline logo here if needed */}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{airline}</p>
              <p className="text-[12px] text-gray-600 mt-0.5">{aircraft}</p>
              <p className="text-[11px] text-gray-500 mt-1">
                {safe(duration, "—")} •{" "}
                {totalStops === 0
                  ? "Non-stop"
                  : totalStops === 1
                  ? "1 stop"
                  : `${totalStops} stops`}
              </p>
            </div>
          </div>

          {/* Arrival — FIX: always read from selected leg's last segment */}
          {hasArrival && (
            <div className="grid grid-cols-[96px_24px_1fr] items-center bg-slate-50 rounded-xl p-3">
              <div className="text-center">
                <p className="text-base font-semibold">{fmtTime(arrTime)}</p>
                <p className="text-[11px] text-gray-500">{safe(arrDate)}</p>
              </div>
              <div className="flex items-center justify-center">
                <SlLocationPin size={18} className="text-gray-700" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  Arrival, {safe(arrCity)}
                </p>
                <p className="text-[12px] text-gray-600 truncate">
                  {safe(arrCode)} - {safe(arrName)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== BAGGAGE ===== */}
      {activeTab === "baggage" && (
        <div className="py-4">
          {/* Route chip (matches details line) */}

          {/* Table header (matches your screenshot with Adult/Child/Infant columns) */}
          <div className="rounded-md overflow-hidden border border-gray-200">
            <div className="grid grid-cols-7 bg-gray-100 text-xs font-medium text-gray-700">
              <div className="col-span-2 px-3 py-2">Flight</div>
              <div className="col-span-2 px-3 py-2">Cabin</div>
              <div className="col-span-3 px-3 py-2">Checked-in</div>
            </div>

            <div className="grid grid-cols-7 bg-gray-50 text-[11px] text-gray-600">
              <div className="col-span-2 px-3 py-2" />
              <div className="col-span-2 px-3 py-2 grid grid-cols-3 text-center">
                <div>Adult</div>
                <div>Child ≥ 5</div>
                <div>Infant</div>
              </div>
              <div className="col-span-3 px-3 py-2 grid grid-cols-3 text-center">
                <div>Adult</div>
                <div>Child ≥ 5</div>
                <div>Infant</div>
              </div>
            </div>

            {/* Data row */}
            <div className="grid grid-cols-7 text-sm">
              <div className="col-span-2 px-3 py-3 border-t">
                <div className="font-medium">
                  {safe(first?.cabinType, "Economy")}
                </div>
                <div className="text-xs text-gray-600">
                  {safe(first?.departure?.airport?.cityCode)} -{" "}
                  {safe(last?.arrival?.airport?.cityCode)}
                </div>
              </div>

              {/* Carry-on (Cabin) */}
              <div className="col-span-2 px-3 py-3 border-t grid grid-cols-3 gap-2 text-center">
                <div>{adt.carryOn}</div>
                <div>{chd.carryOn}</div>
                <div>{inf.carryOn}</div>
              </div>

              {/* Checked-in */}
              <div className="col-span-3 px-3 py-3 border-t grid grid-cols-3 gap-2 text-center">
                <div>{adt.checkedIn}</div>
                <div>{chd.checkedIn}</div>
                <div>{inf.checkedIn}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 py-3 text-xs text-gray-600">
            <span className="w-4 h-4 rounded-full bg-gray-200 inline-block" />
            <p>Every metric is counted per traveller.</p>
          </div>
        </div>
      )}

      {/* ===== POLICY (static text retained) ===== */}
      {activeTab === "policy" && (
        <div className="py-4 text-sm text-gray-700">
          <p className="pt-1">
            Refunds and Date Changes are done as per the following policies:
          </p>
          <p className="py-2">
            Refund is calculated by deducting Airline’s fee and FT fee from the
            paid amount.
          </p>
          <p>
            Date Change fee is calculated by adding Airline’s fee, fare
            difference and FT fee.
          </p>
          <p className="py-2 font-bold">*Fees are shown for all travellers.</p>
          <p>*FT Convenience fee is non-refundable.</p>
          <p className="py-2">
            *We cannot guarantee the accuracy of airline refund/date change fees
            as they are subject to change without prior notice.
          </p>

          <div className="flex gap-2 text-red-500 text-[14px] pb-2 mt-1">
            <AiOutlineQuestionCircle size={18} className="text-red-500" />
            <span>Learn More</span>
          </div>
        </div>
      )}
    </div>
  );
}
