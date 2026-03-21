import React, { useEffect, useState } from "react";
import EmployeeService from "../../services/employeeService";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import EmployeeModal from "./EmployeeModal";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);

    const { toast, showToast, hideToast } = useToast();

    const fetchEmployees = async () => {
        try {
            const res = await EmployeeService.getAll();
            setEmployees(res.data);
        } catch {
            showToast("Failed to load employees", "error");
        }
    };

    useEffect(() => { fetchEmployees(); }, []);

    useEffect(() => {
        const f = employees.filter(e =>
            e.employee_id?.toString().includes(search) ||
            e.emp_phone?.toString().includes(search) ||
            e.emp_nid_number.toLowerCase().includes(search.toLowerCase()) ||
            e.emp_gender.toLowerCase().includes(search.toLowerCase()) ||
            e.emp_email.toLowerCase().includes(search.toLowerCase()) ||
            e.emp_full_name.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(f);
        setPage(1);
    }, [search, employees]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const handleSubmit = async (form) => {
        try {
            if (editData) {
                await EmployeeService.update(editData.employee_id, form);
                showToast("Updated successfully", "success");
            } else {
                await EmployeeService.create(form);
                showToast("Added successfully", "success");
            }
            setModalOpen(false);
            setEditData(null);
            fetchEmployees();
        } catch {
            showToast("Operation failed", "error");
        }
    };

    const confirmDelete = async () => {
        try {
            await EmployeeService.delete(deleteData.employee_id);
            showToast("Deleted", "success");
            fetchEmployees();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Top bar */}
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Employees</h2>
                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />
                    <button
                        onClick={() => { setModalOpen(true); setEditData(null); }}
                        className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                        <FaPlus /> Add Employee
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-200 text-sm">
                        <tr>
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">Full Name</th>
                            <th className="p-2 text-left">Father Name</th>
                            <th className="p-2 text-left">NID</th>
                            <th className="p-2 text-left">Gender</th>
                            <th className="p-2 text-left">Phone</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map(e => (
                            <tr key={e.employee_id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{e.employee_id}</td>
                                <td className="p-2">{e.emp_full_name}</td>
                                <td className="p-2">{e.emp_father_name}</td>
                                <td className="p-2">{e.emp_nid_number}</td>
                                <td className="p-2">{e.emp_gender}</td>
                                <td className="p-2">{e.emp_phone}</td>
                                <td className="p-2">{e.emp_email}</td>
                                <td className="p-2 flex justify-center gap-2">
                                    <button onClick={() => { setEditData(e); setModalOpen(true); }} className="bg-yellow-500 px-2 py-1 text-white rounded"><FaEdit /></button>
                                    <button onClick={() => setDeleteData(e)} className="bg-red-500 px-2 py-1 text-white rounded"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                        {paginated.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center p-4 text-gray-500">
                                    No employees found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center">
                <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />
            </div>

            {/* Delete Modal */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p className="mb-4 text-gray-700">
                            Are you sure you want to delete <strong>{deleteData.emp_full_name}</strong>?
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setDeleteData(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            <EmployeeModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditData(null); }} onSubmit={handleSubmit} initialData={editData} />

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} position="top-right" />}
        </div>
    );
}