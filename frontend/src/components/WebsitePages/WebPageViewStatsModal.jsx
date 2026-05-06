import React, { useEffect, useState } from "react";
import {
  createStat,
  updateStat,
} from "../../services/webPageViewStats.service";
import { getPages } from "../../services/websitePages.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function WebPageViewStatsModal({
  open,
  onClose,
  edit,
  onRefresh,
}) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [pages, setPages] = useState([]);

  const [form, setForm] = useState({
    web_page_id: "",
    view_date: "",
    total_views: 0,
    unique_views: 0,
  });

  // LOAD PAGES
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPages();
        setPages(res?.data || []);
      } catch {
        showToast("Failed to load pages", "error");
      }
    };

    load();
  }, []);

  // EDIT LOAD
  useEffect(() => {
    if (edit) {
      setForm({
        web_page_id: edit.web_page_id || "",
        view_date: edit.view_date || "",
        total_views: edit.total_views || 0,
        unique_views: edit.unique_views || 0,
      });
    }
  }, [edit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.web_page_id || !form.view_date) {
        showToast("Page & Date required", "error");
        return;
      }

      if (isEdit) {
        await updateStat(edit.view_state_id, form);
        showToast("Updated successfully", "success");
      } else {
        await createStat(form);
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
          {isEdit ? "Edit Stats" : "Add Stats"}
        </h2>

        {/* PAGE */}
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
              {p.page_title}
            </option>
          ))}
        </select>

        {/* DATE */}
        <label className="text-sm">Date</label>
        <input
          type="date"
          name="view_date"
          value={form.view_date}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* TOTAL */}
        <label className="text-sm">Total Views</label>
        <input
          type="number"
          name="total_views"
          value={form.total_views}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* UNIQUE */}
        <label className="text-sm">Unique Views</label>
        <input
          type="number"
          name="unique_views"
          value={form.unique_views}
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

      {toast && <Toast {...toast} onClose={hideToast} />}
    </div>
  );
}
