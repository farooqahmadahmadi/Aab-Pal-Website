import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { BlogAuthor, BlogStats } from "./BlogMeta";

import BlogGallery from "./BlogGallery";

export default function BlogCard({ blog, baseUrl }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        bg-white
        rounded-[28px]
        overflow-hidden
        border border-gray-200
        shadow-sm
        hover:shadow-lg
        transition-all duration-500
      "
    >
      {/* ================= TOP ================= */}
      <div className="p-5">
        <BlogAuthor
          author={blog.blog_author_name}
          created_at={blog.created_at}
          type={blog.blog_type}
        />
      </div>

      {/* ================= TITLE ================= */}
      <div className="px-5 pb-2">
        <h3
          className="
            text-2xl
            font-bold
            text-gray-800
            leading-snug
          "
        >
          {blog.blog_title}
        </h3>
      </div>

      {/* ================= TEXT ================= */}
      <div className="px-5 pb-5">
        <div
          className={`
            text-gray-600
            leading-8
            text-[15px]
            whitespace-pre-line
            transition-all duration-300
            ${!open ? "line-clamp-3" : ""}
          `}
        >
          {blog.blog_text}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="
            mt-3
            inline-flex
            items-center
            gap-1
            text-blue-600
            hover:text-blue-700
            font-semibold
            transition
          "
        >
          {open ? (
            <>
              Show Less
              <FiChevronUp />
            </>
          ) : (
            <>
              See More
              <FiChevronDown />
            </>
          )}
        </button>
      </div>

      {/* ================= GALLERY ================= */}
      <BlogGallery blog={blog} baseUrl={baseUrl} />

      {/* ================= STATS ================= */}
      <div
        className="
          border-t
          bg-gray-50
          px-6 py-0
        "
      >
        <BlogStats
          likes={blog.blog_likes}
          comments={blog.comments_count}
          shares={blog.blog_shares}
          views={blog.blog_views}
        />
      </div>
    </div>
  );
}
