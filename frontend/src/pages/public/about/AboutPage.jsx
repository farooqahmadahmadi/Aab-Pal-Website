import { useEffect, useState } from "react";
import { getAboutPages } from "../../../services/aboutPage.service";
import { getHomePages } from "../../../services/homePage.service";

export default function AboutPage() {
  const [data, setData] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  // ================= LANGUAGE =================
  const getLanguageId = () => Number(localStorage.getItem("language_id")) || 1;

  const [languageId, setLanguageId] = useState(getLanguageId());

  // ================= LANGUAGE LISTENER =================
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageId(getLanguageId());
    };

    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [res, homeRes] = await Promise.all([
          getAboutPages(),
          getHomePages(),
        ]);

        const list = Array.isArray(res) ? res : res?.data || [];

        const homeList = Array.isArray(homeRes) ? homeRes : homeRes?.data || [];

        // ================= HERO =================
        const heroSection = homeList.find(
          (h) =>
            h.is_active &&
            Number(h.language_id) === Number(languageId) &&
            h.section_name?.toLowerCase().includes("about"),
        );

        setHero(heroSection || null);

        // ================= FILTER =================
        const filtered = list
          .filter((item) => Number(item.language_id) === Number(languageId))
          .sort((a, b) => a.display_order - b.display_order);

        setData(filtered);
      } catch (err) {
        console.error("ABOUT PAGE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [languageId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white ">
      {/* ================= HERO ================= */}
      <section
        className="relative w-full py-24 px-4 text-center text-white overflow-hidden"
        style={{
          backgroundImage: hero?.section_image
            ? `url(${BASE_URL + hero.section_image})`
            : "linear-gradient(135deg, #1e3a8a, #1e40af, #0ea5e9)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {hero?.section_title || "About Us"}
          </h1>

          <p className="text-sm md:text-base text-gray-200 leading-7">
            {hero?.section_description ||
              "Learn more about our mission, goals, and water management solutions."}
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* LOADING */}
        {loading && (
          <div className="text-center text-gray-500 py-10">
            Loading About Page...
          </div>
        )}

        {/* EMPTY */}
        {!loading && data.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No content found.
          </div>
        )}

        {/* ================= SECTIONS ================= */}
        <div className="space-y-24">
          {data.map((item, index) => {
            const isReverse = index % 2 !== 0;

            return (
              <section
                key={item.about_id}
                className={`grid lg:grid-cols-2 gap-10 items-center ${
                  isReverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* ================= IMAGE ================= */}
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition"></div>

                  <div className="relative overflow-hidden rounded-3xl shadow-xl bg-white">
                    {item.about_image ? (
                      <img
                        src={BASE_URL + item.about_image}
                        alt={item.about_title}
                        className="w-full h-[320px] md:h-[420px] object-cover hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-[320px] md:h-[420px] bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-blue-500 text-lg font-semibold">
                        No Image
                      </div>
                    )}
                  </div>
                </div>

                {/* ================= TEXT ================= */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-5 leading-tight">
                    {item.about_title}
                  </h2>

                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-6"></div>

                  <p className="text-gray-600 leading-8 text-[15px] whitespace-pre-line">
                    {item.about_text}
                  </p>
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
