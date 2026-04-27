import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CashTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState({
    project_id: "",
    reference_type: "",
    reference_id: "",
    transaction_type: "",
    amount: "",
    transaction_description: "",
    transaction_date: "",
  });

  const { t } = useTranslation();
  
  // detect auto record
  const isAuto = initialData && initialData.reference_type !== "Manual";

  useEffect(() => {
    if (initialData) {
      setForm({
        project_id: initialData.project_id || "",
        reference_type: initialData.reference_type || "Manual",
        reference_id: initialData.reference_id || "",
        transaction_type: initialData.transaction_type || "",
        amount: initialData.amount || "",
        transaction_description: initialData.transaction_description || "",
        transaction_date: initialData.transaction_date || "",
      });
    } else {
      setForm({
        project_id: "",
        reference_type: "Manual",
        reference_id: "",
        transaction_type: "",
        amount: "",
        transaction_description: "",
        transaction_date: "",
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    if (isAuto) return;
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (isAuto) return;

    const payload = {
      ...form,
      project_id: form.project_id || null,
      reference_id: form.reference_id || null,
    };

    onSubmit(payload);
  };

  return (
     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_transaction") : t("add_transaction")}
        </h2>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Project ID */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">
                {t("project_id")}
              </label>
              <input
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
                placeholder="(optional)"
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                readOnly={isAuto}
              />
            </div>

            {/* Reference Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("type")}
              </label>
              <select
                name="reference_type"
                value={form.reference_type}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                disabled={isAuto}
              >
                <option value="Manual">Manual</option>
                <option value="Expense">Expense</option>
                <option value="InvoicePayment">InvoicePayment</option>
                <option value="SalaryPayment">SalaryPayment</option>
              </select>
            </div>

            {/* Reference ID */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("reference_id")}
              </label>
              <input
                name="reference_id"
                value={form.reference_id}
                onChange={handleChange}
                placeholder="(optional)"
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                readOnly={isAuto}
              />
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("transaction_type")}
              </label>
              <select
                name="transaction_type"
                value={form.transaction_type}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                required
                disabled={isAuto}
              >
                <option value="">Select Type</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {" "}
                {t("amount")}
              </label>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="Amount"
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                required
                readOnly={isAuto}
              />
            </div>

            {/* Date */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">
                {t("date")}
              </label>
              <input
                name="transaction_date"
                type="date"
                value={form.transaction_date}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                readOnly={isAuto}
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">
                {t("description")}
              </label>
              <textarea
                name="transaction_description"
                value={form.transaction_description}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                rows={3}
                readOnly={isAuto}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              {t("cancel")}
            </button>

            {!isAuto && (
              <button
                type="submit"
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                {initialData ? t("update") : t("save")}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
