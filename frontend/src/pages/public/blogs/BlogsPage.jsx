import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getBlogs } from "../../../services/blogsPage.service";

import { getBlogImages } from "../../../services/blogImages.service";

import BlogCard from "./BlogCard";

export default function BlogsPage() {
  // ================= STATES =================
  const [blogs, setBlogs] = useState([]);

  const [blogImages, setBlogImages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const BASE_URL =
    import.meta.env.VITE_IMAGE_URL || "";

  // ================= RANDOM BLOGS =================
  const randomBlogs = useMemo(() => {
    return [...blogs].sort(
      () => Math.random() - 0.5,
    );
  }, [blogs]);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ================= GET BLOGS =================
        const blogsRes = await getBlogs();

        const blogsData = Array.isArray(
          blogsRes,
        )
          ? blogsRes
          : blogsRes?.data || [];

        // ================= GET BLOG IMAGES =================
        const imagesRes =
          await getBlogImages();

        const imagesData =
          Array.isArray(imagesRes)
            ? imagesRes
            : imagesRes?.data || [];

        setBlogImages(imagesData);

        // ================= MERGE BLOG IMAGES =================
        const mergedBlogs =
          blogsData.map((blog) => ({
            ...blog,

            blog_images:
              imagesData.filter(
                (img) =>
                  Number(img.blog_id) ===
                  Number(blog.blog_id),
              ),
          }));

        // ================= PUBLISHED ONLY =================
        const published =
          mergedBlogs.filter(
            (b) => b.is_published,
          );

        setBlogs(published);

        console.log(
          "MERGED BLOGS:",
          mergedBlogs,
        );
      } catch (err) {
        console.error(
          "BLOGS PAGE ERROR:",
          err,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-b
        from-slate-100
        via-white
        to-slate-100
        py-10 px-4
      "
    >
      <div className="max-w-3xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-10">
          <h1
            className="
              text-4xl
              font-extrabold
              text-gray-800
            "
          >
            Latest Blogs
          </h1>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div
            className="
              text-center
              py-20
              text-gray-500
            "
          >
            Loading blogs...
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading &&
          randomBlogs.length === 0 && (
            <div
              className="
                text-center
                py-20
                text-gray-500
              "
            >
              No blogs found.
            </div>
          )}

        {/* ================= BLOGS ================= */}
        <div className="space-y-8">
          {randomBlogs.map((blog) => (
            <BlogCard
              key={blog.blog_id}
              blog={blog}
              baseUrl={BASE_URL}
            />
          ))}
        </div>

      </div>
    </div>
  );
}