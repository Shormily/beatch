// src/components/Navbar.jsx
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaBoxesPacking } from "react-icons/fa6";
import { BsSearch } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { LuMessageSquareText } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";

import navlogo from "../../assets/navlogo.png";
import Noti from "../../assets/Noti.png";
import Flight from "../../assets/Flight.png";
import Hotel from "../../assets/Hotel.png";
import Business from "../../assets/Business.png";
import Promotions from "../../assets/Promotions.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Flight", icon: Flight },
    { to: "/hotel", label: "Hotel", icon: Hotel },
    { to: "/promotions", label: "Promotions", icon: Promotions },
    { to: "/business", label: "Business Class", icon: Business },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white shadow sticky top-0 z-50 py-2 text-[14px] font-murecho">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left side (Toggle + Logo) */}
            <div className="flex items-center gap-3">
              {/* Mobile Toggle Button */}
              <button
                className="md:hidden text-2xl "
                onClick={() => setOpen(!open)}
              >
                {open ? <FaBars /> : <FaBars />}
              </button>

              {/* Logo */}
              <Link to={"/"}>
                <img className="h-12 w-auto" src={navlogo} alt="logo" />
              </Link>
            </div>

            {/* Menu Items (Desktop) */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`relative flex flex-col items-center group ${
                      isActive
                        ? "text-gray-800 font-semibold"
                        : "text-black"
                    }`}
                  >
                    <img className="h-7 w-auto mb-1" src={item.icon} alt="" />
                    {/* Gradient only for Business Class */}
                    {item.label === "Business Class" ? (
                      <span className="bg-gradient-to-r from-teal-900 to-teal-400 bg-clip-text text-transparent font-semibold">
                        {item.label}
                      </span>
                    ) : (
                      item.label
                    )}

                    {/* Animated underline */}
                    <span
                      className={`absolute -bottom-1 left-1/2 h-[2px] bg-red-500 transition-all duration-300 transform -translate-x-1/2
                        ${
                          isActive
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }
                      `}
                    />
                  </NavLink>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Desktop: Sign In / Sign Up */}
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/signin"
                  className="px-5 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile: Noti image */}
              <div className="md:hidden">
                <img className="h-6 w-auto" src={Noti} alt="noti" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 ">
            <img className="h-10" src={navlogo} alt="logo" />
            <button onClick={() => setOpen(false)}>
              <RxCross1 className="text-xl" />
            </button>
          </div>

          <div className="flex flex-col p-4 space-y-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 ${
                    item.label === "Business Class"
                      ? "bg-gradient-to-r from-teal-900 to-teal-400 bg-clip-text text-transparent font-semibold"
                      : isActive
                      ? "text-red-500 font-semibold"
                      : "text-black"
                  }`
                }
              >
                <img className="h-7 w-auto" src={item.icon} alt="" />
                {item.label}
              </NavLink>
            ))}

            {/* Mobile Buttons */}
            <div className="flex flex-col gap-3 pt-6">
              <Link
                to="/signin"
                className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-full text-center hover:bg-red-500 hover:text-white transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="w-full px-4 py-2 bg-red-500 text-white rounded-full text-center hover:bg-red-600 transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-[#2B2D31] shadow-[0_-6px_16px_rgba(0,0,0,0.25)] p-2">
        <div className="grid grid-cols-4 gap-2 items-stretch">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center justify-center h-12 transition-all ${
                isActive
                  ? "bg-[#7A1C1C] text-white"
                  : "text-white/70 hover:text-white"
              }`
            }
            aria-label="Flight"
          >
            <FaBoxesPacking size={22} />
          </NavLink>

          <NavLink
            to="/hotel"
            className={({ isActive }) =>
              `flex items-center justify-center h-12 transition-all ${
                isActive
                  ? "bg-[#7A1C1C] text-white"
                  : "text-white/70 hover:text-white"
              }`
            }
            aria-label="Hotel"
          >
            <BsSearch size={22} />
          </NavLink>

          <NavLink
            to="/promotions"
            className={({ isActive }) =>
              `flex items-center justify-center h-12 transition-all ${
                isActive
                  ? "bg-[#7A1C1C] text-white"
                  : "text-white/70 hover:text-white"
              }`
            }
            aria-label="Promotions"
          >
            <CgProfile size={22} />
          </NavLink>

          <NavLink
            to="/business"
            className={({ isActive }) =>
              `flex items-center justify-center h-12 transition-all ${
                isActive
                  ? "bg-[#7A1C1C] text-white"
                  : "text-white/70 hover:text-white"
              }`
            }
            aria-label="Business"
          >
            <LuMessageSquareText size={22} />
          </NavLink>
        </div>
      </div>
    </>
  );
}
