import React, { useEffect, useState } from "react";

export default function SafetyIncidentModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        project_id: "",
        incident_description: "",
        incident_date: "",
        incident_severity: "",
        action_taken: ""
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            project_id: "",
            incident_description: "",
            incident_date: "",
            incident_severity: "",
            action_taken: ""
        });
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Incident" : "Add Incident"}
                </h3>

                <form onSubmit={submit} className="space-y-3">
                    <input name="project_id" value={form.project_id} onChange={handleChange} placeholder="Project ID" className="w-full border p-2 rounded" required />

                    <textarea name="incident_description" value={form.incident_description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />

                    <input type="date" name="incident_date" value={form.incident_date} onChange={handleChange} className="w-full border p-2 rounded" />

                    <select name="incident_severity" value={form.incident_severity} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="">Select Severity</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                    </select>

                    <textarea name="action_taken" value={form.action_taken} onChange={handleChange} placeholder="Action Taken" className="w-full border p-2 rounded" />

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