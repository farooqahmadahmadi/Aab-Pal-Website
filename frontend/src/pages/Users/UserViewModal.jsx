import React, { useState } from "react";
import { updateUser, resetPasswordAdmin } from "../../services/userService";
import { FaTimes, FaEdit, FaSave, FaKey } from "react-icons/fa";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";

export default function UserViewModal({ user, onClose, onRefresh }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...user });
  const { toast, showToast, hideToast } = useToast();

  const readOnlyFields = [
    "user_id",
    "created_at",
    "updated_at",
    "last_login_at",
    "login_status",
    "failed_attempts"
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
    failed_attempts: "Failed Attempts"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "is_active" ? value === "true" : value
    });
  };

  const handleSave = async () => {
    try {
      const payload = { ...form };
      delete payload.password_hash;
      await updateUser(user.user_id, payload);
      showToast("User updated successfully", "success");
      setEditMode(false);
      onRefresh();
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
      showToast(err.response?.data?.message || "Failed to reset password", "error");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded w-96 max-h-[90%] overflow-auto relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full">
            <FaTimes />
          </button>

          <div className="flex items-center mb-4 gap-2">
            {!editMode ? (
              <button onClick={() => setEditMode(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded flex items-center gap-2">
                <FaEdit /> Edit
              </button>
            ) : (
              <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2">
                <FaSave /> Save
              </button>
            )}

            <button onClick={handleResetPassword} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2">
              <FaKey /> Reset Password
            </button>
          </div>

          <h2 className="text-xl font-bold mb-4">{form.user_name}</h2>

          <div>
            {Object.keys(form).map((key) => {
              if (key === "password_hash") return null;

              if (key === "employee_id" && form.user_role === "Client") return null;
              if (key === "client_id" && form.user_role !== "Client") return null;

              if (readOnlyFields.includes(key)) {
                return (
                  <div key={key} className="mb-3">
                    <label className="text-sm text-gray-600">{labels[key]}</label>
                    <input type="text" value={form[key] || ""} readOnly className="w-full border p-2 rounded bg-gray-100" />
                  </div>
                );
              }

              if (key === "user_role") {
                return (
                  <div key={key} className="mb-3">
                    <label className="text-sm text-gray-600">{labels[key]}</label>
                    <select name={key} value={form[key]} onChange={handleChange} disabled={!editMode} className="w-full border p-2 rounded">
                      <option value="Admin">Admin</option>
                      <option value="HR">HR</option>
                      <option value="Financial">Financial</option>
                      <option value="PM">PM</option>
                      <option value="Employee">Employee</option>
                      <option value="Client">Client</option>
                    </select>
                  </div>
                );
              }

              if (key === "is_active") {
                return (
                  <div key={key} className="mb-3">
                    <label className="text-sm text-gray-600">{labels[key]}</label>
                    <select name={key} value={form[key] ? "true" : "false"} onChange={handleChange} disabled={!editMode} className="w-full border p-2 rounded">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                );
              }

              if (key === "access_time_start" || key === "access_time_end") {
                return (
                  <div key={key} className="mb-3">
                    <label className="text-sm text-gray-600">{labels[key]}</label>
                    <input type="text" name={key} value={form[key] || ""} placeholder="HH:MM:SS" onChange={handleChange} disabled={!editMode} maxLength={8} className="w-full border p-2 rounded" />
                  </div>
                );
              }

              return (
                <div key={key} className="mb-3">
                  <label className="text-sm text-gray-600">{labels[key]}</label>
                  <input type="text" name={key} value={form[key] || ""} onChange={handleChange} disabled={!editMode} className="w-full border p-2 rounded" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} position="center" />}
    </>
  );
}