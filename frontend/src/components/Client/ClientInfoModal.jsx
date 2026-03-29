import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

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
    }, [initialData, isOpen]);

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
            <div className="bg-white p-6 rounded shadow-md w-96 max-h-[90%] overflow-auto relative">

                <h3 className="text-xl font-bold mb-4">
                    {initialData ? "Edit Client" : "Add Client"}
                </h3>

                <form onSubmit={submit} className="grid gap-4">

                    <input name="client_name" value={form.client_name || ""} onChange={handleChange} placeholder="Name" className="border p-2 rounded w-full" required />
                    <input name="client_nid_number" value={form.client_nid_number || ""} onChange={handleChange} placeholder="NID" className="border p-2 rounded w-full" required />
                    <input name="client_phone" value={form.client_phone || ""} onChange={handleChange} placeholder="Phone" className="border p-2 rounded w-full" />
                    <input name="client_email" value={form.client_email || ""} onChange={handleChange} placeholder="Email" className="border p-2 rounded w-full" />
                    <input name="client_address" value={form.client_address || ""} onChange={handleChange} placeholder="Address" className="border p-2 rounded w-full" />

                    {/* File chooser like others */}
                    <div>

                        <label className="block">
                            <span className="text-gray-700 mb-1">Choose File:</span>
                            <div className="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-gray-100">
                                <span>{form.client_photo ? form.client_photo.name : "Select a file..."}</span>
                                <input
                                    type="file"
                                    name="client_photo"
                                    onChange={handleChange}
                                    className="hidden"
                                    accept=".png,.jpeg,.jpg,.svg"
                                />
                                <FaPlus className="text-green-500" />
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
                        >
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}


