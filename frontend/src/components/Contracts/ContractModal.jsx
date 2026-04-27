import React, { useEffect, useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function ContractModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const defaultForm = {
    project_id: "",
    contract_name: "",
    contract_number: "",
    signed_date: "",
    contract_start_date: "",
    contract_end_date: "",
    total_value: 0,
    contract_status: "Draft",
    file: null,
  };

  const { t } = useTranslation();
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, file: null });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submit = (e) => {
    e.preventDefault();

    const fd = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== "") {
        fd.append(key, form[key]);
      }
    });

    // 🔥 ensure numeric fields correct
    fd.set("project_id", Number(form.project_id) || "");

    onSubmit(fd);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? "Edit Contract" : "Add Contract"}
        </h2>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Project ID */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {t("project_id")}
              </label>
              <input
                type="number"
                name="project_id"
                value={form.project_id ?? ""}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {t("contract_name")}
              </label>
              <input
                name="contract_name"
                value={form.contract_name ?? ""}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Number */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {t("contract_number")}
              </label>
              <input
                name="contract_number"
                value={form.contract_number ?? ""}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Signed */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {t("signed_date")}
              </label>
              <input
                type="date"
                name="signed_date"
                value={form.signed_date ?? ""}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            {/* Start */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {t("contract_start_date")}
              </label>
              <input
                type="date"
                name="contract_start_date"
                value={form.contract_start_date ?? ""}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* End */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {t("contract_end_date")}
              </label>
              <input
                type="date"
                name="contract_end_date"
                value={form.contract_end_date ?? ""}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {t("value")}
              </label>
              <input
                type="number"
                name="total_value"
                step="0.01"
                value={form.total_value ?? 0}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {t("status")}
              </label>
              <select
                name="contract_status"
                value={form.contract_status ?? "Draft"}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option>Draft</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          {/* File */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              {t("choose_file")}
            </label>

            <label className="flex items-center justify-between border p-2.5 rounded cursor-pointer hover:bg-gray-50 transition">
              <span className="text-sm truncate">
                {form.file ? form.file.name : t("select_file")}
              </span>
              <FiFilePlus className="text-green-500" size={20} />

              <input
                type="file"
                name="file"
                onChange={handleChange}
                className="hidden"
                accept=".txt,.pdf,.doc,.docx,.xlsx,.pptx,.png,.jpeg,.jpg,.zip,.rar"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2">
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
