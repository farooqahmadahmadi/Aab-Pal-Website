import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function PurchaseOrdersModal({ isOpen, onClose, onSubmit, initialData }) {
    const [suppliers, setSuppliers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({
        supplier_id: "",
        project_id: "",
        order_date: "",
        total_amount: 0,
        po_type: "In",
        po_status: "Pending"
    });

    useEffect(() => {
        // Initialize form safely
        setForm({
            supplier_id: initialData?.supplier_id || "",
            project_id: initialData?.project_id || "",
            order_date: initialData?.order_date || "",
            total_amount: Number(initialData?.total_amount || 0),
            po_type: initialData?.po_type || "In",
            po_status: initialData?.po_status || "Pending"
        });
    }, [initialData, isOpen]);

    useEffect(() => {
        API.get("/suppliers").then(res => setSuppliers(res.data.filter(s => s.supplier_status === "Active"))).catch(() => { });
        API.get("/project-info").then(res => setProjects(res.data.filter(p => p.project_status === "InProgress"))).catch(() => { });
    }, []);

    if (!isOpen) return null;

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = e => {
        e.preventDefault();

        if ((form.po_type === "In" && !form.supplier_id) || !form.order_date) {
            alert("Required fields missing");
            return;
        }
        if (form.po_type === "Out" && !form.project_id) {
            alert("Project required for Out type");
            return;
        }

        onSubmit({
            ...form,
            supplier_id: form.supplier_id ? Number(form.supplier_id) : null,
            project_id: form.project_id ? Number(form.project_id) : null,
            total_amount: Number(form.total_amount)
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="font-bold mb-4">{initialData ? "Edit" : "Add"} Purchase Order</h3>
                <form onSubmit={submit} className="space-y-3">
                    <select name="po_type" value={form.po_type} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="In">In</option>
                        <option value="Out">Out</option>
                    </select>

                    {form.po_type === "In" && (
                        <select name="supplier_id" value={form.supplier_id} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="">Select Supplier</option>
                            {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
                        </select>
                    )}

                    {form.po_type === "Out" && (
                        <select name="project_id" value={form.project_id} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="">Select Project</option>
                            {projects.map(p => <option key={p.project_id} value={p.project_id}>{p.project_name}</option>)}
                        </select>
                    )}

                    <input type="date" name="order_date" value={form.order_date} onChange={handleChange} className="w-full border p-2 rounded" />

                    <input type="number" name="total_amount" value={form.total_amount} readOnly className="w-full border p-2 rounded bg-gray-100" />

                    <select name="po_status" value={form.po_status} onChange={handleChange} className="w-full border p-2 rounded">
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Ordered</option>
                        <option>Received</option>
                        <option>Cancelled</option>
                    </select>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">{initialData ? "Update" : "Save"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}