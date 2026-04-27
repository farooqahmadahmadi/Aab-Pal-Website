import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function NotificationsModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const defaultForm = {
    notification_recipients: "Admin",
    notification_title: "",
    notification_message: "",
    user_id: "",
  };

  const { t } = useTranslation();

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        notification_recipients: initialData.notification_recipients || "Admin",
        notification_title: initialData.notification_title || "",
        notification_message: initialData.notification_message || "",
        user_id: initialData.user_id || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    let tempErrors = {};

    if (!form.notification_recipients)
      tempErrors.notification_recipients = "Recipient is required";

    if (!form.notification_title.trim())
      tempErrors.notification_title = "Title is required";

    if (!form.notification_message.trim())
      tempErrors.notification_message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const submitForm = (e) => {
    e.preventDefault(); //  fix
    if (!validate()) return;

    const payload = {
      ...form,
      user_id: form.user_id ? Number(form.user_id) : null,
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-2">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 rounded-2xl shadow-xl">
        {/* Title */}
        <h3 className="text-lg font-bold text-center mb-5">
          {initialData ? t("update_notification") : t("add_notification")}
        </h3>

        {/* FORM */}
        <form
          onSubmit={submitForm}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Recipient */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("recipients")}
            </label>

            {errors.notification_recipients && (
              <p className="text-red-500 text-xs mb-1">
                {errors.notification_recipients}
              </p>
            )}

            <select
              value={form.notification_recipients}
              onChange={(e) =>
                handleChange("notification_recipients", e.target.value)
              }
              className={`w-full p-2.5 border rounded focus:ring-2 focus:ring-blue-400 outline-none ${
                errors.notification_recipients ? "border-red-500" : ""
              }`}
            >
              {["Admin", "HR", "Financial", "PM", "Employee", "Client"].map(
                (r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Title */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("title")}
            </label>

            {errors.notification_title && (
              <p className="text-red-500 text-xs mb-1">
                {errors.notification_title}
              </p>
            )}

            <input
              type="text"
              value={form.notification_title}
              onChange={(e) =>
                handleChange("notification_title", e.target.value)
              }
              className={`w-full p-2.5 border rounded focus:ring-2 focus:ring-blue-400 outline-none ${
                errors.notification_title ? "border-red-500" : ""
              }`}
            />
          </div>

          {/* Message */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("message")}
            </label>

            {errors.notification_message && (
              <p className="text-red-500 text-xs mb-1">
                {errors.notification_message}
              </p>
            )}

            <textarea
              value={form.notification_message}
              onChange={(e) =>
                handleChange("notification_message", e.target.value)
              }
              rows={3}
              className={`w-full p-2.5 border rounded focus:ring-2 focus:ring-blue-400 outline-none ${
                errors.notification_message ? "border-red-500" : ""
              }`}
            />
          </div>

          {/* User ID */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {t("user_id")}
            </label>
            <input
              type="number"
              value={form.user_id}
              onChange={(e) => handleChange("user_id", e.target.value)}
              placeholder="Optional"
              className="w-full p-2.5 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {initialData ? t("update") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
