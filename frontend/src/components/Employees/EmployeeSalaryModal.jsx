import React, { useEffect, useState } from "react";
import { getSalaries } from "../../services/employeeSalaryService";

export default function EmployeeSalaryModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        employee_id: "",
        base_salary: "",
        allowance: "",
        effective_from: "",
        effective_to: "",
        is_active: false,
    });
    const [salaries, setSalaries] = useState([]);
    const [activeExists, setActiveExists] = useState(false);

    // Fetch all salaries to check active status
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const data = await getSalaries();
                    setSalaries(data || []);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    // Set initial form data
    useEffect(() => {
        if (initialData) {
            setForm({
                employee_id: initialData.employee_id || "",
                base_salary: initialData.base_salary || "",
                allowance: initialData.allowance || "",
                effective_from: initialData.effective_from || "",
                effective_to: initialData.effective_to || "",
                is_active: initialData.is_active || false,
            });
        } else {
            setForm({
                employee_id: "",
                base_salary: "",
                allowance: "",
                effective_from: "",
                effective_to: "",
                is_active: false,
            });
        }
    }, [initialData]);

    // Check if an active salary already exists (other than editing one)
    useEffect(() => {
        const exists = salaries.some(
            (s) => s.is_active && s.employee_salary_id !== initialData?.employee_salary_id
        );
        setActiveExists(exists);
    }, [salaries, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "is_active" ? value === "true" : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h3 className="text-lg font-bold mb-4">{initialData ? "Edit" : "Add"} Salary</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="number"
                        name="employee_id"
                        value={form.employee_id}
                        onChange={handleChange}
                        placeholder="Employee ID"
                        required
                        className="border px-3 py-2 rounded"
                    />
                    <input
                        type="number"
                        name="base_salary"
                        value={form.base_salary}
                        onChange={handleChange}
                        placeholder="Base Salary"
                        required
                        className="border px-3 py-2 rounded"
                    />
                    <input
                        type="number"
                        name="allowance"
                        value={form.allowance}
                        onChange={handleChange}
                        placeholder="Allowance"
                        required
                        className="border px-3 py-2 rounded"
                    />
                    <input
                        type="date"
                        name="effective_from"
                        value={form.effective_from}
                        onChange={handleChange}
                        required
                        className="border px-3 py-2 rounded"
                    />
                    <input
                        type="date"
                        name="effective_to"
                        value={form.effective_to}
                        onChange={handleChange}
                        required
                        className="border px-3 py-2 rounded"
                    />

                    <label className="block text-sm font-medium">Status</label>
                    <select
                        name="is_active"
                        value={form.is_active ? "true" : "false"}
                        onChange={handleChange}
                        disabled={activeExists && !form.is_active}
                        className="border px-3 py-2 rounded"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                    {activeExists && !form.is_active && (
                        <p className="text-xs text-red-500 mt-1">
                            Only one active record is allowed
                        </p>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}



