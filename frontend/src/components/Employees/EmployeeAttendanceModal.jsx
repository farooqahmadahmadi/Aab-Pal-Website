import React, { useState, useEffect } from "react";
import {
  createAttendance,
  updateAttendance,
} from "../../services/employeeAttendanceService";
import { useTranslation } from "react-i18next";

export default function EmployeeAttendanceModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
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

  const { t } = useTranslation();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  // ===== Load Data =====
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        total_work_hours: initialData.total_work_hours || 0,
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

      setForm((prev) => ({
        ...prev,
        total_work_hours: diff > 0 ? diff.toFixed(2) : 0,
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        employee_id: Number(form.employee_id),
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
     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_attendance") : t("add_attendance")}
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("employee_id")}
              </label>
              <input
                type="number"
                value={form.employee_id}
                onChange={(e) =>
                  setForm({ ...form, employee_id: e.target.value })
                }
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("attendance_date")}
              </label>
              <input
                type="date"
                value={form.attendance_date}
                onChange={(e) =>
                  setForm({ ...form, attendance_date: e.target.value })
                }
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            {/* Check In */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("check_in")}
              </label>
              <input
                type="time"
                value={form.check_in_time || ""}
                onChange={(e) =>
                  setForm({ ...form, check_in_time: e.target.value })
                }
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Check Out */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("check_out")}
              </label>
              <input
                type="time"
                value={form.check_out_time || ""}
                onChange={(e) =>
                  setForm({ ...form, check_out_time: e.target.value })
                }
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Total Hours */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">
                {t("work_hours")}
              </label>
              <input
                type="text"
                value={form.total_work_hours}
                readOnly
                className="w-full border p-2.5 rounded bg-gray-100 text-center font-semibold"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("status")}
              </label>
              <select
                value={form.attendance_status}
                onChange={(e) =>
                  setForm({ ...form, attendance_status: e.target.value })
                }
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="Present">{t("present")}</option>
                <option value="Absent">{t("absent")}</option>
                <option value="Leave">{t("leave")}</option>
                <option value="Sick">{t("sick")}</option>
              </select>
            </div>

            {/* Attendance Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("type")}
              </label>
              <select
                value={form.attendance_type}
                onChange={(e) =>
                  setForm({ ...form, attendance_type: e.target.value })
                }
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="Manual">{t("manual")}</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : initialData ? t("update") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
