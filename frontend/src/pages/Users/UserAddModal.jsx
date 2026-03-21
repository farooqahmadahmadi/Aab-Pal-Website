import React, { useState } from "react";
import { addUser } from "../../services/userService";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";

export default function UserAddModal({ onClose, onRefresh }) {
  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    password: "",
    user_role: "Employee",
    employee_id: "",
    client_id: "",
    access_time_start: "",
    access_time_end: "",
    is_active: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "is_active" ? value === "true" : value });
  };

  // Password strength
  const passwordStrength = (pwd) => {
    if (!pwd) return "";
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return "strong";
    if (pwd.length >= 6) return "medium";
    return "weak";
  };
  const strength = passwordStrength(form.password);
  const strengthColor =
    strength === "strong" ? "bg-green-500" : strength === "medium" ? "bg-yellow-400" : "bg-red-500";

  const handleSubmit = async () => {
    if (!form.user_name || !form.user_email || !form.password) {
      showToast("Required fields missing", "error");
      return;
    }
    if (form.user_role === "Client" && !form.client_id) {
      showToast("Client ID required", "error");
      return;
    }
    if (form.user_role !== "Client" && !form.employee_id) {
      showToast("Employee ID required", "error");
      return;
    }

    const sendData = {
      ...form,
      employee_id: form.employee_id === "" ? null : Number(form.employee_id),
      client_id: form.client_id === "" ? null : Number(form.client_id)
    };

    try {
      await addUser(sendData);
      showToast("User added successfully", "success");
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to add user", "error");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded w-96 max-h-[90%] overflow-auto relative">

          <button onClick={onClose} className="absolute top-3 right-3 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full">
            <FaTimes />
          </button>

          <h2 className="text-xl font-bold mb-4">Add User</h2>

          <input name="user_name" placeholder="Name" value={form.user_name} onChange={handleChange} maxLength={50} className="w-full border p-2 mb-2 rounded" />
          <input name="user_email" placeholder="Email" value={form.user_email} onChange={handleChange} maxLength={100} className="w-full border p-2 mb-2 rounded" />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              maxLength={50}
              className="w-full border p-2 mb-2 rounded"
            />
            <div onClick={() => setShowPassword(!showPassword)} className="absolute top-1 right-1 text-gray-600 p-2 bg-white">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {form.password && (
              <div className="h-2 w-full bg-gray-200 rounded">
                <div className={`h-2 rounded ${strengthColor}`} style={{ width: strength === "weak" ? "33%" : strength === "medium" ? "66%" : "100%" }}></div>
              </div>
            )}
          </div>

          <select name="user_role" value={form.user_role} onChange={handleChange} className="w-full border p-2 mb-2 rounded">
            <option value="Admin">Admin</option>
            <option value="HR">HR</option>
            <option value="Financial">Financial</option>
            <option value="PM">PM</option>
            <option value="Employee">Employee</option>
            <option value="Client">Client</option>
          </select>

          {form.user_role !== "Client" && <input name="employee_id" placeholder="Employee ID" value={form.employee_id} onChange={handleChange} maxLength={8} className="w-full border p-2 mb-2 rounded" />}
          {form.user_role === "Client" && <input name="client_id" placeholder="Client ID" value={form.client_id} onChange={handleChange} maxLength={8} className="w-full border p-2 mb-2 rounded" />}

          <input name="access_time_start" placeholder="Access Time Start: 00:00:00" value={form.access_time_start} onChange={handleChange} maxLength={8} className="w-full border p-2 mb-2 rounded" />
          <input name="access_time_end" placeholder="Access Time End: 23:59:00" value={form.access_time_end} onChange={handleChange} maxLength={8} className="w-full border p-2 mb-2 rounded" />
          <select name="is_active" value={form.is_active.toString()} onChange={handleChange} className="w-full border p-2 mb-2 rounded">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full hover:bg-green-600">Add User</button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} position="center" />}
    </>
  );
}