import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function PublicNavbar() {
  const { i18n, t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isRTL = ["fa", "ps"].includes(i18n.language);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);

    document.documentElement.dir = ["fa", "ps"].includes(lng) ? "rtl" : "ltr";

    setLangOpen(false);
  };

  return (
    <nav className="w-full bg-white shadow-sm">
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
          {/* LANGUAGE */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-sm hover:text-blue-600"
            >
              <FiGlobe />
              {i18n.language.toUpperCase()}
            </button>

            {langOpen && (
              <div
                className={`absolute mt-2 w-28 bg-white shadow rounded border z-50 ${
                  isRTL ? "left-0" : "right-0"
                }`}
              >
                {["en", "ps", "fa"].map((lng) => (
                  <div
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {lng.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LOGIN BUTTON */}
          <Link
            to="/login"
            className="hidden sm:block bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
          >
            {t("login")}
          </Link>

          {/* MOBILE MENU BUTTON */}
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
