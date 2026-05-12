import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { FiPlus, FiMinus, FiHelpCircle } from "react-icons/fi";

import { getHomePages } from "../../../services/homePage.service";
import { getFaqs } from "../../../services/faqsPage.service";

export default function HomeFaqSection() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const langId = Number(localStorage.getItem("language_id")) || 1;

  const isRTL = i18n.language === "fa" || i18n.language === "ps";

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);

      // ================= HOME SECTION =================
      const homeRes = await getHomePages();

      const homeData = homeRes?.data?.data || homeRes?.data || [];

      const faqSection = homeData.find(
        (item) =>
          item.section_name?.toLowerCase().trim() === "faqs" &&
          Number(item.language_id) === langId &&
          item.is_active,
      );

      setSection(faqSection || null);

      // ================= FAQS =================
      const faqRes = await getFaqs();

      const faqData = Array.isArray(faqRes?.data?.data)
        ? faqRes.data.data
        : Array.isArray(faqRes?.data)
          ? faqRes.data
          : Array.isArray(faqRes)
            ? faqRes
            : [];

      const filtered = faqData.filter(
        (f) => Number(f.language_id) === langId && f.is_active,
      );

      // 🔥 LIMIT TO 10 ONLY
      setFaqs(filtered.slice(0, 10));
    } catch (err) {
      console.error("FAQ ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleLang = () => fetchData();

    window.addEventListener("languageChanged", handleLang);

    return () => window.removeEventListener("languageChanged", handleLang);
  }, []);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative w-full py-20 bg-gradient-to-b from-white to-slate-50">
      {/* ================= HEADER ================= */}
      <div className="text-center max-w-3xl mx-auto mb-12 px-4">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
          <FiHelpCircle />
          FAQs
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          {section?.section_title || "Frequently Asked Questions"}
        </h2>

        <p className="text-gray-600">{section?.section_description}</p>

        {/* SEE ALL BUTTON */}
        <button
          onClick={() => navigate("/faqs")}
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

      {/* ================= GRID ================= */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={faq.faqs_id || index}
                className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition overflow-hidden"
              >
                {/* QUESTION */}
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full flex justify-between items-center px-5 py-4 text-left ${isRTL ? "flex-row-reverse text-right" : ""}`}
                >
                  <div
                    className={`flex gap-3 items-start ${isRTL ? "flex-row-reverse text-right" : ""}`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg flex-shrink-0">
                      ?
                    </div>

                    <h3 className="font-semibold text-gray-900 text-base leading-relaxed">
                      {faq.faqs_question}
                    </h3>
                  </div>

                  <div className="text-gray-600">
                    {isOpen ? <FiMinus /> : <FiPlus />}
                  </div>
                </button>

                {/* ANSWER */}
                <div
                  className={`
    px-5 pb-4
    text-gray-600
    text-sm
    leading-relaxed
    ${isRTL ? "text-right" : "text-left"}
    transition-all duration-300
   ${isOpen ? "block" : "hidden"}`}
                >
                  {faq.faqs_answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
