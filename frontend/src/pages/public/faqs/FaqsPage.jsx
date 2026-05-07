import { useEffect, useState } from "react";
import { getFaqs } from "../../../services/faqsPage.service";
import { getHomePages } from "../../../services/homePage.service";

import AskQuestionModal from "../../../components/Faqs/AskQuestionModal";

export default function FaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  // ================= MODAL =================
  const [openAskModal, setOpenAskModal] = useState(false);

  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  // ================= CURRENT LANGUAGE =================
  const getCurrentLanguageId = () => {
    return Number(localStorage.getItem("language_id")) || 1;
  };

  const [languageId, setLanguageId] = useState(getCurrentLanguageId());

  // ================= LANGUAGE CHANGE LISTENER =================
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageId(getCurrentLanguageId());
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

        const [faqRes, homeRes] = await Promise.all([
          getFaqs(),
          getHomePages(),
        ]);

        const faqList = Array.isArray(faqRes) ? faqRes : faqRes?.data || [];

        const homeList = Array.isArray(homeRes) ? homeRes : homeRes?.data || [];

        // ================= HERO FILTER =================
        const heroSection = homeList.find(
          (h) =>
            h.is_active &&
            Number(h.language_id) === Number(languageId) &&
            h.section_name?.toLowerCase().includes("faqs"),
        );

        setHero(heroSection || null);

        // ================= FAQ FILTER =================
        const activeFaqs = faqList.filter(
          (f) => f.is_active && Number(f.language_id) === Number(languageId),
        );

        setFaqs(activeFaqs);
      } catch (err) {
        console.error("FAQ PAGE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [languageId]);

  // ================= TOGGLE =================
  const toggleFAQ = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  // ================= GROUP BY CATEGORY =================
  const groupedFaqs = faqs.reduce((acc, item) => {
    const key = item.faqs_category || "General";

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ================= HERO ================= */}
      <div
        className="w-full py-20 px-4 text-center text-white relative"
        style={{
          backgroundImage: hero?.section_image
            ? `url(${BASE_URL + hero.section_image})`
            : "linear-gradient(135deg, #1e3a8a, #1e40af, #0ea5e9)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">
            {hero?.section_title || "Frequently Asked Questions"}
          </h1>

          <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto">
            {hero?.section_description ||
              "Find answers about our water management system and services."}
          </p>

          {/* ================= ASK QUESTION BUTTON ================= */}
          <div className="mt-8">
            <button
              onClick={() => setOpenAskModal(true)}
              className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105"
            >
              Ask Your Question
            </button>

            <p className="text-xs text-gray-200 mt-3">
              Your question will appear after admin approval.
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* ================= LOADING ================= */}
        {loading && (
          <p className="text-center text-gray-500">Loading FAQs...</p>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && faqs.length === 0 && (
          <p className="text-center text-gray-500">No FAQs found.</p>
        )}

        {/* ================= FAQ GROUPS ================= */}
        <div className="space-y-10">
          {Object.entries(groupedFaqs).map(([category, items]) => (
            <div key={category}>
              {/* CATEGORY TITLE */}
              <h2 className="text-xl font-bold text-blue-700 mb-4 border-l-4 border-blue-500 pl-3">
                {category}
              </h2>

              {/* FAQ LIST */}
              <div className="space-y-3">
                {items.map((faq) => (
                  <div
                    key={faq.faqs_id}
                    className="border rounded-lg bg-white shadow-sm overflow-hidden"
                  >
                    {/* QUESTION */}
                    <button
                      onClick={() => toggleFAQ(faq.faqs_id)}
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition"
                    >
                      <span className="font-semibold text-gray-800">
                        {faq.faqs_question}
                      </span>

                      <span className="text-blue-500 font-bold text-lg">
                        {activeId === faq.faqs_id ? "−" : "+"}
                      </span>
                    </button>

                    {/* ANSWER */}
                    {activeId === faq.faqs_id && (
                      <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                        {faq.faqs_answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ASK QUESTION MODAL ================= */}
      <AskQuestionModal
        isOpen={openAskModal}
        onClose={() => setOpenAskModal(false)}
      />
    </div>
  );
}
