import AppsImg from "./assets/AppsImg.png";
import bgPattern from "./assets/bgPattern.png";
import qr from "./assets/qr.png";
import { TfiDownload } from "react-icons/tfi";


const TravelAppSection = () => {
  return (
    <>

      <section
        className="relative w-full bg-slate-50 font-murecho"
      >
        <div
          className="max-w-[1200px] mx-auto bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${bgPattern})`,
            backgroundSize: "contain", // auto instead of 100% auto
            backgroundPosition: "center center",
          }}
        >
          <div className="px-6 pt-16 py-8 lg:px-20 py-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
            {/* Left side (Phones) */}
            <div className=" flex items-center justify-center lg:justify-start gap-6 ">
              <img
                src={AppsImg}
                alt="App Screen 1"
                className="w-96 sm:w-80 md:w-80 lg:w-auto drop-shadow-2xl "
              />
            </div>

            {/* Right side (Content) */}
            <div className="text-center lg:text-left space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Your Ultimate Travel App
              </h2>

              {/* QR + Text Responsive */}
              <div className="flex flex-col lg:flex-row items-center lg:items-center gap-6">
                {/* QR Code */}
                <div className="flex justify-center lg:justify-start">
                  <img src={qr} alt="QR Code" className="w-28 sm:w-36" />
                </div>

                {/* Texts */}
                <div className="text-center lg:text-left">
                  <p className="text-gray-600 max-w-md">
                    With our app, our finest deals are always right at your fingertips.
                    Book in just a few clicks and get offers on your upcoming travel.
                  </p>
                  <p className="text-red-600 font-medium">*T&amp;C Apply</p>
                </div>
              </div>



              {/* Button */}
              <button className="mt-4 inline-flex items-center font-semibold gap-2 bg-black text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition">
                <p className="bg-gray-700 p-3 font-bold rounded-full ">
                  <TfiDownload size={15} />
                </p>
                Download App
              </button>
            </div>

          </div>


        </div>

      </section>


    </>
  );
};

export default TravelAppSection;