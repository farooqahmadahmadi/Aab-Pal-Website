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
export function BlogAuthor({ author, created_at, type }) {
  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="flex items-center gap-4">
      {/* PROFILE IMAGE */}
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
      <div>
        {/* AUTHOR */}
        <h2
          className="
            font-bold
            text-gray-800
            text-lg
            leading-tight
          "
        >
          {author || "Unknown"}
        </h2>

        {/* DATE + TYPE */}
        <div
          className="
            flex flex-wrap
            items-center gap-3
            mt-1
            text-sm text-gray-500
          "
        >
          {/* TYPE */}
          <div className="flex items-center gap-1">
            <FiTag className="text-[13px]" />

            <span>{type || "General"}</span>
          </div>

          {/* DATE */}
          <div className="flex items-center gap-1">
            <FiClock className="text-[13px]" />

            <span>{formatDate(created_at)}</span>
          </div>
        </div>
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
        flex items-center
        border-t
        px-6 py-3
        bg-gray-50
      "
    >
      {/* LIKE */}
      <div className="flex-1 flex justify-start">
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
      </div>

      {/* COMMENT */}
      <div className="flex-1 flex justify-center">
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
      </div>

      {/* SHARE */}
      <div className="flex-1 flex justify-end">
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
    </div>
  );
}
