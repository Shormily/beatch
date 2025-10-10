// src/pages/Flights/FlightSearchPage.jsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FcAlarmClock } from "react-icons/fc";
import next from "../LandingPages/assets/next.png";
import prev from "../LandingPages/assets/prev.png";
import FlightCard from "./FlightCard";
import { searchFlights } from "../../redux/slices/flightsSlice";
import FlightSortBar from "./FlightSortBar";
import AirlineMinBar from "./AirlineMinBar";
import LoadingCard from "./LoadingCard";
import AirlineMinBarSkeleton from "./AirlineMinBarSkeleton";
import LoadingBar from "react-top-loading-bar";
import { setForm as setSearchForm } from "../../redux/slices/searchFormSlice";

/* ================= tiny utils ================= */

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
  return isoOrLabel;
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
  return "";
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

const minutesToLabel = (mins) => {
  if (!Number.isFinite(mins) || mins <= 0) return "—";
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = Math.floor(mins % 60);
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m || parts.length === 0) parts.push(`${m}m`);
  return parts.join(" ");
};

// "HH:mm" -> minutes since midnight
const parseHHMMToMinutes = (hhmm) => {
  if (typeof hhmm !== "string") return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const hh = Number(m[1]),
    mm = Number(m[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  return hh * 60 + mm;
};

// minutes since midnight -> "HH:mm"
const minutesToHHMM = (mins) => {
  if (!Number.isFinite(mins)) return "—";
  const hh = String(Math.floor(mins / 60)).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return `${hh}:${mm}`;
};

const formatBDT = (v) => {
  if (!Number.isFinite(v)) return "—";
  try {
    return `৳ ${v.toLocaleString("en-BD")}`;
  } catch {
    return `৳ ${v}`;
  }
};

// slots
const timeToSlot = (mins) => {
  if (!Number.isFinite(mins)) return null;
  if (mins < 360) return "EARLY_MORNING";
  if (mins < 720) return "MORNING";
  if (mins < 1080) return "AFTERNOON";
  return "EVENING";
};
const slotLabel = {
  EARLY_MORNING: { title: "Early Morning", range: "00:00–05:59" },
  MORNING: { title: "Morning", range: "06:00–11:59" },
  AFTERNOON: { title: "Afternoon", range: "12:00–17:59" },
  EVENING: { title: "Evening", range: "18:00–23:59" },
};

/* ======== additions for summary/reset ======== */
const plural = (n, s) => `${n} ${s}${n === 1 ? "" : "s"}`;

const makeDefaultFilters = ({ priceMin, priceMax, layMin, layMax }) => ({
  price: [priceMin, priceMax],
  layoverHours: [layMin, layMax],
  stops: { nonstop: false },
  airlines: new Set(),
  depSlots: new Set(),
  arrSlots: new Set(),
  baggage20kg: false,
  refundable: false,
  aircraft: new Set(),
});

const countActiveFilters = (f, d) => {
  let n = 0;
  if (f.price[0] !== d.price[0] || f.price[1] !== d.price[1]) n++;
  if (
    f.layoverHours[0] !== d.layoverHours[0] ||
    f.layoverHours[1] !== d.layoverHours[1]
  )
    n++;
  if (f.stops.nonstop) n++;
  if (f.airlines.size > 0) n++;
  if (f.depSlots.size > 0) n++;
  if (f.arrSlots.size > 0) n++;
  if (f.baggage20kg) n++;
  if (f.refundable) n++;
  if (f.aircraft.size > 0) n++;
  return n;
};

/* ===== Cabin & Pax helpers (UI ↔ API) ===== */

// Normalize any token/label -> nice UI label for display
const cabinToUILabel = (raw) => {
  const v = String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
  if (!v) return "Economy";
  if (v === "y" || v === "economy") return "Economy";
  if (
    v === "premiumeconomy" ||
    v === "premium_economy" ||
    v.includes("premium")
  )
    return "Premium Economy";
  if (v === "business" || v === "c" || v === "j") return "Business";
  if (v === "first" || v === "firstclass" || v === "f") return "First";
  return "Economy";
};

// UI label -> API token with exact casing the backend expects
const toApiCabinValue = (label = "Economy") => {
  const v = String(label).trim().toLowerCase();
  if (v.includes("premium")) return "PremiumEconomy";
  if (v.includes("business")) return "Business";
  if (v.includes("first")) return "First";
  return "Economy";
};

// Prefer passengers array; else reconstruct from travellers
const extractPassengers = (criteria) => {
  if (Array.isArray(criteria?.passengers) && criteria.passengers.length) {
    return criteria.passengers;
  }
  const t = criteria?.travellers || {};
  const rows = [
    { passengerType: "ADT", quantity: Number(t.adults || 0) },
    { passengerType: "CHD", quantity: Number(t.children || 0) },
    { passengerType: "INF", quantity: Number(t.infants || 0) },
  ].filter((p) => p.quantity > 0);
  return rows.length ? rows : [{ passengerType: "ADT", quantity: 1 }];
};

// choose best UI label from criteria
const labelFromCriteria = (criteria) =>
  criteria?.travelClassLabel ||
  cabinToUILabel(criteria?.cabinClass) ||
  "Economy";

// choose best API token from criteria
const tokenFromCriteria = (criteria) => {
  const t1 = criteria?.__requestBody?.cabinClass;
  if (t1) return t1;
  if (criteria?.cabinClass) return toApiCabinValue(criteria.cabinClass);
  if (criteria?.travelClassLabel)
    return toApiCabinValue(criteria.travelClassLabel);
  return "Economy";
};

/* ================= Filter UI bits ================= */

function Section({ title, open, onToggle, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <span className="text-[14px] font-semibold text-gray-800">{title}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function Chip({ active, onClick, icon, title, sub }) {
  return (
    <button
      onClick={onClick}
      className={`w-full cursor-pointer text-left rounded-xl border px-1 py-2  transition
        ${
          active
            ? "bg-red-50 border-red-300"
            : "bg-white hover:border-gray-300 border-gray-200"
        }`}
    >
      <div className="flex items-center gap-1">
        {icon}
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-gray-500">{sub}</div>
        </div>
      </div>
    </button>
  );
}

function DualRange({
  min,
  max,
  value,
  onChange,
  format = (v) => v,
  step = 1,
  minLabel,
  maxLabel,
}) {
  const [a, b] = value;
  const lo = Math.min(a, b),
    hi = Math.max(a, b);

  const handleA = (e) => onChange([Number(e.target.value), hi]);
  const handleB = (e) => onChange([lo, Number(e.target.value)]);

  const realMin = Number.isFinite(min) ? min : 0;
  const realMax = Number.isFinite(max) && max > realMin ? max : realMin + 1;

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
        <span>{format(lo)}</span>
        <span>{format(hi)}</span>
      </div>
      <div className="relative h-2 mb-3">
        <div className="absolute inset-0 rounded-full bg-gray-200" />
        <div
          className="absolute h-2 rounded-full bg-red-600"
          style={{
            left: `${((lo - realMin) / (realMax - realMin)) * 100}%`,
            right: `${(1 - (hi - realMin) / (realMax - realMin)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={realMin}
          max={realMax}
          step={step}
          value={lo}
          onChange={handleA}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto"
        />
        <input
          type="range"
          min={realMin}
          max={realMax}
          step={step}
          value={hi}
          onChange={handleB}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto"
        />
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

function FiltersSidebar({
  bounds,
  value,
  onChange,
  airlineList,
  aircraftList,
}) {
  const [open, setOpen] = useState({
    price: true,
    stops: true,
    airlines: true,
    schedules: true,
    baggage: true,
    refundable: true,
    layover: true,
    aircraft: true,
  });
  const [schedTab, setSchedTab] = useState("dep"); // "dep" | "arr"

  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const setField = (patch) => onChange({ ...value, ...patch });
  const toggleSet = (setName, key) => {
    const next = new Set(value[setName]);
    next.has(key) ? next.delete(key) : next.add(key);
    onChange({ ...value, [setName]: next });
  };

  return (
    <aside>
      {/* Price Range */}
      <Section
        title="Price Range"
        open={open.price}
        onToggle={() => toggle("price")}
      >
        <DualRange
          min={bounds.priceMin}
          max={bounds.priceMax}
          value={value.price}
          onChange={(v) => setField({ price: v })}
          format={formatBDT}
        />
      </Section>

      {/* Stops */}
      <Section title="Stops" open={open.stops} onToggle={() => toggle("stops")}>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-red-500"
            checked={value.stops.nonstop}
            onChange={(e) =>
              setField({ stops: { ...value.stops, nonstop: e.target.checked } })
            }
          />
          <span>Non-stop</span>
        </label>
      </Section>

      {/* Airlines */}
      <Section
        title="Airlines"
        open={open.airlines}
        onToggle={() => toggle("airlines")}
      >
        <div className="space-y-2">
          {airlineList.map(({ code, price }) => (
            <label
              key={code}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-red-500"
                  checked={value.airlines.has(code)}
                  onChange={() => toggleSet("airlines", code)}
                />
                <span className="truncate max-w-[9rem]" title={code}>
                  {code}
                </span>
              </span>
              <span className="text-gray-600">{formatBDT(price)}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Flight Schedules */}
      <Section
        title="Flight Schedules"
        open={open.schedules}
        onToggle={() => toggle("schedules")}
      >
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setSchedTab("dep")}
            className="text-xs px-3 py-1.5 rounded-full bg-white"
          >
            <span
              className={`cursor-pointer ${
                schedTab === "dep"
                  ? "font-semibold text-red-600 bg-red-50 px-4  pt-2 border-b-2 border-red-600 pb-0.5"
                  : "text-gray-500  px-4 pt-2 border-b-2 pb-0.5"
              }`}
            >
              Departure
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSchedTab("arr")}
            className="text-xs px-3 py-1.5 rounded-full bg-white"
          >
            <span
              className={`cursor-pointer ${
                schedTab === "arr"
                  ? "font-semibold text-red-600 bg-red-50  px-4 pt-2 border-b-2 border-red-600 pb-0.5"
                  : "text-gray-500  px-4 pt-2 border-b-2 pb-0.5"
              }`}
            >
              Arrival
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 ">
          {["EARLY_MORNING", "MORNING", "AFTERNOON", "EVENING"].map((k) => {
            const setName = schedTab === "dep" ? "depSlots" : "arrSlots";
            const isActive = value[setName].has(k);
            return (
              <Chip
                key={k}
                active={isActive}
                onClick={() => toggleSet(setName, k)}
                icon={<span className="" />}
                title={slotLabel[k].title}
                sub={slotLabel[k].range}
              />
            );
          })}
        </div>

        <div className="mt-3 text-xs text-gray-500">
          {schedTab === "dep" ? "Departure: Anytime" : "Arrival: Anytime"}
        </div>
      </Section>

      {/* Baggage Policy */}
      <Section
        title="Baggage Policy"
        open={open.baggage}
        onToggle={() => toggle("baggage")}
      >
        <label className="flex items-center gap-2 text-sm">
          <input
            className="accent-red-500"
            type="checkbox"
            checked={value.baggage20kg}
            onChange={(e) => setField({ baggage20kg: e.target.checked })}
          />
          <span>20kg+ Checked baggage</span>
        </label>
      </Section>

      {/* Refundability */}
      <Section
        title="Refundability"
        open={open.refundable}
        onToggle={() => toggle("refundable")}
      >
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-red-500"
            checked={value.refundable}
            onChange={(e) => setField({ refundable: e.target.checked })}
          />
          <span>Partially Refundable</span>
        </label>
      </Section>

      {/* Layover Time */}
      <Section
        title="Layover Time"
        open={open.layover}
        onToggle={() => toggle("layover")}
      >
        <DualRange
          min={0}
          max={Math.max(1, bounds.layMax)} // hours
          value={value.layoverHours}
          onChange={(v) => setField({ layoverHours: v })}
          step={1}
          format={(v) => `${v} hrs`}
          minLabel="0 hrs"
          maxLabel={`${Math.max(1, bounds.layMax)}+ hrs`}
        />
      </Section>

      {/* Aircraft */}
      <Section
        title="Aircraft"
        open={open.aircraft}
        onToggle={() => toggle("aircraft")}
      >
        <div className="space-y-2">
          {aircraftList.length
            ? aircraftList.map((ac) => (
                <label key={ac} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-red-500"
                    checked={value.aircraft.has(ac)}
                    onChange={() => toggleSet("aircraft", ac)}
                  />
                  <span>{ac}</span>
                </label>
              ))
            : null}
        </div>
      </Section>
    </aside>
  );
}

/* ================= page component ================= */

export default function FlightSearchPage() {
  const dispatch = useDispatch();
  const { results, status, error, criteria } = useSelector(
    (s) => s.flights || {}
  );

  const loadingRef = useRef(null);
  useEffect(() => {
    if (status === "loading") loadingRef.current?.continuousStart();
    if (status === "succeeded" || status === "failed")
      loadingRef.current?.complete();
  }, [status]);

  const itineraries = results?.results || [];
  const depOD = criteria?.originDestinationOptions?.[0];
  const retOD = criteria?.originDestinationOptions?.[1];

  const [sortKey, setSortKey] = useState("best");

  /* ---- buildSearchArgs (keeps cabin + pax consistent) ---- */

  const buildSearchArgs = (override = {}) => {
    // base fields from current criteria / OD blocks
    const fromCode = depOD?.departureAirport || criteria?.fromCode || "";
    const toCode = depOD?.arrivalAirport || criteria?.toCode || "";

    const departureDateISO = normalizeToISO(
      override.departureDate ?? depOD?.flyDate
    );
    const isRound = !!retOD;
    const returnDateISO = isRound
      ? normalizeToISO(override.returnDate ?? retOD?.flyDate)
      : undefined;

    // passengers + travellers
    const passengers = extractPassengers(criteria);
    const qty = (t) =>
      passengers.find((p) => p.passengerType === t)?.quantity || 0;
    const travellers = {
      adults: qty("ADT") || 1,
      children: qty("CHD") || 0,
      infants: qty("INF") || 0,
    };

    // class (UI label + API token)
    const travelClassLabel = labelFromCriteria(criteria);
    const cabinClassToken = tokenFromCriteria(criteria);

    // origin-destination for the API body
    const originDestinationOptions = [
      {
        departureAirport: fromCode,
        arrivalAirport: toCode,
        flyDate: departureDateISO,
      },
    ];
    if (isRound) {
      originDestinationOptions.push({
        departureAirport: toCode,
        arrivalAirport: fromCode,
        flyDate: returnDateISO,
      });
    }

    return {
      tripType: isRound ? "ROUND_TRIP" : "ONE_WAY",
      fromCode,
      toCode,
      departureDate: departureDateISO,
      returnDate: isRound ? returnDateISO : undefined,
      travellers,
      travelClassLabel, // for UI
      // also keep cabinClass on criteria for subsequent searches
      cabinClass: cabinClassToken,
      preferredAirline: criteria?.preferredAirline ?? undefined,
      apiId: criteria?.apiId ?? undefined,

      // request body the flights API needs
      __requestBody: {
        originDestinationOptions,
        passengers,
        cabinClass: cabinClassToken,
        preferredAirline: criteria?.preferredAirline ?? undefined,
        apiId: criteria?.apiId ?? undefined,
      },

      // allow explicit overrides (if you pass more later)
      ...override,
    };
  };

  /* ---- date shift handlers (also sync searchForm slice) ---- */

  const shiftDepartureBy = (delta) => {
    if (!depOD) return;
    const depISO = normalizeToISO(depOD.flyDate);
    const newDep = addDaysISO(depISO, delta);

    // keep the Search Form slice in sync for the main form UI
    dispatch(setSearchForm({ departureDate: newDep }));

    const args = buildSearchArgs({ departureDate: newDep });
    dispatch(searchFlights(args));
  };

  const shiftReturnBy = (delta) => {
    if (!retOD) return;
    const retISO = normalizeToISO(retOD.flyDate);
    const newRet = addDaysISO(retISO, delta);

    // keep the Search Form slice in sync for the main form UI
    dispatch(setSearchForm({ returnDate: newRet }));

    const args = buildSearchArgs({ returnDate: newRet });
    dispatch(searchFlights(args));
  };

  /* ---- enrich rows ---- */

  const enriched = useMemo(() => {
    return itineraries.map((it) => {
      const price = pickBDTPrice(it);
      const minutes = getDurationMinutes(it);
      const stops = getStops(it);
      const layMin = totalLayoverMinutes(it); // minutes

      const firstSeg = it?.flights?.[0]?.flightSegments?.[0];
      const lastSeg = it?.flights?.[0]?.flightSegments?.slice(-1)?.[0];

      const depHHmm =
        firstSeg?.departure?.depTime ||
        firstSeg?.departure?.time ||
        firstSeg?.departure?.scheduledTime ||
        firstSeg?.departure?.localTime ||
        "";
      const arrHHmm =
        lastSeg?.arrival?.arrTime ||
        lastSeg?.arrival?.time ||
        lastSeg?.arrival?.scheduledTime ||
        lastSeg?.arrival?.localTime ||
        "";

      const depMins = parseHHMMToMinutes(depHHmm);
      const arrMins = parseHHMMToMinutes(arrHHmm);

      const airlineCodes = new Set();
      if (it?.validatingCarrierCode) airlineCodes.add(it.validatingCarrierCode);
      it?.flights?.[0]?.flightSegments?.forEach((s) => {
        if (s?.airline?.code) airlineCodes.add(s.airline.code);
        if (s?.airline?.optAirlineCode)
          airlineCodes.add(s.airline.optAirlineCode);
      });

      const aircraft = new Set(
        (it?.flights?.[0]?.flightSegments || [])
          .map(
            (s) =>
              s?.equipment?.code ||
              s?.equipment ||
              s?.aircraft ||
              s?.airline?.aircraftTypeCode ||
              s?.airline?.aircraftType ||
              null
          )
          .filter(Boolean)
      );

      return {
        it,
        price,
        minutes,
        stops,
        layMin, // minutes
        airlineCodes: Array.from(airlineCodes),
        aircraft: Array.from(aircraft),
        depMins,
        arrMins,
        depSlot: timeToSlot(depMins),
        arrSlot: timeToSlot(arrMins),
      };
    });
  }, [itineraries]);

  /* ---- airline chips ---- */

  const airlineAgg = useMemo(() => {
    const map = new Map();
    for (const row of enriched) {
      const { price, airlineCodes } = row;
      for (const code of airlineCodes || []) {
        const cur = map.get(code) || { count: 0, min: Infinity };
        cur.count += 1;
        if (Number.isFinite(price?.total) && price.total < cur.min) {
          cur.min = price.total;
        }
        map.set(code, cur);
      }
    }
    return Array.from(map.entries())
      .map(([code, { count, min }]) => ({ code, count, price: min }))
      .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  }, [enriched]);

  const toggleAirlineFilter = (code) => {
    setFilters((f) => {
      const next = new Set(f.airlines);
      next.has(code) ? next.delete(code) : next.add(code);
      return { ...f, airlines: next };
    });
  };

  /* ---- sort bar metrics ---- */

  const metrics = useMemo(() => {
    let cheapest = Infinity,
      fastest = Infinity,
      earliestMins = null;
    for (const { it } of enriched) {
      const { total } = pickBDTPrice(it);
      if (Number.isFinite(total) && total < cheapest) cheapest = total;

      const mins = getDurationMinutes(it);
      if (Number.isFinite(mins) && mins < fastest) fastest = mins;

      const firstSeg = it?.flights?.[0]?.flightSegments?.[0];
      if (firstSeg?.departure) {
        const t =
          firstSeg.departure.depTime ||
          firstSeg.departure.time ||
          firstSeg.departure.scheduledTime ||
          firstSeg.departure.localTime ||
          "";
        const mm = parseHHMMToMinutes(t);
        if (mm !== null && (earliestMins === null || mm < earliestMins))
          earliestMins = mm;
      }
    }
    return {
      cheapestPrice: Number.isFinite(cheapest) ? cheapest : undefined,
      fastestDuration: Number.isFinite(fastest)
        ? minutesToLabel(fastest)
        : undefined,
      earliestTime:
        earliestMins !== null ? minutesToHHMM(earliestMins) : undefined,
    };
  }, [enriched]);

  /* ---- bounds (price/layover/airlines/aircraft) ---- */

  const { priceMin, priceMax, layMin, layMax, airlineList, aircraftList } =
    useMemo(() => {
      let pMin = Infinity,
        pMax = -Infinity;
      let lMaxHours = 0; // hours
      const airlinePriceMap = new Map();
      const aircraftSet = new Set();

      enriched.forEach(({ price, layMin, airlineCodes, aircraft }) => {
        if (Number.isFinite(price.total)) {
          pMin = Math.min(pMin, price.total);
          pMax = Math.max(pMax, price.total);
        }
        // convert minutes -> hours (rounded) to keep same unit as slider
        const layH = Math.round((layMin || 0) / 60);
        lMaxHours = Math.max(lMaxHours, layH);

        airlineCodes.forEach((c) => {
          const prev = airlinePriceMap.get(c);
          if (!prev || (Number.isFinite(price.total) && price.total < prev)) {
            airlinePriceMap.set(c, price.total);
          }
        });

        (aircraft || []).forEach((a) => aircraftSet.add(a));
      });

      if (!Number.isFinite(pMin)) pMin = 0;
      if (!Number.isFinite(pMax) || pMax < pMin) pMax = pMin + 1;
      if (pMax === pMin) pMax = pMin + 1;

      const maxLayHours = Math.max(lMaxHours, 1);

      const list = Array.from(airlinePriceMap.entries())
        .map(([code, price]) => ({ code, price }))
        .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));

      return {
        priceMin: Math.floor(pMin),
        priceMax: Math.ceil(pMax),
        layMin: 0,
        layMax: maxLayHours,
        airlineList: list,
        aircraftList: Array.from(aircraftSet).sort(),
      };
    }, [enriched]);

  /* ---- filters state (with defaults & reset) ---- */

  const defaultFilters = useMemo(
    () => makeDefaultFilters({ priceMin, priceMax, layMin, layMax }),
    [priceMin, priceMax, layMin, layMax]
  );

  const [filters, setFilters] = useState(defaultFilters);

  // when bounds change, sync only range sliders to new bounds
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      price: [priceMin, priceMax],
      layoverHours: [layMin, layMax],
    }));
  }, [priceMin, priceMax, layMin, layMax]);

  const resetAllFilters = () => setFilters(defaultFilters);

  /* ---- timer UI ---- */

  const totalTime = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const progress = (timeLeft / totalTime) * 100;

  /* ---- date labels ---- */

  const depLabel =
    toShortDate(normalizeToISO(depOD?.flyDate)) ||
    (itineraries[0]?.flights?.[0]?.flightSegments?.[0]?.departure?.depDate ??
      "");
  const retLabel =
    toShortDate(normalizeToISO(retOD?.flyDate)) ||
    (itineraries[0]?.flights?.[0]?.flightSegments?.slice(-1)?.[0]?.arrival
      ?.arrDate ??
      "");

  /* ---- FILTER -> SORT -> DISPLAY ---- */

  const view = useMemo(() => {
    const [pMin, pMax] = filters.price;
    const [loMinH, loMaxH] = filters.layoverHours;

    const cmpNumAsc = (a, b) => {
      const A = Number.isFinite(a) ? a : Infinity;
      const B = Number.isFinite(b) ? b : Infinity;
      return A - B;
    };
    const cmpNumDesc = (a, b) => {
      const A = Number.isFinite(a) ? a : -Infinity;
      const B = Number.isFinite(b) ? b : -Infinity;
      return B - A;
    };

    const keep = (row) => {
      const { price, stops, layMin, airlineCodes, depSlot, arrSlot, aircraft } =
        row;

      // price
      if (
        !Number.isFinite(price.total) ||
        price.total < pMin ||
        price.total > pMax
      )
        return false;

      // stops (only show nonstop if checked)
      if (filters.stops.nonstop && stops !== 0) return false;

      // layover: convert minutes -> hours (rounded)
      const layH = Math.round((layMin || 0) / 60);
      if (layH < loMinH || layH > loMaxH) return false;

      // airlines
      if (filters.airlines.size > 0) {
        const hasAirline = airlineCodes?.some((c) => filters.airlines.has(c));
        if (!hasAirline) return false;
      }

      // dep slots
      if (
        filters.depSlots.size > 0 &&
        depSlot &&
        !filters.depSlots.has(depSlot)
      )
        return false;

      // arr slots
      if (
        filters.arrSlots.size > 0 &&
        arrSlot &&
        !filters.arrSlots.has(arrSlot)
      )
        return false;

      // aircraft
      if (filters.aircraft.size > 0) {
        const hasAircraft =
          Array.isArray(aircraft) &&
          aircraft.some((a) => filters.aircraft.has(a));
        if (!hasAircraft) return false;
      }

      // baggage 20kg
      if (filters.baggage20kg) {
        const brands = row?.it?.fares?.[0]?.brands || [];
        const allowOk = brands.some((b) => {
          const kg = Number(b?.baggageAllowanceKg ?? b?.baggageAllowance ?? 0);
          return Number.isFinite(kg) && kg >= 20;
        });
        if (!allowOk && brands.length) return false;
      }

      // refundable
      if (filters.refundable) {
        const brands = row?.it?.fares?.[0]?.brands || [];
        const refOk = brands.some((b) => {
          const tag = String(
            b?.refundability || b?.refundable || ""
          ).toLowerCase();
          return (
            tag.includes("partial") ||
            tag.includes("refundable") ||
            b?.refundable === true
          );
        });
        if (!refOk && brands.length) return false;
      }

      return true;
    };

    let arr = enriched.filter(keep);

    switch (sortKey) {
      case "cheapest":
        arr.sort((a, b) => cmpNumAsc(a.price.total, b.price.total));
        break;
      case "fastest":
        arr.sort((a, b) => cmpNumAsc(a.minutes, b.minutes));
        break;
      case "earliest":
      case "earlyDeparture":
        arr.sort((a, b) => cmpNumAsc(a.depMins, b.depMins));
        break;
      case "lateDeparture":
        arr.sort((a, b) => cmpNumDesc(a.depMins, b.depMins));
        break;
      case "earlyArrival":
        arr.sort((a, b) => cmpNumAsc(a.arrMins, b.arrMins));
        break;
      case "lateArrival":
        arr.sort((a, b) => cmpNumDesc(a.arrMins, b.arrMins));
        break;
      case "best":
      default:
        arr.sort((a, b) => bestScore(a.it) - bestScore(b.it));
    }

    return arr;
  }, [enriched, filters, sortKey]);

  // airline count AFTER filters
  const filteredAirlineCount = useMemo(
    () => getAirlinesCount(view.map((v) => v.it)),
    [view]
  );

  /* ---- render ---- */

  return (
    <section className="bg-slate-200 relative">
      <LoadingBar
        ref={loadingRef}
        color="#dc2626"
        height={3}
        shadow={false}
        waitingTime={400}
        containerStyle={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
      <div className="max-w-[1200px] m-auto">
        <div className="flex flex-col md:flex-row ">
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

            {/* Return (round-trip only) */}
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

            {/* Filters */}
            <FiltersSidebar
              bounds={{ priceMin, priceMax, layMin, layMax }}
              value={filters}
              onChange={setFilters}
              airlineList={airlineList}
              aircraftList={aircraftList}
            />
          </aside>

          {/* Right Section */}
          <main className="flex-1 max-w-4xl">
            <div className="flex items-center gap-3 text-[14px] font-semibold mt-5 mb-4">
              {status === "loading" && <span>Searching flights…</span>}

              {status === "failed" && (
                <span className="text-red-600">Error: {error}</span>
              )}

              {status === "succeeded" && (
                <>
                  <span>
                    Showing {plural(view.length, "Flight")} &{" "}
                    {plural(filteredAirlineCount, "Airline")}
                  </span>

                  <span className="text-gray-300">·</span>

                  {(() => {
                    const active = countActiveFilters(filters, defaultFilters);
                    return active > 0 ? (
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="text-red-600 underline underline-offset-2 hover:text-red-700"
                        title="Clear all filters"
                      >
                        Reset {plural(active, "filter")}
                      </button>
                    ) : (
                      <span className="text-gray-500 font-normal">
                        No filters applied
                      </span>
                    );
                  })()}
                </>
              )}

              {status === "idle" && <span>Pick your filters to begin</span>}
            </div>

            {/* SORT BAR */}
            <div className="mb-4">
              <FlightSortBar
                sortKey={sortKey}
                onChange={setSortKey}
                counts={{ total: view.length }}
                metrics={metrics}
                loading={status === "loading"}
              />
            </div>

            <div className="mb-3">
              <div className="mb-3">
                {status === "loading" && <AirlineMinBarSkeleton count={3} />}

                {status === "succeeded" && (
                  <AirlineMinBar
                    items={airlineAgg}
                    selected={filters.airlines}
                    onToggle={toggleAirlineFilter}
                  />
                )}
              </div>
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
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
