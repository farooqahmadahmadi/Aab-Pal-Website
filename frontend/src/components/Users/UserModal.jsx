import React, { useEffect, useState } from "react";
import { createUser, updateUser } from "../../services/user.service";
import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function UserModal({ open, onClose, onRefresh, editUser }) {
  const isEdit = !!editUser;

  const { toast, showToast, hideToast } = useToast();

  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    password: "",
    user_role: "client",
    employee_id: "",
    client_id: "",
    is_active: true,
    access_time_start: "",
    access_time_end: "",
    user_photo_url: null,
  });

  // ================= LOAD EDIT DATA =================
  useEffect(() => {
    if (editUser) {
      setForm({
        ...editUser,
        password: "",
      });
    } else {
      setForm({
        user_name: "",
        user_email: "",
        password: "",
        user_role: "client",
        employee_id: "",
        client_id: "",
        is_active: true,
        access_time_start: "",
        access_time_end: "",
        user_photo_url: null,
      });
    }
  }, [editUser]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setForm({ ...form, user_photo_url: files[0] });
    } else if (name === "is_active") {
      setForm({ ...form, is_active: value === "true" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });

      if (isEdit) {
        await updateUser(editUser.user_id, formData);
        showToast("User updated successfully", "success");
      } else {
        await createUser(formData);
        showToast("User created successfully", "success");
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  if (!open) return null;

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
        <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg p-5">

          {/* TITLE */}
          <h2 className="text-xl font-bold text-center mb-4">
            {isEdit ? "Edit User" : "Add User"}
          </h2>

          {/* FORM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* NAME */}
            <input
              name="user_name"
              placeholder="User Name"
              value={form.user_name}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            {/* EMAIL */}
            <input
              name="user_email"
              placeholder="Email"
              value={form.user_email}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            {/* PASSWORD (ONLY ADD) */}
            {!isEdit && (
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            )}

            {/* ROLE */}
            <select
              name="user_role"
              value={form.user_role}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
              <option value="client">Client</option>
            </select>

            {/* CONDITIONAL ID */}
            {form.user_role === "client" ? (
              <input
                name="client_id"
                placeholder="Client ID"
                value={form.client_id}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            ) : (
              <input
                name="employee_id"
                placeholder="Employee ID"
                value={form.employee_id}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            )}

            {/* ACCESS TIME */}
            <input
              type="time"
              name="access_time_start"
              value={form.access_time_start}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              type="time"
              name="access_time_end"
              value={form.access_time_end}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            {/* STATUS */}
            <select
              name="is_active"
              value={form.is_active ? "true" : "false"}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            {/* PHOTO */}
            <input
              type="file"
              name="user_photo_url"
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 mt-5">
            <button
              onClick={onClose}
              className="bg-gray-400 px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* TOAST */}
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