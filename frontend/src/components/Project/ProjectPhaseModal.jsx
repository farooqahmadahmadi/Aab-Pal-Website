import React, { useState, useEffect } from "react";

export default function ProjectPhaseModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        project_id: "",
        phase_name: "",
        phase_start_date: "",
        phase_end_date: "",
        phase_status: ""
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            project_id: "",
            phase_name: "",
            phase_start_date: "",
            phase_end_date: "",
            phase_status: ""
        });
    }, [initialData]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = () => onSubmit(form);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-96">
                <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Phase" : "Add New Phase"}</h2>
                <div className="flex flex-col gap-2">
                    <input name="project_id" value={form.project_id} onChange={handleChange} placeholder="Project ID" className="border p-2 rounded" />
                    <input name="phase_name" value={form.phase_name} onChange={handleChange} placeholder="Phase Name" className="border p-2 rounded" />
                    <input type="date" name="phase_start_date" value={form.phase_start_date} onChange={handleChange} className="border p-2 rounded" />
                    <input type="date" name="phase_end_date" value={form.phase_end_date} onChange={handleChange} className="border p-2 rounded" />

                    {/* Phase Status Dropdown */}
                    <select name="phase_status" value={form.phase_status} onChange={handleChange} className="border p-2 rounded">
                        <option value="">Select Status</option>
                        <option value="Not Started">Not Started</option>
                        <option value="InProgress">InProgress</option>
                        <option value="Completed">Completed</option>
                        <option value="OnHold">OnHold</option>
                        <option value="Failed">Failed</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">{initialData ? "Update" : "Add"}</button>
                </div>
            </div>
        </div>
    );
}