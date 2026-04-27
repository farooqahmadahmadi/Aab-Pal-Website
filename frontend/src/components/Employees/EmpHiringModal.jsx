import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function EmpHiringModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [formData, setFormData] = useState({
    employee_id: "",
    department_id: "",
    attendance_shift_id: "",
    position: "",
    employment_type: "",
    hire_date: "",
    end_date: "",
    current_status: "Active",
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        employee_id: "",
        department_id: "",
        attendance_shift_id: "",
        position: "",
        employment_type: "",
        hire_date: "",
        end_date: "",
        current_status: "Active",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      {/* MODAL */}
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* HEADER */}
        <h3 className="text-xl font-bold mb-5 text-center">
          {initialData ? t("update_employee_hiring") : t("add_employee_hiring")}
        </h3>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("employee_id")}
            </label>
            <input
              type="number"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="border p-2.5 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("department_id")}
            </label>
            <input
              type="number"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              className="border p-2.5 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("shift_id")}
            </label>
            <input
              type="number"
              name="attendance_shift_id"
              value={formData.attendance_shift_id}
              onChange={handleChange}
              className="border p-2.5 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("position")}
            </label>
            <input
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="border p-2.5 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("employement_type")}
            </label>
            <input
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              className="border p-2.5 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("hire_date")}
            </label>
            <input
              type="date"
              name="hire_date"
              value={formData.hire_date}
              onChange={handleChange}
              className="border p-2.5 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("end_date")}
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="border p-2.5 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("status")}
            </label>
            <select
              name="current_status"
              value={formData.current_status}
              onChange={handleChange}
              className="border p-2.5 rounded w-full"
            >
              <option value="Active">Active</option>
              <option value="InActive">InActive</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* ACTIONS - FIXED (IMPORTANT FIX) */}
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-2 mt-3">
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
