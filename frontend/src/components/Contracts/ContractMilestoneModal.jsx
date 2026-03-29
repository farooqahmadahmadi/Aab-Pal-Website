import React, { useEffect, useState } from "react";

export default function ContractMilestoneModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        contract_id: "",
        title: "",
        due_date: "",
        amount: 0,
        status: "Pending"
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            contract_id: "",
            title: "",
            due_date: "",
            amount: 0,
            status: "Pending"
        });
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        if (!form.contract_id || !form.title) return alert("Required fields missing");
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="font-bold mb-4">{initialData ? "Edit" : "Add"} Milestone</h3>

                <form onSubmit={submit} className="space-y-3">
                    <input name="contract_id" value={form.contract_id} onChange={handleChange} placeholder="Contract ID" className="w-full border p-2 rounded" required />
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded" required />
                    <input type="date" name="due_date" title="Due Date" value={form.due_date} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input type="number" name="amount" step="0.01" title="Amount" value={form.amount ?? 0} onChange={handleChange} placeholder="Amount" className="w-full border p-2 rounded" />

                    <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
                        <option>Pending</option>
                        <option>Completed</option>
                        <option>Delayed</option>
                        <option>Cancelled</option>
                    </select>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                        >Cancel</button>


                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
