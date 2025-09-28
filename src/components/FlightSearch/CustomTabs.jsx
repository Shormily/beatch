import React, { useMemo, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { SlLocationPin } from "react-icons/sl";

const safe = (v, d = "—") =>
  v === undefined || v === null || v === "" ? d : v;
const pad4 = (t) => (t ? String(t).padStart(4, "0") : "");
const fmtTime = (t) => (t ? pad4(t).replace(/(\d{2})(\d{2})/, "$1:$2") : "—");

export default function CustomTabs({ flight }) {
  const [activeTab, setActiveTab] = useState("details");

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
  const rbd = safe(first?.bookingClass);
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

      {/* -------- DETAILS TAB -------- */}
      {activeTab === "details" && (
        <div className="pt-3">
          <div className="flex items-center gap-2 text-red-600 font-semibold text-sm mb-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-red-600" />
            <span>
              {safe(depCode)} - {safe(arrCode)} (Depart)
            </span>
          </div>

          {/* Departure */}
          <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-3">
            <div className="w-20 text-center">
              <p className="text-base font-semibold">{fmtTime(depTime)}</p>
              <p className="text-[11px] text-gray-500">{safe(depDate)}</p>
            </div>

            <SlLocationPin size={18} className="text-gray-700 shrink-0" />

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

          {/* Airline Row */}
          <div className="flex items-stretch bg-white rounded-xl p-3 my-2">
            <div className="w-40">
              <p className="text-sm font-semibold text-red-500">
                {cabin} {rbd ? `(${rbd})` : ""}
              </p>
              <p className="text-[12px] text-gray-600">{flightNo}</p>
            </div>

            <div className="mx-4 w-px bg-gray-200" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {airlineCode && (
                  <img
                    src={`https://airlines.a4aero.com/images/${airlineCode}.png`}
                    className="w-5 h-5 object-contain"
                    alt={airlineCode}
                  />
                )}
                <p className="text-sm font-semibold">{airline}</p>
              </div>
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

          {/* Arrival (only if data exists) */}
          {hasArrival && (
            <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-3">
              <div className="w-20 text-center">
                <p className="text-base font-semibold">{fmtTime(arrTime)}</p>
                <p className="text-[11px] text-gray-500">{safe(arrDate)}</p>
              </div>

              <SlLocationPin size={18} className="text-gray-700 shrink-0" />

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

      {/* -------- BAGGAGE TAB -------- */}
      {activeTab === "baggage" && (
        <div className="py-4 text-sm text-gray-600">Baggage info here…</div>
      )}

      {/* -------- POLICY TAB -------- */}
      {activeTab === "policy" && (
        <div className="py-4 text-sm text-gray-600 flex items-center gap-2">
          <AiOutlineQuestionCircle className="text-red-500" /> Policies here…
        </div>
      )}
    </div>
  );
}
