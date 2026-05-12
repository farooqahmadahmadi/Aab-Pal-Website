import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { getHomePages } from "../../../services/homePage.service";

import defaultSectionImg from "../../../assets/images/Hero-Section.png";

// ================= HERO SECTION =================
export default function HomeHeroSection() {
  const { i18n } = useTranslation();

  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= RTL =================
  const isRTL = i18n.language === "fa" || i18n.language === "ps";

  // ================= IMAGE BASE URL =================
  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  // ================= FETCH HERO =================
  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);

        const res = await getHomePages();

        const allData = res?.data?.data || res?.data || [];

        const currentLanguageId =
          Number(localStorage.getItem("language_id")) || 1;

        const hero = allData.find(
          (item) =>
            item.section_name?.toLowerCase()?.trim() === "hero" &&
            Number(item.language_id) === currentLanguageId &&
            item.is_active,
        );

        setHeroData(hero || null);
      } catch (err) {
        console.error("HOME HERO ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();

    const handleLanguageChange = () => {
      fetchHero();
    };

    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  // ================= RIGHT IMAGE =================
  const sectionImage = heroData?.section_image
    ? heroData.section_image.startsWith("http")
      ? heroData.section_image
      : `${BASE_URL}${heroData.section_image}`
    : defaultSectionImg;

  return (
    <section
      className="
        relative
        w-full
        min-h-screen
        overflow-hidden
        flex
        items-center
      "
      style={{
        backgroundImage: `url(${defaultSectionImg})`, // ✅ ALWAYS LOCAL BACKGROUND
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ================= OVERLAY ================= */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 py-20">
        <div
          className={`
            max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center
            ${isRTL ? "lg:text-right" : "lg:text-left"}
          `}
        >
          {/* ================= LEFT CONTENT ================= */}
          <div
            className={
              isRTL ? "lg:text-right text-center" : "text-center lg:text-left"
            }
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 px-4 py-2 rounded-full text-sm backdrop-blur-sm mb-5">
              💧 Smart Water Management System
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              {loading
                ? "Loading..."
                : heroData?.section_title || "Modern Water Management"}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {loading
                ? "Please wait..."
                : heroData?.section_description ||
                  "Smart, secure and scalable water management platform for modern organizations and businesses."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-7 py-3.5 rounded-2xl font-semibold transition shadow-lg hover:scale-105">
                Get Started
              </button>

              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-7 py-3.5 rounded-2xl font-semibold transition">
                Learn More
              </button>
            </div>
          </div>

          {/* ================= RIGHT IMAGE ================= */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-2xl">
              {/* background glow */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full" />

              {/* IMAGE CARD */}
              <div className="relative z-10 overflow-hidden rounded-[28px] border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl">
                {/* LIGHT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

                {/* IMAGE */}
                <img
                  src={sectionImage}
                  onError={(e) => {
                    e.target.src = defaultSectionImg;
                  }}
                  alt="Hero"
                  className="w-full h-full max-h-[650px] object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
