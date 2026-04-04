import React, { useEffect, useState } from "react";

export default function ExpensesModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        project_id: "",
        expense_type: "",
        expense_amount: "",
        expense_date: "",
        expense_description: ""
    });

    useEffect(() => {
        if (initialData) setForm({ ...initialData });
        else setForm({
            project_id: "",
            expense_type: "",
            expense_amount: "",
            expense_date: "",
            expense_description: ""
        });
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            project_id: form.project_id ? Number(form.project_id) : null, // ✅ optional
            expense_amount: Number(form.expense_amount)
        };

        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Expense" : "Add Expense"}
                </h3>

                <form onSubmit={submit} className="space-y-3">

                    {/* optional field */}
                    <input
                        name="project_id"
                        value={form.project_id}
                        onChange={handleChange}
                        placeholder="Project ID (optional)"
                        className="w-full border p-2 rounded"
                    />

                    <select
                        name="expense_type"
                        value={form.expense_type}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Material">Material</option>
                        <option value="Labor">Labor</option>
                        <option value="Transport">Transport</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Other">Other</option>
                    </select>

                    <input
                        name="expense_amount"
                        type="number"
                        value={form.expense_amount}
                        onChange={handleChange}
                        placeholder="Amount"
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        name="expense_date"
                        type="date"
                        value={form.expense_date}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        name="expense_description"
                        value={form.expense_description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full border p-2 rounded"
                    />

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}