// src/components/Sign.jsx
import React, { useState } from "react";
import login from "../LandingPages/assets/login.svg";
import email from "../LandingPages/assets/email.png";
import lock from "../LandingPages/assets/lock.png";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple, FaLock, FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import Explore from "../LandingPages/Explore";

const Sign = () => {
  const [mode, setMode] = useState("choose"); // "choose" | "email" | "mobile"

  return (
    <section
     
    >
      <div  className="relative flex min-h-screen items-center justify-center bg-cover bg-center font-murecho"
      style={{ backgroundImage: `url(${login})` }}>
{/* Login card */}
      <div className="w-[350px] max-w-md rounded-2xl bg-white shadow-2xl p-8 mx-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Sign In
        </h2>
        <p className="text-sm text-center mb-6">Sign in to your account</p>

        {/* STEP 1: Choose Email or Mobile */}
        {mode === "choose" && (
          <>
            {/* Email button */}
            <button
              onClick={() => setMode("email")}
              className="w-full flex items-center justify-center gap-2 bg-red-700 text-white py-2 px-4 rounded-md cursor-pointer transition mb-4"
            >
              <img src={email} alt="email" className="w-4 h-4" />
              <span>Email Address</span>
            </button>

            {/* Mobile button */}
            <button
              onClick={() => setMode("mobile")}
              className="w-full cursor-pointer flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition"
            >
              <img src="/asset/Call.png"
              
              className="w-4 h-4" />
              <span>Mobile Number</span>
            </button>
          </>
        )}

        {/* STEP 2: Email flow */}
        {mode === "email" && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              placeholder="Write your email"
              className="w-full border text-[12px] border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />

            <button className="w-full text-[13px] flex items-center justify-center gap-2 bg-red-700 text-white py-2 rounded-md hover:bg-red-500 transition">
               <img src={lock} alt="mobile" className="w-4 h-4" />
              <span>Sign In with Password</span>
            </button>

            <button className="w-full mt-3 border text-[14px] border-gray-300 rounded-md py-2 hover:bg-gray-50 transition">
              Send OTP
            </button>

            {/* Back */}
            <button
              onClick={() => setMode("choose")}
              className="mt-4 mx-auto flex items-center gap-2 text-sm text-red-600 hover:underline"
            >
              <FaChevronLeft className="text-[12px]" />
              Back
            </button>
          </>
        )}

        {/* STEP 3: Mobile flow */}
        {mode === "mobile" && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>

            <div className="w-full flex items-center border border-gray-300 rounded-md overflow-hidden mb-4">
              <div className="flex items-center gap-2 pl-3 pr-2 text-sm text-gray-700 bg-gray-50">
                <span aria-hidden>🇧🇩</span>
                <span className="text-gray-500">+880</span>
              </div>
              <input
                type="tel"
                placeholder="xxxx-xxxxxxx"
                className="flex-1 px-3 py-2 outline-none"
              />
            </div>

            <button className="w-full text-sm flex items-center justify-center gap-2 bg-red-700 text-white py-2 rounded-md  transition">
              <img src={lock} alt="mobile" className="w-4 h-4" />
              <span>Sign In with Password</span>
            </button>

            <button className="w-full mt-3 text-[14px] border border-gray-300 rounded-md py-2 hover:bg-gray-50 transition">
              Send OTP
            </button>

            {/* Back */}
            <button
              onClick={() => setMode("choose")}
              className="mt-4 mx-auto flex items-center gap-2 text-sm text-red-600 hover:underline"
            >
              <FaChevronLeft className="text-[12px]" />
              Back
            </button>
          </>
        )}

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-sm">Or Sign In with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button className="border p-2 rounded-md border-gray-300">
            <FcGoogle size={24} />
          </button>
          <button className="border p-2 rounded-md border-gray-300 text-blue-600">
            <FaFacebook size={24} />
          </button>
          <button className="border p-2 rounded-md border-gray-300 text-black">
            <FaApple size={24} />
          </button>
        </div>
        {/* Sign Up */}
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-red-600 font-semibold underline">
         Sign up!
          </Link>
        </p>
      </div>
      </div>
    <Explore/>


      
    </section>
  );
};

export default Sign;
