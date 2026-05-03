import React, { useEffect, useState } from "react";
import {
  createHomePage,
  updateHomePage,
} from "../../services/homePage.service";

import { getLanguages } from "../../services/websiteLanguage.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function HomeModal({ open, onClose, edit, onRefresh }) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [languages, setLanguages] = useState([]);

  const [form, setForm] = useState({
    language_id: "",
    section_name: "",
    section_title: "",
    section_description: "",
    display_order: 0,
    section_image: null,
  });

  const [fileName, setFileName] = useState("");

  // ================= LOAD LANGUAGES =================
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await getLanguages();

        const list = res?.data?.data || res?.data || res?.languages || [];

        setLanguages(list);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLanguages();
  }, []);

  // ================= LOAD EDIT =================
  useEffect(() => {
    if (edit) {
      setForm({
        language_id: edit.language_id || "",
        section_name: edit.section_name || "",
        section_title: edit.section_title || "",
        section_description: edit.section_description || "",
        display_order: edit.display_order || 0,
        section_image: null,
      });

      setFileName("");
    } else {
      setForm({
        language_id: "",
        section_name: "",
        section_title: "",
        section_description: "",
        display_order: 0,
        section_image: null,
      });

      setFileName("");
    }
  }, [edit]);

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "section_image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, section_image: file }));
      setFileName(file?.name || "");
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.language_id || !form.section_title) {
        showToast("Required fields missing", "error");
        return;
      }

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      if (isEdit) {
        await updateHomePage(edit.section_id, formData);
        showToast("Updated successfully", "success");
      } else {
        await createHomePage(formData);
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 rounded-lg">
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit Home Section" : "Add Home Section"}
        </h2>

        {/* LANGUAGE */}
        <select
          name="language_id"
          value={form.language_id}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="">Select Language</option>
          {languages.map((lang) => (
            <option key={lang.language_id} value={lang.language_id}>
              {lang.language_name}
            </option>
          ))}
        </select>

        {/* SECTION NAME */}
        <input
          name="section_name"
          value={form.section_name}
          onChange={handleChange}
          placeholder="Section Name (hero, services...)"
          className="border p-2 w-full mb-3 rounded text-sm"
        />

        {/* TITLE */}
        <input
          name="section_title"
          value={form.section_title}
          onChange={handleChange}
          placeholder="Section Title"
          className="border p-2 w-full mb-3 rounded text-sm"
        />

        {/* DESCRIPTION */}
        <textarea
          name="section_description"
          value={form.section_description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full mb-3 rounded min-h-[150px]"
        />

        {/* ORDER */}
        <input
          type="number"
          name="display_order"
          value={form.display_order}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* IMAGE */}
        <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer mb-4">
          <span className="text-gray-500 text-sm">
            {fileName || "Choose Image"}
          </span>
          <input
            type="file"
            name="section_image"
            onChange={handleChange}
            className="hidden"
          />
        </label>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 sticky bottom-0 bg-white pt-3">
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
