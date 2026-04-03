import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function PaymentsInfoModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        invoice_id: "",
        payment_amount: "",
        payment_date: "",
        payment_method: "Cash",
        payment_status: "Pending"
    });

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
                payment_status: "Pending"
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
                res.data.forEach(i => {
                    map[i.invoice_id] = i.invoice_status;
                });
                setInvoiceStatuses(map);
            } catch { }
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
        setForm(prev => ({ ...prev, [name]: value }));
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
            payment_amount: Number(form.payment_amount)
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Payment" : "Add Payment"}
                </h3>

                <form onSubmit={submit} className="space-y-3">

                    {/* 🔥 Invoice Select */}
                    <select
                        name="invoice_id"
                        value={form.invoice_id}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">Select Invoice</option>
                        {invoices.map(i => (
                            <option key={i.invoice_id} value={i.invoice_id}>
                                #{i.invoice_id} ({i.invoice_status})
                            </option>
                        ))}
                    </select>

                    <input
                        name="payment_amount"
                        value={form.payment_amount}
                        onChange={handleChange}
                        type="number"
                        placeholder="Amount"
                        className="w-full border p-2 rounded"
                        disabled={!isAllowed}
                        required
                    />

                    <input
                        name="payment_date"
                        value={form.payment_date}
                        onChange={handleChange}
                        type="date"
                        className="w-full border p-2 rounded"
                        disabled={!isAllowed}
                        required
                    />

                    <select
                        name="payment_method"
                        value={form.payment_method}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        disabled={!isAllowed}
                    >
                        <option value="Cash">Cash</option>
                        <option value="Bank">Bank</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Other">Other</option>
                    </select>

                    <select
                        name="payment_status"
                        value={form.payment_status}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        disabled={!isAllowed}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Failed">Failed</option>
                    </select>

                    {/* 🔥 warning */}
                    {!isAllowed && form.invoice_id && (
                        <p className="text-red-500 text-sm">
                            Cannot add/edit payment: Invoice is not Pending or Partial.
                        </p>
                    )}

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                            Cancel
                        </button>

                        <button
                            className={`px-4 py-2 rounded ${
                                isAllowed ? "bg-green-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
                            }`}
                            disabled={!isAllowed}
                        >
                            Save
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}