import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function PurchaseOrderItemsModal({ isOpen, onClose, onSubmit, initialData }) {
    const [materials, setMaterials] = useState([]);
    const [orders, setOrders] = useState([]);

    const [form, setForm] = useState({
        po_id: "",
        material_id: "",
        po_item_quantity: 0,
        po_item_unit_price: 0
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            po_id: "",
            material_id: "",
            po_item_quantity: 0,
            po_item_unit_price: 0
        });
    }, [initialData, isOpen]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const poRes = await API.get("/purchase-orders");
                const matRes = await API.get("/materials");

                setOrders(poRes.data);
                setMaterials(matRes.data);
            } catch { }
        };
        loadData();
    }, []);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        if (!form.po_id || !form.material_id) {
            alert("Required fields missing");
            return;
        }
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="font-bold mb-4">{initialData ? "Edit" : "Add"} Item</h3>

                <form onSubmit={submit} className="space-y-3">

                    <select name="po_id" value={form.po_id} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="">Select PO</option>
                        {orders.map(o => (
                            <option key={o.po_id} value={o.po_id}>
                                #{o.po_id}
                            </option>
                        ))}
                    </select>

                    <select name="material_id" value={form.material_id} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="">Select Material</option>
                        {materials.map(m => (
                            <option key={m.material_id} value={m.material_id}>
                                {m.material_name}
                            </option>
                        ))}
                    </select>

                    <input type="number" name="po_item_quantity" value={form.po_item_quantity} onChange={handleChange} placeholder="Quantity" className="w-full border p-2 rounded" />

                    <input type="number" name="po_item_unit_price" value={form.po_item_unit_price} onChange={handleChange} placeholder="Unit Price" className="w-full border p-2 rounded" />

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
