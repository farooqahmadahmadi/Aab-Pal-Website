import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SafetyIncidentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const defaultForm = {
    project_id: "",
    incident_description: "",
    incident_date: "",
    incident_severity: "",
    action_taken: "",
  };

  const { t } = useTranslation();

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm(defaultForm);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          {initialData ? t("update_incident") : t("add_incident")}
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

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("incident_date")}
            </label>
            <input
              type="date"
              name="incident_date"
              value={form.incident_date || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Severity */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("severity")}
            </label>
            <select
              name="incident_severity"
              value={form.incident_severity || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("description")}
            </label>
            <textarea
              name="incident_description"
              value={form.incident_description || ""}
              onChange={handleChange}
              placeholder="Describe the incident..."
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              rows={3}
            />
          </div>

          {/* Action */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("action_taken")}
            </label>
            <textarea
              name="action_taken"
              value={form.action_taken || ""}
              onChange={handleChange}
              placeholder="What action was taken?"
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
