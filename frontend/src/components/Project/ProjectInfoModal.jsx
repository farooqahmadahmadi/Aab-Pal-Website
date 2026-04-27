import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ProjectInfoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const defaultForm = {
    project_name: "",
    project_type: "",
    project_status: "",
    project_start_date: "",
    project_end_date: "",
    client_id: "",
    employee_id: "",
    longitude: 0,
    latitude: 0,
    project_address: "",
    project_estimate_budget: 0,
  };

  const { t } = useTranslation();
  const [formData, setFormData] = useState(defaultForm);

  // Load Data
  useEffect(() => {
    if (initialData) {
      setFormData({
        project_name: initialData.project_name || "",
        project_type: initialData.project_type || "",
        project_status: initialData.project_status || "",
        project_start_date: initialData.project_start_date || "",
        project_end_date: initialData.project_end_date || "",
        client_id: initialData.client_id || "",
        employee_id: initialData.employee_id || "",
        longitude: initialData.longitude ?? 0,
        latitude: initialData.latitude ?? 0,
        project_address: initialData.project_address || "",
        project_estimate_budget: initialData.project_estimate_budget ?? 0,
      });
    } else {
      setFormData(defaultForm);
    }
  }, [initialData, isOpen]);

  // ✅ Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let val = value;

    if (["client_id", "employee_id"].includes(name)) {
      val = value === "" ? "" : parseInt(value);
    }

    if (["longitude", "latitude", "project_estimate_budget"].includes(name)) {
      val = value === "" ? 0 : parseFloat(value);
    }

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  // ✅ Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      client_id: formData.client_id ? parseInt(formData.client_id) : null,
      employee_id: formData.employee_id ? parseInt(formData.employee_id) : null,
      longitude: parseFloat(formData.longitude) || 0,
      latitude: parseFloat(formData.latitude) || 0,
      project_estimate_budget:
        parseFloat(formData.project_estimate_budget) || 0,
    };

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_project") : t("add_project")}
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Client */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("client_id")}
            </label>
            <input
              type="number"
              name="client_id"
              value={formData.client_id ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
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
              value={formData.employee_id ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("project_name")}
            </label>
            <input
              name="project_name"
              value={formData.project_name ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("type")}
            </label>
            <select
              name="project_type"
              value={formData.project_type ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>

          {/* Start */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("start_date")}
            </label>
            <input
              type="date"
              name="project_start_date"
              value={formData.project_start_date ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* End */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("end_date")}
            </label>
            <input
              type="date"
              name="project_end_date"
              value={formData.project_end_date ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Latitude */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("latitude")}
            </label>
            <input
              type="number"
              step="0.000001"
              name="latitude"
              value={formData.latitude ?? 0}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("longitude")}
            </label>
            <input
              type="number"
              step="0.000001"
              name="longitude"
              value={formData.longitude ?? 0}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("address")}
            </label>
            <input
              name="project_address"
              value={formData.project_address ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("budget")}
            </label>
            <input
              type="number"
              step="0.01"
              name="project_estimate_budget"
              value={formData.project_estimate_budget ?? 0}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("status")}
            </label>
            <select
              name="project_status"
              value={formData.project_status ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Status</option>
              <option value="Planed">Planed</option>
              <option value="InProgress">InProgress</option>
              <option value="Completed">Completed</option>
              <option value="OnHold">OnHold</option>
              <option value="Failed">Failed</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {initialData ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
