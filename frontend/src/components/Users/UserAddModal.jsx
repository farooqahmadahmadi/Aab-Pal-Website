import React, { useState } from "react";
import { addUser } from "../../services/userService";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

import { useTranslation } from "react-i18next";

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
    is_active: true,
  });

  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "is_active" ? value === "true" : value,
    }));
  };

  // ===== PASSWORD STRENGTH =====
  const passwordStrength = (pwd) => {
    if (!pwd) return "";
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd))
      return "strong";
    if (pwd.length >= 6) return "medium";
    return "weak";
  };

  const strength = passwordStrength(form.password);

  const strengthColor =
    strength === "strong"
      ? "bg-green-500"
      : strength === "medium"
        ? "bg-yellow-400"
        : "bg-red-500";

  const strengthWidth =
    strength === "weak" ? "33%" : strength === "medium" ? "66%" : "100%";

  // ===== SUBMIT =====
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
      client_id: form.client_id === "" ? null : Number(form.client_id),
    };

    try {
      await addUser(sendData);
      showToast("User added successfully", "success");

      onRefresh?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to add user", "error");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
        <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg p-5">
          {/* TITLE */}

          <h3 className="text-xl font-bold mb-5 text-center">
            {" "}
            {t("add_user")}
          </h3>

          <div className="space-y-3">
            {/* NAME */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {" "}
                {t("user_name")}
              </label>
              <input
                name="user_name"
                value={form.user_name}
                onChange={handleChange}
                maxLength={50}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {" "}
                {t("email")}
              </label>
              <input
                name="user_email"
                value={form.user_email}
                onChange={handleChange}
                maxLength={100}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {" "}
                {t("password")}
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  maxLength={50}
                  className="w-full border p-2 rounded pr-10"
                />

                <div
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              {form.password && (
                <div className="h-2 w-full bg-gray-200 rounded mt-1">
                  <div
                    className={`h-2 rounded ${strengthColor}`}
                    style={{ width: strengthWidth }}
                  ></div>
                </div>
              )}
            </div>

            {/* ROLE */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm mb-1 font-medium">
                  {" "}
                  {t("role")}
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
              {form.user_role !== "Client" && (
                <div>
                  <label className="block text-sm mb-1 font-medium">
                    {t("employee_id")}
                  </label>
                  <input
                    name="employee_id"
                    value={form.employee_id}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
              )}

              {form.user_role === "Client" && (
                <div>
                  <label className="block text-sm mb-1 font-medium">
                    {t("client_id")}
                  </label>
                  <input
                    name="client_id"
                    value={form.client_id}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
              )}
            </div>
            {/* ACCESS TIME */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm mb-1 font-medium">
                  {t("access_start")}
                </label>
                <input
                  type="time"
                  name="access_time_start"
                  value={form.access_time_start}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  {t("access_end")}
                </label>
                <input
                  type="time"
                  name="access_time_end"
                  value={form.access_time_end}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {" "}
                {t("status")}
              </label>
              <select
                name="is_active"
                value={form.is_active.toString()}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="true"> {t("active")}</option>
                <option value="false"> {t("inactive")}</option>
              </select>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                {t("cancel")}
              </button>

              <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                {t("save")}
              </button>
            </div>
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
