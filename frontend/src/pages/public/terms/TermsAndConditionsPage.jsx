import { useEffect, useState } from "react";
import { getTerms } from "../../../services/termsAndConditionsPage.service";
import { getHomePages } from "../../../services/homePage.service";
import Herobackground from "../../../assets/images/testimonials.jpg";

export default function TermsAndConditionsPage() {
  const [data, setData] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  // ================= LANGUAGE =================
  const getLanguageId = () => Number(localStorage.getItem("language_id")) || 1;

  const [languageId, setLanguageId] = useState(getLanguageId());

  // ================= LISTENER =================
  useEffect(() => {
    const handleChange = () => {
      setLanguageId(getLanguageId());
    };

    window.addEventListener("languageChanged", handleChange);

    return () => {
      window.removeEventListener("languageChanged", handleChange);
    };
  }, []);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [res, homeRes] = await Promise.all([
          getTerms(),
          getHomePages(),
        ]);

        const list = Array.isArray(res) ? res : res?.data || [];
        const homeList = Array.isArray(homeRes) ? homeRes : homeRes?.data || [];

        // ================= HERO =================
        const heroSection = homeList.find(
          (h) =>
            h.is_active &&
            Number(h.language_id) === Number(languageId) &&
            h.section_name?.toLowerCase().includes("terms"),
        );

        setHero(heroSection || null);

        // ================= FILTER + SORT =================
        const filtered = list
          .filter((t) => Number(t.language_id) === Number(languageId))
          .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

        setData(filtered);
      } catch (err) {
        console.error("TERMS PAGE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [languageId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ================= HERO ================= */}
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
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {hero?.section_title || "Terms & Conditions"}
          </h1>

          <p className="mt-3 text-sm md:text-base text-gray-200 leading-relaxed">
            {hero?.section_description ||
              "Please read our terms and conditions carefully before using the system."}
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* LOADING */}
        {loading && (
          <div className="text-center text-gray-500 py-10">
            Loading Terms & Conditions...
          </div>
        )}

        {/* EMPTY */}
        {!loading && data.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No content found.
          </div>
        )}

        {/* LIST */}
        <div className="space-y-6">
          {data.map((item) => (
            <article
              key={item.tc_id}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 hover:shadow-md transition"
            >
              <h2 className="text-lg md:text-xl font-semibold text-blue-700 mb-3">
                {item.tc_title}
              </h2>

              <div className="text-gray-700 text-sm md:text-[15px] leading-7 whitespace-pre-line">
                {item.tc_text}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
