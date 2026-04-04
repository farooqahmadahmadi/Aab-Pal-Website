import React, { useState, useEffect } from "react";

export default function NotificationsModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        notification_recipients: "Admin",
        notification_title: "",
        notification_message: "",
        user_id: "" // optional
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) setForm({
            notification_recipients: initialData.notification_recipients || "Admin",
            notification_title: initialData.notification_title || "",
            notification_message: initialData.notification_message || "",
            user_id: initialData.user_id || ""
        });
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" })); // clear error on change
    };

    const validate = () => {
        let tempErrors = {};
        if (!form.notification_recipients) tempErrors.notification_recipients = "Recipient is required";
        if (!form.notification_title.trim()) tempErrors.notification_title = "Title is required";
        if (!form.notification_message.trim()) tempErrors.notification_message = "Message is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const submitForm = () => {
        if (!validate()) return;

        const payload = {
            ...form,
            user_id: form.user_id ? Number(form.user_id) : null // optional
        };

        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-bold mb-4">{initialData ? "Edit Notification" : "Add Notification"}</h3>

               
                {errors.notification_recipients && <p className="text-red-500 text-xs mb-1">{errors.notification_recipients}</p>}
                <select
                    value={form.notification_recipients}
                    onChange={e => handleChange("notification_recipients", e.target.value)}
                    className={`w-full mb-2 p-2 border rounded ${errors.notification_recipients ? "border-red-500" : ""}`}
                >
                    {["Admin","HR","Financial","PM","Employee","Client"].map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                {errors.notification_title && <p className="text-red-500 text-xs mb-1">{errors.notification_title}</p>}
                <input
                    type="text"
                    placeholder="Title"
                    value={form.notification_title}
                    onChange={e => handleChange("notification_title", e.target.value)}
                    className={`w-full mb-2 p-2 border rounded ${errors.notification_title ? "border-red-500" : ""}`}
                />
                

                {errors.notification_message && <p className="text-red-500 text-xs mb-1">{errors.notification_message}</p>}
                <textarea
                    placeholder="Message"
                    value={form.notification_message}
                    onChange={e => handleChange("notification_message", e.target.value)}
                    className={`w-full mb-2 p-2 border rounded ${errors.notification_message ? "border-red-500" : ""}`}
                />
                

                <input
                    type="number"
                    placeholder="User ID (optional)"
                    value={form.user_id}
                    onChange={e => handleChange("user_id", e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                />

                <div className="flex justify-end gap-2 mt-2">
                    <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
                    <button type="submit" onClick={submitForm} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                        {initialData ? "Update" : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}