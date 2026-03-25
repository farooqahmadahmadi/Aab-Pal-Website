import React, { useState, useEffect } from "react";

export default function EmpHiringModal({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        employee_id: "",
        department_id: "",
        attendance_shift_id: "",
        position: "",
        employment_type: "",
        hire_date: "",
        end_date: "",
        current_status: "Active"
    });

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else setFormData({
            employee_id: "",
            department_id: "",
            attendance_shift_id: "",
            position: "",
            employment_type: "",
            hire_date: "",
            end_date: "",
            current_status: "Active"
        });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-xl">
                <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Hiring" : "Add Hiring"}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input type="number" name="employee_id" placeholder="Employee ID" value={formData.employee_id} onChange={handleChange} className="border p-2 rounded" />
                    <input type="number" name="department_id" placeholder="Department ID" value={formData.department_id} onChange={handleChange} className="border p-2 rounded" />
                    <input type="number" name="attendance_shift_id" placeholder="Shift ID" value={formData.attendance_shift_id} onChange={handleChange} className="border p-2 rounded" />
                    <input name="position" placeholder="Position" value={formData.position} onChange={handleChange} className="border p-2 rounded" />
                    <input name="employment_type" placeholder="Employment Type" value={formData.employment_type} onChange={handleChange} className="border p-2 rounded" />
                    <input type="date" name="hire_date" placeholder="Hire Date" value={formData.hire_date} onChange={handleChange} className="border p-2 rounded" />
                    <input type="date" name="end_date" placeholder="End Date" value={formData.end_date} onChange={handleChange} className="border p-2 rounded" />
                    <select name="current_status" value={formData.current_status} onChange={handleChange} className="border p-2 rounded">
                        <option value="Active">Active</option>
                        <option value="InActive">InActive</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="bg-green-500 px-4 py-2 text-white rounded">{initialData ? "Update" : "Save"}</button>
                </div>
            </div>
        </div>
    );
}
