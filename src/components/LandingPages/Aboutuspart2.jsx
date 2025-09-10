// src/components/StarterKit.jsx
import React from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { LuPlane } from "react-icons/lu";

// <-- Replace with your actual image
import aboutright from "../LandingPages/assets/aboutright.webp";

const PictureItem = ({ title, children }) => (
  <li className="flex items-start gap-4">
    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
      <BsCheckCircleFill className="h-4 w-4" />
    </div>
    <p className="text-[15px] leading-7 text-gray-700">
      <span className="font-semibold text-gray-900">{title}</span> {children}
    </p>
  </li>
);

export default function Aboutuspart2() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-14">

        {/* LEFT: Text */}
        <div className="order-2 lg:order-1">
          <h2 className="text-4xl  font-bold text-gray-900">
            Firsttrip Starter Kit
          </h2>

          <p className="mt-4 text-[15px] leading-7  max-w-2xl">
            We are a closely-knit team striving with one vision: revolutionizing
            the long-standing traditional tourism industry.
          </p>

          <ul className="mt-8 space-y-6">
            <PictureItem title="Smart, Fun & Innovative Culture:">
              The future is online, the present is online, and it’s time to
              redefine the tech-driven organization structure and bring smart,
              innovative solutions to rising challenges with our current lot of
              highly energized members.
            </PictureItem>

            <PictureItem title="Be-The-Change-You Want-To-See Approach">
              Taking leadership and thinking out of the box is our core
              approach. From shaking and moving things around, the only aim that
              we strive for is prospering through teamwork and simply enjoying
              what we do.
            </PictureItem>
          </ul>
        </div>

        {/* RIGHT: Image with rounded-left + plane path */}
        <div className="order-1 lg:order-2 relative">
          {/* Plane + dotted arc */}
         

          {/* Image wrapper */}
          <div className="relative ml-auto w-full max-w-[760px]">
            <div className="">
              <img
                src={aboutright}
                alt="Firsttrip office"
                className=""
                loading="lazy"
              />
            </div>

            {/* Soft inner arc accents on the curved left edge */}
            <span className="pointer-events-none absolute left-[-14px] top-[8%] h-[84%] w-[14px] rounded-full bg-white/70" />
            <span className="pointer-events-none absolute left-[-28px] top-[12%] h-[76%] w-[14px] rounded-full bg-purple-100/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
