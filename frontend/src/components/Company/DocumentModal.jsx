import React, { useState, useEffect } from "react";
import { FiPaperclip } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function DocumentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    doc_name: "",
    doc_description: "",
    file: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        doc_name: initialData.doc_name || "",
        doc_description: initialData.doc_description || "",
        file: null,
      });
    } else {
      setFormData({
        doc_name: "",
        doc_description: "",
        file: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-2">
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 relative">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
          {initialData ? t("edit_document") : t("add_document")}
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-4">
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
                {formData.file ? formData.file.name : t("select_file")}
              </span>

              <FiPaperclip className="text-green-500" size={20} />

              <input
                type="file"
                onChange={handleFileChange}
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
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              {initialData ? t("update") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
