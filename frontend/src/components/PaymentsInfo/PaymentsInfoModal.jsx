import React, { useEffect, useState } from "react";
import API from "../../services/api";

import { useTranslation } from "react-i18next";

export default function PaymentsInfoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState({
    invoice_id: "",
    payment_amount: "",
    payment_date: "",
    payment_method: "Cash",
    payment_status: "Pending",
  });

  const { t } = useTranslation();

  const [invoices, setInvoices] = useState([]);
  const [invoiceStatuses, setInvoiceStatuses] = useState({});
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else {
      setForm({
        invoice_id: "",
        payment_amount: "",
        payment_date: "",
        payment_method: "Cash",
        payment_status: "Pending",
      });
    }
  }, [initialData, isOpen]);

  // 🔥 load invoices
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/invoices");

        setInvoices(res.data);

        const map = {};
        res.data.forEach((i) => {
          map[i.invoice_id] = i.invoice_status;
        });
        setInvoiceStatuses(map);
      } catch {}
    };
    load();
  }, []);

  // 🔥 check allowed
  useEffect(() => {
    if (!form.invoice_id) {
      setIsAllowed(false);
      return;
    }

    const status = invoiceStatuses[form.invoice_id];
    setIsAllowed(status === "Pending" || status === "Partial");
  }, [form.invoice_id, invoiceStatuses]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!isAllowed) {
      alert("Cannot process payment: Invoice is not Pending or Partial");
      return;
    }

    onSubmit({
      ...form,
      invoice_id: Number(form.invoice_id),
      payment_amount: Number(form.payment_amount),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? "update_payment" : t("add_payment")}
        </h2>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-4">
          {/* Invoice Select */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("invoice")}
            </label>
            <select
              name="invoice_id"
              value={form.invoice_id}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            >
              <option value="">Select Invoice</option>
              {invoices.map((i) => (
                <option key={i.invoice_id} value={i.invoice_id}>
                  #{i.invoice_id} ({i.invoice_status})
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("payment_amount")}
            </label>
            <input
              name="payment_amount"
              value={form.payment_amount}
              onChange={handleChange}
              type="number"
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              disabled={!isAllowed}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("payment_date")}
            </label>
            <input
              name="payment_date"
              value={form.payment_date}
              onChange={handleChange}
              type="date"
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              disabled={!isAllowed}
              required
            />
          </div>

          {/* Method */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("payment_method")}
            </label>
            <select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              disabled={!isAllowed}
            >
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="Transfer">Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("status")}
            </label>
            <select
              name="payment_status"
              value={form.payment_status}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              disabled={!isAllowed}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Warning */}
          {!isAllowed && form.invoice_id && (
            <p className="text-red-500 text-sm">
              Cannot add/edit payment: Invoice is not Pending or Partial.
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={!isAllowed}
              className={`w-full sm:w-auto px-4 py-2 rounded ${
                isAllowed
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
