import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function ContractModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        project_id: "",
        contract_name: "",
        contract_number: "",
        signed_date: "",
        contract_start_date: "",
        contract_end_date: "",
        total_value: 0,
        contract_status: "Draft",
        file: null
    });

    useEffect(() => {
        if (initialData) setForm({ ...initialData, file: null });
        else setForm({
            project_id: "",
            contract_name: "",
            contract_number: "",
            signed_date: "",
            contract_start_date: "",
            contract_end_date: "",
            total_value: 0,
            contract_status: "Draft",
            file: null
        });
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setForm(prev => ({ ...prev, file: files[0] }));
        else setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.keys(form).forEach(k => {
            if (form[k] !== null) fd.append(k, form[k]);
        });
        onSubmit(fd);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-2xl w-full max-w-xl">
                <h3 className="font-bold mb-4">{initialData ? "Edit" : "Add"} Contract</h3>

                <form onSubmit={submit} className="space-y-3">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input name="project_id" value={form.project_id} onChange={handleChange} placeholder="Project ID" className="w-full border p-2 rounded" required />
                        <input name="contract_name" value={form.contract_name} onChange={handleChange} placeholder="Contract Name(Subject)" className="w-full border p-2 rounded" />
                        <input name="contract_number" value={form.contract_number} onChange={handleChange} placeholder="Contract Number" className="w-full border p-2 rounded" />
                        <input type="date" name="signed_date" title="Signature Date" value={form.signed_date} onChange={handleChange} className="w-full border p-2 rounded" required />

                        <input type="date" name="contract_start_date" title="Start Date" value={form.contract_start_date} onChange={handleChange} className="w-full border p-2 rounded" />
                        <input type="date" name="contract_end_date" title="End Date" value={form.contract_end_date} onChange={handleChange} className="w-full border p-2 rounded" />

                        <input type="number" name="total_value" step="0.01" title="Total Value" value={form.total_value ?? 0} onChange={handleChange} placeholder="Total Value" className="w-full border p-2 rounded" />

                        <select name="contract_status" title="Status" value={form.contract_status} onChange={handleChange} className="w-full border p-2 rounded">
                            <option>Draft</option>
                            <option>Active</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                        </select>
                    </div>

                    <label className="block">
                        <span className="text-gray-700 mb-1">Choose File:</span>
                        <div className="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-gray-100">
                            <span>{form.file ? form.file.name : "Select file..."}</span>
                            <input type="file"
                                onChange={handleChange}
                                className="hidden"
                                accept=".txt,.pdf,.doc,.docx,.xlsx,.pptx,.png,.jpeg,.jpg,.zip,.rar"
                            />
                            <FaPlus className="text-green-500" />
                        </div>
                    </label>

                    <div className="flex justify-end gap-2">
                        <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={onClose}>Cancel</button>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}
