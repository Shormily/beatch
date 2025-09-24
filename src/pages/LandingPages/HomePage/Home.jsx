import AirlineAlliances from "../../../components/LandingPages/AirlineAlliances";
import DestinationSlider from "../../../components/LandingPages/DestinationSlider";
import Explore from "../../../components/LandingPages/Explore";
import FlightTrackerCard from "../../../components/LandingPages/FlightTrackerCard";
import HeroSection from "../../../components/LandingPages/HeroSection";
import OfferSlider from "../../../components/LandingPages/OfferSlider";
import TravelAppSection from "../../../components/LandingPages/TravelAppSection";

const Home = () => {
  return (
    <>
      <div className="font-murecho">
        <div className="bg-gradient-to-b from-gray-100 to-white">
          <HeroSection />
          <OfferSlider />
        </div>
        <FlightTrackerCard />
        <DestinationSlider />
        <AirlineAlliances />
        <TravelAppSection />
        <Explore />
      </div>
    </>
  );
};

export default Home;
