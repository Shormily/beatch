import video2 from "../../../assets/video2.mp4";

export default function FlightTrackerCard() {
  return (
    <section className="max-w-[1240px] m-auto my-10 px-8">
  <div className="bg-slate-50 rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between md:gap-8 lg:gap-54">
    {/* Left Content */}
    <div className="flex-1 text-left order-2 md:order-1 mb-6 md:mb-0">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
        Flight Tracking Made Easy
      </h2>
      <p className="mt-2 text-gray-600 text-sm md:text-base">
        With Firsttrip, tracking your flight is a breeze!
        <br />
        Stay updated on your flights effortlessly using our handy flight tracker.
      </p>

      <button className="mt-5 inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-red-700 transition">
        Open Flight Tracker
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    {/* Right Content (Video) */}
    <div className="flex-1 relative rounded-xl overflow-hidden order-1 md:order-2 flex justify-start md:justify-end">
      <video
        className="w-52 h-52 object-cover rounded-xl"
        src={video2}
        autoPlay
        loop
        muted
      />
    </div>
  </div>
</section>

  );
}
