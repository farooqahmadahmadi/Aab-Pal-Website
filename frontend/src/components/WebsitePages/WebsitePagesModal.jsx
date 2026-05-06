import React, { useEffect, useState } from "react";
import { createPage, updatePage } from "../../services/websitePages.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

// ================= SLUG HELPER =================
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// fallback slug (safe)
const fallbackSlug = (text) => {
  return (
    "page-" +
    Date.now() +
    "-" +
    Math.random().toString(36).substring(2, 7)
  );
};

export default function WebsitePagesModal({
  open,
  onClose,
  edit,
  onRefresh,
}) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [form, setForm] = useState({
    page_title: "",
    page_slug: "",
    page_meta_title: "",
    page_meta_keyword: "",
    page_meta_description: "",
  });

  // ================= EDIT LOAD =================
  useEffect(() => {
    if (edit) {
      setForm({
        page_title: edit.page_title || "",
        page_slug: edit.page_slug || "",
        page_meta_title: edit.page_meta_title || "",
        page_meta_keyword: edit.page_meta_keyword || "",
        page_meta_description: edit.page_meta_description || "",
      });
    }
  }, [edit]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // AUTO SLUG FROM TITLE
    if (name === "page_title") {
      const engSlug = slugify(value);
      const finalSlug = engSlug || fallbackSlug(value);

      setForm((prev) => ({
        ...prev,
        page_title: value,
        page_slug: finalSlug,
      }));

      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.page_title) {
        showToast("Title required", "error");
        return;
      }

      if (isEdit) {
        await updatePage(edit.web_page_id, form);
        showToast("Updated successfully", "success");
      } else {
        await createPage(form);
        showToast("Created successfully", "success");
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.log(err);
      showToast("Operation failed", "error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">

      <div className="bg-white w-full max-w-3xl p-5 rounded-lg overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit Page" : "Add Page"}
        </h2>

        {/* TITLE */}
        <label className="text-sm">Title</label>
        <input
          name="page_title"
          value={form.page_title}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* SLUG */}
        <label className="text-sm">Slug</label>
        <input
          name="page_slug"
          value={form.page_slug}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded bg-white"
        />

        {/* META TITLE */}
        <label className="text-sm">Meta Title</label>
        <input
          name="page_meta_title"
          value={form.page_meta_title}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* META KEYWORDS */}
        <label className="text-sm">Meta Keywords</label>
        <textarea
          name="page_meta_keyword"
          value={form.page_meta_keyword}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded min-h-[100px]"
        />

        {/* META DESCRIPTION */}
        <label className="text-sm">Meta Description</label>
        <textarea
          name="page_meta_description"
          value={form.page_meta_description}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded min-h-[120px]"
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-400 px-4 py-2 rounded"
          >
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

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

    </div>
  );
}