import React, { useEffect, useState } from "react";

export default function SuppliersModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        supplier_name: "",
        supplier_phone: "",
        supplier_email: "",
        supplier_address: "",
        supplier_status: "Active"
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            supplier_name: "",
            supplier_phone: "",
            supplier_email: "",
            supplier_address: "",
            supplier_status: "Active"
        });
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        if (!form.supplier_name || !form.supplier_address) {
            alert("Name and Address required");
            return;
        }
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="font-bold mb-4">{initialData ? "Edit" : "Add"} Supplier</h3>

                <form onSubmit={submit} className="space-y-3">
                    <input name="supplier_name" value={form.supplier_name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" required />
                    <input name="supplier_phone" value={form.supplier_phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" />
                    <input name="supplier_email" value={form.supplier_email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" />
                    <input name="supplier_address" value={form.supplier_address} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded" required />
                    <select name="supplier_status" value={form.supplier_status} title="Status" onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="Active">Active</option>
                        <option value="InActive">InActive</option>
                    </select>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
