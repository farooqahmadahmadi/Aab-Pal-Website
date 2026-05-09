import userImg from "../../../assets/images/user-def-image.png";

import {
  FiClock,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiEye,
  FiTag,
} from "react-icons/fi";

// ================= AUTHOR =================
export function BlogAuthor({ author }) {
  return (
    <div className="flex items-center gap-4">
      <img
        src={userImg}
        alt="user"
        className="
          w-14 h-14 rounded-full
          object-cover
          border-2 border-blue-100
        "
      />

      <div>
        <h2 className="font-bold text-gray-800 text-lg">
          {author || "Unknown"}
        </h2>
      </div>
    </div>
  );
}

// ================= DATE =================
export function BlogDate({ created_at }) {
  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      <FiClock />
      {formatDate(created_at)}
    </div>
  );
}

// ================= TYPE =================
export function BlogTypeBadge({ type }) {
  return (
    <div className="flex items-center gap-2">
      <FiTag />
      <span>{type || "General"}</span>
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
}) {
  // ONLY VIEWS
  if (onlyViews) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <FiEye />
        <span>{views || 0}</span>
      </div>
    );
  }

  return (
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
        <span>{likes || 0}</span>
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
        <span>{comments || 0}</span>
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
        <span>{shares || 0}</span>
      </button>
    </div>
  );
}
