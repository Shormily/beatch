// src/components/AboutPart1.jsx
import React from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { LuPlane } from "react-icons/lu";
import We from "../LandingPages/assets/We.webp";

const Bullet = ({ children }) => (
  <li className="flex gap-3">
    <BsCheckCircleFill className="mt-1 h-4 w-4 text-gray-900 shrink-0" />
    <span className="text-sm sm:text-[15px] leading-7 text-gray-700">{children}</span>
  </li>
);

const AboutPart1 = () => {
  return (
    <section className="bg-gray-100 py-4">
      <div className="font-murecho flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
        {/* LEFT: image */}
        <div className="relative md:basis-[52%] lg:basis-[55%]">
          <div className="relative w-full">
            <img src={We} alt="Scenic seaside" className="h-[70vh] w-auto max-w-full block" loading="lazy" />
          </div>
        </div>

        {/* RIGHT: text */}
        <div className="md:basis-[48%] lg:basis-[45%] md:pt-0 md:m-0 md:self-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Why We Exist</h2>
          <p className="mt-4 text-[15px] leading-7 text-gray-700">
            As the booming travel industry takes revolutionary turns, it is expected to become unrecognizable in the
            upcoming years. To move forward with this progress and bring unmatchable experiences to your fingertips, a
            huge part of our mission is to create a global brand cultivating right here in our home country. We are
            setting goals for advancing our network and expanding the range of travel activities to the extent like
            never before. We exist to:
          </p>
          <ul className="mt-6 space-y-4">
            <Bullet><span className="font-semibold text-gray-900">Create Unforgettable Experience:</span> Create memorable experiences with your loved ones like it’s your first trip with them.</Bullet>
            <Bullet><span className="font-semibold text-gray-900">Ensure Easy Planning:</span> Make your planning process just as comfortable as your planned trip!</Bullet>
            <Bullet><span className="font-semibold text-gray-900">Build Reliable Processes:</span> Your trust is our source of motivation. Firststrip is here to ensure that you have a safe and trustworthy relationship with your travel planners.</Bullet>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutPart1;
