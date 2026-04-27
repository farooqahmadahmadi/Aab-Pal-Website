import React, { useEffect, useState } from "react";
import { getSalaries } from "../../services/employeeSalaryService";
import { useTranslation } from "react-i18next";

export default function EmployeeSalaryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState({
    employee_id: "",
    base_salary: "",
    allowance: "",
    effective_from: "",
    effective_to: "",
    is_active: false,
  });

  const { t } = useTranslation();

  const [salaries, setSalaries] = useState([]);
  const [activeExists, setActiveExists] = useState(false);

  // FETCH
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const data = await getSalaries();
          setSalaries(data || []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  // INITIAL DATA
  useEffect(() => {
    if (initialData) {
      setForm({
        employee_id: initialData.employee_id || "",
        base_salary: initialData.base_salary || "",
        allowance: initialData.allowance || "",
        effective_from: initialData.effective_from || "",
        effective_to: initialData.effective_to || "",
        is_active: initialData.is_active || false,
      });
    } else {
      setForm({
        employee_id: "",
        base_salary: "",
        allowance: "",
        effective_from: "",
        effective_to: "",
        is_active: false,
      });
    }
  }, [initialData]);

  // ACTIVE CHECK
  useEffect(() => {
    const exists = salaries.some(
      (s) =>
        s.is_active && s.employee_salary_id !== initialData?.employee_salary_id,
    );
    setActiveExists(exists);
  }, [salaries, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "is_active" ? value === "true" : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_salary") : t("add_salary")}
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("emp_id")}
              </label>
              <input
                type="number"
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                required
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("base_salary")}
              </label>
              <input
                type="number"
                name="base_salary"
                value={form.base_salary}
                onChange={handleChange}
                required
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("allowance")}
              </label>
              <input
                type="number"
                name="allowance"
                value={form.allowance}
                onChange={handleChange}
                required
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("effective_from")}
              </label>
              <input
                type="date"
                name="effective_from"
                value={form.effective_from}
                onChange={handleChange}
                required
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("effective_to")}
              </label>
              <input
                type="date"
                name="effective_to"
                value={form.effective_to}
                onChange={handleChange}
                required
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("status")}
              </label>
              <select
                name="is_active"
                value={form.is_active ? "true" : "false"}
                onChange={handleChange}
                disabled={activeExists && !form.is_active}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* WARNING */}
          {activeExists && !form.is_active && (
            <p className="text-xs text-red-500">
              Only one active record is allowed
            </p>
          )}

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
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
