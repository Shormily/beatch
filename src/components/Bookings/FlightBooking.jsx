// src/pages/FlightBooking.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { FcAlarmClock } from "react-icons/fc";
import next from "../LandingPages/assets/next.png";
import prev from "../LandingPages/assets/prev.png";
import mr from "../LandingPages/assets/mr.png";
import { selectBestToken } from "../../redux/slices/authSlice";
import {
  setPrimaryTraveller,
  setContact,
  selectSelectedFlight,
} from "../../redux/slices/checkoutSlice";

/* ------------------ helpers ------------------ */
const useCountdown = (seconds = 360) => {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(1, "0");
  const ss = String(left % 60).padStart(2, "0");
  const pct = Math.max(0, Math.min(100, (left / seconds) * 100));
  return { label: `${mm}:${ss}`, pct };
};

const TitleChoice = ({ text, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors
      ${
        active
          ? "border-red-500 bg-red-50 text-red-600"
          : "border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
  >
    <img
      src={mr}
      className={active ? "text-red-500" : "text-gray-500"}
      alt=""
    />
    {text}
  </button>
);

const FloatingInput = ({ label, type = "text", required, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative w-full font-murecho">
      <label
        className={`absolute left-3 top-1/2 -translate-y-1/2  transition-all duration-200 pointer-events-none
          ${
            focused || props.value
              ? "top-2 text-[12px] pt-2 text-gray-700 font-normal"
              : "text-[15px] text-gray-700 font-medium"
          }`}
      >
        {label}
        {required && "*"}
      </label>
      <input
        type={type}
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== "" ? true : false)}
        className="h-16 w-full rounded-md border border-gray-300 bg-white px-3 pt-4 text-[14px]
                    outline-none"
      />
    </div>
  );
};

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="h-16 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 pr-9 text-sm text-gray-800
               outline-none"
  >
    {children}
  </select>
);

const PhoneInputBare = ({ value, onChange }) => (
  <div
    className="flex h-16 w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 
                  outline-none"
  >
    <div className="flex items-center gap-2 text-sm text-gray-700 bg-sky-50 font-medium pr-6 py-1.2 rounded-lg">
      <img
        src="https://flagcdn.com/16x12/bd.png"
        alt="BD"
        className="h-3 w-4 rounded-sm"
      />
      <span>+880</span>
    </div>
    <span className="text-gray-300">|</span>
    <input
      type="tel"
      placeholder="Mobile"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-16 w-full text-sm text-gray-800 focus:outline-none"
    />
  </div>
);

// flight helpers
const safe = (v, d = "") => (v === undefined || v === null || v === "" ? d : v);
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

/* -------- robust profile extraction from auth -------- */
function selectAuthProfile(state) {
  const auth = state?.auth.user || {};

  // Try several common shapes
  const profile =
    auth.profile ||
    auth.user ||
    auth.userInfo ||
    auth.customer ||
    auth.currentUser ||
    {};

  // Also try to merge nested fields if present
  const data = {
    // names
    firstName:
      profile.firstName ||
      profile.given_name ||
      (profile.name ? String(profile.name).split(" ")[0] : "") ||
      auth.firstName ||
      "",
    lastName:
      profile.lastName ||
      profile.family_name ||
      (profile.name
        ? String(profile.name).split(" ").slice(1).join(" ")
        : "") ||
      auth.lastName ||
      "",
    // email / username as email fallback
    email:
      profile.email ||
      auth.email ||
      (/\S+@\S+\.\S+/.test(profile.username || "") ? profile.username : "") ||
      "",
    // phone
    mobile:
      profile.mobile ||
      profile.phone ||
      profile.phoneNumber ||
      auth.mobile ||
      auth.phone ||
      "",
    // dob
    dob: profile.dob || profile.dateOfBirth || "",
    // gender
    gender: profile.gender || profile.sex || "",
    // nationality / country
    nationality: profile.nationality || profile.country || "Bangladeshi",
    // postal
    postalCode: profile.postalCode || profile.zip || "",
  };

  return data;
}

function genderToTitle(g) {
  const v = String(g || "").toLowerCase();
  if (v.startsWith("m")) return "Mr";
  if (v.startsWith("f")) return "Mrs"; // you can tweak to "Ms" if you prefer
  return "Mr";
}

