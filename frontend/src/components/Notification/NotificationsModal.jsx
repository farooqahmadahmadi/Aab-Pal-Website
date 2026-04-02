import React, { useState, useEffect } from "react";

export default function NotificationsModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        notification_recipients: "Admin",
        notification_title: "",
        notification_message: "",
        user_id: ""
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-bold mb-4">Add Notification</h3>

                <select value={form.notification_recipients} onChange={e => setForm({...form, notification_recipients: e.target.value})} className="w-full mb-2 p-2 border rounded">
                    {["Admin","Admins","HR","HRs","Financial","Financials","Project Manager","Project Managers","Employee","Employees","Client","Clients"].map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <input type="text" placeholder="Title" value={form.notification_title} onChange={e => setForm({...form, notification_title: e.target.value})} className="w-full mb-2 p-2 border rounded" />
                <textarea placeholder="Message" value={form.notification_message} onChange={e => setForm({...form, notification_message: e.target.value})} className="w-full mb-2 p-2 border rounded" />
                <input type="number" placeholder="User ID (optional)" value={form.user_id} onChange={e => setForm({...form, user_id: e.target.value})} className="w-full mb-2 p-2 border rounded" />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                    <button onClick={() => onSubmit(form)} className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
                </div>
            </div>
        </div>
    );
}