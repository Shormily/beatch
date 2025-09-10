import './App.css'
import Navbar from './components/Shared/navbar'
import Footer from './components/Shared/footer'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/LandingPages/HomePage/Home'
import SearchDesign from './pages/FlightSearch/SearchDesign'
import { useEffect } from 'react'
import AboutUs from './pages/LandingPages/AboutUS/AboutUs'


function App() {

  useEffect(() => {
    // 🟢 প্রথমবার অ্যাপ লোড হলে টোকেন ফেচ করে localStorage এ সেভ করবে
    const loadToken = async () => {
      try {
        const res = await fetch("https://ota-api.a4aero.com/api/auth/app/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appSecrate: import.meta.env.VITE_APP_SECRET // ⚠️ Vercel এ env var সেট করুন
          })
        });

        const data = await res.json();
        if (data?.token) {
          localStorage.setItem("auth_token", data.token);
          if (data?.expire) {
            localStorage.setItem("auth_token_expire", data.expire);
          }
          console.log("✅ Token saved:", data.token);
        } else {
          console.error("❌ Token fetch failed:", data);
        }
      } catch (err) {
        console.error("❌ Error fetching token:", err);
      }
    };

    loadToken();
  }, []);

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
  )
}

export default App;