/* ------------------ main ------------------ */
export default function FlightBooking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selected = useSelector(selectSelectedFlight);
  const authToken = useSelector(selectBestToken);

  useEffect(() => {
    if (!authToken) navigate("/sign"); // forces login
  }, [authToken, navigate]);

  useEffect(() => {
    if (!selected?.flight) navigate("/searchresult");
  }, [selected, navigate]);

  const [collapsed, setCollapsed] = useState(false);
  const { label, pct } = useCountdown(360);

  // read profile from auth (robust)
  const authProfile = useSelector(selectAuthProfile);

  // traveller form (prefill from auth once)
  const [title, setTitle] = useState(genderToTitle(authProfile.gender));
  const [firstName, setFirstName] = useState(authProfile.firstName || "");
  const [surname, setSurname] = useState(authProfile.lastName || "");
  const [dob, setDob] = useState(authProfile.dob || "");
  const [nationality, setNationality] = useState(authProfile.nationality || "");
  const [postalCode, setPostalCode] = useState(authProfile.postalCode || "");

  // contact form prefill
  const [mobile, setMobile] = useState(authProfile.mobile || "");
  const [email, setEmail] = useState(authProfile.email || "");

  // If auth updates later (e.g., hydration), fill blanks only once
  useEffect(() => {
    setTitle((t) => (t ? t : genderToTitle(authProfile.gender)));
    setFirstName((v) => (v ? v : authProfile.firstName || ""));
    setSurname((v) => (v ? v : authProfile.lastName || ""));
    setDob((v) => (v ? v : authProfile.dob || ""));
    setNationality((v) => (v ? v : authProfile.nationality || "Bangladeshi"));
    setPostalCode((v) => (v ? v : authProfile.postalCode || ""));
    setMobile((v) => (v ? v : authProfile.mobile || ""));
    setEmail((v) => (v ? v : authProfile.email || ""));
  }, [authProfile]);

  // dynamic summary from selected
  const legs = useMemo(() => getLegs(selected?.flight || {}), [selected]);
  const isRoundTrip = legs.length >= 2;

  const firstLeg = legs[0] || {};
  const lastLeg = isRoundTrip ? legs[legs.length - 1] : legs[0] || {};
  const { first: flFirst } = firstLastSeg(firstLeg);
  const { last: llLast } = firstLastSeg(lastLeg);

  const airlineCode =
    flFirst?.airline?.optAirlineCode || flFirst?.airline?.code || "";
  const airlineName =
    flFirst?.airline?.optAirline ||
    flFirst?.airline?.name ||
    flFirst?.airline?.code ||
    "Airline";

  const depCode =
    flFirst?.departure?.airport?.airportCode ||
    flFirst?.departure?.airport?.cityCode ||
    "";
  const arrCode =
    llLast?.arrival?.airport?.airportCode ||
    llLast?.arrival?.airport?.cityCode ||
    "";

  const depDate = safe(flFirst?.departure?.depDate);
  const retDate = isRoundTrip ? safe(llLast?.arrival?.arrDate) : "";

  const airFareBDT = selected?.pricing?.airFareBDT ?? 0;
  const couponBDT = selected?.pricing?.couponBDT ?? 0;
  const totalBDT =
    selected?.pricing?.totalBDT ?? Math.max(airFareBDT - couponBDT, 0);
  const promoCode = selected?.pricing?.promoCode || "FTFLASH10";

  const onSaveContinue = () => {
    dispatch(
      setPrimaryTraveller({
        title,
        firstName: firstName.trim(),
        lastName: surname.trim(),
        dob,
        nationality,
        postalCode,
      })
    );
    dispatch(
      setContact({
        mobile: mobile.trim(),
        email: email.trim(),
      })
    );
    navigate("/addons");
  };

  const topBadges = useMemo(
    () => [
      { k: "t1", text: "Traveller 1" },
      { k: "adult", text: "Adult" },
      { k: "primary", text: "Primary Traveller", primary: true },
      { k: "saved", text: "Saved Traveller", caret: true },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#eaf0f5] font-murecho">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        {/* Top nav pills + time header */}
        <div className="grid grid-cols-[1fr_340px] items-start">
          <div className="flex items-start">
            <div className="w-full ">
              <nav aria-label="">
                <div className="flex  rounded-full text-sm p-1  ">
                  <button className=" bg-red-50 text-red-600 rounded-full z-10 font-semibold text-[14px] px-16 py-3.5 transition  border border-white shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
                    1. Traveller Info
                  </button>
                  <button className=" rounded-r-full ml-[-15px] z-8  bg-slate-200 text-gray-400 font-semibold px-14 py-3.5 transition border-t border-r border-b border-white shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
                    2. Add-ons
                  </button>
                  <button className="rounded-r-full ml-[-15px] z-5 px-14 py-3 bg-slate-200 text-gray-400 font-semibold transition border-t border-r border-b border-white shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
                    3. Payment Info
                  </button>

                  <button className=" rounded-r-full  ml-[-15px] px-14 py-3 bg-slate-200 text-gray-400 font-semibold transition border-t border-r border-b border-white shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
                    4. Preview
                  </button>
                </div>
              </nav>
            </div>
          </div>

          <div className="rounded-2xl  ">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700 mb-1 mt-3">
                <FcAlarmClock size={25} className="text-red-500  " />
                <span className="text-md font-semibold">Time Remaining</span>
              </div>
              <span className="text-lg font-semibold text-gray-800 ">
                {label}
              </span>
            </div>
            <div className="h-1.5 w-full   overflow-hidden rounded-full bg-red-100">
              <div
                className="h-full bg-red-700 "
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-4 grid grid-cols-[1fr_340px] gap-6 items-start">
          {/* Left card */}
          <div
            className={`rounded-2xl border border-gray-200 bg-white ${
              collapsed ? "p-4" : "p-5"
            } shadow-sm`}
          >
            {/* row badges */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {topBadges.map((b) => (
                  <button
                    key={b.k}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${
                      b.primary
                        ? "border-teal-500 bg-teal-600/10 text-teal-700"
                        : "border-gray-300 text-gray-700"
                    }`}
                    type="button"
                  >
                    {b.text}
                    {b.caret && <FiChevronDown className="text-gray-500" />}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCollapsed((v) => !v)}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm"
                aria-expanded={!collapsed}
                aria-controls="traveller-form"
              >
                {collapsed ? (
                  <img src={prev} alt="prev" className="h-4" />
                ) : (
                  <img src={next} alt="next" className="h-4" />
                )}
              </button>
            </div>

            {!collapsed && (
              <div id="traveller-form" className="mt-2">
                {/* Personal Info */}
                <div className=" flex gap-2 pb-3">
                  <div className="text-[18px] font-semibold text-gray-900">
                    Personal Info
                  </div>
                  <div className="text-[13px] text-gray-800 mt-1">
                    As mentioned on your passport or government approved IDs
                  </div>
                </div>

                {/* Title buttons */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {["Mr", "Mrs", "Ms"].map((t) => (
                    <TitleChoice
                      key={t}
                      text={t}
                      active={title === t}
                      onClick={() => setTitle(t)}
                    />
                  ))}
                </div>

                {/* Form grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FloatingInput
                    label="Given Name / First Name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <FloatingInput
                    label="Surname"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                  <FloatingInput
                    label="Date of Birth"
                    required
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />

                  <div className="relative">
                    <Select
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                    >
                      <option>Bangladeshi</option>
                      <option>Indian</option>
                      <option>Pakistani</option>
                      <option>Nepalese</option>
                      <option>Sri Lankan</option>
                    </Select>
                    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>

                  <FloatingInput
                    label="Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>

                {/* Contact Info */}
                <div className="mt-5 flex gap-2">
                  <div className="text-[15px] font-semibold text-gray-900">
                    Contact Info
                  </div>
                  <div className="text-[12px] text-gray-500 mt-1">
                    For booking confirmation & updates
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <PhoneInputBare value={mobile} onChange={setMobile} />
                  <FloatingInput
                    label="Email Address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Frequent Flyer */}
                <div className="mt-5">
                  <div className="text-[13px] font-semibold text-gray-900">
                    Frequent Flyer Program{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FloatingInput label="Frequent Flyer Number" />
                </div>

                {/* Save to list */}
                <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 text-red-600 accent-red-500 focus:ring-red-500"
                  />
                  <span>Add to My Traveller List</span>
                </label>
              </div>
            )}
          </div>

          {/* Right summary card */}
          <aside className="self-start rounded-2xl border border-gray-200 bg-white p-4 shadow-sm max-h-[360px] overflow-hidden">
            <div className="mb-3 text-sm font-semibold text-gray-800">
              Fare Summary
            </div>

            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <img
                  src={`https://airlines.a4aero.com/images/${airlineCode}.png`}
                  alt={airlineCode}
                  className="w-10 h-full object-contain"
                />

                <span className="text-sm font-medium">{airlineName}</span>
              </div>
              <button className="text-xs font-medium text-blue-600 hover:underline">
                Details
              </button>
            </div>

            <div className="mb-2 text-sm text-gray-700">
              <span className="font-semibold">{depCode || "—"}</span>
              <span className="mx-1">↔</span>
              <span className="font-semibold">{arrCode || "—"}</span>
              {isRoundTrip && (
                <span className="ml-1 text-gray-500">(Round Trip)</span>
              )}
              <div className="text-[12px] text-gray-500">
                {depDate || "—"}
                {isRoundTrip && retDate ? ` - ${retDate}` : ""}
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Air Fare</span>
              <span className="font-medium text-gray-800">
                BDT {Number(airFareBDT).toLocaleString()}
              </span>
            </div>

            {couponBDT > 0 && (
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                    Offer
                  </span>
                  <span className="rounded border border-orange-300 bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                    {promoCode}
                  </span>
                </div>
                <span className="font-medium text-red-600">
                  BDT {Number(couponBDT).toLocaleString()}
                </span>
              </div>
            )}

            <div className="mt-3 rounded-md bg-red-50 px-3 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-600">Total</div>
                  {couponBDT > 0 && (
                    <div className="text-[11px] text-green-600">You Save</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">
                    BDT{" "}
                    <span className="text-xl">
                      {Number(totalBDT).toLocaleString()}
                    </span>
                  </div>
                  {couponBDT > 0 && (
                    <div className="text-[11px] text-green-600">
                      {Number(couponBDT).toLocaleString()} BDT
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom button */}
        <div className="my-6 grid place-items-center">
          <button
            type="button"
            onClick={onSaveContinue}
            className="w-[340px] rounded-2xl bg-red-700 px-5 py-3 text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
          >
            Save & Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
