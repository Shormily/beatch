import { HiOutlineArrowRight } from "react-icons/hi";
import getStarted from "./assets/getStarted.webp";

const Explore = () => {
  return (
   <section
  className="relative min-h-[400px] flex items-center bg-cover bg-center font-murecho"
  style={{ backgroundImage: `url(${getStarted})` }}
>
  <div className="absolute inset-0" />

  <div className="w-full max-w-[1300px] m-auto">
    <div className="relative z-10 text-white px-4 sm:px-8 md:px-12 lg:px-20 max-w-[1200px] text-center md:text-left">
      <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-snug">
        Start Exploring the World with Us!
      </h1>

      {/* Button (center on md, left on lg+) */}
      <div className="flex justify-center md:justify-start">
        <a
          href="#"
          className="group relative inline-flex items-center bg-white text-black 
                     hover:bg-red-700 hover:text-white font-medium
                     py-3 pl-6 pr-12 rounded-full mt-5 shadow-lg
                     text-base sm:text-md "
        >
          <span>Get Started</span>

          {/* Icon */}
          <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 inline-flex w-5 h-5">
            <HiOutlineArrowRight
              className="transition-transform duration-200 ease-linear
                         group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:-rotate-45"
              size={20}
              aria-hidden="true"
            />
          </span>
        </a>
      </div>
    </div>
  </div>
</section>

  );
};

export default Explore;
