// src/pages/Traveller/TravellerSelect.jsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

// utils
const stableStringify = (obj) => JSON.stringify(obj);
const deepEqual = (a, b) => stableStringify(a) === stableStringify(b);

export default function TravellerSelect({
  onChange,
  initialValue, // { adults, children, infants, childAges, travelClass }
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // ---- local state ----
  const [adults, setAdults] = useState(() => initialValue?.adults ?? 1);
  const [children, setChildren] = useState(() => initialValue?.children ?? 0);
  const [infants, setInfants] = useState(() => initialValue?.infants ?? 0);
  const [childAges, setChildAges] = useState(
    () => initialValue?.childAges ?? []
  );
  const [travelClass, setTravelClass] = useState(
    () => initialValue?.travelClass ?? "Economy"
  );

  // guarded sync-from-props (prevents loops/freezes)
  useEffect(() => {
    const nextFromProps = {
      adults: initialValue?.adults ?? 1,
      children: initialValue?.children ?? 0,
      infants: initialValue?.infants ?? 0,
      childAges: initialValue?.childAges ?? [],
      travelClass: initialValue?.travelClass ?? "Economy",
    };
    const curLocal = { adults, children, infants, childAges, travelClass };
    if (!deepEqual(curLocal, nextFromProps)) {
      setAdults(nextFromProps.adults);
      setChildren(nextFromProps.children);
      setInfants(nextFromProps.infants);
      setChildAges(nextFromProps.childAges);
      setTravelClass(nextFromProps.travelClass);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialValue?.adults,
    initialValue?.children,
    initialValue?.infants,
    stableStringify(initialValue?.childAges ?? []),
    initialValue?.travelClass,
  ]);

  // click outside to close
  useEffect(() => {
    const handleClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  // emit to parent ONLY when local values change
  const latestOnChange = useRef(onChange);
  useEffect(() => {
    latestOnChange.current = onChange;
  }, [onChange]);

  const prevSnapRef = useRef("");
  useEffect(() => {
    const payload = { adults, children, infants, childAges, travelClass };
    const snap = stableStringify(payload);
    if (snap !== prevSnapRef.current) {
      prevSnapRef.current = snap;
      latestOnChange.current?.(payload);
    }
  }, [adults, children, infants, childAges, travelClass]);

  const totalTravellers = adults + children + infants;
  const summary = `${totalTravellers} Traveller${
    totalTravellers > 1 ? "s" : ""
  }`;

  const handleChildAgeChange = (index, value) => {
    const newAges = [...childAges];
    newAges[index] = value;
    setChildAges(newAges);
  };

  return (
    <div className="relative" ref={boxRef} aria-disabled={disabled}>
      {/* Trigger */}
      <div
        className={`lg:basis-[20%] min-w-[180px] h-20 border border-gray-300 rounded-md px-4 pt-2 pb-1 flex flex-col justify-between bg-white ${
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span className="text-[12px] text-gray-500">Traveller, Class</span>
        <div>
          <p className="font-semibold leading-4 pb-2">{summary}</p>
          <p className="text-[12px] text-gray-500">{travelClass}</p>
        </div>
      </div>

      {open && !disabled && (
        <div className="absolute top-full left-0 mt-2 w-[260px] bg-white shadow-xl rounded-xl z-50 p-4">
          {/* Adults */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-[14px]">Adult</p>
              <p className="text-xs text-gray-500">12 years and above</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="w-4 h-4 flex items-center justify-center border rounded-full text-red-600"
                onClick={() => setAdults(Math.max(1, adults - 1))}
              >
                <FaMinus size={8} />
              </button>
              <span>{adults}</span>
              <button
                className="w-4 h-4 flex items-center justify-center border rounded-full text-red-600"
                onClick={() => setAdults(adults + 1)}
              >
                <FaPlus size={8} />
              </button>
            </div>
          </div>

          {/* Children + Ages */}
          <div className="flex flex-col py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[14px]">Children</p>
                <p className="text-xs text-gray-500">
                  2 years - under 12 years
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="w-4 h-4 flex items-center justify-center border rounded-full text-red-600"
                  onClick={() => {
                    setChildren(Math.max(0, children - 1));
                    setChildAges((prev) => prev.slice(0, -1));
                  }}
                >
                  <FaMinus size={8} />
                </button>
                <span>{children}</span>
                <button
                  className="w-4 h-4 flex items-center justify-center border rounded-full text-red-600"
                  onClick={() => {
                    setChildren(children + 1);
                    setChildAges((prev) => [...prev, ""]);
                  }}
                >
                  <FaPlus size={8} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: children }).map((_, index) => (
                <div key={index}>
                  <span className="text-[12px] font-medium block mb-1">
                    Child {index + 1} Age
                  </span>
                  <select
                    value={childAges[index] || ""}
                    onChange={(e) =>
                      handleChildAgeChange(index, e.target.value)
                    }
                    className="border rounded-sm px-1 text-[12px] w-18"
                  >
                    <option value="">Choose</option>
                    {Array.from({ length: 11 }).map((_, i) => (
                      <option key={i + 2} value={i + 2}>
                        {i + 2}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-[14px]">Infants</p>
              <p className="text-xs text-gray-500">Below 2 years</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="w-4 h-4 flex items-center justify-center border rounded-full text-red-600"
                onClick={() => setInfants(Math.max(0, infants - 1))}
              >
                <FaMinus size={8} />
              </button>
              <span>{infants}</span>
              <button
                className="w-4 h-4 flex items-center justify-center border rounded-full text-red-600"
                onClick={() => setInfants(infants + 1)}
              >
                <FaPlus size={8} />
              </button>
            </div>
          </div>

          {/* Booking Class (fixed 4 labels for UI) */}
          <div>
            <p className="font-medium mb-2 text-[14px]">Booking Class</p>
            <hr className="text-gray-200 py-1" />
            <div className="flex flex-col gap-2 text-[14px]">
              {["Economy", "Premium Economy", "Business", "First"].map(
                (cls) => (
                  <label
                    key={cls}
                    className="flex items-center gap-2 cursor-pointer accent-red-600"
                  >
                    <input
                      type="radio"
                      name="travelClass"
                      value={cls}
                      checked={travelClass === cls}
                      onChange={() => setTravelClass(cls)}
                    />
                    <span>{cls}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
