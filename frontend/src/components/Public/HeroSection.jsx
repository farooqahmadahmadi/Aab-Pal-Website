import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import API from "../../services/api"; // ستاسو د API سرویس
import defaultBg from "../../assets/images/Hero-Section.png"; // default asset image

export default function HeroSection({ pageKey, bgImage }) {
  const [data, setData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // د database/API څخه معلومات راواخلئ
        const res = await API.get(`/hero-section/${pageKey}`);
        setData({
          title: res.data?.title || "",
          description: res.data?.description || "",
        });
      } catch (err) {
        console.error("Failed to load hero data:", err);
      }
    };

    fetchHeroData();
  }, [pageKey]);

  return (
    <section
  className="
    relative
    w-full
    min-h-screen
    flex items-center justify-center
    bg-cover bg-center
    overflow-hidden
  "
  style={{
    backgroundImage: `url(${bgImage || defaultBg})`,
  }}
>
      {/* overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
          {data.title}
        </h1>

        <p className="text-lg sm:text-xl lg:text-2xl text-gray-200">
          {data.description}
        </p>
      </div>
    </section>
  );
}

// Props: pageKey = د هر صفحه لپاره unique key, bgImage = د asset عکس
HeroSection.propTypes = {
  pageKey: PropTypes.string.isRequired,
  bgImage: PropTypes.string,
};
