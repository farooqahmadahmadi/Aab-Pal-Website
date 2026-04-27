import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function EquipmentUsageModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const defaultForm = {
    equipment_id: "",
    employee_id: "",
    project_id: "",
    usage_start_date: "",
    usage_end_date: "",
    usage_description: "",
  };

  const { t } = useTranslation();

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm(defaultForm);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault(); // ✅ prevent reload
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_usage") : t("add_usage")}
        </h2>

        {/* FORM */}
        <form
          onSubmit={submit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("equipment_id")}
            </label>
            <input
              type="number"
              name="equipment_id"
              value={form.equipment_id || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Employee */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("employee_id")}
            </label>
            <input
              type="number"
              name="employee_id"
              value={form.employee_id || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("project_id")}
            </label>
            <input
              type="number"
              name="project_id"
              value={form.project_id || ""}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("start_date")}
            </label>
            <input
              type="date"
              name="usage_start_date"
              value={form.usage_start_date || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("end_date")}
            </label>
            <input
              type="date"
              name="usage_end_date"
              value={form.usage_end_date || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Description (full width) */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("description")}
            </label>
            <textarea
              name="usage_description"
              value={form.usage_description || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
                 {t("cancel")}
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {initialData ? t("update") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
