import { useEffect, useMemo, useState } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiTag,
} from "react-icons/fi";

import userImg from "../../../assets/images/user-def-image.png";

import { getBlogs } from "../../../services/blogsPage.service";

export default function BlogsPage() {
  // ================= STATES =================
  const [blogs, setBlogs] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  // ================= RANDOM BLOGS =================
  const randomBlogs = useMemo(() => {
    return [...blogs].sort(() => Math.random() - 0.5);
  }, [blogs]);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getBlogs();

        const data = Array.isArray(res)
          ? res
          : res?.data || [];

        const published = data.filter((b) => b.is_published);

        setBlogs(published);
      } catch (err) {
        console.error("BLOGS PAGE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleString();
  };

  // ================= TOGGLE =================
  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Latest Blogs
          </h1>

          <p className="text-gray-500 mt-4">
            Explore stories, ideas and updates from our latest posts.
          </p>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="text-center py-20 text-gray-500">
            Loading blogs...
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && randomBlogs.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No blogs found.
          </div>
        )}

        {/* ================= BLOGS ================= */}
        <div className="space-y-8">
          {randomBlogs.map((blog) => {
            const isOpen = expanded[blog.blog_id];

            return (
              <div
                key={blog.blog_id}
                className="
                  bg-white
                  rounded-[28px]
                  overflow-hidden
                  border border-gray-200
                  shadow-md
                  hover:shadow-2xl
                  transition-all duration-500
                "
              >
                {/* ================= TOP ================= */}
                <div className="flex items-center gap-4 p-5">

                  {/* PROFILE */}
                  <img
                    src={userImg}
                    alt="user"
                    className="
                      w-14 h-14 rounded-full
                      object-cover
                      border-2 border-blue-100
                    "
                  />

                  {/* INFO */}
                  <div className="flex-1">
                    <h2 className="font-bold text-gray-800 text-lg">
                      {blog.blog_author_name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">

                      {/* TIME */}
                      <div className="flex items-center gap-1">
                        <FiClock />
                        {formatDate(blog.created_at)}
                      </div>

                    </div>
                  </div>
                </div>

                {/* ================= TITLE ================= */}
                <div className="px-5 pb-2">
                  <h3 className="text-2xl font-bold text-gray-800 leading-snug">
                    {blog.blog_title}
                  </h3>
                </div>

                {/* ================= TEXT ================= */}
                <div className="px-5 pb-4">
                  <div
                    className={`
                      text-gray-600 leading-8 text-[15px]
                      transition-all duration-300 whitespace-pre-line
                      ${!isOpen ? "line-clamp-3" : ""}
                    `}
                  >
                    {blog.blog_text}
                  </div>

                  {/* SEE MORE */}
                  <button
                    onClick={() => toggleExpand(blog.blog_id)}
                    className="
                      mt-3
                      inline-flex items-center gap-1
                      text-blue-600
                      hover:text-blue-700
                      font-semibold
                      transition
                    "
                  >
                    {isOpen ? (
                      <>
                        Show Less <FiChevronUp />
                      </>
                    ) : (
                      <>
                        See More <FiChevronDown />
                      </>
                    )}
                  </button>
                </div>

                {/* ================= IMAGE ================= */}
                {blog.blog_image && (
                  <div className="relative overflow-hidden">

                    <img
                      src={BASE_URL + blog.blog_image}
                      alt={blog.blog_title}
                      className="
                        w-full max-h-[500px]
                        object-cover
                        transition duration-700
                        hover:scale-105
                      "
                    />

                    {/* ================= BOTTOM OVERLAY ================= */}
                    <div
                      className="
                        absolute bottom-0 left-0 right-0
                        flex items-center justify-between
                        px-4 py-3
                        bg-gradient-to-t from-black/70 to-transparent
                        text-white text-sm
                      "
                    >
                      {/* TYPE */}
                      <div className="flex items-center gap-2">
                        <FiTag />
                        <span>
                          {blog.blog_type || "General"}
                        </span>
                      </div>

                      {/* VIEWS */}
                      <div className="flex items-center gap-2">
                        <FiEye />
                        <span>{blog.blog_views || 0}</span>
                      </div>
                    </div>

                  </div>
                )}

                {/* ================= ACTIONS ================= */}
                <div
                  className="
                    flex items-center justify-around
                    border-t
                    px-2 py-3
                    bg-gray-50
                  "
                >
                  {/* LIKE */}
                  <button
                    className="
                      flex items-center gap-2
                      text-gray-600
                      hover:text-red-500
                      transition
                      font-medium
                    "
                  >
                    <FiHeart className="text-lg" />
                    <span>{blog.blog_likes || 0}</span>
                  </button>

                  {/* COMMENT */}
                  <button
                    className="
                      flex items-center gap-2
                      text-gray-600
                      hover:text-blue-500
                      transition
                      font-medium
                    "
                  >
                    <FiMessageCircle className="text-lg" />
                    <span>{blog.comments_count || 0}</span>
                  </button>

                  {/* SHARE */}
                  <button
                    className="
                      flex items-center gap-2
                      text-gray-600
                      hover:text-green-500
                      transition
                      font-medium
                    "
                  >
                    <FiShare2 className="text-lg" />
                    <span>{blog.blog_shares || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}