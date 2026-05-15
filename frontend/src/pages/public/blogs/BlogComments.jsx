import { useEffect, useState, useRef } from "react";
import {
  getBlogComments,
  createBlogComment,
  likeBlogComment,
} from "../../../services/blogComments.service";

import {
  FiUser,
  FiCornerDownRight,
  FiX,
  FiMail,
  FiImage,
  FiHeart,
} from "react-icons/fi";

import defaultUserImg from "../../../assets/images/user-def-image.png";

export default function BlogComments({ blogId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const fileRef = useRef(null);

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

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

      // ================= LIKED STATE RESTORE =================
      const likedComments = JSON.parse(
        localStorage.getItem("likedComments") || "[]",
      );

      const map = {};

      filtered.forEach((c) => {
        c.replies = [];
        c._liked = likedComments.includes(c.comment_id);

        // IMPORTANT
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

      if (photo) {
        formData.append("visitor_photo", photo);
      }

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

      // already liked
      if (likedComments.includes(commentId)) {
        return;
      }

      const res = await likeBlogComment(commentId);

      // save local
      likedComments.push(commentId);

      localStorage.setItem("likedComments", JSON.stringify(likedComments));

      // update UI
      const updateTree = (list) =>
        list.map((c) => {
          if (c.comment_id === commentId) {
            return {
              ...c,
              _liked: true,
              likes: res.likes,
            };
          }

          return {
            ...c,
            replies: c.replies ? updateTree(c.replies) : [],
          };
        });

      setComments(updateTree(comments));
    } catch (err) {
      console.error("LIKE ERROR:", err);
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

        if (c.replies?.length) {
          walk(c.replies);
        }
      });
    };

    walk(list);

    return count;
  };

  // ================= RENDER =================
  const renderComments = (list, level = 0) => {
    return list.map((c) => (
      <div
        key={c.comment_id}
        className={`p-4 mb-3 ${
          level > 0 ? "ml-5 border-l-2 border-l-gray-200 rounded-bl-md" : ""
        }`}
      >
        {/* USER */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={getImage(c.visitor_photo)}
            onError={(e) => (e.target.src = defaultUserImg)}
            className="w-8 h-8 rounded-full object-cover border"
          />

          <span className="text-xs text-gray-600">
            {c.visitor_email || "Anonymous"}
          </span>
        </div>

        {/* TEXT */}
        <p className="text-sm text-gray-700">{c.comment_text}</p>

        {/* ACTIONS */}
        <div className="flex gap-4 mt-2 text-xs items-center">
          {/* LIKE */}
          <button
            onClick={() => handleLikeComment(c.comment_id)}
            className={`flex items-center gap-1 transition ${
              c._liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <FiHeart
              className={`
                transition-all duration-300
                ${c._liked ? "fill-current text-red-500" : ""}
              `}
            />

            {c.likes || 0}
          </button>

          {/* REPLY */}
          <div
            onClick={() => handleReply(c)}
            className="text-blue-600 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <FiCornerDownRight />
            Reply
          </div>
        </div>

        {/* REPLIES */}
        {c.replies?.length > 0 && (
          <div className="mt-3">{renderComments(c.replies, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="mt-8 border-t pt-6 max-h-[500px] overflow-y-auto pr-2">
      {/* HEADER */}
      <h2 className="text-lg font-bold mb-4 flex justify-between">
        <span>Comments</span>

        <span className="text-sm text-gray-500">{countAll(comments)}</span>
      </h2>

      {/* ADD */}
      <button
        onClick={() => setOpenModal(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
      >
        Add Comment
      </button>

      {/* LIST */}
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
                  placeholder="Your email (for gravatar)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 outline-none text-sm"
                />
              </div>

              {/* PHOTO UPLOAD */}
              <div
                onClick={() => fileRef.current.click()}
                className="
    flex items-center gap-2
    border rounded-xl
    px-3 py-2
    cursor-pointer
    text-sm text-gray-600
    hover:bg-gray-50
    transition
  "
              >
                <FiImage />

                <span>{photo ? photo.name : "Upload Photo"}</span>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (!file) return;

                  setPhoto(file);
                }}
              />

              <textarea
                value={text}
                placeholder="Your comment..."
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
