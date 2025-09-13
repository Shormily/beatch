import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { Link } from "react-router-dom";
import logo from "../LandingPages/assets/logo.png";
import TATA from "../LandingPages/assets/TATA.png"; // iata/lata
import BASIS from "../LandingPages/assets/BASIS.png";
import CAB from "../LandingPages/assets/CAB.webp";
import DBID from "../LandingPages/assets/DBID.webp";
import pci from "../LandingPages/assets/pci.png";
import pay from "../LandingPages/assets/pay.png";

const Footer = () => {
  return (
    <footer className="bg-[#1d2b36] text-gray-300">
      {/* 🔹 Top Section */}
      <div className="max-w-[1200px] mx-auto  grid gap-10 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4 text-center sm:text-left">
        {/* Logo + Social */}
        <div>
          <Link to={"/"}>
            <img className="h-12 w-auto mx-auto sm:mx-0" src={logo} alt="logo" />
          </Link>
          <p className="py-4 text-[14px] text-white font-murecho">
            Let us be your trusted travel companion every step of the way.
          </p>
          <div className="flex justify-center sm:justify-start flex-wrap gap-2 mt-4">
            {[FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map(
              (Icon, i) => (
                <span
                  key={i}
                  className="bg-black p-3 rounded-full hover:bg-red-500 transition"
                >
                  <Icon size={19} />
                </span>
              )
            )}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-semibold text-[18px] text-white  mb-4 font-murecho">
            Explore
          </h3>
          <ul className="space-y-3 text-[14px] text-white  font-murecho">
            <li className="hover:text-red-700 cursor-pointer" >Flight</li>
            <li className="hover:text-red-700 cursor-pointer" >Hotel</li>
            <li className="hover:text-red-700 cursor-pointer" >Holidays</li>
            <li className="hover:text-red-700 cursor-pointer" >Visa</li>
            <li className="hover:text-red-700 cursor-pointer" >Promotions</li>
            <li className="hover:text-red-700 cursor-pointer" >Business Class</li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-semibold text-[18px] text-white mb-4 font-murecho">
            Useful Links
          </h3>
          <ul className="space-y-3 text-[14px] text-white font-murecho">
            <Link to="/aboutus" className="block hover:text-red-700 cursor-pointer">
    About Us
  </Link>
            <li className="hover:text-red-700 cursor-pointer" >Contact Us</li>
            <li className="hover:text-red-700 cursor-pointer" >Visa Guide & Application</li>
            <li className="hover:text-red-700 cursor-pointer" >Terms & Conditions</li>
            <li className="hover:text-red-700 cursor-pointer" >Privacy Policy</li>
            <li className="hover:text-red-700 cursor-pointer" >Refund & Cancellation</li>
            <li className="hover:text-red-700 cursor-pointer" >Rescheduling Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h3 className="font-semibold text-[18px] text-white mb-4 font-murecho">
            Contact Us
          </h3>
          <p className="text-[14px] text-white font-murecho">
            3rd floor, Sharif Plaza, 39 Kemal Ataturk Avenue, Banani, Dhaka-1213.
          </p>
          <p className="flex items-center justify-center sm:justify-start gap-2 text-[14px] text-white font-murecho">
            <MdPhone /> 09613-131415
          </p>
          <p className="flex items-center justify-center sm:justify-start gap-2 text-[14px] text-white font-murecho">
            <MdEmail /> ask@firsttrip.com
          </p>
          <p className="flex items-center justify-center sm:justify-start gap-2 text-orange-400 cursor-pointer text-[14px] font-murecho">
            <MdLocationOn /> View Map
          </p>
        </div>
      </div>

      {/* 🔹 Middle Section */}
      <div className="bg-[#141C26] py-6 px-6 md:px-10 font-murecho">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
          {/* Authorized & Verified */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-[14px] text-white mb-2">Authorized by</h2>
              <img src={TATA} alt="iata" className="h-12 p-2 rounded-md cursor-pointer" />
            </div>

            <div className="hidden md:block w-px bg-white h-20"></div>

            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-[14px] text-white mb-2">Verified by</h2>
              <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                <img src={BASIS} alt="basis" className="h-10 bg-[#1E293B] p-2 rounded-md cursor-pointer" />
                <img src={CAB} alt="cab" className="h-10 bg-[#1E293B] p-2 rounded-md cursor-pointer" />
                <img src={DBID} alt="dbid" className="h-10 bg-[#1E293B] p-2 rounded-md cursor-pointer" />
                <img src={pci} alt="pci" className="h-10 bg-[#1E293B] p-2 rounded-md cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="mb-2 font-semibold text-white text-[18px] font-murecho">
              Payment Method
            </h2>
            <img src={pay} alt="pay" className="h-10" />
          </div>
        </div>
      </div>

      {/* Gradient Divider */}
      {/* <div className="pt-6">
        <div className="h-[1px] w-full bg-gradient-to-r from-[#999694] via-[#ff3b2d] to-[#999694]"></div>
      </div> */}

      {/* 🔹 Bottom Section */}
      <div className="max-w-[1200px] py-10 text-[14px] text-white font-murecho mx-auto px-6 
flex flex-col md:flex-row items-center gap-4 text-center md:text-left 
justify-center md:justify-between">

        <p>
          © 2025 <span className="text-red-500 font-bold">Firsttrip.</span> All Rights Reserved
        </p>

        <div className="flex gap-6 justify-center md:justify-end">
          <a href="#">EMI Policy</a>
          <a href="#">FAQ’s</a>
        </div>
      </div>


    </footer>

  );
};

export default Footer;
