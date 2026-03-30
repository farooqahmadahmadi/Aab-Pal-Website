import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function StockTransactionModal({ isOpen, onClose, onSubmit, initialData }) {
    const [materials, setMaterials] = useState([]);
    const [projects, setProjects] = useState([]);
    const { toast, showToast, hideToast } = useToast();

    const [form, setForm] = useState({
        material_id: "",
        project_id: "",
        quantity: 0,
        stock_transaction_type: "",
        stock_transaction_date: ""
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            material_id: "",
            project_id: "",
            quantity: 0,
            stock_transaction_type: "",
            stock_transaction_date: ""
        });
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = e => {
        e.preventDefault();
        if (!form.material_id || !form.project_id) {
            showToast("Please insert both Material and Project", "error");
            return;
        }
        onSubmit(form);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded w-96">
                    <h3 className="font-bold mb-4">{initialData ? "Edit" : "Add"} Transaction</h3>

                    <form onSubmit={submit} className="space-y-3">
                        <input type="number" name="material_id" title="Material ID" value={form.material_id} onChange={handleChange} placeholder="Material ID" className="w-full border p-2 rounded" />

                        <input type="number" name="project_id" title="Project ID" value={form.project_id} onChange={handleChange} placeholder="Project ID" className="w-full border p-2 rounded" />

                        <input type="number" name="quantity" title="Quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="w-full border p-2 rounded" />

                        <select name="stock_transaction_type" title="Transaction Type" value={form.stock_transaction_type} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="IN">IN</option>
                            <option value="OUT">OUT</option>
                            <option value="ADJUSTMENT">ADJUSTMENT</option>
                        </select>

                        <input type="date" title="Transaction Date" name="stock_transaction_date" value={form.stock_transaction_date} onChange={handleChange} className="w-full border p-2 rounded" />

                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                                {initialData ? "Update" : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </>
    );
}