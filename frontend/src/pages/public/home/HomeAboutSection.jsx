import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAboutPages } from "../../../services/aboutPage.service";
import { getHomePages } from "../../../services/homePage.service";

import defaultImg from "../../../assets/images/default_image.png";

export default function HomeAboutSection() {
  const [about, setAbout] = useState(null);
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");
  const getLanguageId = () => Number(localStorage.getItem("language_id")) || 1;

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const langId = getLanguageId();

        const [aboutRes, homeRes] = await Promise.all([
          getAboutPages(),
          getHomePages(),
        ]);

        // ================= ABOUT DATA =================
        const list = Array.isArray(aboutRes?.data)
          ? aboutRes.data
          : Array.isArray(aboutRes)
            ? aboutRes
            : [];

        const record = list.find((item) => Number(item.language_id) === langId);

        setAbout(record || null);

        // ================= HOME SECTION (TITLE + DESC) =================
        const homeList = Array.isArray(homeRes?.data)
          ? homeRes.data
          : homeRes?.data?.data || [];

        const aboutSection = homeList.find(
          (item) =>
            item.section_name?.toLowerCase().trim() === "about" &&
            Number(item.language_id) === langId &&
            item.is_active,
        );

        setSection(aboutSection || null);
      } catch (err) {
        console.error("ABOUT SECTION ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!about) return null;

  return (
    <section
      className="
        py-20
        bg-gradient-to-b
        from-cyan-50
        to-cyan-100
      "
    >
      {/* ================= SECTION TITLE (NEW) ================= */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          {section?.section_title || "About Us"}
        </h2>

        <p className="text-gray-600">{section?.section_description}</p>
      </div>

      {/* ================= CONTENT (UNCHANGED) ================= */}
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* IMAGE */}

        <div className="relative group flex justify-center">
          {/* Soft background glow */}
          <div className="absolute -inset-4 bg-blue-100 opacity-40 blur-2xl rounded-[30%] group-hover:opacity-60 transition" />

          {/* Polygon Shape Wrapper */}
          <div
            className="
      relative
      w-full
      max-w-md
      overflow-hidden
      shadow-2xl
      border-4 border-white
      transition
      duration-500
      group-hover:scale-[1.03]
    "
            style={{
              clipPath:
                "polygon(10% 0%, 90% 0%, 100% 25%, 100% 75%, 85% 100%, 15% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <img
              src={
                about.about_image
                  ? `${BASE_URL}${about.about_image}`
                  : defaultImg
              }
              alt="About"
              className="
        w-full
        h-[420px]
        object-cover
        transition-transform
        duration-700
        group-hover:scale-110
      "
            />

            {/* subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        </div>

        <div className="absolute -z-10 top-6 left-6 w-full h-full bg-blue-100 rounded-3xl blur-2xl opacity-40" />

        {/* CONTENT */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {about.about_title || "Why Choose Us"}
          </h2>

          <p className="text-gray-600 leading-7 text-justify line-clamp-4">
            {about.about_text}
          </p>

          <div className="mt-6 flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/about")}
              className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700  rounded-2xl
              font-bold
              shadow-xl
              hover:scale-105
              transition-all"
            >
              Read More
            </button>

            <button
              onClick={() => navigate("/contact-us")}
              className="px-5 py-2 bg-gray-100 text-gray-700  hover:bg-gray-200  rounded-2xl
              font-bold
              shadow-xl
              hover:scale-105
              transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
