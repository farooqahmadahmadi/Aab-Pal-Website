import React, { useEffect, useState } from "react";

export default function EquipmentMaintenanceModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        equipment_id: "",
        maintenance_description: "",
        maintenance_cost: "",
        maintenance_date: ""
    });

    useEffect(() => {
        if (initialData) setForm({ ...initialData });
        else setForm({ equipment_id: "", maintenance_description: "", maintenance_cost: "", maintenance_date: "" });
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
            <div className="bg-white p-6 rounded w-96 max-h-[90%] overflow-auto">
                <h3 className="text-lg font-bold mb-4">{initialData ? "Edit Maintenance" : "Add Maintenance"}</h3>
                <form onSubmit={submit} className="space-y-3">
                    <input name="equipment_id" value={form.equipment_id} onChange={handleChange} placeholder="Equipment ID" className="w-full border p-2 rounded" required />
                    <input name="maintenance_description" value={form.maintenance_description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" required />
                    <input name="maintenance_cost" value={form.maintenance_cost} onChange={handleChange} placeholder="Cost" type="number" className="w-full border p-2 rounded" required />
                    <input name="maintenance_date" value={form.maintenance_date} onChange={handleChange} type="date" className="w-full border p-2 rounded" required />

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">{initialData ? "Update" : "Save"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
