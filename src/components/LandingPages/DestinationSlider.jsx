import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import next from "./assets/next.png";
import prev from "./assets/prev.png";

export default function DestinationSlider() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetch("/mockData.json")
      .then((res) => res.json())
      .then((data) => setDestinations(data));
  }, []);

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-[1240px] mx-auto px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Popular Destinations
        </h2>

        {/* Wrapper to keep arrows inside */}
      <div className="relative">
  <Swiper
    modules={[Navigation]}
    loop={true}
    speed={300}
    effect="slide"
    navigation={{
      nextEl: ".swiper-next",
      prevEl: ".swiper-prev",
    }}
    breakpoints={{
      0: { slidesPerView: 1, spaceBetween: 16 },
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 3, spaceBetween: 24 },
      1024: { slidesPerView: 4, spaceBetween: 28 },
    }}
  >
    {destinations.map((dest) => (
      <SwiperSlide key={dest.id}>
        <div
          
          className="relative h-[430px]  w-full rounded-2xl overflow-hidden shadow-lg group"
        >
          {/* Image (responsive height, always show full) */}
          <img
            src={dest.image}
            alt={dest.name}
            
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent"></div>

          {/* Text */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{dest.name}</h3>
            <p className="text-xs sm:text-sm md:text-base">{dest.price}</p>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  {/* Arrows (now always visible on all screens) */}
  {/* Prev Button */}
  <button
    className="swiper-prev absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-6 
               bg-white w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 
               flex items-center justify-center rounded-full shadow-md 
               hover:scale-110 transition z-20"
  >
    <img src={prev} alt="prev" className="h-4" />
  </button>

  {/* Next Button */}
  <button
    className="swiper-next absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-6 
               bg-white w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 
               flex items-center justify-center rounded-full shadow-md 
               hover:scale-110 transition z-20"
  >
    <img src={next} alt="next" className="h-4" />
  </button>
</div>


       
      </div>
    </section>
  );
}
