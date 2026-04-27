import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

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
      invoice_due_date: form.invoice_due_date || null,
    });
  };

  const isPurchaseOrder = form.reference_type === "Purchase Order";
  const showReferenceFields = !!form.reference_type;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_invoice") : t("add_invoice")}
        </h2>

        <form
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Invoice Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("type")}
            </label>
            <select
              name="invoice_type"
              value={form.invoice_type || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="In">In</option>
              <option value="Out">Out</option>
            </select>
          </div>

          {/* Reference Type */}
          {showReferenceFields && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("reference_type")}
                </label>
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("reference_id")}
                </label>
                <input
                  name="reference_id"
                  value={form.reference_id || ""}
                  onChange={handleChange}
                  placeholder="Reference ID"
                  className="w-full border p-2 rounded bg-gray-100"
                  readOnly
                />
              </div>
            </>
          )}

          {/* Project ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("project_id")}
            </label>
            <input
              name="project_id"
              value={form.project_id || ""}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                isPurchaseOrder ? "bg-gray-100" : ""
              }`}
              readOnly={isPurchaseOrder}
            />
          </div>

          {/* Client ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("client_id")}
            </label>
            <input
              name="client_id"
              value={form.client_id || ""}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                isPurchaseOrder ? "bg-gray-100" : ""
              }`}
              readOnly={isPurchaseOrder}
            />
          </div>

          {/* Invoice Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("amount")}
            </label>
            <input
              name="invoice_amount"
              type="number"
              value={form.invoice_amount || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              readOnly={isPurchaseOrder}
              required
            />
          </div>

          {/* Paid Amount (Full Width) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("paid_amount")}
            </label>
            <input
              name="paid_amount"
              type="number"
              value={form.paid_amount || 0}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("due_date")}
            </label>
            <input
              name="invoice_due_date"
              type="date"
              value={form.invoice_due_date || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("status")}
            </label>
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
          </div>

          {/* Description (Full Width) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("description")}
            </label>
            <textarea
              name="invoice_description"
              value={form.invoice_description || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">
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
