import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import {
  likeBlog,
  shareBlog,
  viewBlog,
} from "../../../services/blogsPage.service";

import { BlogAuthor, BlogStats } from "./BlogMeta";
import BlogGallery from "./BlogGallery";
import BlogComments from "./BlogComments";

export default function BlogCard({ blog, baseUrl }) {
  const [open, setOpen] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);

  const [likes, setLikes] = useState(blog.blog_likes || 0);
  const [shares, setShares] = useState(blog.blog_shares || 0);
  const [views, setViews] = useState(blog.blog_views || 0);

  const [commentsCount, setCommentsCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const viewedRef = useRef(false);
  const cardRef = useRef(null);
  const timerRef = useRef(null);

  // ================= LIKE STORAGE =================
  useEffect(() => {
    const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
    setLiked(likedBlogs.includes(blog.blog_id));
  }, [blog.blog_id]);

  // ================= VIEW COUNTER =================
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !viewedRef.current) {
          timerRef.current = setTimeout(async () => {
            try {
              viewedRef.current = true;
              const res = await viewBlog(blog.blog_id);
              setViews(res.views);
            } catch (err) {
              console.error("VIEW ERROR:", err);
            }
          }, 3000);
        } else {
          if (timerRef.current) clearTimeout(timerRef.current);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [blog.blog_id]);

  // ================= LIKE =================
  const handleLike = async () => {
    try {
      const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");

      if (likedBlogs.includes(blog.blog_id)) return;

      const updated = [...likedBlogs, blog.blog_id];
      localStorage.setItem("likedBlogs", JSON.stringify(updated));

      setLiked(true);

      const res = await likeBlog(blog.blog_id);
      setLikes(res.likes);
    } catch (err) {
      console.error("LIKE ERROR:", err);
    }
  };

  // ================= SHARE =================
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const res = await shareBlog(blog.blog_id);
      setShares(res.shares);
    } catch (err) {
      console.error("SHARE ERROR:", err);
    }
  };

  // ================= COMMENTS TOGGLE =================
  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  // ================= ADD COMMENT (MODAL FIXED) =================
  const handleAddComment = () => {
    setShowComments(true);
    setOpenCommentModal(true);
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500"
    >
      {/* AUTHOR */}
      <div className="p-5">
        <BlogAuthor
          author={blog.blog_author_name}
          created_at={blog.created_at}
          type={blog.blog_type}
        />
      </div>

      {/* TITLE */}
      <div className="px-5 pb-2">
        <h3 className="text-2xl font-bold text-gray-800 leading-snug">
          {blog.blog_title}
        </h3>
      </div>

      {/* TEXT */}
      <div className="px-5 pb-5">
        <div
          className={`text-gray-600 leading-8 text-[15px] whitespace-pre-line ${
            !open ? "line-clamp-3" : ""
          }`}
        >
          {blog.blog_text}
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="mt-3 inline-flex items-center gap-1 text-blue-600 font-semibold cursor-pointer"
        >
          {open ? (
            <>
              Show Less <FiChevronUp />
            </>
          ) : (
            <>
              See More... <FiChevronDown />
            </>
          )}
        </div>
      </div>

      {/* GALLERY */}
      <BlogGallery blog={blog} baseUrl={baseUrl} />

      {/* STATS */}
      <div className="border-t bg-gray-50 px-6 py-0">
        <BlogStats
          likes={likes}
          comments={commentsCount ?? 0}
          shares={shares}
          views={views}
          onLike={handleLike}
          onShare={handleShare}
          onToggleComments={handleToggleComments}
          onAddComment={handleAddComment}
          showComments={showComments}
          blogId={blog.blog_id}
        />
      </div>

      {/* COMMENTS (IMPORTANT FIX: always mounted) */}
      <div className={`px-5 pb-6 ${showComments ? "block" : "hidden"}`}>
        <BlogComments
          blogId={blog.blog_id}
          onCommentsCountChange={setCommentsCount}
          openModal={openCommentModal}
          setOpenModal={setOpenCommentModal}
        />
      </div>
    </div>
  );
}
