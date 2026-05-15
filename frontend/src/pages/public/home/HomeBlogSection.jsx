import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import { getBlogs } from "../../../services/blogsPage.service";
import { getHomePages } from "../../../services/homePage.service";

import defaultImg from "../../../assets/images/default_image.png";

import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiHeart,
  FiShare2,
} from "react-icons/fi";

export default function HomeBlogSection() {
  const [section, setSection] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const isPaused = useRef(false);

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  const langId = Number(localStorage.getItem("language_id")) || 1;

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
  const fetchData = async () => {
    try {
      setLoading(true);

      // ================= HOME SECTION =================
      const homeRes = await getHomePages();

      const homeData = Array.isArray(homeRes?.data)
        ? homeRes.data
        : homeRes?.data?.data || [];

      const blogSection = homeData.find(
        (item) =>
          item.section_name?.toLowerCase().trim() === "blogs" &&
          Number(item.language_id) === langId &&
          item.is_active,
      );

      setSection(blogSection || null);

      // ================= BLOGS =================
      const blogsRes = await getBlogs();

      const blogsData = blogsRes?.data || blogsRes || [];

      const filtered = blogsData
        .filter((b) => b.is_published && Number(b.language_id) === langId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 8);

      setBlogs(filtered);
    } catch (err) {
      console.error("BLOG SECTION ERROR:", err);
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

  // ================= LOOP =================
  const loopedBlogs = [...blogs, ...blogs];

  // ================= AUTO SLIDE =================
  useEffect(() => {
    if (!blogs.length) return;

    const interval = setInterval(() => {
      if (!isPaused.current) {
        setIndex((prev) => prev + 1);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [blogs]);

  // ================= RESET =================
  useEffect(() => {
    if (index >= blogs.length && blogs.length > 0) {
      const timeout = setTimeout(() => {
        setIndex(0);
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [index, blogs.length]);

  // ================= NAVIGATION =================
  const next = () => {
    setIndex((prev) => prev + 1);
  };

  const prev = () => {
    setIndex((prev) => (prev <= 0 ? blogs.length - 1 : prev - 1));
  };

  // ================= IMAGE =================
  const getImage = (img) =>
    img ? (img.startsWith("http") ? img : `${BASE_URL}${img}`) : defaultImg;

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
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

  // ================= EMPTY =================
  if (!blogs.length) {
    return null;
  }

  return (
       <section
      className="
    py-20
    bg-gradient-to-r
    from-sky-200
    via-teal-100
    via-cyan-100
    to-blue-200
    bg-[length:300%_300%]
    animate-waterFlow
  "
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* ================= HEADER ================= */}
        <div
          className="
            text-center
            mb-14
            max-w-3xl
            mx-auto
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
            {section?.section_title || "Latest Blogs"}
          </h2>

          <p className="text-gray-600">{section?.section_description}</p>

          <Link
            to="/blogs"
            className="mt-6 text-blue-600 font-semibold hover:underline hover:text-black bg-transparent border-none transition-all"
        
          >
            See All →
          </Link>
        </div>

        {/* ================= SLIDER ================= */}
        <div
          className="
            relative
            px-2
            md:px-6
          "
          onMouseEnter={() => (isPaused.current = true)}
          onMouseLeave={() => (isPaused.current = false)}
        >
          {/* LEFT */}
          <button
            onClick={prev}
            className="
              absolute
              left-0
              md:-left-4
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

          {/* RIGHT */}
          <button
            onClick={next}
            className="
              absolute
              right-0
              md:-right-4
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

          {/* TRACK */}
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
              {loopedBlogs.map((blog, idx) => (
                <div
                  key={`${blog.blog_id}-${idx}`}
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
                        h-full
                        bg-white
                        rounded-3xl
                        overflow-hidden
                        border
                        border-gray-100
                        shadow-md
                        hover:shadow-2xl
                        transition-all
                        duration-500
                        flex
                        flex-col
                      "
                  >
                    {/* IMAGE */}
                    <div
                      className="
                          relative
                          h-60
                          overflow-hidden
                        "
                    >
                      <img
                        src={getImage(blog.blog_image)}
                        onError={(e) => {
                          e.target.src = defaultImg;
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

                      {/* TYPE */}
                      <div
                        className="
                            absolute
                            top-4
                            left-4
                            bg-blue-600
                            text-white
                            text-xs
                            px-3
                            py-1
                            rounded-full
                            capitalize
                          "
                      >
                        {blog.blog_type || "Article"}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div
                      className="
                          p-6
                          flex
                          flex-col
                          flex-1
                        "
                    >
                      {/* TITLE */}
                      <h3
                        className="
                            text-xl
                            font-bold
                            text-gray-900
                            mb-3
                            line-clamp-2
                          "
                      >
                        {blog.blog_title}
                      </h3>

                      {/* TEXT */}
                      <p
                        className="
                            text-gray-600
                            text-sm
                            leading-7
                            text-justify
                            line-clamp-4
                            flex-1
                          "
                      >
                        {blog.blog_text}
                      </p>

                      {/* FOOTER */}
                      <div
                        className="
                            mt-6
                            pt-4
                            border-t
                            flex
                            items-center
                            justify-between
                          "
                      >
                        {/* STATS */}
                        <div
                          className="
                              flex
                              items-center
                              gap-4
                              text-sm
                              text-gray-500
                            "
                        >
                          <div className="flex items-center gap-1">
                            <FiEye />
                            {blog.blog_views || 0}
                          </div>

                          <div className="flex items-center gap-1">
                            <FiHeart />
                            {blog.blog_likes || 0}
                          </div>

                          <div className="flex items-center gap-1">
                            <FiShare2 />
                            {blog.blog_shares || 0}
                          </div>
                        </div>

                        {/* DATE */}
                        <p
                          className="
                            text-xs
                            text-gray-400
                            mb-2
                          "
                        >
                          {formatDate(blog.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
