import React, { useEffect, useState } from "react";

export default function InvoicesModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState({
    project_id: "",
    client_id: "",
    invoice_amount: "",
    invoice_due_date: "",
    invoice_description: "",
    invoice_status: "Pending",
    invoice_type: "In",
    reference_type: "",
    reference_id: "",
    paid_amount: "",
  });

  useEffect(() => {
    setForm({
      project_id: initialData?.project_id ?? "",
      client_id: initialData?.client_id ?? "",
      invoice_amount: initialData?.invoice_amount ?? "",
      invoice_due_date: initialData?.invoice_due_date ?? "",
      invoice_description: initialData?.invoice_description ?? "",
      invoice_status: initialData?.invoice_status ?? "Pending",
      invoice_type: initialData?.invoice_type ?? "In",
      reference_type: initialData?.reference_type ?? "",
      reference_id: initialData?.reference_id ?? "",
      paid_amount: initialData?.paid_amount ?? 0,
    });
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      project_id: form.project_id ? Number(form.project_id) : null,
      client_id: form.client_id ? Number(form.client_id) : null,
      invoice_amount: form.invoice_amount ? Number(form.invoice_amount) : 0,
      invoice_due_date: form.invoice_due_date || null, // 🔹 null allowed
    });
  };

  const isPurchaseOrder = form.reference_type === "Purchase Order";
  const showReferenceFields = !!form.reference_type;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="text-lg font-bold mb-4">
          {initialData ? "Edit Invoice" : "Add Invoice"}
        </h3>

        <form onSubmit={submit} className="space-y-3">
          {/* Invoice Type */}
          <select
            name="invoice_type"
            value={form.invoice_type || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="In">In</option>
            <option value="Out">Out</option>
          </select>

          {/* Reference Type & ID */}
          {showReferenceFields && (
            <>
              <select
                name="reference_type"
                value={form.reference_type || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded bg-gray-100"
                disabled
              >
                <option value="">Select Reference Type</option>
                <option value="Purchase Order">Purchase Order</option>
                <option value="Other">Other</option>
              </select>

              <input
                name="reference_id"
                value={form.reference_id || ""}
                onChange={handleChange}
                placeholder="Reference ID"
                className="w-full border p-2 rounded bg-gray-100"
                readOnly
              />
            </>
          )}

          {/* Project & Client ID */}
          <input
            name="project_id"
            value={form.project_id || ""}
            onChange={handleChange}
            placeholder="Project ID"
            className={`w-full border p-2 rounded ${isPurchaseOrder ? "bg-gray-100" : ""}`}
            readOnly={isPurchaseOrder}
          />
          <input
            name="client_id"
            value={form.client_id || ""}
            onChange={handleChange}
            placeholder="Client ID"
            className={`w-full border p-2 rounded ${isPurchaseOrder ? "bg-gray-100" : ""}`}
            readOnly={isPurchaseOrder}
          />

          {/* Invoice Amount */}
          <input
            name="invoice_amount"
            type="number"
            value={form.invoice_amount || ""}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full border p-2 rounded"
            readOnly={isPurchaseOrder}
            required
          />

          {/* Paid Amount */}
          <input
            name="paid_amount"
            type="number"
            value={form.paid_amount || 0}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />

          {/* Due Date */}
          <input
            name="invoice_due_date"
            type="date"
            value={form.invoice_due_date || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Description */}
          <textarea
            name="invoice_description"
            value={form.invoice_description || ""}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />

          {/* Status */}
          <select
            name="invoice_status"
            value={form.invoice_status || "Pending"}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {initialData ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
