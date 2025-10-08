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
import bdAirportsData from "../../data/airports.json";

/* ---------------- helpers ---------------- */

const toLocalISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

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

const formatSelectLabel = (a) => (a ? `${a.cityName}, ${a.countryName}` : "");

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

  // airports for hydrating
  const airportsState = useSelector((s) => s.airports);
  const airports = airportsState?.items || [];
  const allAirports = airports.length ? airports : bdAirportsData;

  // 🔒 loading flag -> disable everything
  const flightsStatus = useSelector((s) => s.flights?.status);
  const isLoading = flightsStatus === "loading";

  const saved = useSelector((s) => s.searchForm);

  // ----- Date defaults -----
  const today = new Date();
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);
  const defaultDepartureISO = toLocalISO(today);
  const defaultReturnISO = toLocalISO(threeDaysLater);

  // ----- Correctly shaped default airport objects -----
  const DEFAULT_FROM_AIRPORT = {
    code: "DAC",
    name: "Hazrat Shahjalal International Airport",
    cityName: "Dhaka",
    countryCode: "BD",
    countryName: "Bangladesh",
    timezone: "6",
  };
  const DEFAULT_TO_AIRPORT = {
    code: "CXB",
    name: "Cox's Bazar Airport",
    cityName: "Cox's Bazar",
    countryCode: "BD",
    countryName: "Bangladesh",
    timezone: "6",
  };

  // ----- Text defaults -----
  const DEFAULT_FROM_TEXT = formatSelectLabel(DEFAULT_FROM_AIRPORT);
  const DEFAULT_TO_TEXT = formatSelectLabel(DEFAULT_TO_AIRPORT);

  // --- Local state ---
  const [tripType, setTripType] = useState(saved.tripType || "ROUND_TRIP");
  const isOneWay = tripType === "ONE_WAY";

  const [fromText, setFromText] = useState(saved.fromText || DEFAULT_FROM_TEXT);
  const [toText, setToText] = useState(saved.toText || DEFAULT_TO_TEXT);
  const [fromAirport, setFromAirport] = useState(saved.fromAirport || null);
  const [toAirport, setToAirport] = useState(saved.toAirport || null);

  const [departureDate, setDepartureDate] = useState(
    saved.departureDate || defaultDepartureISO
  );
  const [returnDate, setReturnDate] = useState(
    saved.returnDate || defaultReturnISO
  );

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

  const [calendarAutoOpenAt, setCalendarAutoOpenAt] = useState(null); // 'start' | 'end' | null

  // init defaults once
  useEffect(() => {
    const hasFrom =
      (saved.fromText && saved.fromText.trim()) || saved.fromAirport?.code;
    const hasTo =
      (saved.toText && saved.toText.trim()) || saved.toAirport?.code;

    if (!hasFrom) {
      setFromText(DEFAULT_FROM_TEXT);
      setFromAirport(DEFAULT_FROM_AIRPORT);
    }
    if (!hasTo) {
      setToText(DEFAULT_TO_TEXT);
      setToAirport(DEFAULT_TO_AIRPORT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // hydrate airport objects if text had (CODE)
  useEffect(() => {
    if (!fromAirport && fromText) {
      const c = extractIata(fromText);
      if (c) {
        const found = allAirports.find(
          (a) => (a.code || "").toUpperCase() === c
        );
        if (found) {
          setFromAirport(found);
          setFromText(formatSelectLabel(found));
        }
      }
    }
  }, [fromAirport, fromText, allAirports]);

  useEffect(() => {
    if (!toAirport && toText) {
      const c = extractIata(toText);
      if (c) {
        const found = allAirports.find(
          (a) => (a.code || "").toUpperCase() === c
        );
        if (found) {
          setToAirport(found);
          setToText(formatSelectLabel(found));
        }
      }
    }
  }, [toAirport, toText, allAirports]);

  // Keep Redux form in sync
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

  // ONE_WAY => clear return
  useEffect(() => {
    if (isOneWay && returnDate) setReturnDate("");
  }, [isOneWay]); // eslint-disable-line

  // swap
  const swap = () => {
    if (isLoading) return; // guard
    setFromText(toText);
    setToText(fromText);
    setFromAirport(toAirport);
    setToAirport(fromAirport);
  };

  // derive codes
  const fromCode = useMemo(() => {
    const code =
      (fromAirport && fromAirport.code) || extractIata(fromText) || "";
    return code.toUpperCase();
  }, [fromAirport, fromText]);

  const toCode = useMemo(() => {
    const code = (toAirport && toAirport.code) || extractIata(toText) || "";
    return code.toUpperCase();
  }, [toAirport, toText]);

  const sameAirport = fromCode && toCode && fromCode === toCode;

  const canSearch = useMemo(() => {
    const hasFrom = fromCode && fromCode.length === 3;
    const hasTo = toCode && toCode.length === 3;
    const hasDep = !!departureDate;
    const hasRet = isOneWay ? true : !!returnDate;
    return hasFrom && hasTo && hasDep && hasRet && !sameAirport;
  }, [fromCode, toCode, departureDate, returnDate, isOneWay, sameAirport]);

  const buildRequestBody = () => {
    const originDestinationOptions = [
      {
        departureAirport: fromCode,
        arrivalAirport: toCode,
        flyDate: departureDate,
      },
    ];

    if (!isOneWay) {
      originDestinationOptions.push({
        departureAirport: toCode,
        arrivalAirport: fromCode,
        flyDate: returnDate,
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
    if (isLoading) return; // guard
    if (!canSearch) return;

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
        __requestBody: buildRequestBody(),
      })
    );

    navigate("/searchresult");
  };

  const handleCalendarDatesChange = ({ departureISO, returnISO }) => {
    if (isLoading) return; // guard
    setDepartureDate(departureISO || "");
    setReturnDate(returnISO || "");
  };

  const handlePromoteRoundTrip = () => {
    if (isLoading) return; // guard
    setTripType("ROUND_TRIP");
    setCalendarAutoOpenAt("end");
  };

  const handleClearToOneWay = () => {
    if (isLoading) return; // guard
    setReturnDate("");
    setTripType("ONE_WAY");
    setCalendarAutoOpenAt(null);
  };

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
    <div className="relative z-50">
      {/* overlay that eats all pointer events while loading */}
      {isLoading && (
        <div className="absolute inset-0 z-20 cursor-not-allowed" aria-hidden />
      )}

      <div
        className={`px-3 sm:px-6 lg:px-6 pt-7 pb-5 max-w-[1200px] mx-auto transition-opacity ${
          isLoading ? "opacity-50" : ""
        }`}
        aria-busy={isLoading}
        aria-disabled={isLoading}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {/* put native controls inside a disabled fieldset so keyboard interaction is blocked too */}
        <fieldset disabled={isLoading}>
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
                    if (isLoading) return;
                    setTripType(t.key);
                    if (t.key === "ROUND_TRIP") setCalendarAutoOpenAt("start");
                    if (t.key === "ONE_WAY") setCalendarAutoOpenAt(null);
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
                disabled={isLoading}
              />
              <AirportSelect
                label="To"
                value={toText}
                onChange={setToText}
                onSelect={setToAirport}
                excludeCode={fromAirport?.code}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={swap}
                disabled={isLoading}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex w-10 h-10 rounded-full items-center justify-center shadow-lg z-10 ${
                  isLoading
                    ? "bg-gray-300 text-white cursor-not-allowed"
                    : "bg-red-700 text-white"
                }`}
                title="Swap"
              >
                <AiOutlineSwap className="text-xl" />
              </button>
            </div>

            {/* Dates */}
            <div className="flex-1 min-w-[250px]">
              <FirsttripCalendarClone
                disableReturn={isOneWay}
                defaultDeparture={departureDate}
                defaultReturn={returnDate}
                minDepartureDate={new Date()}
                onDatesChange={handleCalendarDatesChange}
                autoOpenAt={calendarAutoOpenAt}
                onPromoteRoundTrip={handlePromoteRoundTrip}
                onRequestOneWayClear={handleClearToOneWay}
                disabled={isLoading}
              />
            </div>

            {/* Travellers */}
            <TravellerSelect
              onChange={setTrav}
              initialValue={saved.travellers}
              disabled={isLoading}
            />

            {/* Search */}
            <div className="w-full lg:w-auto flex flex-col items-center lg:items-end flex-shrink-0 mt-4 lg:mt-0">
              <button
                onClick={handleSearch}
                disabled={!canSearch || isLoading}
                className={`w-32 sm:w-36 md:w-40 lg:w-24 py-1 lg:h-20 rounded-md text-white flex items-center justify-center gap-2 ${
                  canSearch && !isLoading
                    ? "bg-red-700 hover:bg-red-500"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                title={canSearch ? "Search" : "Fill required fields"}
              >
                <CiSearch size={36} />
                <span className="lg:hidden font-semibold text-sm">Search</span>
              </button>
            </div>
          </div>

          {showMissingHint && <MissingHint />}
        </fieldset>
      </div>
    </div>
  );
}
