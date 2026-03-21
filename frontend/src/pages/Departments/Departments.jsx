import React, { useEffect, useState } from "react";
import DepartmentService from "../../services/departmentService";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import DepartmentModal from "./DepartmentModal";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);

    const { toast, showToast, hideToast } = useToast();

    // ===== FETCH =====
    const fetchDepartments = async () => {
        try {
            const res = await DepartmentService.getAll();
            setDepartments(res.data);
        } catch {
            showToast("Failed to load departments", "error");
        }
    };

    useEffect(() => { fetchDepartments(); }, []);

    // ===== SEARCH =====
    useEffect(() => {
        const f = departments.filter(d =>
            d.department_name.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(f);
        setPage(1);
    }, [search, departments]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    // ===== ADD / EDIT =====
    const handleSubmit = async (form) => {
        try {
            if (editData) {
                await DepartmentService.update(editData.department_id, form);
                showToast("Updated", "success");
            } else {
                await DepartmentService.create(form);
                showToast("Added", "success");
            }

            setModalOpen(false);
            setEditData(null);
            fetchDepartments();
        } catch {
            showToast("Operation failed", "error");
        }
    };

    // ===== DELETE =====
    const confirmDelete = async () => {
        try {
            await DepartmentService.delete(deleteData.department_id);
            showToast("Deleted", "success");
            fetchDepartments();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">

            {/* TOP BAR */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold">Departments</h2>

                <div className="flex gap-2 flex-wrap justify-end">
                    <SearchBar value={search} onChange={setSearch} />
                    <button
                        onClick={() => { setModalOpen(true); setEditData(null); }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex gap-2 items-center"
                    >
                        <FaPlus /> Add Department
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-200 text-sm">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Description</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map(d => (
                            <tr key={d.department_id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{d.department_id}</td>
                                <td className="p-3">{d.department_name}</td>
                                <td className="p-3">{d.department_description}</td>
                                <td className="p-3 flex justify-center gap-2">
                                    <button
                                        onClick={() => { setEditData(d); setModalOpen(true); }}
                                        className="bg-yellow-500 px-2 py-1 text-white rounded"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => setDeleteData(d)}
                                        className="bg-red-500 px-2 py-1 text-white rounded"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {paginated.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center p-4 text-gray-500">
                                    No departments found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="mt-4 flex justify-center">
                <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />
            </div>

            {/* DELETE MODAL */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p className="mb-4 text-gray-700">
                            Are you sure you want to delete <strong>{deleteData.department_name}</strong>?
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setDeleteData(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL */}
            <DepartmentModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={handleSubmit}
                initialData={editData}
            />

            {/* TOAST */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} position="center" />}
        </div>
    );
}
