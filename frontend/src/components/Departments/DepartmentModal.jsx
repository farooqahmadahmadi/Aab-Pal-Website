import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function DepartmentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    department_name: "",
    department_description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        department_name: initialData.department_name || "",
        department_description: initialData.department_description || "",
      });
    } else {
      setForm({
        department_name: "",
        department_description: "",
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-5">
        {/* TITLE */}
        <h3 className="text-xl font-bold mb-5 text-center">
          {initialData ? t("edit_department") : t("add_department")}
        </h3>

        {/* FORM */}
        <form
          onSubmit={submit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* NAME */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("department_name")}
            </label>
            <input
              name="department_name"
              value={form.department_name}
              onChange={handleChange}
              placeholder={t("department_name")}
              maxLength={150}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("description")}
            </label>
            <textarea
              name="department_description"
              value={form.department_description}
              onChange={handleChange}
              placeholder={t("description")}
              maxLength={255}
              rows="3"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* BUTTONS */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 mt-2">
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
