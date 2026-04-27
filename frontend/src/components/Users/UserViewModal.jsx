import React, { useState } from "react";
import { updateUser, resetPasswordAdmin } from "../../services/userService";
import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function UserViewModal({ user, onClose, onRefresh }) {
  const [form, setForm] = useState({ ...user });
  const { toast, showToast, hideToast } = useToast();

  const readOnlyFields = [
    "user_id",
    "created_at",
    "updated_at",
    "last_login_at",
    "login_status",
    "failed_attempts",
  ];

  const labels = {
    user_id: "User ID",
    user_name: "Name",
    user_email: "Email",
    user_role: "Role",
    employee_id: "Employee ID",
    client_id: "Client ID",
    access_time_start: "Access Start Time",
    access_time_end: "Access End Time",
    is_active: "Status",
    login_status: "Login Status",
    created_at: "Created At",
    updated_at: "Updated At",
    last_login_at: "Last Login",
    failed_attempts: "Failed Attempts",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "is_active" ? value === "true" : value,
    });
  };

  const handleSave = async () => {
    try {
      const payload = { ...form };
      delete payload.password_hash;

      await updateUser(user.user_id, payload);

      showToast("User updated successfully", "success");
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Failed to update user", "error");
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await resetPasswordAdmin(user.user_id);
      showToast(res.data.message, "success");
      onRefresh();
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || "Failed to reset password",
        "error",
      );
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
        <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg p-5">
          {/* TITLE */}

          <h3 className="text-xl font-bold mb-5 text-center">
            {form.user_name}
          </h3>

          {/* ✅ EDITABLE FIELDS FIRST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* NAME */}
            <div>
              <label className="text-sm text-gray-600">
                {labels.user_name}
              </label>
              <input
                name="user_name"
                value={form.user_name || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600">
                {labels.user_email}
              </label>
              <input
                name="user_email"
                value={form.user_email || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="text-sm text-gray-600">
                {labels.user_role}
              </label>
              <select
                name="user_role"
                value={form.user_role}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="Admin">Admin</option>
                <option value="HR">HR</option>
                <option value="Financial">Financial</option>
                <option value="PM">PM</option>
                <option value="Employee">Employee</option>
                <option value="Client">Client</option>
              </select>
            </div>

            {/* CONDITIONAL */}
            {form.user_role === "Client" ? (
              <div>
                <label className="text-sm text-gray-600">
                  {labels.client_id}
                </label>
                <input
                  name="client_id"
                  value={form.client_id || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm text-gray-600">
                  {labels.employee_id}
                </label>
                <input
                  name="employee_id"
                  value={form.employee_id || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            )}

            {/* ACCESS TIME */}
            <div>
              <label className="text-sm text-gray-600">
                {labels.access_time_start}
              </label>
              <input
                type="time"
                name="access_time_start"
                value={form.access_time_start || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                {labels.access_time_end}
              </label>
              <input
                type="time"
                name="access_time_end"
                value={form.access_time_end || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* STATUS */}
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600">
                {labels.is_active}
              </label>
              <select
                name="is_active"
                value={form.is_active ? "true" : "false"}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* 🔒 READ ONLY LAST */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-500 mb-3">
              System Info
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {readOnlyFields.map((key) => (
                <div key={key}>
                  <label className="text-sm text-gray-600">{labels[key]}</label>
                  <input
                    value={form[key] || ""}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-100"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              onClick={handleResetPassword}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Reset Password
            </button>

            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          position="center"
        />
      )}
    </>
  );
}
