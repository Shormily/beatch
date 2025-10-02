// src/LandingPages/FlightForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { AiOutlineSwap } from "react-icons/ai";
import FirsttripCalendarClone from "./calender";
import AirportSelect from "./AirportSelect";
import TravellerSelect from "../../pages/Traveller/TravellerSelect";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchFlights } from "../../redux/slices/flightsSlice";
import { setForm } from "../../redux/slices/searchFormSlice";
import CalendarCompact from "./calender";

// Extract IATA helper (unchanged)
function extractIata(text = "") {
  const t = text.trim().toUpperCase();
  const paren = t.match(/\(([A-Z]{3})\)/);
  if (paren) return paren[1];
  const plain = t.match(/\b[A-Z]{3}\b/);
  if (plain) return plain[0];
  return "";
}

export default function FlightForm({
  showMissingHint = true,
  onFocus,
  onBlur,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const saved = useSelector((s) => s.searchForm);

  // --- Local state (hydrated from Redux once) ---
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
      children: 0,
      infants: 0,
      travelClass: "Economy",
      childAges: [],
    }
  );

  const [preferredAirline] = useState(saved.preferredAirline || "");
  const [apiId] = useState(saved.apiId || 1001);

  // keep Redux copy in sync on every relevant change
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

  // Swap
  const swap = () => {
    setFromText(toText);
    setToText(fromText);
    setFromAirport(toAirport);
    setToAirport(fromAirport);
  };

  // Determine IATA codes
  const fromCode = useMemo(
    () => (fromAirport?.code || extractIata(fromText)).toUpperCase(),
    [fromAirport, fromText]
  );
  const toCode = useMemo(
    () => (toAirport?.code || extractIata(toText)).toUpperCase(),
    [toAirport, toText]
  );

  // Button enablement
  const canSearch = useMemo(() => {
    const hasFrom = fromCode && fromCode.length === 3;
    const hasTo = toCode && toCode.length === 3;
    const hasDep = !!departureDate;
    const hasRet = isOneWay ? true : !!returnDate;
    return hasFrom && hasTo && hasDep && hasRet;
  }, [fromCode, toCode, departureDate, returnDate, isOneWay]);

  const handleSearch = () => {
    if (!canSearch) return;

    // (Redux already has the form values due to the useEffect above)
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
      })
    );

    navigate("/searchresult");
  };

  // Missing hint (hidden on Searchresult by passing showMissingHint={false})
  const MissingHint = () => {
    if (!showMissingHint) return null;
    const missing = [];
    if (!(fromCode && fromCode.length === 3)) missing.push("From (IATA)");
    if (!(toCode && toCode.length === 3)) missing.push("To (IATA)");
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
              onChange={() => setTripType(t.key)}
              className="w-4 h-4 accent-red-600"
            />
            {t.label}
          </label>
        ))}
      </div>

      {/* Inputs */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* From/To */}
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
        <div className="flex-1 min-w-[250px]">
          <FirsttripCalendarClone
            disableReturn={isOneWay}
            defaultDeparture={saved.departureDate || ""}
            defaultReturn={saved.returnDate || ""}
            minDepartureDate={new Date()}
            onChange={({ departureDate: d, returnDate: r }) => {
              setDepartureDate(d || "");
              setReturnDate(isOneWay ? "" : r || "");
            }}
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
