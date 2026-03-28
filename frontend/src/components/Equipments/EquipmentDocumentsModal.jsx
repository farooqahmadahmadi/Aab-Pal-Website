import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function EquipmentDocumentsModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        equipment_id: "",
        doc_name: "",
        doc_description: "",
        doc_file: null
    });

    useEffect(() => {
        if (initialData) setForm({ ...initialData, doc_file: null }); // doc_file نوي فایل لپاره null
        else setForm({ equipment_id: "", doc_name: "", doc_description: "", doc_file: null });
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setForm(prev => ({ ...prev, [name]: files[0] }));
        else setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        if (!form.equipment_id || !form.doc_name) return alert("Equipment ID and Name are required");

        const formData = new FormData();
        formData.append("equipment_id", form.equipment_id);
        formData.append("doc_name", form.doc_name);
        formData.append("doc_description", form.doc_description);
        if (form.doc_file) formData.append("doc_file", form.doc_file); // که نوی فایل وي

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-96 max-h-[90%] overflow-auto">
                <h3 className="text-lg font-bold mb-4">{initialData ? "Edit Document" : "Add Document"}</h3>
                <form onSubmit={submit} className="space-y-3">
                    <input name="equipment_id" value={form.equipment_id} onChange={handleChange} placeholder="Equipment ID" className="w-full border p-2 rounded" required />
                    <input name="doc_name" value={form.doc_name} onChange={handleChange} placeholder="Document Name" className="w-full border p-2 rounded" required />
                    <input name="doc_description" value={form.doc_description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />

                    <label className="block">
                        <span className="text-gray-700 mb-1">Choose File:</span>
                        <div className="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-gray-100">
                            <span>{form.doc_file ? form.doc_file.name : "Select a file..."}</span>
                            <input
                                type="file"
                                name="doc_file"
                                onChange={handleChange}
                                className="hidden"
                                accept=".txt,.pdf,.doc,.docx,.xlsx,.pptx,.png,.jpeg,.jpg,.zip,.rar"
                            />
                            <FaPlus className="text-green-500" />
                        </div>
                    </label>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">{initialData ? "Update" : "Save"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}