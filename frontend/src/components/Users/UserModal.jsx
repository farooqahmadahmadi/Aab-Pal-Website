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
    user_role: "admin",
    is_active: true,
    failed_attempts: "",
    access_time_start: "",
    access_time_end: "",
    user_photo_url: null,
  });

  // ================= LOAD =================
  useEffect(() => {
    if (editUser) {
      setForm({
        user_name: editUser.user_name || "",
        user_email: editUser.user_email || "",
        password: "",
        user_role: editUser.user_role || "admin",
        is_active: editUser.is_active ?? true,
        failed_attempts: "",
        access_time_start: editUser.access_time_start || "",
        access_time_end: editUser.access_time_end || "",
        user_photo_url: null,
      });
    } else {
      setForm({
        user_name: "",
        user_email: "",
        password: "",
        user_role: "admin",
        is_active: true,
        failed_attempts: "",
        access_time_start: "",
        access_time_end: "",
        user_photo_url: null,
      });
    }
  }, [editUser]);

  // ================= INPUT =================
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
      showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    if (!editUser) return;

    const confirmReset = window.confirm(
      "Are you sure you want to reset password to 12345?",
    );

    if (!confirmReset) return;

    try {
      const formData = new FormData();
      formData.append("password", "12345");

      await updateUser(editUser.user_id, formData);

      showToast(
        "Password reset to 12345 successfully. Please change after login.",
        "success",
      );
    } catch (err) {
      showToast("Password reset failed", "error");
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-center mb-5">
            {isEdit ? "Edit User" : "Add User"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NAME */}
            <div>
              <label className="text-sm">User Name</label>
              <input
                name="user_name"
                value={form.user_name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm">Email</label>
              <input
                name="user_email"
                value={form.user_email}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* PASSWORD ONLY ADD */}
            {!isEdit && (
              <div>
                <label className="text-sm">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            )}

            {/* ROLE */}
            <div>
              <label className="text-sm">Role</label>
              <select
                name="user_role"
                value={form.user_role}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="text-sm">Status</label>
              <select
                name="is_active"
                value={form.is_active ? "true" : "false"}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* FILE */}
            <div>
              <label className="text-sm block mb-1">User Photo</label>

              <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                <span className="text-gray-500 text-sm">Choose Image</span>
                <input
                  type="file"
                  name="user_photo_url"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* READ ONLY */}
            {isEdit && (
              <>
                <div>
                  <label className="text-sm">Created At</label>
                  <input
                    value={editUser.created_at}
                    readOnly
                    className="border p-2 rounded w-full bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm">Updated At</label>
                  <input
                    value={editUser.updated_at}
                    readOnly
                    className="border p-2 rounded w-full bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm">Failed Attempts</label>
                  <input
                    value={editUser.failed_attempts}
                    readOnly
                    className="border p-2 rounded w-full bg-gray-100"
                  />
                </div>
              </>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 mt-6">
            {/* RESET PASSWORD */}
            {isEdit && (
              <button
                onClick={handleResetPassword}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Reset Password
              </button>
            )}
            <button onClick={onClose} className="bg-gray-400 px-4 py-2 rounded">
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
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </>
  );
}
