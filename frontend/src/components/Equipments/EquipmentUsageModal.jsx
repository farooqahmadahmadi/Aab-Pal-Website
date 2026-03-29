import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

export default function EquipmentUsageModal({ isOpen, onClose, onSubmit, initialData }) {

    const [form, setForm] = useState({
        equipment_id: "",
        employee_id: "",
        project_id: "",
        usage_start_date: "",
        usage_end_date: "",
        usage_description: ""
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            equipment_id: "",
            employee_id: "",
            project_id: "",
            usage_start_date: "",
            usage_end_date: "",
            usage_description: ""
        });
    }, [initialData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">

                <h3 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Usage" : "Add Usage"}
                </h3>

                <form onSubmit={submit} className="space-y-3">
                    <input name="equipment_id" value={form.equipment_id} onChange={handleChange} placeholder="Equipment ID" className="w-full border p-2 rounded" required />
                    <input name="employee_id" value={form.employee_id} onChange={handleChange} placeholder="Employee ID" className="w-full border p-2 rounded" required />
                    <input name="project_id" value={form.project_id} onChange={handleChange} placeholder="Project ID" className="w-full border p-2 rounded" />
                    <input type="date" name="usage_start_date" value={form.usage_start_date} onChange={handleChange} className="w-full border p-2 rounded" required />
                    <input type="date" name="usage_end_date" value={form.usage_end_date} onChange={handleChange} className="w-full border p-2 rounded" />
                    <textarea name="usage_description" value={form.usage_description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />

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
