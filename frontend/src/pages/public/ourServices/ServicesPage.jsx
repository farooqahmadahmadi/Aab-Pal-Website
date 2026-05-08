import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getServices } from "../../../services/servicesPage.service";
import { getHomePages } from "../../../services/homePage.service";

export default function ServicesPage() {
  // ================= STATES =================
  const [services, setServices] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  // ================= LANGUAGE =================
  const getLanguageId = () =>
    Number(localStorage.getItem("language_id")) || 1;

  const [languageId] = useState(getLanguageId());

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [servicesRes, homeRes] = await Promise.all([
          getServices(),
          getHomePages(),
        ]);

        // ================= SERVICES =================
        const servicesList = Array.isArray(servicesRes)
          ? servicesRes
          : servicesRes?.data || [];

        // ================= HOME =================
        const homeList = Array.isArray(homeRes)
          ? homeRes
          : homeRes?.data || [];

        // ================= HERO =================
        const heroSection = homeList.find(
          (h) =>
            h.is_active &&
            Number(h.language_id) === Number(languageId) &&
            h.section_name?.toLowerCase().includes("service"),
        );

        setHero(heroSection || null);

        // ================= FILTER =================
        const filtered = servicesList
          .filter(
            (s) =>
              s.is_active &&
              Number(s.language_id) === Number(languageId),
          )
          .sort((a, b) => a.display_order - b.display_order);

        setServices(filtered);
      } catch (err) {
        console.error("SERVICES PAGE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [languageId]);

  // ================= RENDER STARS =================
  const renderStars = (rating = 5) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < Math.round(rating)
            ? "text-yellow-400"
            : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative w-full py-28 px-4 text-center text-white overflow-hidden"
        style={{
          backgroundImage: hero?.section_image
            ? `url(${BASE_URL + hero.section_image})`
            : "linear-gradient(135deg,#1e3a8a,#2563eb,#06b6d4)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/65" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide">
            {hero?.section_title || "Our Services"}
          </h1>

          <p className="mt-5 text-sm md:text-base text-gray-200 leading-7 max-w-2xl mx-auto">
            {hero?.section_description ||
              "Explore our professional and trusted services designed for modern systems."}
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        {/* ================= LOADING ================= */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading services...
          </p>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && services.length === 0 && (
          <p className="text-center text-gray-500">
            No services found.
          </p>
        )}

        {/* ================= GRID ================= */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={service.service_id}
              className="
                group
                relative
                bg-white/80
                backdrop-blur-xl
                border border-white/50
                rounded-[30px]
                overflow-hidden
                shadow-lg
                hover:shadow-2xl
                transition-all duration-500
                hover:-translate-y-2
              "
            >
              {/* ================= IMAGE ================= */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={
                    service.service_image
                      ? BASE_URL + service.service_image
                      : "https://via.placeholder.com/600x400"
                  }
                  alt={service.service_title}
                  className="
                    w-full h-full object-cover
                    transition duration-700
                    group-hover:scale-110
                  "
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                NUMBER BADGE
                <div
                  className="
                    absolute top-5 left-5
                    w-12 h-12 rounded-full
                    bg-white/20 backdrop-blur-md
                    border border-white/30
                    text-white font-bold text-lg
                    flex items-center justify-center
                    shadow-lg
                  "
                >
                  {index + 1}
                </div>

                {/* ACTIVE BADGE */}
                <div
                  className="
                    absolute top-5 right-5
                    bg-emerald-500/90
                    text-white text-xs
                    px-3 py-1 rounded-full
                    font-medium shadow-md
                  "
                >
                  Active
                </div>
              </div>

              {/* ================= CONTENT ================= */}
              <div className="p-6">
                {/* TITLE */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {service.service_title}
                </h2>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-sm leading-7 line-clamp-5">
                  {service.service_description}
                </p>

                {/* FOOTER */}
                <div className="mt-7 flex items-center justify-between">
                  {/* STARS */}
                  <div className="flex items-center gap-1">
                    {renderStars(service.service_rating)}
                  </div>

                  {/* SEE MORE BUTTON */}
                  <Link
                    to={`/services/${service.service_id}`}
                    className="
                      inline-flex items-center gap-2
                      bg-gradient-to-r from-blue-600 to-cyan-500
                      hover:from-blue-700 hover:to-cyan-600
                      text-white text-sm font-medium
                      px-5 py-2.5 rounded-full
                      shadow-md hover:shadow-xl
                      transition-all duration-300
                    "
                  >
                    See More →
                  </Link>
                </div>
              </div>

              {/* GLOW EFFECT */}
              <div
                className="
                  absolute inset-0
                  opacity-0 group-hover:opacity-100
                  transition duration-500
                  pointer-events-none
                  bg-gradient-to-tr from-blue-500/5 to-cyan-500/10
                "
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}