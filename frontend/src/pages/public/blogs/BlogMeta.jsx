import { useEffect, useRef, useState } from "react";
import userImg from "../../../assets/images/user-def-image.png";

import {
  FiClock,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiEye,
  FiTag,
  FiPlusCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

// ================= AUTHOR =================
export function BlogAuthor({ author, created_at, type }) {
  const formatDate = (date) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="flex items-center gap-4">
      <img
        src={userImg}
        alt="user"
        className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
      />

      <div>
        <h2 className="font-bold text-gray-800 text-lg leading-tight">
          {author || "Unknown"}
        </h2>

        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FiTag className="text-[13px]" />
            <span>{type || "General"}</span>
          </div>

          <div className="flex items-center gap-1">
            <FiClock className="text-[13px]" />
            <span>{formatDate(created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= STATS =================
export function BlogStats({
  likes,
  comments,
  shares,
  views,
  onlyViews = false,
  onLike,
  onShare,
  onToggleComments,
  onAddComment,
  showComments,
  blogId,
}) {
  const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false);

  const [openMenu, setOpenMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const menuRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // check like state
  useEffect(() => {
    const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
    if (likedBlogs.includes(blogId)) setLiked(true);
  }, [blogId]);

  // LIKE
  const handleLikeClick = async () => {
    if (liked) return;

    try {
      await onLike();
      setLiked(true);
      setAnimate(true);

      setTimeout(() => setAnimate(false), 500);

      const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
      likedBlogs.push(blogId);
      localStorage.setItem("likedBlogs", JSON.stringify(likedBlogs));
    } catch (err) {
      console.error("LIKE ERROR:", err);
    }
  };

  // SHARE (FIXED + COPIED MESSAGE)
  const handleShareClick = async () => {
    try {
      await onShare();

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("SHARE ERROR:", err);
    }
  };

  if (onlyViews) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <FiEye />
        <span>{views || 0}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center border-t px-6 py-4 bg-gray-50">
      {/* LIKE */}
      <div className="flex-1 flex justify-start hover:scale-105 transition-transform duration-500">
        <div
          onClick={handleLikeClick}
          className={`flex items-center gap-2 cursor-pointer transition-all duration-300 ${
            liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
          }`}
        >
          <FiHeart
            size={22}
            className={`transition-all duration-300 ${
              liked ? "fill-current" : ""
            } ${animate ? "scale-150" : "scale-100"}`}
          />
          <span>{likes || 0}</span>
        </div>
      </div>

      {/* COMMENTS */}
      <div
        ref={menuRef}
        className="flex-1 flex justify-center relative hover:scale-105 transition-transform duration-500"
      >
        <div
          onClick={() => setOpenMenu(!openMenu)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500 cursor-pointer"
        >
          <FiMessageCircle size={22} />
          <span>{comments || 0}</span>
          {openMenu ? <FiChevronUp /> : <FiChevronDown />}
        </div>

        {openMenu && (
          <div className="absolute bottom-10 z-30 bg-white border rounded-xl shadow-lg min-w-[190px] overflow-hidden">
            <div
              onClick={() => {
                onToggleComments();
                setOpenMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
            >
              <FiMessageCircle />
              {showComments ? "Hide Comments" : "View Comments"}
            </div>

            <div
              onClick={() => {
                onAddComment();
                setOpenMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
            >
              <FiPlusCircle />
              Add Comment
            </div>
          </div>
        )}
      </div>

      {/* SHARE */}
      <div className="flex-1 flex justify-end flex-col items-end">
        <div
          onClick={handleShareClick}
          className="flex items-center gap-2 text-gray-600 hover:text-green-500 cursor-pointer hover:scale-105 transition-transform duration-500"
        >
          <FiShare2 size={22} />
          <span>{shares || 0}</span>
        </div>

        {/* COPIED MESSAGE */}
        {copied && (
          <div className="text-green-600 text-xs mt-1">Link copied ✔</div>
        )}
      </div>
    </div>
  );
}
