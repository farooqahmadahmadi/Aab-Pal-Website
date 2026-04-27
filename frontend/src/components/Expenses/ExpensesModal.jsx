import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

export default function ExpensesModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState({
    project_id: "",
    expense_type: "",
    expense_amount: "",
    expense_date: "",
    expense_description: "",
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    } else {
      setForm({
        project_id: "",
        expense_type: "",
        expense_amount: "",
        expense_date: "",
        expense_description: "",
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      project_id: form.project_id ? Number(form.project_id) : null,
      expense_amount: Number(form.expense_amount),
    };

    onSubmit(payload);
  };

  return (
     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_expense") : t("add_expense")}
        </h2>

        {/* FORM */}
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Project ID (optional) */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("project_id") + " (Optional)"}
              </label>
              <input
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
                className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Expense Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("type")}
              </label>
              <select
                name="expense_type"
                value={form.expense_type}
                onChange={handleChange}
                required
                className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">Select Type</option>
                <option value="Material">Material</option>
                <option value="Labor">Labor</option>
                <option value="Transport">Transport</option>
                <option value="Equipment">Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("amount")}
              </label>
              <input
                name="expense_amount"
                type="number"
                value={form.expense_amount}
                onChange={handleChange}
                required
                className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("date")}
              </label>
              <input
                name="expense_date"
                type="date"
                value={form.expense_date}
                onChange={handleChange}
                className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Description full width */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("description")}
            </label>
            <input
              name="expense_description"
              value={form.expense_description}
              onChange={handleChange}
              className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-3">
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
