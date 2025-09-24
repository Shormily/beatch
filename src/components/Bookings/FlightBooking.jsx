import React, { useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiClock, FiUser } from "react-icons/fi";
import { LuHourglass } from "react-icons/lu";
import next from "../LandingPages/assets/next.png";
import prev from "../LandingPages/assets/prev.png";
import mr from "../LandingPages/assets/mr.png";
// import styles from "./FlightBooking.module.css";

/* ------------------ helpers ------------------ */
const useCountdown = (seconds = 95) => {
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
      ${active ? "border-red-500 bg-red-50 text-red-600" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
  >
    <img src={mr} className={active ? "text-red-500" : "text-gray-500"} />
    {text}
  </button>
);

/* ------------------ Floating Input ------------------ */
const FloatingInput = ({ label, type = "text", required, ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full font-murecho">
      <label
        className={`absolute left-3 top-1/2 -translate-y-1/2  transition-all duration-200 pointer-events-none
          ${focused || props.value ? "top-2 text-[12px] pt-2 text-gray-700 font-normal" : "text-[15px] text-gray-700 font-medium"}
        `}
      >
        {label}{required && "*"}
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

/* ------------------ Select ------------------ */
const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="h-16 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 pr-9 text-sm text-gray-800
               outline-none"
  >
    {children}
  </select>
);

/* ------------------ Phone Input ------------------ */
const PhoneInput = () => (
  <div className="flex h-16 w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 
                  outline-none">
    <div className="flex items-center gap-2 text-sm text-gray-700 bg-sky-50 font-medium pr-6 py-1.2 rounded-lg">
      <img src="https://flagcdn.com/16x12/bd.png" alt="BD" className="h-3 w-4 rounded-sm" />
      <span>+880</span>
    </div>
    <span className="text-gray-300">|</span>
    <input type="tel" placeholder="Mobile" className="h-16 w-full text-sm text-gray-800 focus:outline-none" />
  </div>
);

/* ------------------ main ------------------ */
export default function FlightBooking() {
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("Mrs");
  const { label, pct } = useCountdown(95);

  const topBadges = useMemo(
    () => [
      { k: "t1", text: "Traveller 1" },
      { k: "adult", text: "Adult" },
      { k: "primary", text: "Primary Traveller", primary: true },
      { k: "saved", text: "Saved Traveller", caret: true },
    ],
    []
  );
  const [step, setStep] = useState(1);
  const steps = [
    { label: "Traveller Info", active: true },
    { label: "Add-ons" },
    { label: "Payment Info" },
    { label: "Preview", link: true },
  ];

  return (
    <div className="min-h-screen bg-[#eaf0f5] font-murecho">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        {/* Top nav pills + time header */}
        <div className="grid grid-cols-[1fr_340px] items-start">
          {/* start the code */}
          <div className="flex items-start justify-center ">
            <div className="w-full max-w-3xl">
              <nav aria-label="" className="">
                <div className="flex  items-center rounded-full p-1 bg-white shadow-sm">
                  {steps.map(s => {
                    return (
                      <button
                        key={s.n}
                        onClick={() => setStep(s.n)}
                        className=
                          "flex items-center rounded-full px-14 py-3 transition  border border-[#f6dede]" 
                  
                      >              
                        <span className="">
                          {s.label}
                        </span>         
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <FiClock className="text-red-500" />
                <span className="text-sm font-semibold">Time Remaining</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">{label}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full bg-red-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-4 grid grid-cols-[1fr_340px] gap-6 items-start">
          {/* Left card */}
          <div className={`rounded-2xl border border-gray-200 bg-white ${collapsed ? "p-4" : "p-5"} shadow-sm`}>
            {/* row badges */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {topBadges.map((b) => (
                  <button
                    key={b.k}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${b.primary
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
                {collapsed ? <img src={prev} alt="prev" className="h-4" /> : <img src={next} alt="next" className="h-4" />}
              </button>
            </div>

            {!collapsed && (
              <div id="traveller-form" className="mt-2">
                {/* Personal Info */}
                <div className=" flex gap-2 pb-3">
                  <div className="text-[18px] font-semibold text-gray-900">Personal Info</div>
                  <div className="text-[13px] text-gray-800 mt-1">
                    As mentioned on your passport or government approved IDs
                  </div>
                </div>

                {/* Title buttons */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {["Mr", "Mrs", "Ms"].map((t) => (
                    <TitleChoice key={t} text={t} active={title === t} onClick={() => setTitle(t)} />
                  ))}
                </div>

                {/* Form grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FloatingInput label="Given Name / First Name" required />
                  <FloatingInput label="Surname" required />
                  <FloatingInput label="Date of Birth" required />

                  <div className="relative">
                    <Select >
                      <option>Bangladeshi</option>
                      <option>Indian</option>
                      <option>Pakistani</option>
                      <option>Nepalese</option>
                      <option>Sri Lankan</option>
                    </Select>
                    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>

                  <FloatingInput label="Postal Code" />
                </div>

                {/* Contact Info */}
                <div className="mt-5 flex gap-2">
                  <div className="text-[15px] font-semibold text-gray-900">Contact Info</div>
                  <div className="text-[12px] text-gray-500 mt-1">For booking confirmation & updates</div>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <PhoneInput />
                  <FloatingInput label="Email Address" type="email" required />
                </div>

                {/* Frequent Flyer */}
                <div className="mt-5">
                  <div className="text-[13px] font-semibold text-gray-900">
                    Frequent Flyer Program <span className="text-gray-400 font-normal">(Optional)</span>
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
            <div className="mb-3 text-sm font-semibold text-gray-800">Fare Summary</div>

            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <img
                  alt="air"
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Airplane_silhouette.svg"
                  className="h-4 w-4 opacity-70"
                />
                <span className="text-sm font-medium">US Bangla Airlines</span>
              </div>
              <button className="text-xs font-medium text-blue-600 hover:underline">Details</button>
            </div>

            <div className="mb-2 text-sm text-gray-700">
              <span className="font-semibold">DAC</span>
              <span className="mx-1">↔</span>
              <span className="font-semibold">CXB</span>
              <span className="ml-1 text-gray-500">(Round Trip)</span>
              <div className="text-[12px] text-gray-500">21 Sep - 24 Sep</div>
            </div>

            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Air Fare</span>
              <span className="font-medium text-gray-800">BDT 10,398</span>
            </div>

            <div className="mb-2 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                  Offer
                </span>
                <span className="rounded border border-orange-300 bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                  FTFLASH10
                </span>
              </div>
              <span className="font-medium text-red-600">BDT 1,448</span>
            </div>

            <div className="mt-3 rounded-md bg-red-50 px-3 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-600">Total</div>
                  <div className="text-[11px] text-green-600">You Save</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">
                    BDT <span className="text-xl">8,950</span>
                  </div>
                  <div className="text-[11px] text-green-600">1,448 BDT</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom button */}
        <div className="my-6 grid place-items-center">
          <button
            type="button"
            className="w-[340px] rounded-2xl bg-red-700 px-5 py-3 text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
          >
            Save & Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
