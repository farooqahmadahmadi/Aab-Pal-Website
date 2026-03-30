import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function PurchaseOrdersModal({ isOpen, onClose, onSubmit, initialData }) {
    const [suppliers, setSuppliers] = useState([]);
    const [form, setForm] = useState({
        supplier_id: "",
        order_date: "",
        total_amount: 0,
        po_status: "Pending"
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            supplier_id: "",
            order_date: "",
            total_amount: 0,
            po_status: "Pending"
        });
    }, [initialData, isOpen]);

    // ✅ Load only Active Suppliers
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await API.get("/suppliers");
                const active = res.data.filter(s => s.supplier_status === "Active");
                setSuppliers(active);
            } catch { }
        };
        fetchSuppliers();
    }, []);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        if (!form.supplier_id || !form.order_date) {
            alert("Required fields missing");
            return;
        }
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="font-bold mb-4">{initialData ? "Edit" : "Add"} Purchase Order</h3>

                <form onSubmit={submit} className="space-y-3">

                    <select name="supplier_id" title="Active Supplier ID" value={form.supplier_id} onChange={handleChange} className="w-full border p-2 rounded" required>
                        <option value="">Select Supplier</option>
                        {suppliers.map(s => (
                            <option key={s.supplier_id} value={s.supplier_id}>
                                {s.supplier_id} - {s.supplier_name}
                            </option>
                        ))}
                    </select>

                    <input type="date" name="order_date" title="Order Date" value={form.order_date} onChange={handleChange} className="w-full border p-2 rounded" required />

                    <input type="number" name="total_amount" title="Total Amount" value={form.total_amount} onChange={handleChange} placeholder="Total Amount" className="w-full border p-2 rounded" />

                    <select name="po_status" title="Order Status" value={form.po_status} onChange={handleChange} className="w-full border p-2 rounded">
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Ordered</option>
                        <option>Received</option>
                        <option>Cancelled</option>
                    </select>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}