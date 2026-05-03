import React, { useEffect, useState } from "react";
import {
  createAboutPage,
  updateAboutPage,
} from "../../services/aboutPage.service";

import { getLanguages } from "../../services/websiteLanguage.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function AboutModal({ open, onClose, edit, onRefresh }) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [languages, setLanguages] = useState([]);

  const [form, setForm] = useState({
    language_id: "",
    about_title: "",
    about_text: "",
    display_order: 0,
    about_image: null,
  });

  const [fileName, setFileName] = useState("");

  // ================= LOAD LANGUAGES =================
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await getLanguages();
        setLanguages(res.data.languages);
        
        const list = res?.languages || res?.data?.languages || res?.data || [];

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
        about_title: edit.about_title || "",
        about_text: edit.about_text || "",
        display_order: edit.display_order || 0,
        about_image: null,
      });
      setFileName("");
    } else {
      setForm({
        language_id: "",
        about_title: "",
        about_text: "",
        display_order: 0,
        about_image: null,
      });
      setFileName("");
    }
  }, [edit]);

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "about_image") {
      const file = files[0];
      setForm({ ...form, about_image: file });
      setFileName(file?.name || "");
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.language_id || !form.about_title || !form.about_text) {
        showToast("Please fill required fields", "error");
        return;
      }

      const formData = new FormData();

      formData.append("language_id", form.language_id);
      formData.append("about_title", form.about_title);
      formData.append("about_text", form.about_text);
      formData.append("display_order", form.display_order);

      if (form.about_image) {
        formData.append("about_image", form.about_image);
      }

      if (isEdit) {
        await updateAboutPage(edit.about_id, formData);
        showToast("Updated successfully", "success");
      } else {
        await createAboutPage(formData);
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
      <div className="bg-white w-full max-w-2xl p-5 rounded-lg">
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit About Page" : "Add About Page"}
        </h2>

        {/* LANGUAGE DROPDOWN */}
        <div className="mb-3">
          <label className="text-sm">Language</label>

          <select
            name="language_id"
            value={form.language_id}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Language</option>

            {languages.map((lang) => (
              <option key={lang.language_id} value={lang.language_id}>
                {lang.language_name}
              </option>
            ))}
          </select>
        </div>

        {/* TITLE */}
        <input
          name="about_title"
          value={form.about_title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full mb-3 rounded"
        />

        {/* TEXT */}
        <textarea
          name="about_text"
          value={form.about_text}
          onChange={handleChange}
          placeholder="Text"
          className="border p-2 w-full mb-3 rounded"
        />

        {/* ORDER */}
        <input
          type="number"
          name="display_order"
          value={form.display_order}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* FILE CHOOSER */}
        <div className="mb-4">
          <label className="text-sm block mb-1">About Image</label>

          <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer hover:bg-gray-50">
            <span className="text-gray-500 text-sm">
              {fileName || "Choose Image"}
            </span>

            <input
              type="file"
              name="about_image"
              onChange={handleChange}
              className="hidden"
            />
          </label>
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

      {/* TOAST */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
