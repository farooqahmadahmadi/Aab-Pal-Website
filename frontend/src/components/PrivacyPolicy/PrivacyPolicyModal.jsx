import React, { useEffect, useState } from "react";
import {
  createPrivacyPolicy,
  updatePrivacyPolicy,
} from "../../services/privacyAndPolicyPage.service";

import { getLanguages } from "../../services/websiteLanguage.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function PrivacyPolicyModal({ open, onClose, edit, onRefresh }) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [languages, setLanguages] = useState([]);

  const [form, setForm] = useState({
    language_id: "",
    pp_title: "",
    pp_text: "",
    display_order: 0,
  });

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
        pp_title: edit.pp_title || "",
        pp_text: edit.pp_text || "",
        display_order: edit.display_order || 0,
      });
    } else {
      setForm({
        language_id: "",
        pp_title: "",
        pp_text: "",
        display_order: 0,
      });
    }
  }, [edit]);

  // ================= CHANGE =================
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
      if (!form.language_id || !form.pp_title || !form.pp_text) {
        showToast("Please fill required fields", "error");
        return;
      }

      if (isEdit) {
        await updatePrivacyPolicy(edit.pp_id, form);
        showToast("Updated successfully", "success");
      } else {
        await createPrivacyPolicy(form);
        showToast("Created successfully", "success");
      }

      await onRefresh();
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
          {isEdit ? "Edit Privacy Policy" : "Add Privacy Policy"}
        </h2>

        {/* LANGUAGE */}
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
          name="pp_title"
          value={form.pp_title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full mb-3 rounded"
        />

        {/* TEXT */}
        <textarea
          name="pp_text"
          value={form.pp_text}
          onChange={handleChange}
          placeholder="Write content..."
          className="border p-2 w-full mb-3 rounded min-h-[200px]"
        />

        {/* ORDER */}
        <input
          type="number"
          name="display_order"
          value={form.display_order}
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
