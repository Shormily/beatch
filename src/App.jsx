import "./App.css";
import Navbar from "./components/Shared/navbar";
import Footer from "./components/Shared/footer";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/LandingPages/HomePage/Home";
import SearchDesign from "./pages/FlightSearch/SearchDesign";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchToken } from "./redux/slices/authSlice";

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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
