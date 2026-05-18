import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getServices } from "../../../services/servicesPage.service";
import { getHomePages } from "../../../services/homePage.service";

import { formatNumber } from "../../../utils/formatNumber";

// ⭐ NEW MODAL IMPORT
import ServiceRateModal from "../../../components/OurServices/ServiceRateModal";
import defaultImg from "../../../assets/images/default_image.png";
import Herobackground from "../../../assets/images/testimonials.jpg";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openRate, setOpenRate] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const BASE_URL = import.meta.env.VITE_IMAGE_URL;
  const getLanguageId = () => Number(localStorage.getItem("language_id")) || 1;
  const [languageId] = useState(getLanguageId());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [servicesRes, homeRes] = await Promise.all([
          getServices(),
          getHomePages(),
        ]);

        const servicesList = Array.isArray(servicesRes)
          ? servicesRes
          : servicesRes?.data || [];

        const homeList = Array.isArray(homeRes)
          ? homeRes
          : homeRes?.data || [];

        const heroSection = homeList.find(
          (h) =>
            h.is_active &&
            Number(h.language_id) === Number(languageId) &&
            h.section_name?.toLowerCase().includes("service")
        );

        setHero(heroSection || null);

        const filtered = servicesList
          .filter(
            (s) =>
              s.is_active &&
              Number(s.language_id) === Number(languageId)
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

  // ⭐ STARS (STATIC UI ONLY - SAME PATTERN)
  const renderStars = (rating = 5) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">

      <ServiceRateModal
        isOpen={openRate}
        onClose={() => setOpenRate(false)}
        serviceId={selectedService}
      />

      {/* HERO */}
      <section
        className="w-full min-h-screen flex items-center justify-center px-4 text-center text-white relative"
        style={{
          backgroundImage: hero?.section_image
            ? `url(${BASE_URL + hero.section_image})`
            : `url(${Herobackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {hero?.section_title || "Our Services"}
          </h1>

          <p className="mt-5 text-gray-200 max-w-2xl mx-auto">
            {hero?.section_description}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        {loading && (
          <p className="text-center text-gray-500">Loading services...</p>
        )}

        {!loading && services.length === 0 && (
          <p className="text-center text-gray-500">No services found.</p>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={service.service_id}
              className="group relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-[30px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={
                    service.service_image
                      ? BASE_URL + service.service_image
                      : defaultImg
                  }
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-5 left-5 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold flex items-center justify-center">
                  {index + 1}
                </div>

                <div className="absolute top-5 right-5 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full">
                  Active
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {service.service_title}
                </h2>

                <p className="text-gray-600 text-sm leading-7 line-clamp-5 flex-grow">
                  {service.service_description}
                </p>

                {/* BOTTOM */}
                <div className="mt-5 flex items-center justify-between">

                  {/* ⭐ STARS (STATIC) */}
                  <div className="flex items-center gap-1">
                    {renderStars(5)}
                  </div>

                  {/* ⭐ FORMAT NUMBER */}
                  <span className="text-xs text-gray-500">
                    {formatNumber(service.service_rating)} Ratings
                  </span>

                  <div className="flex gap-2">

                    <button
                      onClick={() => {
                        setSelectedService(service.service_id);
                        setOpenRate(true);
                      }}
                      className="text-xs bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition"
                    >
                      Rate
                    </button>

                    <Link
                      to={`/services/${service.service_id}`}
                      className="bg-blue-600 text-white text-xs px-4 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                      See More
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}