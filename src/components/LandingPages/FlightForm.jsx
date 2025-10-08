// src/LandingPages/FlightForm.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { AiOutlineSwap } from "react-icons/ai";

import AirportSelect from "./AirportSelect";
import TravellerSelect from "../../pages/Traveller/TravellerSelect";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchFlights } from "../../redux/slices/flightsSlice";
import { setForm } from "../../redux/slices/searchFormSlice";
import FirsttripCalendarClone from "./calender";

/* ---------------- helpers ---------------- */

// Extract IATA code from "Dhaka (DAC)" or "DAC"
function extractIata(text = "") {
  const t = String(text || "")
    .trim()
    .toUpperCase();
  const paren = t.match(/\(([A-Z]{3})\)/);
  if (paren) return paren[1];
  const plain = t.match(/\b[A-Z]{3}\b/);
  if (plain) return plain[0];
  return "";
}

// Normalize cabin class to API style
const normalizeCabin = (label = "Economy") => {
  const v = String(label || "ECONOMY")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  if (v === "PREMIUM" || v === "PREMIUM_ECO" || v === "PREMIUM_ECONOMY")
    return "PREMIUM_ECONOMY";
  if (v === "ECONOMY" || v === "Y") return "ECONOMY";
  if (v === "BUSINESS" || v === "J" || v === "C") return "BUSINESS";
  if (v === "FIRST" || v === "F") return "FIRST";
  return v || "ECONOMY";
};

/* ---------------- component ---------------- */

