import React, { useEffect, useState } from "react";
import {
  createNotification,
  updateNotification,
} from "../../services/websiteNotifications.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function WebsiteNotificationsModal({
  open,
  onClose,
  edit,
  onRefresh,
}) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [form, setForm] = useState({
    notification_title: "",
    notification_message: "",
    is_read: "0",
  });

  // ================= EDIT LOAD =================
  useEffect(() => {
    if (edit) {
      setForm({
        notification_title: edit.notification_title || "",
        notification_message: edit.notification_message || "",
        is_read: edit.is_read ? "1" : "0",
      });
    }
  }, [edit]);

  // ================= HANDLE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.notification_title || !form.notification_message) {
        showToast("Title and message required", "error");
        return;
      }

      const payload = {
        ...form,
        is_read: form.is_read === "1",
      };

      if (isEdit) {
        await updateNotification(edit.notification_id, payload);
        showToast("Updated successfully", "success");
      } else {
        await createNotification(payload);
        showToast("Created successfully", "success");
      }

      onRefresh();
      onClose();
    } catch {
      showToast("Operation failed", "error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl p-5 rounded-lg">
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit Notification" : "Add Notification"}
        </h2>

        {/* TITLE */}
        <label className="text-sm">Title</label>
        <input
          name="notification_title"
          value={form.notification_title}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* MESSAGE */}
        <label className="text-sm">Message</label>
        <textarea
          name="notification_message"
          value={form.notification_message}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded min-h-[120px]"
        />

        {/* STATUS */}
        <label className="text-sm">Status</label>
        <select
          name="is_read"
          value={form.is_read}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="0">Unread</option>
          <option value="1">Read</option>
        </select>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2">
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

      {toast && <Toast {...toast} onClose={hideToast} />}
    </div>
  );
}
