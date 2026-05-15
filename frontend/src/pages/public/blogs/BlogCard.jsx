import { useEffect, useRef, useState } from "react";

import { FiChevronDown, FiChevronUp, FiMessageCircle } from "react-icons/fi";

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

  const [likes, setLikes] = useState(blog.blog_likes || 0);
  const [shares, setShares] = useState(blog.blog_shares || 0);
  const [views, setViews] = useState(blog.blog_views || 0);

  const [commentsCount, setCommentsCount] = useState(
    blog.comments_count || 0
  );

  const [liked, setLiked] = useState(false);

  const viewedRef = useRef(false);
  const cardRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
    setLiked(likedBlogs.includes(blog.blog_id));
  }, [blog.blog_id]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
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
    }, { threshold: 0.6 });

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [blog.blog_id]);

  const handleLike = async () => {
    try {
      const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");

      const isLiked = likedBlogs.includes(blog.blog_id);

      if (isLiked) {
        const updated = likedBlogs.filter((id) => id !== blog.blog_id);
        localStorage.setItem("likedBlogs", JSON.stringify(updated));
        setLiked(false);

        const res = await likeBlog(blog.blog_id, "remove");
        setLikes(res.likes);
        return;
      }

      const updated = [...likedBlogs, blog.blog_id];
      localStorage.setItem("likedBlogs", JSON.stringify(updated));

      setLiked(true);

      const res = await likeBlog(blog.blog_id, "add");
      setLikes(res.likes);
    } catch (err) {
      console.error("LIKE ERROR:", err);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      const res = await shareBlog(blog.blog_id);
      setShares(res.shares);
    } catch (err) {
      console.error("SHARE ERROR:", err);
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500"
    >
      <div className="p-5">
        <BlogAuthor
          author={blog.blog_author_name}
          created_at={blog.created_at}
          type={blog.blog_type}
        />
      </div>

      <div className="px-5 pb-2">
        <h3 className="text-2xl font-bold text-gray-800 leading-snug">
          {blog.blog_title}
        </h3>
      </div>

      <div className="px-5 pb-5">
        <div className={`text-gray-600 leading-8 text-[15px] whitespace-pre-line ${
          !open ? "line-clamp-3" : ""
        }`}>
          {blog.blog_text}
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="mt-3 inline-flex items-center gap-1 text-blue-600 font-semibold cursor-pointer"
        >
          {open ? (
            <>Show Less <FiChevronUp /></>
          ) : (
            <>See More... <FiChevronDown /></>
          )}
        </div>
      </div>

      <BlogGallery blog={blog} baseUrl={baseUrl} />

      {/* STATS + COMMENT TOGGLE */}
      <div className="border-t bg-gray-50 px-6 py-0">
        <BlogStats
          likes={likes}
          comments={commentsCount}
          shares={shares}
          views={views}
          onLike={handleLike}
          onShare={handleShare}
          blogId={blog.blog_id}
        />
      </div>

      {/* COMMENT BUTTON (NEW UX) */}
      <div className="px-6 pb-4">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm text-blue-600 font-semibold mt-3"
        >
          <FiMessageCircle />
          {showComments ? "Hide Comments" : "View Comments"}
        </button>
      </div>

      {/* COMMENTS (ONLY ONE PLACE NOW) */}
      {showComments && (
        <div className="px-5 pb-6">
          <BlogComments blogId={blog.blog_id} />
        </div>
      )}
    </div>
  );
}