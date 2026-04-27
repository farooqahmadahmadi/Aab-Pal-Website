import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ProjectPhaseModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const emptyForm = {
    project_id: "",
    phase_name: "",
    phase_start_date: "",
    phase_end_date: "",
    phase_status: "",
  };

  const { t } = useTranslation();

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        project_id: initialData.project_id || "",
        phase_name: initialData.phase_name || "",
        phase_start_date: initialData.phase_start_date || "",
        phase_end_date: initialData.phase_end_date || "",
        phase_status: initialData.phase_status || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let val = value;

    // number fix
    if (name === "project_id") {
      val = value === "" ? "" : parseInt(value);
    }

    setForm({ ...form, [name]: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); //  FIX

    const payload = {
      ...form,
      project_id: form.project_id ? Number(form.project_id) : null,
    };

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_phase") : t("add_phase")}
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid gap-3">
          {/* Project ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("project_id")}
            </label>
            <input
              name="project_id"
              value={form.project_id ?? ""}
              onChange={handleChange}
              className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Phase Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("phase_name")}
            </label>
            <input
              name="phase_name"
              value={form.phase_name ?? ""}
              onChange={handleChange}
              className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("start_date")}
            </label>
            <input
              type="date"
              name="phase_start_date"
              value={form.phase_start_date ?? ""}
              onChange={handleChange}
              className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("end_date")}
            </label>
            <input
              type="date"
              name="phase_end_date"
              value={form.phase_end_date ?? ""}
              onChange={handleChange}
              className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("status")}
            </label>
            <select
              name="phase_status"
              value={form.phase_status ?? ""}
              onChange={handleChange}
              className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Status</option>
              <option value="Not Started">Not Started</option>
              <option value="InProgress">InProgress</option>
              <option value="Completed">Completed</option>
              <option value="OnHold">OnHold</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
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
