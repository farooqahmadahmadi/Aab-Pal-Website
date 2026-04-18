import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const emptyForm = {
  employee_id: "",
  educational_degree: "",
  educational_institution: "",
  educational_field: "",
  graduation_date: "",
  description: "",
};

export default function EmployeeEducationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const { t } = useTranslation();

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        employee_id: initialData.employee_id || "",
        educational_degree: initialData.educational_degree || "",
        educational_institution: initialData.educational_institution || "",
        educational_field: initialData.educational_field || "",
        graduation_date: initialData.graduation_date || "",
        description: initialData.description || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();

    const cleanedForm = {
      ...form,
      graduation_date: form.graduation_date || null,
    };

    onSubmit(cleanedForm);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {initialData
              ? t("update_employee_education")
              : t("add_employee_education")}
          </h3>

          {/* <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button> */}
        </div>

        {/* FORM */}
        <form
          onSubmit={submit}
          className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("emp_id")}
            </label>
            <input
              type="number"
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Degree */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("degree")}
            </label>
            <input
              type="text"
              name="educational_degree"
              value={form.educational_degree}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("institution")}
            </label>
            <input
              type="text"
              name="educational_institution"
              value={form.educational_institution}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Field */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("field")}
            </label>
            <input
              type="text"
              name="educational_field"
              value={form.educational_field}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Graduation Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("graduation")}
            </label>
            <input
              type="date"
              name="graduation_date"
              value={form.graduation_date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Description (full width) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("description")}
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              {initialData ? t("update") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
