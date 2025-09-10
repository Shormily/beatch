// src/pages/Flights/FlightSearchPage.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FcAlarmClock } from "react-icons/fc";
import next from "../LandingPages/assets/next.png";
import prev from "../LandingPages/assets/prev.png";
import FlightTabs from "./FlightTab";
import Dropdownmenu from "./Dropdownmenu";
import FlightCard from "./FlightCard";
import { searchFlights } from "../../redux/slices/flightsSlice";

// ---------- tiny utils ----------
const safe = (v, d = "") => (v === undefined || v === null ? d : v);

const toShortDate = (isoOrLabel) => {
  if (!isoOrLabel) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrLabel)) {
    const d = new Date(isoOrLabel + "T00:00:00");
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      weekday: "short",
    });
  }
  return isoOrLabel; // already like "15 Sep, 2025"
};

const toISO = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const normalizeToISO = (dateLike) => {
  if (!dateLike) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateLike)) return dateLike;
  const dt = new Date(dateLike);
  if (!isNaN(dt)) return toISO(dt);
  return ""; // give up
};

const addDaysISO = (iso, delta) => {
  if (!iso) return "";
  const dt = new Date(iso + "T00:00:00");
  if (isNaN(dt)) return "";
  dt.setDate(dt.getDate() + delta);
  return toISO(dt);
};

// Prefer BDT if present; otherwise fall back to totalFare
const pickBDTPrice = (it) => {
  const bdtBrand = it?.fares?.[0]?.brands?.find(
    (b) => b?.currency === "BDT" && b?.totalFare != null
  );
  if (bdtBrand) return { currency: "BDT", total: Number(bdtBrand.totalFare) };

  const rf = it?.fares?.[0]?.passengerFares?.[0]?.referanceFares?.find(
    (r) => r?.currency === "BDT" && String(r?.type).toUpperCase() === "FARE"
  );
  if (rf) return { currency: "BDT", total: Number(rf.amount) };

  const tf = it?.totalFare;
  if (tf?.currency && tf?.totalFare != null)
    return { currency: tf.currency, total: Number(tf.totalFare) };

  return { currency: "", total: NaN };
};

const getDurationMinutes = (it) => {
  const mins = it?.flights?.[0]?.flightSegments?.reduce((sum, s) => {
    const m = Number(s?.elapsedTimeMinutes || 0);
    return sum + (Number.isFinite(m) ? m : 0);
  }, 0);
  if (mins && mins > 0) return mins;
  const label = it?.flights?.[0]?.totalElapsedTime || "";
  const d = Number(/(\d+)d/.exec(label)?.[1] || 0);
  const h = Number(/(\d+)h/.exec(label)?.[1] || 0);
  const m = Number(/(\d+)m/.exec(label)?.[1] || 0);
  return d * 1440 + h * 60 + m;
};

const getStops = (it) => it?.stops ?? it?.flights?.[0]?.totalStops ?? 0;

const totalLayoverMinutes = (it) =>
  (it?.flights?.[0]?.flightSegments || []).reduce(
    (sum, s) =>
      sum +
      (Number.isFinite(Number(s?.layoverTimeInMinutes))
        ? Number(s?.layoverTimeInMinutes)
        : 0),
    0
  );

const bestScore = (it) => {
  const { total } = pickBDTPrice(it);
  const price = Number.isFinite(total) ? total : Infinity;
  const dur = getDurationMinutes(it);
  const stops = getStops(it);
  return price * 1 + dur * 500 + stops * 100000;
};

const getAirlinesCount = (results = []) => {
  const s = new Set();
  results.forEach((r) => {
    if (r?.validatingCarrierCode) s.add(r.validatingCarrierCode);
    r?.flights?.forEach((f) =>
      f?.flightSegments?.forEach((seg) => {
        if (seg?.airline?.code) s.add(seg.airline.code);
        if (seg?.airline?.optAirlineCode) s.add(seg.airline.optAirlineCode);
      })
    );
  });
  return s.size;
};
const formatCount = (n, thing) => `${n} ${thing}${n === 1 ? "" : "s"}`;

