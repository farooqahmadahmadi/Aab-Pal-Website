import { useState } from "react";

import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function BlogGallery({ blog, baseUrl }) {
  const [expanded, setExpanded] = useState(false);

  // ================= MAIN IMAGE =================
  const mainImage = blog.blog_image;

  // ================= EXTRA IMAGES =================
  const extraImages = blog.blog_images || [];

  // ================= NO IMAGES =================
  if (!mainImage && extraImages.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* ================= MAIN IMAGE ================= */}
      {mainImage && (
        <div className="relative group overflow-hidden">
          <img
            src={baseUrl + mainImage}
            alt={blog.blog_title}
            className="
              w-full
              max-h-[520px]
              object-cover
              transition duration-700
              group-hover:scale-[1.015]
            "
          />

          {/* ================= VIEW ALL BUTTON ================= */}
          {extraImages.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="
                absolute bottom-4 right-4
                bg-white/10
                backdrop-blur-xl
                border border-white/20
                text-white
                px-4 py-2
                rounded-full
                text-sm font-medium
                flex items-center gap-2
                shadow-lg
                hover:bg-white/20
                hover:scale-105
                transition-all duration-300
              "
            >
              {expanded ? (
                <>
                  Show Less
                  <FiChevronUp />
                </>
              ) : (
                <>
                  View All ({extraImages.length}
                  )
                  <FiChevronDown />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* ================= EXPANDED GALLERY ================= */}
      {expanded && extraImages.length > 0 && (
        <div
          className="
              px-3 py-4
              space-y-6
              bg-gradient-to-b
              from-gray-50
              via-white
              to-white
            "
        >
          {extraImages.map((img, index) => (
            <div
              key={index}
              className="
                    overflow-hidden
                    rounded-[28px]
                    bg-white
                    border border-gray-100
                    shadow-sm
                    hover:shadow-xl
                    transition-all duration-500
                  "
            >
              {/* ================= IMAGE ================= */}
              <div className="overflow-hidden">
                <img
                  src={baseUrl + img.image_path}
                  alt={img.image_alt}
                  className="
                        w-full
                        max-h-[500px]
                        object-cover
                        hover:scale-[1.02]
                        transition duration-700
                      "
                />
              </div>

              {/* ================= TITLE ================= */}
              {img.image_title && (
                <div className="px-5 py-4">
                  <h3
                    className="
                          text-gray-800
                          font-semibold
                          text-lg
                          leading-relaxed
                        "
                  >
                    {img.image_title}
                  </h3>
                </div>
              )}
            </div>
          ))}

          {/* ================= COLLAPSE BUTTON ================= */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setExpanded(false)}
              className="
                  px-6 py-3
                  rounded-full
                  bg-gray-900
                  text-white
                  font-medium
                  flex items-center gap-2
                  hover:bg-black
                  hover:scale-105
                  transition-all duration-300
                  shadow-lg
                "
            >
              Show Less
              <FiChevronUp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
