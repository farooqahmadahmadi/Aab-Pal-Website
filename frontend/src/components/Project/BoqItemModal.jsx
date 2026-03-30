import React, { useEffect, useState } from "react";

export default function BoqItemModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        project_id: "",
        item_name: "",
        unit: "Meter",
        item_quantity: "",
        unit_price: ""
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            project_id: "",
            item_name: "",
            unit: "Meter",
            item_quantity: "",
            unit_price: ""
        });
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        if (!form.project_id || !form.item_name) return alert("Required fields");
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="font-bold mb-4">{initialData ? "Edit" : "Add"} BOQ Item</h3>

                <form onSubmit={submit} className="space-y-3">
                    <input name="project_id" value={form.project_id} onChange={handleChange} placeholder="Project ID" className="w-full border p-2 rounded" required />
                    <input name="item_name" value={form.item_name} onChange={handleChange} placeholder="Item Name" className="w-full border p-2 rounded" required />

                    <select name="unit" value={form.unit} onChange={handleChange} className="w-full border p-2 rounded">
                        <option>Meter</option>
                        <option>Tone</option>
                        <option>Squire Meter</option>
                        <option>Other</option>
                    </select>

                    <input name="item_quantity" value={form.item_quantity} onChange={handleChange} placeholder="Quantity" className="w-full border p-2 rounded" />
                    <input name="unit_price" value={form.unit_price} onChange={handleChange} placeholder="Unit Price" className="w-full border p-2 rounded" />

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
