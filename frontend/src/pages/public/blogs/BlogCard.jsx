import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import {
  BlogAuthor,
  BlogDate,
  BlogStats,
  BlogTypeBadge,
} from "./BlogMeta";

import BlogGallery from "./BlogGallery";

export default function BlogCard({ blog, baseUrl }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-[28px] overflow-hidden border shadow-md">

      {/* TOP */}
      <div className="p-5 flex justify-between items-center">
        <BlogAuthor author={blog.blog_author_name} />
        <BlogDate created_at={blog.created_at} />
      </div>

      {/* TITLE */}
      <div className="px-5 pb-2">
        <h3 className="text-2xl font-bold text-gray-800">
          {blog.blog_title}
        </h3>
      </div>

      {/* TEXT */}
      <div className="px-5 pb-4">
        <div className={!open ? "line-clamp-3 text-gray-600" : "text-gray-600"}>
          {blog.blog_text}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-blue-600 mt-2 flex items-center gap-1"
        >
          {open ? (
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

      {/* ================= FACEBOOK STYLE GALLERY ================= */}
      <BlogGallery blog={blog} baseUrl={baseUrl} />

      {/* TYPE + STATS */}
      <div className="px-5 py-3 flex justify-between items-center border-t">
        <BlogTypeBadge type={blog.blog_type} />

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