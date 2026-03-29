import React, { useState, useEffect } from "react";

export default function ProjectInfoModal({ isOpen, onClose, onSubmit, initialData }) {

    const defaultForm = {
        project_name: "",
        project_type: "",
        project_status: "",
        project_start_date: "",
        project_end_date: "",
        client_id: "",
        employee_id: "",
        longitude: 0,
        latitude: 0,
        project_address: "",
        project_estimate_budget: 0
    };

    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => {
        if (initialData) {
            setFormData({
                project_name: initialData.project_name || "",
                project_type: initialData.project_type || "",
                project_status: initialData.project_status || "",
                project_start_date: initialData.project_start_date || "",
                project_end_date: initialData.project_end_date || "",
                client_id: initialData.client_id || "",
                employee_id: initialData.employee_id || "",
                longitude: initialData.longitude ?? 0,
                latitude: initialData.latitude ?? 0,
                project_address: initialData.project_address || "",
                project_estimate_budget: initialData.project_estimate_budget ?? 0
            });
        } else {
            setFormData(defaultForm);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        let val = value;

        // 🔥 FIX: number fields → number convert
        if (["client_id", "employee_id"].includes(name)) {
            val = value === "" ? "" : parseInt(value);
        }

        if (["longitude", "latitude", "project_estimate_budget"].includes(name)) {
            val = value === "" ? 0 : parseFloat(value);
        }

        setFormData({ ...formData, [name]: val });
    };

    const handleSubmit = () => {
        // 🔥 FIX: clean payload (no null, correct types)
        const payload = {
            ...formData,
            client_id: parseInt(formData.client_id),
            employee_id: parseInt(formData.employee_id),
            longitude: parseFloat(formData.longitude) || 0,
            latitude: parseFloat(formData.latitude) || 0,
            project_estimate_budget: parseFloat(formData.project_estimate_budget) || 0
        };

        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-xl">
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? "Edit Project" : "Add Project"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

                    <input type="number" name="client_id" placeholder="Client ID"
                        value={formData.client_id ?? ""}
                        onChange={handleChange} className="border p-2 rounded" />

                    <input type="number" name="employee_id" placeholder="Employee ID"
                        value={formData.employee_id ?? ""}
                        onChange={handleChange} className="border p-2 rounded" />

                    <input name="project_name" placeholder="Project Name"
                        value={formData.project_name ?? ""}
                        onChange={handleChange} className="border p-2 rounded" />

                    <select name="project_type"
                        value={formData.project_type ?? ""}
                        onChange={handleChange}
                        className="border p-2 rounded">
                        <option value="">Select Type</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Other">Other</option>
                    </select>

                    <input type="date" name="project_start_date"
                        value={formData.project_start_date ?? ""} title="Start Date"
                        onChange={handleChange} className="border p-2 rounded" />

                    <input type="date" name="project_end_date"
                        value={formData.project_end_date ?? ""} title="End Date"
                        onChange={handleChange} className="border p-2 rounded" />

                    <input type="number" step="0.000001" name="latitude"
                        value={formData.latitude ?? 0} title="Latitude"
                        onChange={handleChange} className="border p-2 rounded" />

                    <input type="number" step="0.000001" name="longitude"
                        value={formData.longitude ?? 0} title="Longitude"
                        onChange={handleChange} className="border p-2 rounded" />

                    <input name="project_address"
                        value={formData.project_address ?? ""} placeholder="Address"
                        onChange={handleChange} className="border p-2 rounded" />

                    <input type="number" step="0.01" name="project_estimate_budget"
                        value={formData.project_estimate_budget ?? 0}
                        title="Estimate Budget"
                        onChange={handleChange} className="border p-2 rounded" />

                    <select name="project_status"
                        value={formData.project_status ?? ""}
                        onChange={handleChange}
                        className="border p-2 rounded">
                        <option value="">Select Status</option>
                        <option value="Planed">Planed</option>
                        <option value="InProgress">InProgress</option>
                        <option value="Completed">Completed</option>
                        <option value="OnHold">OnHold</option>
                        <option value="Failed">Failed</option>
                        <option value="Other">Other</option>
                    </select>

                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                    <button type="submit" onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                        {initialData ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}