import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

export default function ProjectDocumentModal({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        project_id: "",
        document_name: "",
        document_description: "",
        file: null
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                project_id: initialData.project_id || "",
                document_name: initialData.document_name || "",
                document_description: initialData.document_description || "",
                file: null
            });
        } else {
            setFormData({ project_id: "", document_name: "", document_description: "", file: null });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setFormData(prev => ({ ...prev, [name]: files[0] }));
        else setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.project_id || !formData.document_name) {
            alert("Project ID and Document Name are required");
            return;
        }
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-96 relative">
                <h3 className="text-xl font-bold mb-4">{initialData ? "Edit Document" : "Add Document"}</h3>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <input
                        type="number"
                        name="project_id"
                        value={formData.project_id}
                        onChange={handleChange}
                        placeholder="Project ID"
                        className="border p-2 rounded w-full"
                        required
                    />
                    <input
                        type="text"
                        name="document_name"
                        value={formData.document_name}
                        onChange={handleChange}
                        placeholder="Document Name"
                        maxLength={150}
                        className="border p-2 rounded w-full"
                        required
                    />
                    <input
                        type="text"
                        name="document_description"
                        value={formData.document_description}
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
                                onChange={handleChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                            />
                            <FaPlus className="text-green-500" />
                        </div>
                    </label>

                    
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
                        >
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}