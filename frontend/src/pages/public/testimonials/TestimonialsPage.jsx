import { useEffect, useState } from "react";
import { getTestimonials } from "../../../services/testimonialsPage.service";
import { getHomePages } from "../../../services/homePage.service";
import AskTestimonialModal from "../../../components/Testimonials/AddTestimonialModal";
import { FiPlus } from "react-icons/fi";

export default function TestimonialsPage() {
  const [data, setData] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  // MODAL STATE
  const [openModal, setOpenModal] = useState(false);

  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  // LANGUAGE
  const getLanguageId = () =>
    Number(localStorage.getItem("language_id")) || 1;

  const [languageId] = useState(getLanguageId());

  // FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [res, homeRes] = await Promise.all([
          getTestimonials(),
          getHomePages(),
        ]);

        const list = Array.isArray(res) ? res : res?.data || [];
        const homeList = Array.isArray(homeRes)
          ? homeRes
          : homeRes?.data || [];

        const heroSection = homeList.find(
          (h) =>
            h.is_active &&
            Number(h.language_id) === Number(languageId) &&
            h.section_name?.toLowerCase().includes("testimonial")
        );

        setHero(heroSection || null);

        const approved = list.filter((t) => t.is_approved === true);
        setData(approved);
      } catch (err) {
        console.error("TESTIMONIALS PAGE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [languageId]);

  // STARS (bigger + centered)
  const renderStars = (rating = 5) => {
    return (
      <div className="flex justify-center gap-1 text-xl">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={i < rating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HERO */}
      <section
        className="relative w-full py-20 px-4 text-center text-white"
        style={{
          backgroundImage: hero?.section_image
            ? `url(${BASE_URL + hero.section_image})`
            : "linear-gradient(135deg, #1e3a8a, #1e40af, #0ea5e9)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">
            {hero?.section_title || "Testimonials"}
          </h1>

          <p className="mt-3 text-sm md:text-base text-gray-200">
            {hero?.section_description ||
              "What our users say about our services."}
          </p>

          {/* ✅ ADD BUTTON IN HERO */}
          <button
            onClick={() => setOpenModal(true)}
            className="mt-6 inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-2 rounded-full font-semibold shadow hover:bg-gray-100 transition"
          >
            <FiPlus />
            Add Your Feedback
          </button>
        </div>
      </section>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {loading && (
          <div className="text-center text-gray-500 py-10">
            Loading Testimonials...
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No testimonials found.
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item.testimonial_id}
              className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition p-6 text-center"
            >
              {/* PHOTO */}
              <div className="flex justify-center mb-3">
                {item.testimonial_photo ? (
                  <img
                    src={BASE_URL + item.testimonial_photo}
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {item.testimonial_name?.charAt(0)}
                  </div>
                )}
              </div>

              {/* NAME */}
              <h3 className="font-semibold text-gray-800">
                {item.testimonial_name}
              </h3>

              {/* MESSAGE */}
              <p className="text-gray-600 text-sm mt-2 mb-4">
                {item.testimonial_message}
              </p>

              {/* STARS (center + bigger) */}
              {renderStars(item.testimonial_rating)}
            </div>
          ))}
        </div>
      </main>

      {/* MODAL */}
      <AskTestimonialModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}