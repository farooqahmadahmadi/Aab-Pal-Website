import React, { useState, useEffect } from "react";

export default function AttendanceShiftModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        shift_name: "",
        check_in_start: "",
        check_in_end: "",
        check_out_start: "",
        check_out_end: "",
        latitude: "",
        longitude: "",
        reduce: 10
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Shift" : "Add Shift"}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
                    <input name="shift_name" placeholder="Shift Name" value={form.shift_name} onChange={handleChange} className="border p-2 rounded" required />
                    <div className="grid grid-cols-2 gap-2">
                        <input type="time" name="check_in_start" value={form.check_in_start} onChange={handleChange} className="border p-2 rounded" required />
                        <input type="time" name="check_in_end" value={form.check_in_end} onChange={handleChange} className="border p-2 rounded" required />
                        <input type="time" name="check_out_start" value={form.check_out_start} onChange={handleChange} className="border p-2 rounded" required />
                        <input type="time" name="check_out_end" value={form.check_out_end} onChange={handleChange} className="border p-2 rounded" required />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" step="0.0000001" name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitude" className="border p-2 rounded" required />
                        <input type="number" step="0.0000001" name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitude" className="border p-2 rounded" required />
                    </div>
                    <input type="number" name="reduce" value={form.reduce} onChange={handleChange} placeholder="Reduce (meters)" className="border p-2 rounded" />
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">{initialData ? "Update" : "Save"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
