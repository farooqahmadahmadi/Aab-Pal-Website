import React, { useEffect, useState } from "react";

export default function TaskModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        project_id: "",
        employee_id: "",
        task_title: "",
        task_description: "",
        task_due_date: "",
        task_status: "Pending"
    });

    useEffect(() => {
        if (initialData) setForm({ ...initialData });
        else setForm({
            project_id: "",
            employee_id: "",
            task_title: "",
            task_description: "",
            task_due_date: "",
            task_status: "Pending"
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
            <div className="bg-white p-6 rounded w-96 max-h-[90%] overflow-auto">
                <h3 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Task" : "Add Task"}
                </h3>

                <form onSubmit={submit} className="space-y-3">
                    <input name="project_id" value={form.project_id} onChange={handleChange} placeholder="Project ID" className="w-full border p-2 rounded" required />
                    <input name="employee_id" value={form.employee_id} onChange={handleChange} placeholder="Assigned To (Employee ID)" className="w-full border p-2 rounded" required />
                    <input name="task_title" value={form.task_title} onChange={handleChange} placeholder="Task Title" className="w-full border p-2 rounded" required />
                    <textarea name="task_description" value={form.task_description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />

                    <input type="date" name="task_due_date" value={form.task_due_date || ""} onChange={handleChange} className="w-full border p-2 rounded" />

                    <select name="task_status" value={form.task_status} onChange={handleChange} className="w-full border p-2 rounded">
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                    </select>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}