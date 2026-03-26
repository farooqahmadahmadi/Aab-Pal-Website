
import React, { useEffect, useState } from "react";

export default function ClientInfoModal({ isOpen, onClose, onSubmit, initialData }) {

    const [form, setForm] = useState({
        client_name: "",
        client_nid_number: "",
        client_phone: "",
        client_email: "",
        client_address: "",
        client_photo: null
    });

    useEffect(() => {
        if (initialData) {
            setForm({ ...initialData, client_photo: null });
        } else {
            setForm({
                client_name: "",
                client_nid_number: "",
                client_phone: "",
                client_email: "",
                client_address: "",
                client_photo: null
            });
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setForm({ ...form, [name]: files[0] });
        else setForm({ ...form, [name]: value });
    };

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(form).forEach(key => {
            if (form[key] !== null) formData.append(key, form[key]);
        });

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-96 max-h-[90%] overflow-auto">

                <h3 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Client" : "Add Client"}
                </h3>

                <form onSubmit={submit} className="space-y-3">

                    <input name="client_name" value={form.client_name || ""} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" required />
                    <input name="client_nid_number" value={form.client_nid_number || ""} onChange={handleChange} placeholder="NID" className="w-full border p-2 rounded" required />
                    <input name="client_phone" value={form.client_phone || ""} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" />
                    <input name="client_email" value={form.client_email || ""} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" />
                    <input name="client_address" value={form.client_address || ""} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded" />

                    <input type="file" name="client_photo" onChange={handleChange} accept=".png,.jpeg,.jpg" />

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


