import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

export default function DocumentModal({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({ doc_name: "", doc_description: "", file: null });

    useEffect(() => {
        if (initialData) {
            setFormData({
                doc_name: initialData.doc_name || "",
                doc_description: initialData.doc_description || "",
                file: null
            });
        } else {
            setFormData({ doc_name: "", doc_description: "", file: null });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, file });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-96 relative">
                <h3 className="text-xl font-bold mb-4">{initialData ? "Edit Document" : "Add Document"}</h3>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <input
                        type="text"
                        name="doc_name"
                        value={formData.doc_name}
                        onChange={handleChange}
                        placeholder="Document Name"
                        maxLength={150}
                        className="border p-2 rounded w-full"
                        required
                    />
                    <input
                        type="text"
                        name="doc_description"
                        value={formData.doc_description}
                        onChange={handleChange}
                        placeholder="Description"
                        maxLength={255}
                        className="border p-2 rounded w-full"
                    />
                    <label className="block">
                        <span className="text-gray-700 mb-1">Choose File:</span>
                        <div className="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-gray-100">
                            <span>{formData.file ? formData.file.name : "Select a file..."}</span>
                            <input
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".txt,.pdf,.doc,.docx,.xlsx,.pptx,.png,.jpeg,.jpg,.zip,.rar"
                            />
                            <FaPlus className="text-green-500" />
                        </div>
                    </label>
                    <div className="flex justify-end gap-2 mt-2">
                        <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
