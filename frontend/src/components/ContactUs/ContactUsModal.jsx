import React, { useEffect, useState } from "react";

import {
  createContactMessage,
  updateContactMessage,
} from "../../services/contactUsPage.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function ContactUsModal({
  open,
  onClose,
  edit,
  onRefresh,
}) {
  const isEdit = !!edit;

  const { toast, showToast, hideToast } = useToast();

  const [form, setForm] = useState({
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    contact_title: "",
    contact_message: "",
    is_replied: false,
  });

  // ================= LOAD EDIT =================
  useEffect(() => {
    if (edit) {
      setForm({
        contact_name: edit.contact_name || "",
        contact_email: edit.contact_email || "",
        contact_phone: edit.contact_phone || "",
        contact_title: edit.contact_title || "",
        contact_message: edit.contact_message || "",
        is_replied: edit.is_replied || false,
      });
    } else {
      setForm({
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        contact_title: "",
        contact_message: "",
        is_replied: false,
      });
    }
  }, [edit]);

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (
        !form.contact_name ||
        !form.contact_email ||
        !form.contact_message
      ) {
        showToast("Please fill required fields", "error");
        return;
      }

      const payload = {
        ...form,
        replied_at: form.is_replied ? new Date() : null,
      };

      if (isEdit) {
        await updateContactMessage(edit.contact_id, payload);

        showToast("Updated successfully", "success");
      } else {
        await createContactMessage(payload);

        showToast("Created successfully", "success");
      }

      await onRefresh();

      onClose();
    } catch (err) {
      console.log(err);

      showToast("Operation failed", "error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 rounded-lg">
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit Contact Message" : "Add Contact Message"}
        </h2>

        {/* NAME */}
        <div className="mb-3">
          <label className="text-sm">Name</label>

          <input
            type="text"
            name="contact_name"
            value={form.contact_name}
            onChange={handleChange}
            placeholder="Enter name"
            className="border p-2 w-full rounded"
          />
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="text-sm">Email</label>

          <input
            type="email"
            name="contact_email"
            value={form.contact_email}
            onChange={handleChange}
            placeholder="Enter email"
            className="border p-2 w-full rounded"
          />
        </div>

        {/* PHONE */}
        <div className="mb-3">
          <label className="text-sm">Phone</label>

          <input
            type="text"
            name="contact_phone"
            value={form.contact_phone}
            onChange={handleChange}
            placeholder="Enter phone"
            className="border p-2 w-full rounded"
          />
        </div>

        {/* TITLE */}
        <div className="mb-3">
          <label className="text-sm">Title</label>

          <input
            type="text"
            name="contact_title"
            value={form.contact_title}
            onChange={handleChange}
            placeholder="Enter title"
            className="border p-2 w-full rounded"
          />
        </div>

        {/* MESSAGE */}
        <div className="mb-3">
          <label className="text-sm">Message</label>

          <textarea
            name="contact_message"
            value={form.contact_message}
            onChange={handleChange}
            placeholder="Write message..."
            className="border p-2 w-full rounded min-h-[180px]"
          />
        </div>

        {/* REPLIED */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            name="is_replied"
            checked={form.is_replied}
            onChange={handleChange}
          />

          <label className="text-sm">
            Message Replied
          </label>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-400 px-4 py-2 rounded text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}