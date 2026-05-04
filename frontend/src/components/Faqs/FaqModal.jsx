import React, { useEffect, useState } from "react";
import { createFaq, updateFaq } from "../../services/faqsPage.service";
import { getLanguages } from "../../services/websiteLanguage.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function FaqsModal({ open, onClose, edit, onRefresh }) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [languages, setLanguages] = useState([]);

  const [form, setForm] = useState({
    language_id: "",
    faqs_question: "",
    faqs_answer: "",
    faqs_category: "",
    is_active: true,
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
        faqs_question: edit.faqs_question || "",
        faqs_answer: edit.faqs_answer || "",
        faqs_category: edit.faqs_category || "",
        is_active: edit.is_active ?? true,
      });
    } else {
      setForm({
        language_id: "",
        faqs_question: "",
        faqs_answer: "",
        faqs_category: "",
        is_active: true,
      });
    }
  }, [edit]);

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.language_id || !form.faqs_question || !form.faqs_answer) {
        showToast("Please fill required fields", "error");
        return;
      }

      if (isEdit) {
        await updateFaq(edit.faqs_id, form);
        showToast("Updated successfully", "success");
      } else {
        await createFaq(form);
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
        {/* HEADER */}
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit FAQ" : "Add FAQ"}
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

        {/* QUESTION */}
        <input
          name="faqs_question"
          value={form.faqs_question}
          onChange={handleChange}
          placeholder="Question"
          className="border p-2 w-full mb-3 rounded"
        />

        {/* ANSWER */}
        <textarea
          name="faqs_answer"
          value={form.faqs_answer}
          onChange={handleChange}
          placeholder="Answer..."
          className="border p-2 w-full mb-3 rounded min-h-[150px]"
        />

        {/* CATEGORY DROPDOWN (NEW) */}
        <div className="mb-3">
          <label className="text-sm">Category</label>

          <select
            name="faqs_category"
            value={form.faqs_category}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="Billing">Billing</option>
            <option value="Technical">Technical</option>
            <option value="Support">Support</option>
          </select>
        </div>

        {/* ACTIVE DROPDOWN (NEW) */}
        <div className="mb-4">
          <label className="text-sm">Status</label>

          <select
            name="is_active"
            value={form.is_active}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                is_active: e.target.value === "true",
              }))
            }
            className="border p-2 w-full rounded"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

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

      {/* TOAST */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
