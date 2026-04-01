
import React, { useEffect, useState } from "react";

export default function SiteReportModal({ isOpen, onClose, onSubmit, initialData }) {

    const [form, setForm] = useState({
        project_id: "",
        employee_id: "",
        task_assignment_id: "",
        report_date: "",
        weather: "",
        report_title: "",
        work_completed: "",
        issues: ""
    });

    useEffect(() => {
        if (initialData) setForm({ ...initialData });
        else setForm({
            project_id: "",
            employee_id: "",
            task_assignment_id: "",
            report_date: "",
            weather: "",
            report_title: "",
            work_completed: "",
            issues: ""
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
            <div className="bg-white p-6 rounded w-[500px] max-h-[90%] overflow-auto">

                <h3 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Report" : "Add Report"}
                </h3>

                <form onSubmit={submit} className="space-y-3">

                    <input name="project_id" value={form.project_id} onChange={handleChange} placeholder="Project ID" className="w-full border p-2 rounded" required />
                    <input name="employee_id" value={form.employee_id} onChange={handleChange} placeholder="Prepared By (Employee ID)" className="w-full border p-2 rounded" required />

                    <input name="task_assignment_id" value={form.task_assignment_id || ""} onChange={handleChange} placeholder="Task ID (optional)" className="w-full border p-2 rounded" />

                    <input type="date" name="report_date" value={form.report_date} onChange={handleChange} className="w-full border p-2 rounded" required />

                    <input name="weather" value={form.weather} onChange={handleChange} placeholder="Weather" className="w-full border p-2 rounded" />

                    <input name="report_title" value={form.report_title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded" required />

                    <textarea name="work_completed" value={form.work_completed} onChange={handleChange} placeholder="Work Completed" className="w-full border p-2 rounded" />

                    <textarea name="issues" value={form.issues} onChange={handleChange} placeholder="Issues" className="w-full border p-2 rounded" />

                    <div className="flex justify-end gap-2 mt-4">
                        <button typeof="button" onClick={onClose} type="button" className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}