// map API cabinClasse back to the label used in your FlightForm
const cabinToLabel = (c) => {
  switch ((c || "").toUpperCase()) {
    case "BUSINESS":
      return "Business";
    case "FIRST":
      return "First Class";
    case "PREMIUM_ECONOMY":
      return "Premium Economy";
    default:
      return "Economy";
  }
};

// ---------- component ----------
export default function FlightSearchPage() {
  const dispatch = useDispatch();
  const { results, status, error, criteria } = useSelector(
    (s) => s.flights || {}
  );

  const itineraries = results?.results || [];
  const depOD = criteria?.originDestinationOptions?.[0];
  const retOD = criteria?.originDestinationOptions?.[1];

  // sorting tab
  const [sortKey, setSortKey] = useState("best"); // best | cheapest | fastest

  // ====== SHIFT DATE & RE-SEARCH ======
  // Build a re-search payload from current criteria (keep airports, pax, cabin)
  const buildSearchArgs = (override = {}) => {
    const fromCode = depOD?.departureAirport || "";
    const toCode = depOD?.arrivalAirport || "";
    const departureDateISO = normalizeToISO(depOD?.flyDate);
    const isRound = !!retOD;
    const returnDateISO = isRound ? normalizeToISO(retOD?.flyDate) : undefined;

    // passengers back to counts
    const pax = Array.isArray(criteria?.passengers) ? criteria.passengers : [];
    const qty = (t) => pax.find((p) => p?.passengerType === t)?.quantity || 0;
    const travellers = {
      adults: qty("ADT") || 1,
      children: qty("CHD") || 0,
      infants: qty("INF") || 0,
    };

    const travelClassLabel = cabinToLabel(criteria?.cabinClasse);

    return {
      tripType: isRound ? "ROUND_TRIP" : "ONE_WAY",
      fromCode,
      toCode,
      departureDate: departureDateISO,
      returnDate: isRound ? returnDateISO : undefined,
      travellers,
      travelClassLabel,
      preferredAirline: criteria?.preferredAirline ?? undefined,
      apiId: criteria?.apiId ?? undefined,
      ...override, // allow override of dates
    };
  };

  // Click handlers for date arrows
  const shiftDepartureBy = (delta) => {
    if (!depOD) return;
    const depISO = normalizeToISO(depOD.flyDate);
    const newDep = addDaysISO(depISO, delta);
    const args = buildSearchArgs({ departureDate: newDep });
    dispatch(searchFlights(args));
  };

  const shiftReturnBy = (delta) => {
    if (!retOD) return; // only round-trip
    const retISO = normalizeToISO(retOD.flyDate);
    const newRet = addDaysISO(retISO, delta);
    const args = buildSearchArgs({ returnDate: newRet });
    dispatch(searchFlights(args));
  };

  // ====== ENRICH FOR FILTERING/SORTING ======
  const enriched = useMemo(() => {
    return itineraries.map((it) => {
      const price = pickBDTPrice(it);
      const minutes = getDurationMinutes(it);
      const stops = getStops(it);
      const layMin = totalLayoverMinutes(it);
      const codes = new Set();
      if (it?.validatingCarrierCode) codes.add(it.validatingCarrierCode);
      it?.flights?.[0]?.flightSegments?.forEach((s) => {
        if (s?.airline?.code) codes.add(s.airline.code);
        if (s?.airline?.optAirlineCode) codes.add(s.airline.optAirlineCode);
      });
      return {
        it,
        price,
        minutes,
        stops,
        layMin,
        airlineCodes: Array.from(codes),
      };
    });
  }, [itineraries]);

  // global bounds (price & layover)
  const { priceMin, priceMax, layMin, layMax, airlineList } = useMemo(() => {
    let pMin = Infinity,
      pMax = -Infinity,
      lMax = 0;
    const airlinePriceMap = new Map();

    enriched.forEach(({ price, layMin, airlineCodes }) => {
      if (Number.isFinite(price.total)) {
        pMin = Math.min(pMin, price.total);
        pMax = Math.max(pMax, price.total);
      }
      lMax = Math.max(lMax, Math.ceil(layMin / 60));
      airlineCodes.forEach((c) => {
        const prev = airlinePriceMap.get(c);
        if (!prev || (Number.isFinite(price.total) && price.total < prev)) {
          airlinePriceMap.set(c, price.total);
        }
      });
    });

    if (!Number.isFinite(pMin)) pMin = 0;
    if (!Number.isFinite(pMax) || pMax < pMin) pMax = pMin + 1;
    if (pMax === pMin) pMax = pMin + 1;

    if (!Number.isFinite(lMax)) lMax = 1;
    if (lMax < 1) lMax = 1;

    const list = Array.from(airlinePriceMap.entries())
      .map(([code, price]) => ({ code, price }))
      .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));

    return {
      priceMin: Math.floor(pMin),
      priceMax: Math.ceil(pMax),
      layMin: 0,
      layMax: Math.max(lMax, 1),
      airlineList: list,
    };
  }, [enriched]);

  // FILTER STATE (controlled; defaults from bounds)
  const [filters, setFilters] = useState({
    price: [priceMin, priceMax],
    layoverHours: [layMin, layMax],
    stops: { nonstop: true, one: true, twoPlus: true },
    airlines: new Set(),
  });

  // keep filters in sync when bounds change (new search)
  useEffect(() => {
    setFilters((f) => ({
      price: [priceMin, priceMax],
      layoverHours: [layMin, layMax],
      stops: f.stops || { nonstop: true, one: true, twoPlus: true },
      airlines: new Set(),
    }));
  }, [priceMin, priceMax, layMin, layMax]);

  // timer UI
  const totalTime = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const progress = (timeLeft / totalTime) * 100;

  // sidebar dates
  const depLabel =
    toShortDate(normalizeToISO(depOD?.flyDate)) ||
    (itineraries[0]?.flights?.[0]?.flightSegments?.[0]?.departure?.depDate ??
      "");
  const retLabel =
    toShortDate(normalizeToISO(retOD?.flyDate)) ||
    (itineraries[0]?.flights?.[0]?.flightSegments?.slice(-1)?.[0]?.arrival
      ?.arrDate ??
      "");

  // FILTER -> SORT -> DISPLAY
  const view = useMemo(() => {
    const [pMin, pMax] = filters.price;
    const [loMinH, loMaxH] = filters.layoverHours;
    const selectedAirlines = filters.airlines;

    const keep = ({ price, stops, layMin, airlineCodes }) => {
      if (!Number.isFinite(price.total)) return false;
      if (price.total < pMin || price.total > pMax) return false;

      if (stops === 0 && !filters.stops.nonstop) return false;
      if (stops === 1 && !filters.stops.one) return false;
      if (stops >= 2 && !filters.stops.twoPlus) return false;

      const layH = Math.ceil(layMin / 60);
      if (layH < loMinH || layH > loMaxH) return false;

      if (selectedAirlines.size > 0) {
        const has = airlineCodes.some((c) => selectedAirlines.has(c));
        if (!has) return false;
      }
      return true;
    };

    let arr = enriched.filter(keep);

    if (sortKey === "cheapest") {
      arr.sort((a, b) => a.price.total - b.price.total);
    } else if (sortKey === "fastest") {
      arr.sort((a, b) => a.minutes - b.minutes);
    } else {
      arr.sort((a, b) => bestScore(a.it) - bestScore(b.it));
    }

    return arr;
  }, [enriched, filters, sortKey]);

  return (
    <section className="bg-slate-100">
      <div className="max-w-[1200px] m-auto">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          {/* Left Sidebar */}
          <aside className="w-full md:w-72 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] flex items-center text-gray-800 gap-2">
                <FcAlarmClock size={25} /> Time Remaining
              </h3>
              <span className="font-murecho font-semibold text-[17px]">
                {mm}:{ss}
              </span>
            </div>

            <div className="w-full h-1.5 bg-red-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-1.5 bg-red-700 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Departure */}
            <div className="bg-white rounded-full px-1.5 py-1.5 mb-3 flex items-center justify-between shadow">
              <button
                disabled={status === "loading" || !depOD}
                onClick={() => shiftDepartureBy(-1)}
                className={`w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200 ${
                  status === "loading" || !depOD
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                title="Previous day"
              >
                <img src={prev} alt="prev" className="h-4" />
              </button>

              <div>
                <p className="text-xs">Departure</p>
                <p className="text-gray-500 text-center text-[14px]">
                  {depLabel || "-"}
                </p>
              </div>

              <button
                disabled={status === "loading" || !depOD}
                onClick={() => shiftDepartureBy(1)}
                className={`w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200 ${
                  status === "loading" || !depOD
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                title="Next day"
              >
                <img src={next} alt="next" className="h-4" />
              </button>
            </div>

            {/* Return (only for round-trip) */}
            {retOD && (
              <div className="bg-white rounded-full px-1.5 py-1.5 mb-3 flex items-center justify-between shadow">
                <button
                  disabled={status === "loading"}
                  onClick={() => shiftReturnBy(-1)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200 ${
                    status === "loading" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="Previous day"
                >
                  <img src={prev} alt="prev" className="h-4" />
                </button>

                <div>
                  <p className="text-xs">Return</p>
                  <p className="text-gray-500 text-center text-[14px]">
                    {retLabel || "-"}
                  </p>
                </div>

                <button
                  disabled={status === "loading"}
                  onClick={() => shiftReturnBy(1)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200 ${
                    status === "loading" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="Next day"
                >
                  <img src={next} alt="next" className="h-4" />
                </button>
              </div>
            )}

            {/* Filters (controlled) */}
            <Dropdownmenu
              bounds={{
                priceMin,
                priceMax,
                layMin,
                layMax,
                airlines: airlineList,
              }}
              value={filters}
              onChange={setFilters}
            />
          </aside>

          {/* Right Section */}
          <main className="flex-1">
            <p className="text-[14px] font-semibold mt-5 mb-4">
              {status === "loading" && "Searching flights…"}
              {status === "failed" && (
                <span className="text-red-600">Error: {error}</span>
              )}
              {status === "succeeded" &&
                `${formatCount(view.length, "Flight")} & ${formatCount(
                  getAirlinesCount(itineraries),
                  "Airline"
                )}`}
              {status === "idle" && "Pick your filters to begin"}
            </p>

            <div className="mb-4">
              <FlightTabs
                sortKey={sortKey}
                onChange={setSortKey}
                counts={{ total: view.length }}
              />
            </div>

            <div className="space-y-4">
              {status === "succeeded" && view.length === 0 && (
                <div className="bg-white rounded-md p-4 text-sm text-gray-600">
                  No flights match your filters.
                </div>
              )}

              {status === "succeeded" &&
                view.map(({ it }) => {
                  const { currency, total } = pickBDTPrice(it);
                  const firstSeg = it?.flights?.[0]?.flightSegments?.[0] || {};
                  const lastSeg =
                    it?.flights?.[0]?.flightSegments?.slice(-1)?.[0] || {};
                  const depCity =
                    firstSeg?.departure?.airport?.cityName ||
                    firstSeg?.departure?.airport?.airportCode ||
                    "";
                  const arrCity =
                    lastSeg?.arrival?.airport?.cityName ||
                    lastSeg?.arrival?.airport?.airportCode ||
                    "";

                  const topLine = `${safe(depCity)} → ${safe(arrCity)}`;
                  const duration = it?.flights?.[0]?.totalElapsedTime || "";
                  const stops = it?.stops ?? it?.flights?.[0]?.totalStops ?? 0;
                  const validatingCarrier =
                    it?.validatingCarrier || it?.validatingCarrierCode || "";

                  const flight = {
                    id: it?.resultID,
                    validatingCarrier,
                    price: { currency, total },
                    duration,
                    stops,
                    segments: it?.flights?.[0]?.flightSegments || [],
                    raw: it,
                    summary: topLine,
                  };

                  return <FlightCard key={it?.resultID} flight={flight} />;
                })}

              {status === "loading" && (
                <>
                  <div className="bg-white rounded-md p-4 animate-pulse h-28" />
                  <div className="bg-white rounded-md p-4 animate-pulse h-28" />
                  <div className="bg-white rounded-md p-4 animate-pulse h-28" />
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
