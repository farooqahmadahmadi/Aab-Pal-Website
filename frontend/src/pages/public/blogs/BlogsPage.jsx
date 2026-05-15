import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { getBlogs } from "../../../services/blogsPage.service";
import { getBlogImages } from "../../../services/blogImages.service";
import { getHomePages } from "../../../services/homePage.service";

import BlogCard from "./BlogCard";
import Herobackground from "../../../assets/images/blogs.jpg";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  const { blogId } = useParams();

  const blogSectionRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_IMAGE_URL || "";
  const languageId = Number(localStorage.getItem("language_id")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [blogsRes, imagesRes, homeRes] = await Promise.all([
          getBlogs(),
          getBlogImages(),
          getHomePages(),
        ]);

        const blogsData = Array.isArray(blogsRes)
          ? blogsRes
          : blogsRes?.data || [];

        const imagesData = Array.isArray(imagesRes)
          ? imagesRes
          : imagesRes?.data || [];

        const homeList = Array.isArray(homeRes) ? homeRes : homeRes?.data || [];

        // ================= HERO (LIKE PROJECTS PATTERN) =================
        const heroSection = homeList.find(
          (h) =>
            h.is_active &&
            Number(h.language_id) === languageId &&
            h.section_name?.toLowerCase().includes("blog"),
        );

        setHero(heroSection || null);

        // ================= MERGE IMAGES =================
        const mergedBlogs = blogsData.map((blog) => ({
          ...blog,
          blog_images: imagesData.filter(
            (img) => Number(img.blog_id) === Number(blog.blog_id),
          ),
        }));

        // ================= FILTER PUBLISHED =================
        let finalBlogs = mergedBlogs.filter((b) => b.is_published);

        // ================= SINGLE BLOG PRIORITY =================
        if (blogId) {
          const targetBlog = finalBlogs.find(
            (b) => Number(b.blog_id) === Number(blogId),
          );

          if (targetBlog) {
            finalBlogs = [
              targetBlog,
              ...finalBlogs.filter((b) => Number(b.blog_id) !== Number(blogId)),
            ];
          }
        }

        setBlogs(finalBlogs);
      } catch (err) {
        console.error("BLOGS PAGE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [blogId, languageId]);

  // ================= AUTO SCROLL TO BLOGS =================
  useEffect(() => {
    if (blogId && blogSectionRef.current) {
      setTimeout(() => {
        blogSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 310);
    }
  }, [blogId]);

  // ================= RANDOM =================
  const randomBlogs = useMemo(() => {
    // when direct blog opened => no random
    if (blogId) return blogs;

    return [...blogs].sort(() => Math.random() - 0.5);
  }, [blogs, blogId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ================= HERO (SAME PATTERN AS PROJECTS) ================= */}
      <section
        className="w-full min-h-screen flex items-center justify-center px-4 text-center text-white relative"
        style={{
          backgroundImage: hero?.section_image
            ? `url(${BASE_URL + hero.section_image})`
            : `url(${Herobackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {hero?.section_title || "Latest Blogs"}
          </h1>

          <p className="text-sm md:text-base text-gray-200 leading-7">
            {hero?.section_description ||
              "Read our latest updates, insights, and stories."}
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section ref={blogSectionRef} className="max-w-3xl mx-auto px-4 py-6">
        {loading && (
          <p className="text-center text-gray-500">Loading blogs...</p>
        )}

        {!loading && randomBlogs.length === 0 && (
          <p className="text-center text-gray-500">No blogs found.</p>
        )}

        <div className="space-y-4">
          {randomBlogs.map((blog) => (
            <BlogCard key={blog.blog_id} blog={blog} baseUrl={BASE_URL} />
          ))}
        </div>
      </section>
    </div>
  );
}
