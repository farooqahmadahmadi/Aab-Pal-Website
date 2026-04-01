import React, { useState, useEffect } from "react";
import {
    createAttendance,
    updateAttendance
} from "../../services/employeeAttendanceService";

export default function EmployeeAttendanceModal({
    isOpen,
    onClose,
    initialData,
    onSuccess
}) {
    const emptyForm = {
        employee_id: "",
        attendance_date: "",
        attendance_status: "Present",
        check_in_time: "",
        check_out_time: "",
        total_work_hours: 0,
        attendance_type: "Manual",
    };

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);

    // ===== Load Data =====
    useEffect(() => {
        if (initialData) {
            setForm({
                ...initialData,
                total_work_hours: initialData.total_work_hours || 0
            });
        } else {
            setForm(emptyForm);
        }
    }, [initialData]);

    // ===== Auto Calculate Work Hours =====
    useEffect(() => {
        if (form.check_in_time && form.check_out_time) {

            const checkIn = new Date(`1970-01-01T${form.check_in_time}`);
            const checkOut = new Date(`1970-01-01T${form.check_out_time}`);

            const diff = (checkOut - checkIn) / (1000 * 60 * 60);

            setForm(prev => ({
                ...prev,
                total_work_hours: diff > 0 ? diff.toFixed(2) : 0
            }));
        }
    }, [form.check_in_time, form.check_out_time]);

    // ===== Validation =====
    const validate = () => {
        if (!form.employee_id) return "Employee ID required";
        if (!form.attendance_date) return "Date required";

        if (form.check_in_time && form.check_out_time) {
            if (form.check_out_time < form.check_in_time) {
                return "Check-out must be after check-in";
            }
        }

        return null;
    };

    // ===== Submit =====
    const handleSubmit = async () => {

        const error = validate();
        if (error) {
            alert(error);
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...form,
                employee_id: Number(form.employee_id)
            };

            if (initialData) {
                await updateAttendance(initialData.emp_attendance_id, payload);
            } else {
                await createAttendance(payload);
            }

            onSuccess();
            onClose();

        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || "Save failed");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg space-y-4">

                {/* Title */}
                <h2 className="text-xl font-bold text-center">
                    {initialData ? "Edit Attendance" : "Add Attendance"}
                </h2>

                {/* Employee ID */}
                <input
                    type="number"
                    placeholder="Employee ID"
                    value={form.employee_id}
                    onChange={(e) =>
                        setForm({ ...form, employee_id: e.target.value })
                    }
                    className="border p-2 w-full rounded"
                />

                {/* Date */}
                <input
                    type="date"
                    value={form.attendance_date}
                    title="Date"
                    onChange={(e) =>
                        setForm({ ...form, attendance_date: e.target.value })
                    }
                    className="border p-2 w-full rounded"
                />

                {/* Check In */}
                <input
                    type="time"
                    value={form.check_in_time || ""}
                    title="Check In Time"
                    onChange={(e) =>
                        setForm({ ...form, check_in_time: e.target.value })
                    }
                    className="border p-2 w-full rounded"
                />

                {/* Check Out */}
                <input
                    type="time"
                    value={form.check_out_time || ""}
                    title="Check Out Time"
                    onChange={(e) =>
                        setForm({ ...form, check_out_time: e.target.value })
                    }
                    className="border p-2 w-full rounded"
                />

                {/* Total Hours */}
                <input
                    type="text"
                    value={form.total_work_hours}
                    title="Total Work Hours"
                    readOnly
                    className="border p-2 w-full rounded bg-gray-100 text-center font-semibold"
                />

                {/* Status */}
                <select
                    value={form.attendance_status}
                    title="Status"
                    onChange={(e) =>
                        setForm({ ...form, attendance_status: e.target.value })
                    }
                    className="border p-2 w-full rounded"
                >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                    <option value="Sick">Sick</option>
                </select>

                {/* Attendance Type */}
                <select
                    value={form.attendance_type}
                    title="Attendance Type"
                    onChange={(e) =>
                        setForm({ ...form, attendance_type: e.target.value })
                    }
                    className="border p-2 w-full rounded"
                >
                    <option value="Manual">Manual</option>
                    <option value="Other">Other</option>
                </select>

                {/* Buttons */}
                <div className="flex justify-end gap-2 pt-2">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>

                </div>

            </div>
        </div>
    );
}