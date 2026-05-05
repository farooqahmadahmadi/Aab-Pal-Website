import React, { useEffect, useState } from "react";
import {
  createService,
  updateService,
} from "../../services/servicesPage.service";

import { getLanguages } from "../../services/websiteLanguage.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function ServicesModal({ open, onClose, edit, onRefresh }) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [languages, setLanguages] = useState([]);
  const [fileName, setFileName] = useState("");

  const [form, setForm] = useState({
    language_id: "",
    service_title: "",
    service_description: "",
    service_image: null,
    service_rating: 0,
    is_active: "1",
    display_order: 0,
  });

  useEffect(() => {
    getLanguages().then((res) =>
      setLanguages(res?.data?.data || res?.data || []),
    );
  }, []);

  useEffect(() => {
    if (edit) {
      setForm({
        language_id: edit.language_id || "",
        service_title: edit.service_title || "",
        service_description: edit.service_description || "",
        service_image: null,
        service_rating: edit.service_rating || 0,
        is_active: edit.is_active ? "1" : "0",
        display_order: edit.display_order || 0,
      });

      setFileName("");
    }
  }, [edit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "service_image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, service_image: file }));
      setFileName(file?.name || "");
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.service_title || !form.service_description) {
        showToast("Title & Description required", "error");
        return;
      }

      const fd = new FormData();
      Object.keys(form).forEach((k) => {
        if (form[k] !== null) fd.append(k, form[k]);
      });

      if (isEdit) {
        await updateService(edit.service_id, fd);
        showToast("Updated successfully", "success");
      } else {
        await createService(fd);
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
      <div className="bg-white w-full max-w-2xl p-5 rounded-lg">
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit Service" : "Add Service"}
        </h2>

        <select
          name="language_id"
          value={form.language_id}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="">Language</option>
          {languages.map((l) => (
            <option key={l.language_id} value={l.language_id}>
              {l.language_name}
            </option>
          ))}
        </select>

        <input
          name="service_title"
          value={form.service_title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full mb-3 rounded"
        />

        <textarea
          name="service_description"
          value={form.service_description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full mb-3 rounded"
        />

        <select
          name="is_active"
          value={form.is_active}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>

        <input
          type="number"
          name="display_order"
          value={form.display_order}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* IMAGE */}
        <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer mb-3">
          <span className="text-gray-500 text-sm">
            {fileName || "Choose Image"}
          </span>

          <input
            type="file"
            name="service_image"
            onChange={handleChange}
            className="hidden"
          />
        </label>

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
