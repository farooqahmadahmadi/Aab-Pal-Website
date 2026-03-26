import React, { useEffect, useState } from "react";

export default function DepartmentModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        department_name: "",
        department_description: ""
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({ department_name: "", department_description: "" });
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const submit = (e) => { e.preventDefault(); onSubmit(form); };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-bold mb-4">{initialData ? "Edit Department" : "Add Department"}</h3>
                <form onSubmit={submit} className="space-y-3">
                    <input
                        name="department_name"
                        value={form.department_name}
                        onChange={handleChange}
                        placeholder="Department Name"
                        maxLength={150}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        name="department_description"
                        value={form.department_description}
                        onChange={handleChange}
                        placeholder="Description"
                        maxLength={255}
                        className="w-full border p-2 rounded"
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">{initialData ? "Update" : "Save"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}