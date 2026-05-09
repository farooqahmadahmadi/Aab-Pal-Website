import { useState } from "react";

export default function BlogGallery({ blog, baseUrl }) {
  const [open, setOpen] = useState(false);

  const mainImage = blog.blog_image;
  const extraImages = blog.blog_images || [];

  const allImages = mainImage
    ? [
        {
          image_path: mainImage,
          image_title: "Main Image",
        },
        ...extraImages,
      ]
    : extraImages;

  const preview = allImages.slice(0, 4);
  const remaining = allImages.length - 4;

  if (!allImages.length) return null;

  return (
    <div className="w-full">

      {/* ================= MAIN IMAGE ================= */}
      <div className="relative">
        <img
          src={baseUrl + mainImage}
          alt="main"
          className="w-full max-h-[520px] object-cover"
        />

        {allImages.length > 1 && (
          <button
            onClick={() => setOpen(true)}
            className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm"
          >
            {remaining > 0 ? remaining + 1 + "+" : "View"}
          </button>
        )}
      </div>

      {/* ================= PREVIEW GRID ================= */}
      <div className="grid grid-cols-2 gap-2 mt-2 px-2">

        {preview.map((img, i) => (
          <div key={i}>
            <img
              src={baseUrl + img.image_path}
              className="w-full h-32 object-cover rounded-lg"
            />

            <div className="text-xs text-gray-600 mt-1 truncate">
              {img.image_title}
            </div>
          </div>
        ))}

      </div>

      {/* ================= FULL MODAL ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-4">All Images</h2>

            <div className="space-y-4">
              {allImages.map((img, i) => (
                <div key={i}>
                  <img
                    src={baseUrl + img.image_path}
                    className="w-full rounded-lg object-cover"
                  />

                  <p className="text-sm text-gray-600 mt-1">
                    {img.image_title}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}