import './App.css'
import Navbar from './components/Shared/navbar'
import Footer from './components/Shared/footer'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/LandingPages/HomePage/Home'
import SearchDesign from './pages/FlightSearch/SearchDesign'
import { useEffect } from 'react'

function App() {

  useEffect(() => {
    // define the callback function globally so Google can find it
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,bn,hi,hr,es,fr,de,zh",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        "google_translate_element"
      );
    };

    // load the script
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);
  }, []);

  return (
    <>

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/searchresult" element={<SearchDesign />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App;
