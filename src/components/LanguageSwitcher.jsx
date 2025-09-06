import { useState, useEffect } from "react";

const LanguageSwitcher = () => {
  const [selectedLang, setSelectedLang] = useState("en");

  // Google translate combo লোড হওয়ার পর চেক করব
  useEffect(() => {
    const checkTranslate = () => {
      const combo = document.querySelector(
        "#google_translate_element select.goog-te-combo"
      );
      if (!combo) {
        setTimeout(checkTranslate, 500);
      }
    };
    checkTranslate();
  }, []);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);

    const applyTranslate = () => {
      const combo = document.querySelector(
        "#google_translate_element select.goog-te-combo"
      );
      if (!combo) {
        setTimeout(applyTranslate, 500);
        return;
      }
      if (combo.value !== lang) {
        combo.value = lang;
        combo.dispatchEvent(new Event("change"));
      }
    };

    applyTranslate();
  };

  return (
    <div className="relative">
      {/* Hidden Google Translate div */}
      <div id="google_translate_element" className="hidden"></div>

      {/* Custom Dropdown */}
      <select
        value={selectedLang}
        onChange={handleLanguageChange}
        className="px-3 py-2 border border-gray-300 rounded-full bg-white text-gray-700 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
      >
        <option value="en">English</option>
        <option value="bn">বাংলা</option>
        <option value="hi">हिन्दी</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
