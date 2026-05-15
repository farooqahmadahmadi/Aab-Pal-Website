import { useEffect, useState, useRef } from "react";
import {
  getBlogComments,
  createBlogComment,
  likeBlogComment,
} from "../../../services/blogComments.service";

import {
  FiCornerDownRight,
  FiX,
  FiMail,
  FiImage,
  FiHeart,
} from "react-icons/fi";

import defaultUserImg from "../../../assets/images/user-def-image.png";

export default function BlogComments({
  blogId,
  onCommentsCountChange,
  openModal,
  setOpenModal,
}) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fileRef = useRef(null);
  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  // ================= IMAGE =================
  const getImage = (img) => {
    if (!img) return defaultUserImg;
    if (img.startsWith("http")) return img;
    return `${BASE_URL}${img}`;
  };

  // ================= FETCH =================
  const fetchComments = async () => {
    try {
      setFetching(true);

      const res = await getBlogComments();
      const list = Array.isArray(res) ? res : res?.data || [];

      const filtered = list.filter((c) => Number(c.blog_id) === Number(blogId));

      const likedComments = JSON.parse(
        localStorage.getItem("likedComments") || "[]",
      );

      const map = {};

      filtered.forEach((c) => {
        c.replies = [];
        c._liked = likedComments.includes(c.comment_id);
        c.likes = c.comment_likes || 0;
        map[c.comment_id] = c;
      });

      const roots = [];

      filtered.forEach((c) => {
        if (c.parent_id) {
          map[c.parent_id]?.replies.push(c);
        } else {
          roots.push(c);
        }
      });

      setComments(roots);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  // ================= COUNT SYNC =================
  useEffect(() => {
    onCommentsCountChange?.(countAll(comments));
  }, [comments]);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("blog_id", blogId);
      formData.append("comment_text", text);
      formData.append("visitor_email", email);
      formData.append("parent_id", replyTo || "");

      if (photo) formData.append("visitor_photo", photo);

      await createBlogComment(formData);

      setText("");
      setEmail("");
      setPhoto(null);
      setReplyTo(null);
      setOpenModal(false);

      await fetchComments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LIKE =================
  const handleLikeComment = async (commentId) => {
    try {
      const likedComments = JSON.parse(
        localStorage.getItem("likedComments") || "[]",
      );

      if (likedComments.includes(commentId)) return;

      const res = await likeBlogComment(commentId);

      likedComments.push(commentId);
      localStorage.setItem("likedComments", JSON.stringify(likedComments));

      const updateTree = (list) =>
        list.map((c) => {
          if (c.comment_id === commentId) {
            return { ...c, _liked: true, likes: res.likes };
          }

          return {
            ...c,
            replies: c.replies ? updateTree(c.replies) : [],
          };
        });

      setComments(updateTree(comments));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= REPLY =================
  const handleReply = (comment) => {
    setReplyTo(comment.comment_id);
    setOpenModal(true);
  };

  // ================= COUNT =================
  const countAll = (list) => {
    let count = 0;

    const walk = (arr) => {
      arr.forEach((c) => {
        count++;
        if (c.replies?.length) walk(c.replies);
      });
    };

    walk(list);
    return count;
  };

  // ================= RENDER =================
  const renderComments = (list, level = 0) =>
    list.map((c) => (
      <div
        key={c.comment_id}
        className={`p-4 mb-3 ${
          level > 0 ? "ml-1 border-l-2 border-l-gray-100" : ""
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <img
            src={getImage(c.visitor_photo)}
            onError={(e) => (e.target.src = defaultUserImg)}
            className="w-8 h-8 rounded-full object-cover border"
          />
          <span
            className="
    text-xs text-gray-600
    bg-gray-100
    px-2 py-1
    rounded-full
    max-w-[180px]
    truncate
    inline-block
  "
          >
            {c.visitor_email || "Anonymous"}
          </span>
        </div>

        <p className="text-sm text-gray-700">{c.comment_text}</p>

        <div className="flex gap-4 mt-2 text-xs items-center">
          <div
            onClick={() => handleLikeComment(c.comment_id)}
            className={`flex items-center gap-1  p-1 cursor-pointer  hover:scale-125 transition-transform duration-200${
              c._liked ? "text-red-500" : "text-gray-500"
            }`}
          >
            <FiHeart
              className={`
      transition-all duration-300
      ${c._liked ? "text-red-500 fill-current" : ""}
      ${c._liked ? "scale-125" : "scale-100"}
    `}
            />

            <span className="transition-all duration-300">{c.likes || 0}</span>
          </div>

          <div
            onClick={() => handleReply(c)}
            className="text-blue-600 flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            <FiCornerDownRight />
            Reply
          </div>
        </div>

        {c.replies?.length > 0 && (
          <div className="mt-3">{renderComments(c.replies, level + 1)}</div>
        )}
      </div>
    ));

  return (
    <div>
      {/* <h2 className="text-lg font-bold mb-4 flex justify-between">
        <span>Comments</span>
        <span className="text-sm text-gray-500">{countAll(comments)}</span>
      </h2>

      <button
        onClick={() => setOpenModal(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
      >
        Add Comment
      </button> */}

      <div>{renderComments(comments)}</div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-5 rounded-2xl border">
            <div className="flex justify-between mb-3">
              <h3 className="font-bold text-lg">
                {replyTo ? "Reply Comment" : "Add Comment"}
              </h3>

              <FiX
                className="cursor-pointer"
                onClick={() => setOpenModal(false)}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center border rounded-xl px-3">
                <FiMail className="text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 outline-none text-sm"
                />
              </div>

              <div
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer"
              >
                <FiImage />
                <span>{photo ? photo.name : "Upload Photo"}</span>
              </div>

              <input
                type="file"
                hidden
                ref={fileRef}
                onChange={(e) => setPhoto(e.target.files[0])}
              />

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="w-full border p-3 rounded-xl text-sm"
              />

              <button className="w-full bg-blue-600 text-white py-2 rounded-xl">
                {loading ? "Posting..." : "Post Comment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
