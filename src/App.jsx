import "./App.css";
import Navbar from "./components/Shared/navbar";
import Footer from "./components/Shared/footer";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/LandingPages/HomePage/index";
import SearchDesign from "./pages/FlightSearch/SearchDesign";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchToken } from "./redux/slices/authSlice";
import AboutUs from "./pages/LandingPages/AboutUS/AboutUs";
import Sign from "./components/Auth/sign";
import SignUp from "./components/Auth/signup";
import FlightBooking from "./components/Bookings/FlightBooking";
import FareModalDemo from "./components/FlightSearch/FareModal";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchToken());
  }, [dispatch]);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/searchresult" element={<SearchDesign />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/fare" element={<FlightBooking />} />
        <Route path="/modal" element={<FareModalDemo />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
