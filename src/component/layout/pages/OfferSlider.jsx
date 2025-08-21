import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { HiOutlineArrowRight } from "react-icons/hi";
import book from "../../../assets/book.png";
import book1 from "../../../assets/book1.png";
import book2 from "../../../assets/book2.png";
import book3 from "../../../assets/book3.png";
import { GoArrowUpRight } from "react-icons/go";


export default function OfferSlider() {
  const [offers, setOffers] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetch("/mockDatas.json")
      .then((res) => res.json())
      .then((data) => setOffers(data.offers || []));
  }, []);

  // Filtered data
  const filteredOffers = offers.filter((offer) => {
    if (activeTab === "All") return true;
    if (activeTab === "Flight") return offer.type === "flight";
    if (activeTab === "Hotel") return offer.type === "hotel";
    return true;
  });

  const features = [
    { img: book3, title: "Top Travel App in Bangladesh" },
    { img: book2, title: "Travel With Confidence" },
    { img: book1, title: "Pay The Way You Want" },
    { img: book, title: "Instant Bookings, Anytime, Anywhere" },
  ];

  return (
    <section>
      {/* Feature Section */}
      <div className="max-w-[1240px]  px-5 mx-auto py-4 ">
        <div className="flex flex-wrap  flex-col md:flex-row gap-6  lg:justify-between ">
          {features.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-4 transition">
              <img src={item.img} alt={item.title} className="w-14 h-14" />
              <p className="text-sm font-medium text-gray-800 text-left">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/*  */}


      {/*  */}
      {/* Travel Offers */}
      <div className="py-12 ">
        <div className="max-w-[1240px] mx-auto px-8 relative">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-900  md:text-left ">
              Save Big with Limited-Time Travel Offers
            </h2>

            {/* Tabs */}
            <div className="flex items-center bg-gray-100 rounded-full p-1 w-fit mx-auto md:mx-0">
              {["All", "Flight", "Hotel"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1 text-sm md:text-base font-medium rounded-full transition ${activeTab === tab
                    ? "bg-red-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {tab}
                </button>

              ))}
            </div>
          </div>

          {/* Swiper */}
          <Swiper
            modules={[Navigation, Pagination]}
            loop={true}
            speed={300}
            navigation={{
              nextEl: ".swiper-next-offer",
              prevEl: ".swiper-prev-offer",
            }}
            pagination={{ dynamicBullets: true, clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 16 },
            }}
          >
            {filteredOffers.map((offer) => (
          <SwiperSlide key={offer.id}>
  <div className="py-12">
    <div className="relative group rounded-2xl overflow-hidden shadow-md">
      {/* Image: auto height, full width */}
      <img
        src={offer.image}
        alt={offer.title}
        className="w-full h-[260px] object-fill object-contain"
      />

      {/* Details button */}
      <a
        href="#"
        className="absolute bottom-4 right-4
                   opacity-0 translate-y-2
                   group-hover:opacity-100 group-hover:translate-y-0
                   transition duration-300
                   inline-flex items-center text-white
                   bg-red-600 hover:bg-red-700 font-medium
                   py-2 pl-8 pr-12 rounded-md text-base"
      >
        <span>Details</span>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <GoArrowUpRight size={20} aria-hidden="true" />
        </span>
      </a>
    </div>
  </div>
</SwiperSlide>



            ))}
          </Swiper>

          {/* Navigation Buttons */}



        </div>
      </div>
    </section>
  );
}
