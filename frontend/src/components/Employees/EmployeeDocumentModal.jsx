import React, { useState, useEffect } from "react";
import { FiPaperclip } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function EmployeeDocumentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [formData, setFormData] = useState({
    employee_id: "",
    doc_name: "",
    doc_description: "",
    file: null,
  });
  const { t } = useTranslation();

  useEffect(() => {
    if (initialData) {
      setFormData({
        employee_id: initialData.employee_id || "",
        doc_name: initialData.doc_name || "",
        doc_description: initialData.doc_description || "",
        file: null,
      });
    } else {
      setFormData({
        employee_id: "",
        doc_name: "",
        doc_description: "",
        file: null,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setFormData((prev) => ({ ...prev, [name]: files[0] }));
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("employee_id", formData.employee_id);
    payload.append("doc_name", formData.doc_name);
    payload.append("doc_description", formData.doc_description);
    if (formData.file) payload.append("file", formData.file);
    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-2">
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
          {initialData ? t("edit_document") : t("add_document")}
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Employee ID */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              {t("employee_id")}
            </label>
            <input
              type="number"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Document Name */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              {t("document_name")}
            </label>
            <input
              type="text"
              name="doc_name"
              value={formData.doc_name}
              onChange={handleChange}
              maxLength={150}
              className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1 font-medium">
             {t("description")}
            </label>
            <input
              type="text"
              name="doc_description"
              value={formData.doc_description}
              onChange={handleChange}
              maxLength={255}
              className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              {t("choose_file")}
            </label>

            <label className="flex items-center justify-between border p-2.5 rounded cursor-pointer hover:bg-gray-50 transition">
              <span className="text-sm truncate">
                {formData.file ? formData.file.name :  t("select_file")}
              </span>

              <FiPaperclip className="text-green-500" size={20} />

              <input
                type="file"
                name="file"
                onChange={handleChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
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
