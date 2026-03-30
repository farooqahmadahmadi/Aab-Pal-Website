import React, { useEffect, useState } from "react";

export default function MaterialsModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        material_name: "",
        material_unit: "",
        current_stock: 0,
        average_price: 0
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            material_name: "",
            material_unit: "",
            current_stock: 0,
            average_price: 0
        });
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        if (!form.material_name) {
            alert("Material name required");
            return;
        }
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="font-bold mb-4">{initialData ? "Edit" : "Add"} Material</h3>

                <form onSubmit={submit} className="space-y-3">
                    <input name="material_name" value={form.material_name} onChange={handleChange} placeholder="Material Name" className="w-full border p-2 rounded" required />

                    <select name="material_unit" title="Unit" value={form.material_unit} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="">Select Unit</option>
                        <option value="Meter">Meter</option>
                        <option value="Squire Meter">Squire Meter</option>
                        <option value="Kg">Kg</option>
                        <option value="Tone">Tone</option>
                    </select>

                    <input type="number" title="Current Stock" name="current_stock" value={form.current_stock} onChange={handleChange} placeholder="Stock" className="w-full border p-2 rounded" />
                    <input type="number" title="Average Price" name="average_price" value={form.average_price} onChange={handleChange} placeholder="Unit Price" className="w-full border p-2 rounded" />

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}