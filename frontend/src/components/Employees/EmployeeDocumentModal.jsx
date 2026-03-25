import React, { useState, useEffect } from "react";

export default function DocumentModal({ isOpen, onClose, onSubmit, initialData }) {
    const [employee_id, setEmployeeId] = useState("");
    const [doc_name, setDocName] = useState("");
    const [doc_description, setDocDescription] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (initialData) {
            setEmployeeId(initialData.employee_id || "");
            setDocName(initialData.doc_name || "");
            setDocDescription(initialData.doc_description || "");
            setFile(null); 
        } else {
            setEmployeeId("");
            setDocName("");
            setDocDescription("");
            setFile(null);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("employee_id", employee_id);
        formData.append("doc_name", doc_name);
        formData.append("doc_description", doc_description);
        if (file) formData.append("file", file);
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h3 className="text-lg font-bold mb-4">{initialData ? "Edit" : "Add"} Document</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    <div>
                        <label className="block text-sm font-medium mb-1">Employee ID *</label>
                        <input
                            type="number"
                            value={employee_id}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Document Name *</label>
                        <input
                            type="text"
                            value={doc_name}
                            onChange={(e) => setDocName(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={doc_description}
                            onChange={(e) => setDocDescription(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* File chooser */}
                    <div>
                        <label className="block text-sm font-medium mb-1">File</label>
                        <div className="flex items-center gap-2">
                            <label className="bg-gray-200 px-3 py-2 rounded cursor-pointer hover:bg-gray-300 transition">
                                Choose File
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="hidden"
                                />
                            </label>
                            <span className="text-sm text-gray-600">
                                {file ? file.name : (initialData?.doc_name || "No file selected")}
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}





