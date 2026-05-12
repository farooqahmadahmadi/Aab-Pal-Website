import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { getHomePages } from "../../../services/homePage.service";
import { getServices } from "../../../services/servicesPage.service";

import defaultImg from "../../../assets/images/default_image.png";

import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";

export default function HomeServicesSection() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [services, setServices] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const isPaused = useRef(false);

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  // ================= RTL =================
  const isRTL = i18n.language === "fa" || i18n.language === "ps";

  // ================= RESPONSIVE =================
  const getCardsPerView = () => {
    if (typeof window === "undefined") return 3;

    if (window.innerWidth < 640) return 1;

    if (window.innerWidth < 1024) return 2;

    return 3;
  };

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());

  useEffect(() => {
    const handleResize = () => setCardsPerView(getCardsPerView());

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const langId = Number(localStorage.getItem("language_id")) || 1;

        // ================= HOME =================
        const homeRes = await getHomePages();

        const homeData = homeRes?.data?.data || homeRes?.data || [];

        const servicesSection = homeData.find(
          (item) =>
            item.section_name?.toLowerCase().trim() === "services" &&
            Number(item.language_id) === langId &&
            item.is_active,
        );

        setSection(servicesSection || null);

        // ================= SERVICES =================
        const serviceRes = await getServices();

        const serviceData = serviceRes || [];

        const filtered = serviceData.filter(
          (s) => Number(s.language_id) === langId && s.is_active,
        );

        setServices(filtered);
      } catch (err) {
        console.error("SERVICES ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleLang = () => fetchData();

    window.addEventListener("languageChanged", handleLang);

    return () => window.removeEventListener("languageChanged", handleLang);
  }, []);

  // ================= DUPLICATE FOR INFINITE =================
  const loopedServices = [...services, ...services];

  // ================= AUTO SLIDE =================
  useEffect(() => {
    if (!services.length) return;

    const interval = setInterval(() => {
      if (!isPaused.current) {
        setIndex((prev) => prev + 1);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [services]);

  // ================= RESET SMOOTHLY =================
  useEffect(() => {
    if (index >= services.length) {
      setTimeout(() => {
        setIndex(0);
      }, 700);
    }
  }, [index, services.length]);

  // ================= NAVIGATION =================
  const next = () => {
    setIndex((prev) => prev + 1);
  };

  const prev = () => {
    setIndex((prev) => (prev <= 0 ? services.length - 1 : prev - 1));
  };

  // ================= MOUSE WHEEL =================
  const handleWheel = (e) => {
    if (e.deltaY > 0) {
      next();
    } else {
      prev();
    }
  };

  // ================= DRAG =================
  let startX = 0;

  const onDragStart = (e) => {
    startX = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const onDragEnd = (e) => {
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;

    if (startX > endX + 50) next();

    if (startX < endX - 50) prev();
  };

  // ================= IMAGE =================
  const getImage = (img) =>
    img ? (img.startsWith("http") ? img : `${BASE_URL}${img}`) : defaultImg;

  // ================= STARS =================
  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={
          i < Math.round(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }
      />
    ));

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div
          className="
            w-10
            h-10
            border-4
            border-blue-500
            border-t-transparent
            rounded-full
            animate-spin
          "
        />
      </div>
    );
  }

  return (
    <section
      className="
        w-full
        py-20
        bg-gradient-to-b
        from-white
        to-blue-50
      "
    >
      {/* ================= HEADER ================= */}
      <div
        className="
          text-center
          max-w-3xl
          mx-auto
          mb-14
          px-4
        "
      >
        <h2
          className="
            text-4xl
            font-bold
            text-gray-900
            mb-3
          "
        >
          {section?.section_title || "Our Services"}
        </h2>

        <p
          className="
            text-gray-600
            mb-5
          "
        >
          {section?.section_description}
        </p>

        <button
          onClick={() => navigate("/our-services")}
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
          View All Services →
        </button>
      </div>

      {/* ================= SLIDER ================= */}
      <div
        className="
          relative
          max-w-7xl
          mx-auto
          px-6
          select-none
        "
        onMouseEnter={() => (isPaused.current = true)}
        onMouseLeave={() => (isPaused.current = false)}
        onWheel={handleWheel}
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
      >
        {/* LEFT BUTTON */}
        <button
          onClick={prev}
          className="
            absolute
            -left-2
            md:-left-8
            top-1/2
            -translate-y-1/2
            z-20
            bg-white
            shadow-lg
            p-3
            rounded-full
            hover:scale-110
            transition
          "
        >
          <FiChevronLeft />
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={next}
          className="
            absolute
            -right-2
            md:-right-8
            top-1/2
            -translate-y-1/2
            z-20
            bg-white
            shadow-lg
            p-3
            rounded-full
            hover:scale-110
            transition
          "
        >
          <FiChevronRight />
        </button>

        {/* ================= TRACK ================= */}
        <div className="overflow-hidden">
          <div
            className="
              flex
              transition-transform
              duration-700
              ease-in-out
            "
            style={{
              transform: `translateX(-${(index * 100) / cardsPerView}%)`,
            }}
          >
            {loopedServices.map((s, idx) => (
              <div
                key={`${s.service_id}-${idx}`}
                className="
                    w-full
                    sm:w-1/2
                    lg:w-1/3
                    p-4
                    flex-shrink-0
                  "
              >
                <div
                  className="
                      bg-white
                      rounded-2xl
                      shadow-md
                      hover:shadow-2xl
                      transition
                      overflow-hidden
                      group
                      h-full
                    "
                >
                  {/* IMAGE */}
                  <div
                    className="
                        h-48
                        overflow-hidden
                      "
                  >
                    <img
                      src={getImage(s.service_image)}
                      onError={(e) => (e.target.src = defaultImg)}
                      className="
                          w-full
                          h-full
                          object-cover
                          group-hover:scale-105
                          transition
                          duration-500
                        "
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <h3
                      className="
                          text-lg
                          font-bold
                          mb-1
                        "
                    >
                      {s.service_title}
                    </h3>

                    {/* STARS */}
                    <div
                      className="
                          flex
                          gap-1
                          mb-2
                        "
                    >
                      {renderStars(s.service_rating)}
                    </div>

                    <p
                      className="
                          text-gray-600
                          text-sm
                          line-clamp-3
                        "
                    >
                      {s.service_description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
