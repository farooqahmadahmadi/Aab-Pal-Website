import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function TasksModal({ isOpen, onClose, onSubmit, initialData }) {
  const defaultForm = {
    project_id: "",
    employee_id: "",
    task_title: "",
    task_description: "",
    task_due_date: "",
    task_status: "Pending",
  };

  const { t } = useTranslation();
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) setForm({ ...initialData });
    else setForm(defaultForm);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-2">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 rounded-2xl shadow-xl">
        {/* Title */}
        <h3 className="text-lg font-bold text-center mb-5">
          {initialData ? t("update_task") : t("add_task")}
        </h3>

        <form
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Project ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("project_id")}
            </label>
            <input
              name="project_id"
              value={form.project_id || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("employee_id")}
            </label>
            <input
              name="employee_id"
              value={form.employee_id || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Task Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("title")}
            </label>
            <input
              name="task_title"
              value={form.task_title || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("description")}
            </label>
            <textarea
              name="task_description"
              value={form.task_description || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              rows={3}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("due_date")}
            </label>
            <input
              type="date"
              name="task_due_date"
              value={form.task_due_date || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("status")}
            </label>
            <select
              name="task_status"
              value={form.task_status}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">
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
