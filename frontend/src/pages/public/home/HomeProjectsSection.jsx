import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { getHomePages } from "../../../services/homePage.service";
import { getProjects } from "../../../services/ourProjectsPage.service";

import defaultImg from "../../../assets/images/default_image.png";

import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
} from "react-icons/fi";

export default function HomeProjectsSection() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [projects, setProjects] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const isPaused = useRef(false);

  // ================= RTL =================
  const isRTL =
    i18n.language === "fa" || i18n.language === "ps";

  // ================= IMAGE URL =================
  const BASE_URL = (
    import.meta.env.VITE_IMAGE_URL || ""
  ).replace(/\/$/, "");

  // ================= RESPONSIVE =================
  const getCardsPerView = () => {
    if (typeof window === "undefined") return 3;

    if (window.innerWidth < 640) return 1;

    if (window.innerWidth < 1024) return 2;

    return 3;
  };

  const [cardsPerView, setCardsPerView] =
    useState(getCardsPerView());

  useEffect(() => {
    const handleResize = () =>
      setCardsPerView(getCardsPerView());

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize,
      );
  }, []);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const langId =
          Number(
            localStorage.getItem(
              "language_id",
            ),
          ) || 1;

        // ================= HOME PAGE =================
        const homeRes =
          await getHomePages();

        const homeData =
          homeRes?.data?.data ||
          homeRes?.data ||
          homeRes ||
          [];

        const projectsSection =
          homeData.find(
            (item) =>
              item.section_name
                ?.toLowerCase()
                .trim() ===
                "projects" &&
              Number(
                item.language_id,
              ) === langId &&
              item.is_active,
          );

        setSection(
          projectsSection || null,
        );

        // ================= PROJECTS =================
        const projectRes =
          await getProjects();

        // ✅ FIXED
        const projectData =
          Array.isArray(
            projectRes?.data?.data,
          )
            ? projectRes.data.data
            : Array.isArray(
                  projectRes?.data,
                )
              ? projectRes.data
              : Array.isArray(projectRes)
                ? projectRes
                : [];

        // ✅ YOUR MODEL DOES NOT HAVE is_active
        const filtered =
          projectData.filter(
            (p) =>
              Number(
                p.language_id,
              ) === langId,
          );

        setProjects(filtered);
      } catch (err) {
        console.error(
          "PROJECTS ERROR:",
          err,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleLang = () =>
      fetchData();

    window.addEventListener(
      "languageChanged",
      handleLang,
    );

    return () =>
      window.removeEventListener(
        "languageChanged",
        handleLang,
      );
  }, []);

  // ================= LOOP =================
  const loopedProjects = [
    ...projects,
    ...projects,
  ];

  // ================= AUTO SLIDE =================
  useEffect(() => {
    if (!projects.length) return;

    const interval = setInterval(() => {
      if (!isPaused.current) {
        setIndex(
          (prev) => prev + 1,
        );
      }
    }, 3000);

    return () =>
      clearInterval(interval);
  }, [projects]);

  // ================= CONTINUOUS LOOP =================
  useEffect(() => {
    if (
      index >= projects.length &&
      projects.length > 0
    ) {
      setTimeout(() => {
        setIndex(0);
      }, 700);
    }
  }, [index, projects.length]);

  // ================= NAVIGATION =================
  const next = () => {
    setIndex(
      (prev) => prev + 1,
    );
  };

  const prev = () => {
    setIndex((prev) =>
      prev <= 0
        ? projects.length - 1
        : prev - 1,
    );
  };

  // ================= WHEEL =================
  const handleWheel = (e) => {
    if (e.deltaY > 0) next();
    else prev();
  };

  // ================= TOUCH =================
  let startX = 0;

  const onTouchStart = (e) => {
    startX =
      e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const endX =
      e.changedTouches[0]
        .clientX;

    if (startX > endX + 50)
      next();

    if (startX < endX - 50)
      prev();
  };

  // ================= IMAGE =================
  const getImage = (img) =>
    img
      ? img.startsWith("http")
        ? img
        : `${BASE_URL}${img}`
      : defaultImg;

  // ================= STATUS COLOR =================
  const getStatusColor = (
    status,
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "completed":
        return "bg-green-500";

      case "ongoing":
        return "bg-blue-500";

      case "pending":
        return "bg-yellow-500";

      default:
        return "bg-gray-500";
    }
  };

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
        relative
        w-full
        py-20
        overflow-hidden
        bg-gradient-to-b
        from-slate-50
        to-white
      "
    >
      {/* ================= BG EFFECT ================= */}
      <div
        className="
          absolute
          top-0
          right-0
          w-72
          h-72
          bg-blue-100
          rounded-full
          blur-3xl
          opacity-40
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          w-72
          h-72
          bg-cyan-100
          rounded-full
          blur-3xl
          opacity-40
        "
      />

      {/* ================= HEADER ================= */}
      <div
        className="
          relative
          z-10
          text-center
          max-w-3xl
          mx-auto
          mb-14
          px-4
        "
      >
        <div
          className="
            inline-flex
            items-center
            gap-2
            bg-blue-100
            text-blue-700
            px-4
            py-2
            rounded-full
            text-sm
            font-semibold
            mb-5
          "
        >
          🚀 Our Projects
        </div>

        <h2
          className="
            text-4xl
            lg:text-5xl
            font-extrabold
            text-gray-900
            mb-4
          "
        >
          {section?.section_title ||
            "Latest Projects"}
        </h2>

        <p
          className="
            text-gray-600
            text-lg
            leading-relaxed
          "
        >
          {section?.section_description ||
            "Explore our successful projects and smart management solutions."}
        </p>

        {/* VIEW ALL */}
        <button
          onClick={() =>
            navigate(
              "/our-projects",
            )
          }
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
          View All Projects
          <FiArrowRight />
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
        onMouseEnter={() =>
          (isPaused.current = true)
        }
        onMouseLeave={() =>
          (isPaused.current = false)
        }
        onWheel={handleWheel}
        onTouchStart={
          onTouchStart
        }
        onTouchEnd={onTouchEnd}
      >
        {/* LEFT BUTTON */}
        <button
          onClick={prev}
          className="
            absolute
            left-2
            md:-left-5
            top-1/2
            -translate-y-1/2
            z-20
            bg-white
            shadow-xl
            p-3
            rounded-full
            hover:scale-110
            transition
          "
        >
          {isRTL ? (
            <FiChevronRight />
          ) : (
            <FiChevronLeft />
          )}
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={next}
          className="
            absolute
            right-2
            md:-right-5
            top-1/2
            -translate-y-1/2
            z-20
            bg-white
            shadow-xl
            p-3
            rounded-full
            hover:scale-110
            transition
          "
        >
          {isRTL ? (
            <FiChevronLeft />
          ) : (
            <FiChevronRight />
          )}
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
              transform: `translateX(-${
                (index * 100) /
                cardsPerView
              }%)`,
            }}
          >
            {loopedProjects.map(
              (
                project,
                idx,
              ) => (
                <div
                  key={`${project.project_id}-${idx}`}
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
                      group
                      relative
                      h-full
                      bg-white
                      rounded-3xl
                      overflow-hidden
                      shadow-md
                      hover:shadow-2xl
                      transition-all
                      duration-500
                      border
                      border-gray-100
                    "
                  >
                    {/* IMAGE */}
                    <div
                      className="
                        relative
                        h-64
                        overflow-hidden
                      "
                    >
                      <img
                        src={getImage(
                          project.project_image,
                        )}
                        onError={(
                          e,
                        ) => {
                          e.target.src =
                            defaultImg;
                        }}
                        className="
                          w-full
                          h-full
                          object-cover
                          group-hover:scale-110
                          transition-transform
                          duration-700
                        "
                      />

                      {/* OVERLAY */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/70
                          via-black/20
                          to-transparent
                        "
                      />

                      {/* STATUS */}
                      <div
                        className={`
                          absolute
                          top-4
                          left-4
                          ${getStatusColor(
                            project.project_status,
                          )}
                          text-white
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-semibold
                          capitalize
                        `}
                      >
                        {project.project_status ||
                          "ongoing"}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">
                      <h3
                        className="
                          text-xl
                          font-bold
                          text-gray-900
                          mb-3
                          line-clamp-1
                        "
                      >
                        {project.project_name}
                      </h3>

                      <p
                        className="
                          text-gray-600
                          leading-relaxed
                          line-clamp-2
                          mb-5
                        "
                      >
                        📍{" "}
                        {project.project_address ||
                          "No Address"}
                      </p>

                      {/* BUTTON */}
                      <button
                        className="
                          inline-flex
                          items-center
                          gap-2
                          text-blue-600
                          font-semibold
                          hover:gap-3
                          transition-all
                        "
                      >
                        View Details
                        <FiArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}