// src/components/SignUp.jsx
import React from "react";
import login from "../LandingPages/assets/login.svg";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import { Link } from "react-router-dom";
import Explore from "../LandingPages/Explore";

const SignUp = () => {
  return (
    <section
      
    >
      <div
      className="relative min-h-screen  flex items-center justify-center font-murecho bg-cover bg-center"
      style={{ backgroundImage: `url(${login})` }}
      >
 {/* Card */}
      <div className="w-[380px] mx-4 max-w-md rounded-2xl bg-white shadow-2xl p-8 mx-4 md:mr-24">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign up</h2>
        <p className="text-sm text-center text-gray-600 mt-1 mb-6">Create an account</p>

        {/* Email */}
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          placeholder="youremail@email.com"
          className="w-full border text-[12px] border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 mb-4"
        />

        {/* Mobile */}
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Mobile Number
        </label>
        <div className="flex text-[12px] items-center border border-gray-300 rounded-md overflow-hidden">
          <div className="flex items-center gap-2 pl-3 pr-2 bg-gray-50 text-sm text-gray-700">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-600">+880</span>
          </div>
          <input
            type="tel"
            placeholder="XXXX-XXXXXXX"
            className="flex-1 px-3 py-2 outline-none"
          />
        </div>

        {/* Send OTP */}
        <button className="mt-4 w-full bg-red-700 text-[14px] text-white font-normal py-2 rounded-md transition">
          Send OTP
        </button>

        {/* Already have account */}
        <p className="text-center text-sm text-gray-800 mt-4">
                  Already have an account?{" "}
                  <Link to="/sign" className="text-red-600 font-semibold underline">
                   Sign in
                  </Link>
         
           
          
        </p>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-sm text-gray-600">Or Sign up with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social */}
        <div className="flex justify-center gap-4">
          <button className="border border-gray-300 rounded-md p-2">
            <FcGoogle size={22} />
          </button>
          <button className="border border-gray-300 rounded-md p-2 text-blue-600">
            <FaFacebook size={22} />
          </button>
          <button className="border border-gray-300 rounded-md p-2 text-black">
            <FaApple size={22} />
          </button>
        </div>

        {/* Terms */}
        <p className="text-[12px] text-center text-gray-600 mt-5 leading-relaxed">
          By signing up you agree to our{" "}
          <a href="#" className="text-red-600 font-semibold hover:underline">
            Terms &amp; Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-red-600 font-semibold hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>
      </div>
      <Explore/>
     
    </section>
  );
};

export default SignUp;
