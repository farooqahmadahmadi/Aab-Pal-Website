import React, { useEffect, useState } from "react";
import { FiPaperclip } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function EquipmentDocumentsModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const defaultForm = {
    equipment_id: "",
    doc_name: "",
    doc_description: "",
    doc_file: null,
  };

  const { t } = useTranslation();

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        equipment_id: initialData.equipment_id || "",
        doc_name: initialData.document_name || "",
        doc_description: initialData.document_description || "",
        doc_file: null,
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm((prev) => ({ ...prev, [name]: files[0] }));
    else setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.equipment_id || !form.doc_name)
      return alert("Equipment ID and Name are required");

    const formData = new FormData();
    formData.append("equipment_id", form.equipment_id);
    formData.append("doc_name", form.doc_name);
    formData.append("doc_description", form.doc_description);
    if (form.doc_file) formData.append("doc_file", form.doc_file);

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-2">
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
          {initialData ? t("edit_document") : t("add_document")}
        </h3>

        {/* Form */}
        <form onSubmit={submit} className="grid gap-4">
          {/* Equipment ID */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              {t("equipment_id")}
            </label>
            <input
              name="equipment_id"
              value={form.equipment_id}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Document Name */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              {t("document_name")}
            </label>
            <input
              name="doc_name"
              value={form.doc_name}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              {t("description")}
            </label>
            <input
              name="doc_description"
              value={form.doc_description}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              {t("choose_file")}
            </label>

            <label className="flex items-center justify-between border p-2.5 rounded cursor-pointer hover:bg-gray-50 transition">
              <span className="text-sm truncate">
                {form.doc_file ? form.doc_file.name : t("select_file")}
              </span>

              <FiPaperclip className="text-green-500" size={20} />

              <input
                type="file"
                name="doc_file"
                onChange={handleChange}
                className="hidden"
                accept=".txt,.pdf,.doc,.docx,.xlsx,.pptx,.png,.jpeg,.jpg,.zip,.rar"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {initialData ? t("update") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
