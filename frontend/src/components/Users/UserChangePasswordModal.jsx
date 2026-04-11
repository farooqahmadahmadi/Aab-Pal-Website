import React, { useState } from "react";
import API from "../../services/api";
import { FaTimes, FaSave, FaEye, FaEyeSlash, FaStore } from "react-icons/fa";
import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function UserChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { toast, showToast, hideToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return "";
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return "strong";
    if (pwd.length >= 6) return "medium";
    return "weak";
  };

  const handleSubmit = async () => {
    if (!form.old_password || !form.new_password || !form.confirm_password) {
      showToast("All fields are required", "error");
      return;
    }
    if (form.new_password !== form.confirm_password) {
      showToast("New Password and Confirm Password do not match", "error");
      return;
    }

    setLoading(true);
    try {
      await API.post("/users/change-password", {
        old_password: form.old_password,
        new_password: form.new_password,
      });
      showToast("Password updated successfully", "success");
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(form.new_password);
  const strengthColor =
    strength === "strong" ? "bg-green-500" : strength === "medium" ? "bg-yellow-400" : "bg-red-500";

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-2">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full"
          >
            <FaTimes />
          </button>

          <h2 className="text-xl font-bold mb-4 text-center">Change Password</h2>

          <div className="flex flex-col gap-4">
            {/* Old Password */}
            <div className="relative">
              <label className="block text-gray-600 mb-1">Old Password</label>
              <input
                type={showOld ? "text" : "password"}
                name="old_password"
                value={form.old_password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Enter old password"
              />
              <div

                onClick={() => setShowOld(!showOld)}
                className="absolute top-10 right-3 text-gray-600"
              >
                {showOld ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block text-gray-600 mb-1">New Password</label>
              <input
                type={showNew ? "text" : "password"}
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Enter new password"
              />
              <div

                onClick={() => setShowNew(!showNew)}
                className="absolute top-10 right-3 text-gray-600"
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </div>

              {/* Strength bar only if input not empty */}
              {form.new_password && (
                <div className="h-2 w-full bg-gray-200 rounded mt-1">
                  <div
                    className={`h-2 rounded ${strengthColor}`}
                    style={{
                      width: strength === "weak" ? "33%" : strength === "medium" ? "66%" : "100%",
                    }}
                  ></div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-gray-600 mb-1">Confirm New Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Re-enter new password"
              />
              <div

                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-10 right-3 text-gray-600"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || form.new_password !== form.confirm_password}
              className={`flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded text-white ${form.new_password === form.confirm_password
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              {loading ? "Changing..." : "Change"}
            </button>
          </div>
        </div>
      </div>

      {/* Toast in center of screen */}
      {toast && (<Toast message={toast.message} type={toast.type} onClose={hideToast} position="center" />)}
    </>
  );
}