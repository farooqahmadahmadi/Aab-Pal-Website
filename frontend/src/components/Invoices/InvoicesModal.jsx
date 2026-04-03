import React, { useEffect, useState } from "react";

export default function InvoicesModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        project_id: "",
        client_id: "",
        invoice_amount: "",
        invoice_due_date: "",
        invoice_description: "",
        invoice_status: "pending"
    });

    useEffect(() => {
        if (initialData) setForm({ ...initialData });
        else setForm({
            project_id: "",
            client_id: "",
            invoice_amount: "",
            invoice_due_date: "",
            invoice_description: "",
            invoice_status: "pending"
        });
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Invoice" : "Add Invoice"}
                </h3>

                <form onSubmit={submit} className="space-y-3">

                    <input name="project_id" value={form.project_id} onChange={handleChange} placeholder="Project ID" className="w-full border p-2 rounded" />

                    <input name="client_id" value={form.client_id} onChange={handleChange} placeholder="Client ID" className="w-full border p-2 rounded" />

                    <input name="invoice_amount" type="number" value={form.invoice_amount} onChange={handleChange} placeholder="Amount" className="w-full border p-2 rounded" required />

                    <input name="invoice_due_date" type="date" value={form.invoice_due_date} onChange={handleChange} className="w-full border p-2 rounded" />

                    <textarea name="invoice_description" value={form.invoice_description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />

                    <select name="invoice_status" value={form.invoice_status} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Cancelled">Cancelled</option>
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