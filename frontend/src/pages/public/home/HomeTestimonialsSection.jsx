import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTestimonials } from "../../../services/testimonialsPage.service";
import { getHomePages } from "../../../services/homePage.service";

import defaultImg from "../../../assets/images/default_image.png";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

export default function HomeTestimonialsSection() {
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [data, setData] = useState([]);

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  const langId = Number(localStorage.getItem("language_id")) || 1;

  // ================= SHUFFLE =================
  const shuffle = (arr) => {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, 6);
  };

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      // ================= HOME SECTION (LANGUAGE FILTERED) =================
      const homeRes = await getHomePages();

      const homeData = Array.isArray(homeRes?.data)
        ? homeRes.data
        : homeRes?.data?.data || [];

      const testimonialSection = homeData.find(
        (item) =>
          item.section_name?.toLowerCase().trim() === "testimonials" &&
          Number(item.language_id) === langId &&
          item.is_active,
      );

      setSection(testimonialSection || null);

      // ================= TESTIMONIALS (GLOBAL - NO LANGUAGE FILTER) =================
      const res = await getTestimonials();

      const list = res?.data || [];

      const approved = list.filter((i) => i.is_approved);

      setData(shuffle(approved));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();

    // ================= AUTO REFRESH CARDS (WITHOUT RELOAD) =================
    const interval = setInterval(() => {
      setData((prev) => shuffle(prev));
    }, 15000); // Change every 15 seconds

    // ================= LANGUAGE CHANGE =================
    const handleLang = () => fetchData();

    window.addEventListener("languageChanged", handleLang);

    return () => {
      clearInterval(interval);
      window.removeEventListener("languageChanged", handleLang);
    };
  }, []);

  // ================= STARS =================
  const renderStars = (rating = 5) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
        size={14}
      />
    ));

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            {section?.section_title || "Testimonials"}
          </h2>

          <p className="text-gray-600">{section?.section_description}</p>

          <button
            onClick={() => navigate("/testimonials")}
            className="
            mt-6
            inline-flex
            items-center
            gap-2
            text-blue-600
            font-semibold
            hover:gap-3
            transition-all
          "
          >
            See All →
          </button>
        </div>

        {/* ================= CARDS ================= */}
        {data.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <div
                key={item.testimonial_id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 relative h-[260px] flex flex-col justify-between"
              >
                <FaQuoteLeft className="absolute top-4 right-4 text-blue-100 text-4xl" />

                {/* USER */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item.testimonial_photo
                        ? `${BASE_URL}${item.testimonial_photo}`
                        : defaultImg
                    }
                    onError={(e) => (e.target.src = defaultImg)}
                    className="w-14 h-14 rounded-full object-cover border"
                  />

                  <div>
                    <h3 className="font-bold text-gray-800">
                      {item.testimonial_name}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      <a
                        href={`mailto:${item.testimonial_email}`}
                        className="hover:underline"
                      >
                        {item.testimonial_email}
                      </a>
                    </p>

                    <div className="flex gap-1 mt-1">
                      {renderStars(item.testimonial_rating || 5)}
                    </div>
                  </div>
                </div>

                {/* MESSAGE (4 LINES ONLY) */}
                <p className="text-gray-600 text-sm mt-4 line-clamp-6">
                  {item.testimonial_message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            No testimonials found
          </div>
        )}
      </div>
    </section>
  );
}
