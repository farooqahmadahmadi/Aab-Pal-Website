import React, { useEffect, useState } from "react";
import { createView, updateView } from "../../services/webPageViews.service";
import { getPages } from "../../services/websitePages.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function WebPageViewsModal({ open, onClose, edit, onRefresh }) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [pages, setPages] = useState([]);

  const [form, setForm] = useState({
    web_page_id: "",
    visitor_ip: "",
    visitor_agent: "",
  });

  // ================= LOAD PAGES =================
  useEffect(() => {
    const loadPages = async () => {
      try {
        const res = await getPages();
        setPages(res?.data || []);
      } catch {
        showToast("Failed to load pages", "error");
      }
    };

    loadPages();
  }, []);

  // ================= EDIT LOAD =================
  useEffect(() => {
    if (edit) {
      setForm({
        web_page_id: edit.web_page_id || "",
        visitor_ip: edit.visitor_ip || "",
        visitor_agent: edit.visitor_agent || "",
      });
    }
  }, [edit]);

  // ================= HANDLE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.web_page_id) {
        showToast("Page required", "error");
        return;
      }

      if (isEdit) {
        await updateView(edit.view_id, form);
        showToast("Updated successfully", "success");
      } else {
        await createView(form);
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
      <div className="bg-white w-full max-w-xl p-5 rounded-lg">

        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit View" : "Add View"}
        </h2>

        {/* PAGE DROPDOWN */}
        <label className="text-sm">Page</label>
        <select
          name="web_page_id"
          value={form.web_page_id}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="">Select Page</option>
          {pages.map((p) => (
            <option key={p.web_page_id} value={p.web_page_id}>
              {p.page_title} (ID: {p.web_page_id})
            </option>
          ))}
        </select>

        {/* IP */}
        <label className="text-sm">Visitor IP</label>
        <input
          name="visitor_ip"
          value={form.visitor_ip}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* AGENT */}
        <label className="text-sm">User Agent</label>
        <textarea
          name="visitor_agent"
          value={form.visitor_agent}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

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