import React, { useEffect, useState } from "react";

export default function PaymentModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        invoice_id: "",
        payment_amount: "",
        payment_date: "",
        payment_method: "",
        payment_status: "pending"
    });

    useEffect(() => {
        if (initialData) setForm({ ...initialData });
        else setForm({
            invoice_id: "",
            payment_amount: "",
            payment_date: "",
            payment_method: "",
            payment_status: "pending"
        });
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Payment" : "Add Payment"}
                </h3>

                <form onSubmit={submit} className="space-y-3">

                    <input name="invoice_id" value={form.invoice_id} onChange={handleChange} placeholder="Invoice ID" className="w-full border p-2 rounded" required />

                    <input name="payment_amount" value={form.payment_amount} onChange={handleChange} type="number" placeholder="Amount" className="w-full border p-2 rounded" required />

                    <input name="payment_date" value={form.payment_date} onChange={handleChange} type="date" className="w-full border p-2 rounded" required />

                    <select name="payment_method" value={form.payment_method} onChange={handleChange} className="w-full border p-2 rounded" required>
                        <option value="">Select Method</option>
                        <option value="cash">Cash</option>
                        <option value="bank">Bank</option>
                        <option value="transfer">Transfer</option>
                        <option value="cheque">Cheque</option>
                    </select>

                    <select name="payment_status" value={form.payment_status} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                    </select>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}