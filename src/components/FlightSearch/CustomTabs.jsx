// CustomTabs.jsx
import React, { useMemo, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { SlLocationPin } from "react-icons/sl";

const safe = (v, d = "—") =>
  v === undefined || v === null || v === "" ? d : v;
const pad4 = (t) => (t ? String(t).padStart(4, "0") : "");
const fmtTime = (t) => (t ? pad4(t).replace(/(\d{2})(\d{2})/, "$1:$2") : "—");

export default function CustomTabs({ flight }) {
  const [activeTab, setActiveTab] = useState("details");

  // One-way (extend for return if you add it later)
  const segs = useMemo(
    () => flight?.raw?.flights?.[0]?.flightSegments || [],
    [flight]
  );
  const first = segs[0] || {};
  const last = segs[segs.length - 1] || {};

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

  const hasArrival =
    Boolean(arrCity) ||
    Boolean(arrCode) ||
    Boolean(arrName) ||
    Boolean(arrTime);

  const cabin = safe(first?.cabinType, "Economy");
  const rbd = safe(first?.bookingClass); // e.g. Y, G…
  const airline = safe(first?.airline?.name);
  const airlineCode = first?.airline?.code || first?.airline?.optAirlineCode;
  const flightNo = `${safe(first?.airline?.code)} ${safe(
    first?.airline?.flightNo
  )}`;
  const aircraft = safe(
    first?.airline?.aircraftTypeCode,
    first?.airline?.aircraftType
  );

  const totalStops =
    flight?.raw?.flights?.[0]?.totalStops ?? Math.max(0, segs.length - 1);
  const duration = flight?.raw?.flights?.[0]?.totalElapsedTime;

  const tabs = [
    { id: "details", label: "Flight Details" },
    { id: "baggage", label: "Baggage" },
    { id: "policy", label: "Policy" },
  ];

  return (
    <div className="w-full bg-white">
      {/* Tabs Header */}
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

      {/* ===== DETAILS (dynamic) ===== */}
      {activeTab === "details" && (
        <div className="pt-3 space-y-2">
          {/* Section label with radio */}
          <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
            <span className="relative inline-flex items-center justify-center w-4 h-4">
              <input
                type="radio"
                checked
                readOnly
                className="accent-red-500 w-4 h-4"
              />
            </span>
            <span>
              {safe(depCode)} - {safe(arrCode)} (Depart)
            </span>
          </div>

          {/* ===== Departure row ===== */}
          <div className="grid grid-cols-[96px_24px_1fr] items-center bg-slate-50 rounded-xl p-3">
            {/* col 1: time/date */}
            <div className="text-center">
              <p className="text-base font-semibold">{fmtTime(depTime)}</p>
              <p className="text-[11px] text-gray-500">{safe(depDate)}</p>
            </div>

            {/* col 2: center icon */}
            <div className="flex items-center justify-center">
              <SlLocationPin size={18} className="text-gray-700" />
            </div>

            {/* col 3: content */}
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                Departure, {safe(depCity)}
              </p>
              <p className="text-[12px] text-gray-600 truncate">
                {safe(depCode)} - {safe(depName)}
                {depTerm ? `, (T${depTerm})` : ""}
              </p>
            </div>
          </div>

          {/* ===== Airline row with vertical divider & logo ===== */}
          <div className="grid grid-cols-[96px_24px_1fr] items-stretch bg-white rounded-xl p-3">
            {/* col 1: cabin & flight no */}
            <div>
              <p className="text-sm font-semibold text-red-500">
                {cabin} {rbd ? `(${rbd})` : ""}
              </p>
              <p className="text-[12px] text-gray-600">{flightNo}</p>
            </div>

            {/* col 2: vertical divider + logo */}
            <div className="relative flex items-center justify-center">
              <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gray-200" />
              {airlineCode ? (
                <img
                  src={`https://airlines.a4aero.com/images/${airlineCode}.png`}
                  className="relative z-10 w-5 h-5 bg-white rounded-full p-0.5 shadow-sm object-contain"
                  alt={airlineCode}
                />
              ) : null}
            </div>

            {/* col 3: airline + aircraft + duration */}
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

          {/* ===== Arrival row (only if data exists) ===== */}
          {hasArrival && (
            <div className="grid grid-cols-[96px_24px_1fr] items-center bg-slate-50 rounded-xl p-3">
              {/* col 1: time/date */}
              <div className="text-center">
                <p className="text-base font-semibold">{fmtTime(arrTime)}</p>
                <p className="text-[11px] text-gray-500">{safe(arrDate)}</p>
              </div>

              {/* col 2: center icon */}
              <div className="flex items-center justify-center">
                <SlLocationPin size={18} className="text-gray-700" />
              </div>

              {/* col 3: content */}
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

      {/* ===== BAGGAGE (static block) ===== */}
      {activeTab === "baggage" && (
        <div className="py-4">
          {/* Table header */}
          <div className="bg-gray-100 rounded-md overflow-hidden">
            <div className="grid grid-cols-3 text-sm font-medium text-gray-600 pt-1">
              <div className="flex items-center justify-center border-r border-white">
                Flight
              </div>
              <div className="flex items-center justify-center border-r border-white">
                Cabin
              </div>
              <div className="flex items-center justify-center">Checked-in</div>
            </div>

            <div className="grid grid-cols-3 text-sm text-center">
              <div className="flex items-center justify-center border-r border-white py-3" />
              <div className="flex items-center justify-center border-r border-white">
                Adult
              </div>
              <div className="flex items-center justify-center py-3">Adult</div>
            </div>
          </div>

          {/* Static values */}
          <div className="bg-slate-100 rounded-md overflow-hidden mt-4">
            <div className="grid grid-cols-3 text-sm font-medium text-gray-600">
              <div className="flex items-center justify-center border-r border-gray-300 pt-1">
                {safe(first?.cabinType, "Economy")}
              </div>
              <div className="flex items-center justify-center border-r border-gray-300" />
              <div className="flex items-center justify-center" />
            </div>

            <div className="grid grid-cols-3 text-sm text-center">
              <div className="flex items-center justify-center border-r border-gray-300 font-semibold">
                {safe(first?.departure?.airport?.airportCode)} -{" "}
                {safe(last?.arrival?.airport?.airportCode)}
              </div>
              <div className="flex items-center justify-center border-r border-gray-300">
                7kg
              </div>
              <div className="flex items-center justify-center py-3">20kg</div>
            </div>
          </div>

          <div className="flex items-center gap-2 py-3 text-xs text-gray-600">
            <span className="w-4 h-4 rounded-full bg-gray-200 inline-block" />
            <p>Every metric is counted per traveller.</p>
          </div>
        </div>
      )}

      {/* ===== POLICY (static block) ===== */}
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
