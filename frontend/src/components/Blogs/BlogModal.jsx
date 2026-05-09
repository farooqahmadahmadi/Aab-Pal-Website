import React, { useEffect, useState } from "react";
import { createBlog, updateBlog } from "../../services/blogsPage.service";

import {
  createBlogImage,
  getBlogImagesByBlog,
  deleteBlogImage,
} from "../../services/blogImages.service";

import { getLanguages } from "../../services/websiteLanguage.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

// ================= SLUG HELPER =================
const slugify = (text) => {
  const english = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return english;
};

// fallback slug (for non-English like Pashto/Dari)
const fallbackSlug = (text) => {
  return (
    "blog-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7)
  );
};

export default function BlogModal({ open, onClose, edit, onRefresh }) {
  const isEdit = !!edit;

  const { toast, showToast, hideToast } = useToast();

  const [languages, setLanguages] = useState([]);
  const [fileName, setFileName] = useState("");

  // ================= BLOG IMAGES =================
  const [blogImages, setBlogImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  const [form, setForm] = useState({
    language_id: "",
    blog_author_name: "",
    blog_title: "",
    blog_slug: "",
    blog_type: "",
    blog_text: "",
    blog_image: null,
    is_published: "0",
  });

  // ================= LOAD LANGUAGES =================
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await getLanguages();

        setLanguages(res?.data?.data || res?.data || []);
      } catch {
        showToast("Failed to load languages", "error");
      }
    };

    fetchLanguages();
  }, []);

  // ================= LOAD EDIT DATA =================
  useEffect(() => {
    if (edit) {
      setForm({
        language_id: edit.language_id || "",
        blog_author_name: edit.blog_author_name || "",
        blog_title: edit.blog_title || "",
        blog_slug: edit.blog_slug || "",
        blog_type: edit.blog_type || "",
        blog_text: edit.blog_text || "",
        blog_image: null,
        is_published: edit.is_published ? "1" : "0",
      });

      setFileName("");

      // LOAD BLOG IMAGES
      fetchBlogImages(edit.blog_id);
    } else {
      setBlogImages([]);
      setNewImages([]);
    }
  }, [edit]);

  // ================= FETCH BLOG IMAGES =================
  const fetchBlogImages = async (blogId) => {
    try {
      const res = await getBlogImagesByBlog(blogId);

      setBlogImages(res?.data || []);
    } catch {
      console.log("Failed to load blog images");
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // MAIN IMAGE
    if (name === "blog_image") {
      const file = files[0];

      setForm((prev) => ({
        ...prev,
        blog_image: file,
      }));

      setFileName(file?.name || "");

      return;
    }

    // BLOG EXTRA IMAGES
    if (name === "blog_images") {
      const selected = Array.from(files || []);

      const mapped = selected.map((file) => ({
        file,
        title: "",
        alt: "",
      }));

      setNewImages(mapped);

      return;
    }

    // TITLE => AUTO SLUG
    if (name === "blog_title") {
      const engSlug = slugify(value);

      const finalSlug = engSlug || fallbackSlug(value);

      setForm((prev) => ({
        ...prev,
        blog_title: value,
        blog_slug: finalSlug,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= HANDLE IMAGE META =================
  const handleImageMeta = (index, field, value) => {
    setNewImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, [field]: value } : img)),
    );
  };

  // ================= DELETE EXTRA IMAGE =================
  const handleDeleteImage = async (id) => {
    try {
      await deleteBlogImage(id);

      setBlogImages((prev) => prev.filter((x) => x.blog_image_id !== id));

      showToast("Image deleted", "success");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.blog_title || !form.blog_text) {
        showToast("Title and content required", "error");
        return;
      }

      const fd = new FormData();

      Object.keys(form).forEach((k) => {
        if (form[k] !== null) {
          fd.append(k, form[k]);
        }
      });

      let blogResult;

      // ================= CREATE / UPDATE =================
      if (isEdit) {
        blogResult = await updateBlog(edit.blog_id, fd);

        showToast("Updated successfully", "success");
      } else {
        blogResult = await createBlog(fd);

        showToast("Created successfully", "success");
      }

      // ================= BLOG ID =================
      const blogId =
        edit?.blog_id || blogResult?.blog_id || blogResult?.data?.blog_id;

      // ================= SAVE EXTRA IMAGES =================
      if (newImages.length > 0 && blogId) {
        for (const item of newImages) {
          const imgFd = new FormData();

          imgFd.append("blog_id", blogId);
         imgFd.append("image_path", item.file);
          imgFd.append("image_title", item.title);
          imgFd.append("image_alt", item.alt);

          await createBlogImage(imgFd);
        }
      }

      onRefresh();
      onClose();

      setNewImages([]);
    } catch (err) {
      console.log(err);

      showToast("Operation failed", "error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-3xl p-5 rounded-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit Blog" : "Add Blog"}
        </h2>

        {/* LANGUAGE + PUBLISH */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-sm">Language</label>

            <select
              name="language_id"
              value={form.language_id}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="">Select</option>

              {languages.map((l) => (
                <option key={l.language_id} value={l.language_id}>
                  {l.language_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">Publish Blog</label>

            <select
              name="is_published"
              value={form.is_published}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="0">Draft</option>
              <option value="1">Published</option>
            </select>
          </div>
        </div>

        {/* AUTHOR */}
        <label className="text-sm">Author</label>

        <input
          name="blog_author_name"
          value={form.blog_author_name}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* TITLE */}
        <label className="text-sm">Title</label>

        <input
          name="blog_title"
          value={form.blog_title}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* SLUG */}
        <label className="text-sm">Slug</label>

        <input
          name="blog_slug"
          value={form.blog_slug}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded bg-white"
        />

        {/* TYPE */}
        <label className="text-sm">Type</label>

        <select
          name="blog_type"
          value={form.blog_type}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="">Select Type</option>
          <option value="news">News</option>
          <option value="tech">Tech</option>
          <option value="tutorial">Tutorial</option>
          <option value="other">Other</option>
        </select>

        {/* CONTENT */}
        <label className="text-sm">Content</label>

        <textarea
          name="blog_text"
          value={form.blog_text}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded min-h-[150px]"
        />

        {/* MAIN IMAGE */}
        <label className="text-sm">Main Image</label>

        <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer mb-5">
          <span className="text-gray-500 text-sm">
            {fileName || "Choose Main Image"}
          </span>

          <input
            type="file"
            name="blog_image"
            onChange={handleChange}
            className="hidden"
          />
        </label>

        {/* EXTRA BLOG IMAGES */}
        <div className="border rounded-lg p-4 mb-5">
          <h3 className="font-semibold mb-3">Blog Images</h3>
          {/* FILE PICKER */}
          <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer mb-4">
            <span className="text-gray-500 text-sm">
              Choose Multiple Images
            </span>

            <input
              type="file"
              multiple
              name="blog_images"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          
          {/* ================= NEW IMAGES ================= */}
          {newImages.length > 0 && (
            <div className="max-h-[420px] overflow-y-auto space-y-4 pr-1 mb-4">
              {newImages.map((img, index) => (
                <div key={index} className="border rounded-xl p-3 bg-gray-50">
                  {/* PREVIEW + ACTIONS */}
                  <div className="flex gap-3 mb-3">
                    {/* IMAGE */}
                    <div className="relative w-28 h-28 overflow-hidden rounded-lg border bg-white group">
                      <img
                        src={URL.createObjectURL(img.file)}
                        alt="preview"
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-semibold truncate">
                          {img.file.name}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {(img.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <div className="flex gap-2 mt-3">
                        {/* CHANGE */}
                        <label className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded cursor-pointer">
                          Change
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];

                              if (!file) return;

                              setNewImages((prev) =>
                                prev.map((item, i) =>
                                  i === index
                                    ? {
                                        ...item,
                                        file,
                                      }
                                    : item,
                                ),
                              );
                            }}
                          />
                        </label>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() => {
                            setNewImages((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                          }}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* TITLE */}
                  <input
                    type="text"
                    placeholder="Image Title"
                    value={img.title}
                    onChange={(e) =>
                      handleImageMeta(index, "title", e.target.value)
                    }
                    className="border p-2 w-full rounded mb-2 bg-white"
                  />

                  {/* ALT */}
                  <input
                    type="text"
                    placeholder="Image Alt"
                    value={img.alt}
                    onChange={(e) =>
                      handleImageMeta(index, "alt", e.target.value)
                    }
                    className="border p-2 w-full rounded bg-white"
                  />
                </div>
              ))}
            </div>
          )}
          {/* EXISTING IMAGES */}
          {blogImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {blogImages.map((img) => (
                <div
                  key={img.blog_image_id}
                  className="border rounded overflow-hidden"
                >
                  <img
                    src={`${BASE_URL}${img.image_path}`}
                    alt={img.image_alt}
                    className="w-full h-32 object-cover"
                  />

                  <div className="p-2">
                    <p className="text-xs font-semibold truncate">
                      {img.image_title}
                    </p>

                    <p className="text-[11px] text-gray-500 truncate">
                      {img.image_alt}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.blog_image_id)}
                      className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-400 px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
