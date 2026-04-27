import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ContractMilestoneModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const defaultForm = {
    contract_id: "",
    title: "",
    due_date: "",
    amount: 0,
    status: "Pending",
  };

  const { t } = useTranslation();
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm(defaultForm);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.contract_id || !form.title) {
      alert("Required fields missing");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData
            ? t("update_contract_milestone")
            : t("add_contract_milestone")}
        </h2>

        <form
          onSubmit={submit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Contract ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("contract_id")}
            </label>
            <input
              name="contract_id"
              value={form.contract_id || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("title")}
            </label>
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
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
              name="due_date"
              value={form.due_date || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("amount")}
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              value={form.amount ?? 0}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Status */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("status")}
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option>Pending</option>
              <option>Completed</option>
              <option>Delayed</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {initialData ? t("update") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
