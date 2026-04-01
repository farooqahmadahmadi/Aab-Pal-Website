import React, { useEffect, useState } from "react";

export default function CashTransactionModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        project_id: "",
        reference_type: "",
        reference_id: "",
        transaction_type: "",
        amount: "",
        transaction_description: "",
        transaction_date: ""
    });

    useEffect(() => {
        if (initialData) setForm({ ...initialData });
        else setForm({
            project_id: "",
            reference_type: "",
            reference_id: "",
            transaction_type: "",
            amount: "",
            transaction_description: "",
            transaction_date: ""
        });
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = e => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-96 max-h-[90%] overflow-auto">
                <h3 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Transaction" : "Add Transaction"}
                </h3>

                <form onSubmit={submit} className="space-y-3">
                    <input name="project_id" value={form.project_id} onChange={handleChange} placeholder="Project ID" className="w-full border p-2 rounded" />

                    <select name="reference_type" value={form.reference_type} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="">Reference Type</option>
                        <option value="expense">Expense</option>
                        <option value="invoice">Invoice</option>
                        <option value="payment">Payment</option>
                        <option value="manual">Manual</option>
                    </select>

                    <input name="reference_id" value={form.reference_id} onChange={handleChange} placeholder="Reference ID" className="w-full border p-2 rounded" />

                    <select name="transaction_type" value={form.transaction_type} onChange={handleChange} className="w-full border p-2 rounded" required>
                        <option value="">Transaction Type</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount" className="w-full border p-2 rounded" required />

                    <input name="transaction_description" value={form.transaction_description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />

                    <input name="transaction_date" type="date" value={form.transaction_date} onChange={handleChange} className="w-full border p-2 rounded" />

                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={onClose} type="button" className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}