export default function FlightForm({
  showMissingHint = true,
  onFocus,
  onBlur,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const saved = useSelector((s) => s.searchForm);

  // --- Local state (hydrate from Redux once) ---
  const [tripType, setTripType] = useState(saved.tripType || "ONE_WAY");
  const isOneWay = tripType === "ONE_WAY";

  const [fromText, setFromText] = useState(saved.fromText || "");
  const [toText, setToText] = useState(saved.toText || "");
  const [fromAirport, setFromAirport] = useState(saved.fromAirport || null);
  const [toAirport, setToAirport] = useState(saved.toAirport || null);

  const [departureDate, setDepartureDate] = useState(saved.departureDate || "");
  const [returnDate, setReturnDate] = useState(saved.returnDate || "");

  const [trav, setTrav] = useState(
    saved.travellers || {
      adults: 1,
      children: 1,
      infants: 1,
      travelClass: "Economy",
      childAges: [],
    }
  );

  const [preferredAirline] = useState(saved.preferredAirline || "");
  const [apiId] = useState(saved.apiId || 1001);

  // NEW: ask calendar to open at "start" or "end" after a state change
  const [calendarAutoOpenAt, setCalendarAutoOpenAt] = useState(null); // 'start' | 'end' | null

  // Keep Redux form in sync whenever inputs change
  useEffect(() => {
    dispatch(
      setForm({
        tripType,
        fromText,
        toText,
        fromAirport,
        toAirport,
        departureDate,
        returnDate,
        travellers: trav,
        preferredAirline,
        apiId,
      })
    );
  }, [
    tripType,
    fromText,
    toText,
    fromAirport,
    toAirport,
    departureDate,
    returnDate,
    trav,
    preferredAirline,
    apiId,
    dispatch,
  ]);

  // When switching to ONE_WAY, clear any stale return date
  useEffect(() => {
    if (isOneWay && returnDate) setReturnDate("");
  }, [isOneWay]); // eslint-disable-line

  // Swap origin/destination
  const swap = () => {
    setFromText(toText);
    setToText(fromText);
    setFromAirport(toAirport);
    setToAirport(fromAirport);
  };

  // Derive IATA codes safely
  const fromCode = useMemo(() => {
    const code =
      (fromAirport && fromAirport.code) || extractIata(fromText) || "";
    return code.toUpperCase();
  }, [fromAirport, fromText]);

  const toCode = useMemo(() => {
    const code = (toAirport && toAirport.code) || extractIata(toText) || "";
    return code.toUpperCase();
  }, [toAirport, toText]);

  // Prevent same origin/destination
  const sameAirport = fromCode && toCode && fromCode === toCode;

  // Enable Search button only when inputs are valid
  const canSearch = useMemo(() => {
    const hasFrom = fromCode && fromCode.length === 3;
    const hasTo = toCode && toCode.length === 3;
    const hasDep = !!departureDate;
    const hasRet = isOneWay ? true : !!returnDate;
    return hasFrom && hasTo && hasDep && hasRet && !sameAirport;
  }, [fromCode, toCode, departureDate, returnDate, isOneWay, sameAirport]);

  // Build API request body for roundtrip/oneway
  const buildRequestBody = () => {
    const originDestinationOptions = [
      {
        departureAirport: fromCode,
        arrivalAirport: toCode,
        flyDate: departureDate, // yyyy-MM-dd
      },
    ];

    if (!isOneWay) {
      originDestinationOptions.push({
        departureAirport: toCode,
        arrivalAirport: fromCode,
        flyDate: returnDate, // yyyy-MM-dd
      });
    }

    const passengers = [
      { passengerType: "ADT", quantity: Number(trav.adults || 0) },
      { passengerType: "CHD", quantity: Number(trav.children || 0) },
      { passengerType: "INF", quantity: Number(trav.infants || 0) },
    ].filter((p) => p.quantity > 0);

    return {
      originDestinationOptions,
      passengers,
      cabinClasse: normalizeCabin(trav.travelClass),
      preferredAirline: preferredAirline || undefined,
      apiId,
    };
  };

  const handleSearch = () => {
    if (!canSearch) return;
    const requestBody = buildRequestBody();

    dispatch(
      searchFlights({
        tripType,
        fromCode,
        toCode,
        departureDate,
        returnDate: isOneWay ? undefined : returnDate,
        travellers: {
          adults: trav.adults,
          children: trav.children,
          infants: trav.infants,
        },
        travelClassLabel: trav.travelClass,
        preferredAirline,
        apiId,
        __requestBody: requestBody,
      })
    );

    navigate("/searchresult");
  };

  // Calendar -> parent dates sync
  const handleCalendarDatesChange = ({ departureISO, returnISO }) => {
    setDepartureDate(departureISO || "");
    setReturnDate(returnISO || "");
  };

  /* ====== NEW: UX glue with the calendar ======
     1) If the user clicks the Return pill while in one-way,
        calendar will call this to promote to round-trip and open on Return.
     2) The calendar shows a small “One-way / Clear return” button — when pressed,
        we clear return and flip back to one-way.
  */
  const handlePromoteRoundTrip = () => {
    setTripType("ROUND_TRIP");
    // Ask calendar to open with Return side active
    setCalendarAutoOpenAt("end");
  };

  const handleClearToOneWay = () => {
    setReturnDate("");
    setTripType("ONE_WAY");
    setCalendarAutoOpenAt(null);
  };

  // Small inline helper to show what’s missing
  const MissingHint = () => {
    if (!showMissingHint) return null;
    const missing = [];
    if (!(fromCode && fromCode.length === 3)) missing.push("From (IATA)");
    if (!(toCode && toCode.length === 3)) missing.push("To (IATA)");
    if (sameAirport) missing.push("Different From/To airports");
    if (!departureDate) missing.push("Departure date");
    if (!isOneWay && !returnDate) missing.push("Return date");
    if (missing.length === 0) return null;
    return (
      <div className="text-xs text-gray-500 mt-1">
        Missing: {missing.join(", ")}
      </div>
    );
  };

  return (
    <div
      className="px-3 sm:px-6 lg:px-6 pt-7 pb-2 relative"
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {/* Trip type */}
      <div className="flex gap-2 mb-5">
        {[
          { key: "ONE_WAY", label: "One Way" },
          { key: "ROUND_TRIP", label: "Round Trip" },
          { key: "MULTI_CITY", label: "Multi City" },
        ].map((t) => (
          <label
            key={t.key}
            className="flex items-center gap-1 cursor-pointer text-[10px] sm:text-[14px]"
          >
            <input
              type="radio"
              name="trip"
              checked={tripType === t.key}
              onChange={() => {
                setTripType(t.key);
                // if user manually flips to round-trip, open calendar on start
                if (t.key === "ROUND_TRIP") setCalendarAutoOpenAt("start");
              }}
              className="w-4 h-4 accent-red-600"
            />
            {t.label}
          </label>
        ))}
      </div>

      {/* Inputs */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* From / To */}
        <div className="lg:basis-[35%] grid grid-cols-1 sm:grid-cols-2 gap-4 relative min-w-[250px]">
          <AirportSelect
            label="From"
            value={fromText}
            onChange={setFromText}
            onSelect={setFromAirport}
            excludeCode={toAirport?.code}
          />
          <AirportSelect
            label="To"
            value={toText}
            onChange={setToText}
            onSelect={setToAirport}
            excludeCode={fromAirport?.code}
          />
          <button
            type="button"
            onClick={swap}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex w-10 h-10 rounded-full bg-red-700 text-white items-center justify-center shadow-lg z-20"
            title="Swap"
          >
            <AiOutlineSwap className="text-xl" />
          </button>
        </div>

        {/* Dates */}
        <div className="flex-1 min-w-[250px]  ">
          <FirsttripCalendarClone
            disableReturn={isOneWay}
            defaultDeparture={saved.departureDate || ""}
            defaultReturn={saved.returnDate || ""}
            minDepartureDate={new Date()}
            onDatesChange={handleCalendarDatesChange}
            /* NEW props for the UX glue */
            autoOpenAt={calendarAutoOpenAt} // 'start' | 'end' | null
            onPromoteRoundTrip={handlePromoteRoundTrip} // called when Return pill clicked in one-way
            onRequestOneWayClear={handleClearToOneWay} // called by “Clear return / One-way” button
           
          />
        </div>

        {/* Travellers */}
        <TravellerSelect onChange={setTrav} initialValue={saved.travellers} />

        {/* Search */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-end flex-shrink-0 mt-4 lg:mt-0">
          <button
            onClick={handleSearch}
            disabled={!canSearch}
            className={`w-32 sm:w-36 md:w-40 lg:w-24 py-1 lg:h-20 rounded-md text-white flex items-center justify-center gap-2 ${
              canSearch
                ? "bg-red-700 hover:bg-red-500"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            title={canSearch ? "Search" : "Fill required fields"}
          >
            <CiSearch size={36} />
            <span className="lg:hidden font-semibold text-sm">Search</span>
          </button>
          <MissingHint />
        </div>
      </div>
    </div>
  );
}
