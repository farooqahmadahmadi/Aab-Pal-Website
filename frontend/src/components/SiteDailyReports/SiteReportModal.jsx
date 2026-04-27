import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SiteReportModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const defaultForm = {
    project_id: "",
    employee_id: "",
    task_assignment_id: "",
    report_date: "",
    weather: "",
    report_title: "",
    work_completed: "",
    issues: "",
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
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 rounded-2xl shadow-xl">
        {/* Title */}
        <h3 className="text-lg font-bold text-center mb-5">
          {initialData ? "Edit Report" : "Add Report"}
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

          {/* Employee */}
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

          {/* Task Assignment */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("task_id")}
            </label>
            <input
              name="task_assignment_id"
              value={form.task_assignment_id || ""}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("report_date")}
            </label>
            <input
              type="date"
              name="report_date"
              value={form.report_date || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Weather */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("weather")}
            </label>
            <input
              name="weather"
              value={form.weather || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("title")}
            </label>
            <input
              name="report_title"
              value={form.report_title || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Work Completed */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("work_completed")}
            </label>
            <textarea
              name="work_completed"
              value={form.work_completed || ""}
              onChange={handleChange}
              placeholder="Describe completed work..."
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              rows={3}
            />
          </div>

          {/* Issues */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("issues")}
            </label>
            <textarea
              name="issues"
              value={form.issues || ""}
              onChange={handleChange}
              placeholder="Describe issues..."
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              {initialData ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
