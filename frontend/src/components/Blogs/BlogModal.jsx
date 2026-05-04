import React, { useEffect, useState } from "react";
import { createBlog, updateBlog } from "../../services/blogsPage.service";
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
    "blog-" +
    Date.now() +
    "-" +
    Math.random().toString(36).substring(2, 7)
  );
};

export default function BlogModal({ open, onClose, edit, onRefresh }) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [languages, setLanguages] = useState([]);
  const [fileName, setFileName] = useState("");

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

  // ================= EDIT LOAD =================
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
    }
  }, [edit]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // IMAGE
    if (name === "blog_image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, blog_image: file }));
      setFileName(file?.name || "");
      return;
    }

    // TITLE → AUTO SLUG
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

    setForm((prev) => ({ ...prev, [name]: value }));
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
        if (form[k] !== null) fd.append(k, form[k]);
      });

      if (isEdit) {
        await updateBlog(edit.blog_id, fd);
        showToast("Updated successfully", "success");
      } else {
        await createBlog(fd);
        showToast("Created successfully", "success");
      }

      onRefresh();
      onClose();
    } catch {
      showToast("Operation failed", "error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">

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

        {/* SLUG (EDITABLE) */}
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

        {/* TEXT */}
        <label className="text-sm">Content</label>
        <textarea
          name="blog_text"
          value={form.blog_text}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded min-h-[150px]"
        />

        {/* IMAGE */}
        <label className="text-sm">Image</label>
        <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer mb-3">
          <span className="text-gray-500 text-sm">
            {fileName || "Choose Image"}
          </span>

          <input
            type="file"
            name="blog_image"
            onChange={handleChange}
            className="hidden"
          />
        </label>

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