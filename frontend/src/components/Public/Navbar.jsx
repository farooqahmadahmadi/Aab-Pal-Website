import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { getLanguages } from "../../services/websiteLanguage.service";

export default function PublicNavbar() {
  const { i18n, t } = useTranslation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(null);

  // ================= RTL =================
  const isRTL = currentLanguage?.language_direction?.toUpperCase() === "RTL";

  // ================= FETCH LANGUAGES =================
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await getLanguages();

        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];

        setLanguages(list);

        // ================= RESTORE SAVED LANGUAGE =================
        const savedLanguageId = localStorage.getItem("language_id");

        let selectedLanguage = null;

        // first try by language_id
        if (savedLanguageId) {
          selectedLanguage = list.find(
            (l) => Number(l.language_id) === Number(savedLanguageId),
          );
        }

        // fallback first language
        if (!selectedLanguage && list.length > 0) {
          selectedLanguage = list[0];
        }

        if (selectedLanguage) {
          applyLanguage(selectedLanguage);
        }
      } catch (err) {
        console.error("Language fetch failed:", err);
      }
    };

    fetchLanguages();
  }, []);

  // ================= APPLY LANGUAGE =================
  const applyLanguage = async (langObj) => {
    try {
      if (!langObj) return;

      const lng = langObj.language_code;
      const dir = langObj.language_direction?.toLowerCase() || "ltr";

      // react-i18next (ONLY for static texts)
      await i18n.changeLanguage(lng);

      // save full DB language info
      localStorage.setItem("lang", lng);
      localStorage.setItem("language_id", langObj.language_id);
      localStorage.setItem("language_direction", langObj.language_direction);
      localStorage.setItem("language_name", langObj.language_name);

      // html settings
      document.documentElement.lang = lng;
      document.documentElement.dir = dir;

      // current selected language
      setCurrentLanguage(langObj);

      // global refresh event for pages
      window.dispatchEvent(
        new CustomEvent("languageChanged", {
          detail: langObj,
        }),
      );
    } catch (err) {
      console.error("Apply language error:", err);
    }
  };

  // ================= CHANGE LANGUAGE =================
  const changeLanguage = async (language) => {
    await applyLanguage(language);

    setLangOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm w-svw">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* ================= LOGO ================= */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          AabPal
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-blue-600">
            {t("home")}
          </Link>

          <Link to="/services" className="hover:text-blue-600">
            {t("services")}
          </Link>

          <Link to="/faqs" className="hover:text-blue-600">
            {t("faqs")}
          </Link>

          <Link to="/privacy-policy" className="hover:text-blue-600">
            {t("privacy")}
          </Link>

          <Link to="/terms-and-conditions" className="hover:text-blue-600">
            {t("terms")}
          </Link>

 <Link to="/testimonials" className="hover:text-blue-600">
            {t("testimonials")}
          </Link>

          <Link to="/projects" className="hover:text-blue-600">
            {t("projects")}
          </Link>

          <Link to="/blogs" className="hover:text-blue-600">
            {t("blogs")}
          </Link>

          <Link to="/about" className="hover:text-blue-600">
            {t("about")}
          </Link>

          <Link to="/contact" className="hover:text-blue-600">
            {t("contact")}
          </Link>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-3">
          {/* ================= LANGUAGE ================= */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-sm hover:text-blue-600 transition"
            >
              <FiGlobe />

              {currentLanguage?.language_code?.toUpperCase() || "LANG"}
            </button>

            {langOpen && (
              <div
                className={`absolute mt-2 w-44 bg-white shadow rounded border z-50 overflow-hidden ${
                  isRTL ? "left-0" : "right-0"
                }`}
              >
                {languages.map((language) => (
                  <div
                    key={language.language_id}
                    onClick={() => changeLanguage(language)}
                    className={`px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between items-center transition ${
                      Number(currentLanguage?.language_id) ===
                      Number(language.language_id)
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : ""
                    }`}
                  >
                    <span>{language.language_name}</span>

                    <span className="text-xs text-gray-400">
                      {language.language_code?.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= LOGIN ================= */}
          <Link
            to="/login"
            className="hidden sm:block bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm transition"
          >
            {t("login")}
          </Link>

          {/* ================= MOBILE BUTTON ================= */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3 text-sm">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            {t("home")}
          </Link>

          <Link to="/services" onClick={() => setMenuOpen(false)}>
            {t("services")}
          </Link>

          <Link to="/faqs" onClick={() => setMenuOpen(false)}>
            {t("faqs")}
          </Link>

          <Link to="/privacy-policy" onClick={() => setMenuOpen(false)}>
            {t("privacy")}
          </Link>

          <Link to="/projects" onClick={() => setMenuOpen(false)}>
            {t("projects")}
          </Link>

          <Link to="/blogs" onClick={() => setMenuOpen(false)}>
            {t("blogs")}
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)}>
            {t("about")}
          </Link>

          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            {t("contact")}
          </Link>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block bg-blue-500 text-white text-center py-2 rounded"
          >
            {t("login")}
          </Link>
        </div>
      )}
    </nav>
  );
}
