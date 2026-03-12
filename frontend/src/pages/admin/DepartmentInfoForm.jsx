import { useState, useEffect } from "react";

import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function Departments({ role }) {
    // Admin role check
    if (role !== "admin") {
        return (
            <div className="flex justify-center items-center h-full">
                <h2 className="text-red-500 text-lg font-semibold">
                    Access Denied - Admin Only
                </h2>
            </div>
        );
    }

    const [departments, setDepartments] = useState([]);
    const [form, setForm] = useState({ depart_name: "", department_description: "" });
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

    // ================= GET DEPARTMENTS =================
    const fetchDepartments = async () => {
        try {
            const res = await axios.get("/api/departments");
            setDepartments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    // ================= VALIDATION =================
    const validate = () => {
        const errs = {};
        if (!form.depart_name) errs.depart_name = "Department name is required";
        if (!form.department_description) errs.department_description = "Description is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ================= HANDLE SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (editingId) {
                // Update
                await axios.put(`/api/departments/${editingId}`, form);
            } else {
                // Create
                await axios.post("/api/departments", form);
            }
            setForm({ depart_name: "", department_description: "" });
            setEditingId(null);
            fetchDepartments();
        } catch (err) {
            console.error(err);
        }
    };

    // ================= HANDLE EDIT =================
    const handleEdit = (dept) => {
        setEditingId(dept.department_id);
        setForm({
            depart_name: dept.depart_name,
            department_description: dept.department_description,
        });
        setErrors({});
    };

    // ================= HANDLE DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this department?")) return;
        try {
            await axios.delete(`/api/departments/${id}`);
            fetchDepartments();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Departments</h1>

            {/* ================= FORM ================= */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-4 rounded-lg shadow-md mb-6 max-w-lg"
            >
                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Department Name</label>
                    <input
                        type="text"
                        value={form.depart_name}
                        onChange={(e) => setForm({ ...form, depart_name: e.target.value })}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${errors.depart_name ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.depart_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.depart_name}</p>
                    )}
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={form.department_description}
                        onChange={(e) =>
                            setForm({ ...form, department_description: e.target.value })
                        }
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${errors.department_description ? "border-red-500" : "border-gray-300"
                            }`}
                    ></textarea>
                    {errors.department_description && (
                        <p className="text-red-500 text-xs mt-1">{errors.department_description}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    {editingId ? "Update Department" : "Add Department"}
                </button>
            </form>

            {/* ================= DEPARTMENTS TABLE ================= */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-2">ID</th>
                            <th className="text-left px-4 py-2">Name</th>
                            <th className="text-left px-4 py-2">Description</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept) => (
                            <tr key={dept.department_id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{dept.department_id}</td>
                                <td className="px-4 py-2">{dept.depart_name}</td>
                                <td className="px-4 py-2">{dept.department_description}</td>
                                <td className="px-4 py-2 flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEdit(dept)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <FiEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dept.department_id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}