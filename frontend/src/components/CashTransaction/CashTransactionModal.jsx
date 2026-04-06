import React, { useEffect, useState } from "react";

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

  // 🔥 detect auto record
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
    setForm({ ...form, [e.target.name]: e.target.value });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96 max-h-[90%] overflow-auto">
        <h3 className="text-lg font-bold mb-4">
          {initialData ? "View Transaction" : "Add Transaction"}
        </h3>

        <form onSubmit={submit} className="space-y-3">
          <input
            name="project_id"
            value={form.project_id}
            onChange={handleChange}
            placeholder="Project ID (optional)"
            className="w-full border p-2 rounded"
            readOnly={isAuto}
          />

          {/* ✅ FIXED */}
          <select
            name="reference_type"
            value={form.reference_type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            disabled={isAuto}
          >
            <option value="Manual">Manual</option>
            <option value="Expense">Expense</option>
            <option value="InvoicePayment">InvoicePayment</option>
            <option value="SalaryPayment">SalaryPayment</option>
          </select>

          <input
            name="reference_id"
            value={form.reference_id}
            onChange={handleChange}
            placeholder="Reference ID (optional)"
            className="w-full border p-2 rounded"
            readOnly={isAuto}
          />

          <select
            name="transaction_type"
            value={form.transaction_type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            disabled={isAuto}
          >
            <option value="">Transaction Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full border p-2 rounded"
            required
            readOnly={isAuto}
          />

          <input
            name="transaction_description"
            value={form.transaction_description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
            readOnly={isAuto}
          />

          <input
            name="transaction_date"
            type="date"
            value={form.transaction_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            readOnly={isAuto}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              type="button"
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Close
            </button>

            {!isAuto && (
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                {initialData ? "Update" : "Save"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
