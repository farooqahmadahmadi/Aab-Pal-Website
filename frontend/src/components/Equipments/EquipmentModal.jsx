import React, { useEffect, useState } from "react";

export default function EquipmentModal({ isOpen, onClose, onSubmit, initialData }) {

    const [form, setForm] = useState({
        equip_name: "",
        equip_company: "",
        equip_serial_number: "",
        equip_purchase_date: "",
        equip_purchase_price: "",
        equip_current_status: "NotUsed"
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            equip_name: "",
            equip_company: "",
            equip_serial_number: "",
            equip_purchase_date: "",
            equip_purchase_price: "",
            equip_current_status: "NotUsed"
        });
    }, [initialData]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = () => onSubmit(form);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h3 className="text-xl font-bold mb-4">
                    {initialData ? "Edit Equipment" : "Add Equipment"}
                </h3>

                <div className="grid gap-3">
                    <input name="equip_name" value={form.equip_name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" />
                    <input name="equip_company" value={form.equip_company} onChange={handleChange} placeholder="Company" className="border p-2 rounded" />
                    <input name="equip_serial_number" value={form.equip_serial_number} onChange={handleChange} placeholder="Serial Number" className="border p-2 rounded" />
                    <input type="date" name="equip_purchase_date" value={form.equip_purchase_date || ""} onChange={handleChange} className="border p-2 rounded" />
                    <input name="equip_purchase_price" value={form.equip_purchase_price} onChange={handleChange} placeholder="Price" className="border p-2 rounded" />

                    <select name="equip_current_status" value={form.equip_current_status} onChange={handleChange} className="border p-2 rounded">
                        <option value="NotUsed">NotUsed</option>
                        <option value="InUse">InUse</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                    <button type="submit" onClick={submit} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                        {initialData ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

