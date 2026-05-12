import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { getLanguages } from "../../services/websiteLanguage.service";

export default function PublicNavbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(null);

  const isRTL = currentLanguage?.language_direction?.toUpperCase() === "RTL";

  // Fetch languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await getLanguages();
        const list = Array.isArray(res?.data) ? res.data : [];
        setLanguages(list);

        const savedLanguageId = localStorage.getItem("language_id");
        let selectedLanguage = savedLanguageId
          ? list.find((l) => Number(l.language_id) === Number(savedLanguageId))
          : list[0];

        if (selectedLanguage) applyLanguage(selectedLanguage);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLanguages();
  }, []);

  const applyLanguage = async (langObj) => {
    if (!langObj) return;
    const dir = langObj.language_direction?.toLowerCase() || "ltr";
    await i18n.changeLanguage(langObj.language_code);
    document.documentElement.dir = dir;

    setCurrentLanguage(langObj);
    localStorage.setItem("language_id", langObj.language_id);
    localStorage.setItem("language_direction", langObj.language_direction);
    localStorage.setItem("language_name", langObj.language_name);
    localStorage.setItem("lang", langObj.language_code);
  };

  const changeLanguage = (language) => {
    applyLanguage(language);
    setLangOpen(false);
  };

  // Active link helper
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm w-full">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight shrink-0">
          AabPal
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-6 text-[15px] font-medium">
          {[
            { path: "/", label: t("home") },
            { path: "/our-services", label: t("services") },
            { path: "/our-team", label: t("ourTeam") },
            { path: "/faqs", label: t("faqs") },
            { path: "/privacy-policy", label: t("privacy") },
            { path: "/terms-and-conditions", label: t("terms") },
            { path: "/testimonials", label: t("testimonials") },
            { path: "/our-projects", label: t("projects") },
            { path: "/blogs", label: t("blogs") },
            { path: "/about", label: t("about") },
            { path: "/contact-us", label: t("contact") },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition px-2 py-1 rounded ${
                isActive(item.path) ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* LANGUAGE */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-xl text-sm hover:border-blue-400 hover:text-blue-600 transition"
            >
              <FiGlobe />
              {currentLanguage?.language_code?.toUpperCase() || "LANG"}
            </button>

            {langOpen && (
              <div
                className={`absolute mt-2 w-48 bg-white shadow-xl rounded-2xl border overflow-hidden z-50 ${
                  isRTL ? "left-0" : "right-0"
                }`}
              >
                {languages.map((language) => (
                  <div
                    key={language.language_id}
                    onClick={() => changeLanguage(language)}
                    className={`px-4 py-3 cursor-pointer text-sm flex justify-between items-center transition hover:bg-gray-100 ${
                      Number(currentLanguage?.language_id) === Number(language.language_id)
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    <span>{language.language_name}</span>
                    <span className="text-xs text-gray-400">{language.language_code?.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LOGIN */}
          <Link
            to="/login"
            className="hidden sm:flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
          >
            {t("login")}
          </Link>

          {/* MOBILE BUTTON */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden border-t bg-white px-4 py-4 space-y-1 shadow-md">
          {[
            { path: "/", label: t("home") },
            { path: "/our-services", label: t("services") },
            { path: "/our-team", label: t("ourTeam") },
            { path: "/faqs", label: t("faqs") },
            { path: "/privacy-policy", label: t("privacy") },
            { path: "/terms-and-conditions", label: t("terms") },
            { path: "/testimonials", label: t("testimonials") },
            { path: "/our-projects", label: t("projects") },
            { path: "/blogs", label: t("blogs") },
            { path: "/about", label: t("about") },
            { path: "/contact-us", label: t("contact") },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl transition text-sm font-medium ${
                isActive(item.path) ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-xl font-medium mt-3"
          >
            {t("login")}
          </Link>
        </div>
      )}
    </nav>
  );
}