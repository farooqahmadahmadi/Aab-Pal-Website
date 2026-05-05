import React, { useEffect, useState } from "react";
import {
  createTerm,
  updateTerm,
} from "../../services/termsAndConditionsPage.service";
import { getLanguages } from "../../services/websiteLanguage.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function TermsModal({ open, onClose, edit, onRefresh }) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [languages, setLanguages] = useState([]);

  const [form, setForm] = useState({
    language_id: "",
    tc_title: "",
    tc_text: "",
    display_order: 0,
  });

  // LOAD LANGUAGES
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getLanguages();
        setLanguages(res?.data?.data || res?.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, []);

  // LOAD EDIT
  useEffect(() => {
    if (edit) {
      setForm({
        language_id: edit.language_id || "",
        tc_title: edit.tc_title || "",
        tc_text: edit.tc_text || "",
        display_order: edit.display_order || 0,
      });
    } else {
      setForm({
        language_id: "",
        tc_title: "",
        tc_text: "",
        display_order: 0,
      });
    }
  }, [edit]);

  // CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // SUBMIT
  const handleSubmit = async () => {
    try {
      if (!form.language_id || !form.tc_title || !form.tc_text) {
        showToast("Fill required fields", "error");
        return;
      }

      if (isEdit) {
        await updateTerm(edit.tc_id, form);
        showToast("Updated", "success");
      } else {
        await createTerm(form);
        showToast("Created", "success");
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.log(err);
      showToast("Error", "error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl p-5 rounded">
        <h2 className="font-bold mb-4">
          {isEdit ? "Edit Terms" : "Add Terms"}
        </h2>

        {/* LANGUAGE */}
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
          name="tc_title"
          value={form.tc_title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full mb-3 rounded"
        />

        <textarea
          name="tc_text"
          value={form.tc_text}
          onChange={handleChange}
          placeholder="Text..."
          className="border p-2 w-full mb-3 rounded min-h-[150px]"
        />

        <input
          type="number"
          name="display_order"
          value={form.display_order}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

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
