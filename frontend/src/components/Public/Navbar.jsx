import { useState, useEffect, useRef } from "react";
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

  const navbarRef = useRef(null);

  // ================= FETCH LANGUAGES =================
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

  // ================= APPLY LANGUAGE =================
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

  // ================= CHANGE LANGUAGE =================
  const changeLanguage = (language) => {
    applyLanguage(language);
    setLangOpen(false);
  };

  // ================= ACTIVE LINK =================
  const isActive = (path) => location.pathname === path;

  // ================= OUTSIDE CLICK CLOSE =================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMenuOpen(false);
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ================= CLOSE ON ROUTE CHANGE =================
  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  return (
    <nav
  ref={navbarRef}
  className="
    fixed top-0 z-50 w-full
    bg-white/60 backdrop-blur-2xl
    border-b border-white/30
    shadow-[0_8px_30px_rgb(0,0,0,0.08)]
    transition-all duration-300
  "
>
  <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">

    {/* LOGO */}
    <Link
      to="/"
      className="
        text-2xl font-extrabold tracking-tight shrink-0
        text-transparent bg-clip-text
        bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-600
        drop-shadow-sm
      "
    >
      AabPal
    </Link>

    {/* DESKTOP MENU */}
    <div className="hidden lg:flex items-center gap-6 text-[15px] font-medium">

      {[
        { path: "/", label: t("home") },
        { path: "/our-services", label: t("services") },
        { path: "/faqs", label: t("faqs") },
        { path: "/testimonials", label: t("testimonials") },
        { path: "/our-projects", label: t("projects") },
        { path: "/blogs", label: t("blogs") },
        { path: "/about", label: t("about") },
        { path: "/contact-us", label: t("contact") },
      ].map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`
            relative px-2 py-1 rounded-lg transition-all duration-300

            ${isActive(item.path)
              ? "text-blue-700 font-semibold"
              : "text-gray-700 hover:text-blue-600"
            }

            after:content-[''] after:absolute after:left-0 after:-bottom-1
            after:h-[2px] after:rounded-full after:transition-all after:duration-300

            ${
              isActive(item.path)
                ? "after:w-full after:bg-gradient-to-r after:from-sky-400 after:via-cyan-500 after:to-blue-600"
                : "after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-sky-300 after:to-blue-500"
            }
          `}
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
          className="
            flex items-center gap-2
            bg-white/40 backdrop-blur-xl
            border border-white/40
            px-3 py-2 rounded-xl text-sm
            text-gray-800
            shadow-sm hover:shadow-md
            hover:border-cyan-300
            transition-all
          "
        >
          <FiGlobe />
          {currentLanguage?.language_code?.toUpperCase() || "LANG"}
        </button>

        {langOpen && (
          <div
            className={`
              absolute mt-2 w-48
              bg-white/95 backdrop-blur-2xl
              shadow-2xl rounded-2xl border border-white/40
              overflow-hidden z-50
              ${isRTL ? "left-0" : "right-0"}
            `}
          >
            {languages.map((language) => (
              <div
                key={language.language_id}
                onClick={() => changeLanguage(language)}
                className={`
                  px-4 py-3 cursor-pointer text-sm flex justify-between
                  transition-all hover:bg-cyan-50

                  ${
                    Number(currentLanguage?.language_id) ===
                    Number(language.language_id)
                      ? "bg-cyan-100 text-blue-700 font-semibold"
                      : "text-gray-700"
                  }
                `}
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

      {/* LOGIN */}
      <Link
        to="/login"
        className="
          hidden sm:flex items-center justify-center
          bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600
          hover:from-sky-600 hover:via-cyan-600 hover:to-blue-700
          text-white px-5 py-2 rounded-xl
          text-sm font-medium
          shadow-md hover:shadow-xl
          transition-all duration-300
        "
      >
        {t("login")}
      </Link>

      {/* MOBILE BUTTON */}
      <button
        className="
          lg:hidden p-2 rounded-xl
          bg-white/40 backdrop-blur-xl
          border border-white/40
          hover:shadow-md transition
          text-gray-800
        "
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

    </div>
  </div>

  {/* MOBILE MENU */}
  {menuOpen && (
    <div className="
      lg:hidden border-t
      bg-white/95 backdrop-blur-2xl
      px-4 py-4 space-y-1
      shadow-xl
    ">
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
          className={`
            block px-4 py-3 rounded-xl text-sm font-medium transition

            ${
              isActive(item.path)
                ? "bg-cyan-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          {item.label}
        </Link>
      ))}

      <Link
        to="/login"
        onClick={() => setMenuOpen(false)}
        className="
          block text-center py-3 rounded-xl font-medium mt-3
          bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600
          text-white shadow-md
        "
      >
        {t("login")}
      </Link>
    </div>
  )}
</nav>
  );
}
