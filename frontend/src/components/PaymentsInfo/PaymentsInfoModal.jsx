
import React, { useEffect, useState } from "react";

export default function PaymentsInfoModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        invoice_id: "",
        payment_amount: "",
        payment_date: "",
        payment_method: "Cash",
        payment_status: "Pending"
    });

    useEffect(() => {
        if (initialData) {
            setForm({ ...initialData });
        } else {
            setForm({
                invoice_id: "",
                payment_amount: "",
                payment_date: "",
                payment_method: "Cash",
                payment_status: "Pending"
            });
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = (e) => {
        e.preventDefault();

        onSubmit({
            ...form,
            invoice_id: Number(form.invoice_id),
            payment_amount: Number(form.payment_amount),
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Payment" : "Add Payment"}
                </h3>

                <form onSubmit={submit} className="space-y-3">

                    <input
                        name="invoice_id"
                        value={form.invoice_id}
                        onChange={handleChange}
                        placeholder="Invoice ID"
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        name="payment_amount"
                        value={form.payment_amount}
                        onChange={handleChange}
                        type="number"
                        placeholder="Amount"
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        name="payment_date"
                        value={form.payment_date}
                        onChange={handleChange}
                        type="date"
                        className="w-full border p-2 rounded"
                        required
                    />

                    <select
                        name="payment_method"
                        value={form.payment_method}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
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
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Failed">Failed</option>
                    </select>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                            Save
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}