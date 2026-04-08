import React, { useEffect, useState } from "react";
import {
    getSalaries,
    createSalary,
    updateSalary,
    deleteSalary,
} from "../../services/employeeSalaryService";

import EmployeeSalaryModal from "../../components/Employees/EmployeeSalaryModal";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";

import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";

import { FaPlus } from "react-icons/fa";

export default function EmployeeSalary() {
    const [records, setRecords] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);

    const { toast, showToast, hideToast } = useToast();

    // ===== FETCH =====
    const fetchData = async () => {
        try {
            const res = await getSalaries();
            setRecords(res);
        } catch (err) {
            console.error(err);
            showToast("Failed to fetch salaries", "error");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ===== SEARCH =====
    useEffect(() => {
        const data = records.filter((r) => {
            const name = r.EmployeeInfo?.emp_full_name || "";
            return name.toLowerCase().includes(search.toLowerCase());
        });

        setFiltered(data);
        setPage(1);
    }, [search, records]);

    // ===== PAGINATION =====
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    // ===== SUBMIT =====
    const handleSubmit = async (form) => {
        try {
            if (editData) {
                await updateSalary(editData.employee_salary_id, form);
                showToast("Salary updated successfully", "success");
            } else {
                await createSalary(form);
                showToast("Salary added successfully", "success");
            }

            setModalOpen(false);
            setEditData(null);
            fetchData();
        } catch (err) {
            console.error(err);
            showToast("Operation failed", "error");
        }
    };

    // ===== DELETE =====
    const confirmDelete = async () => {
        try {
            await deleteSalary(deleteData.employee_salary_id);
            showToast("Deleted successfully", "success");
            fetchData();
        } catch (err) {
            console.error(err);
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            {/* ===== TOP BAR ===== */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Employee Salary Info</h2>

                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />

                    <button
                        onClick={() => { setModalOpen(true); setEditData(null); }}
                        className="bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center hover:bg-green-600 transition"
                    >
                        <FaPlus /> Add Salary
                    </button>
                </div>
            </div>

            {/* ===== TABLE ===== */}
            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Employee ID</th>
                            <th className="p-2">Employee Name</th>
                            <th className="p-2">Base Salary</th>
                            <th className="p-2">Allowance</th>
                            <th className="p-2">From</th>
                            <th className="p-2">To</th>
                            <th className="p-2">Status</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.map((r) => (
                            <tr
                                key={r.employee_salary_id}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="p-2">{r.employee_salary_id}</td>
                                <td className="p-2">{r.employee_id}</td>
                                <td className="p-2">
                                    {r.EmployeeInfo?.emp_full_name || "-"}
                                </td>
                                <td className="p-2">{r.base_salary}</td>
                                <td className="p-2">{r.allowance}</td>
                                <td className="p-2">{r.effective_from}</td>
                                <td className="p-2">{r.effective_to}</td>

                                {/* STATUS BADGE */}
                                <td className="p-2">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${r.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {r.is_active ? "Active" : "InActive"}
                                    </span>
                                </td>

                                <td className="p-2 flex justify-center gap-1">
                                    <button
                                        onClick={() => {
                                            setEditData(r);
                                            setModalOpen(true);
                                        }}
                                        className="bg-yellow-500 px-2 py-1 text-white rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => setDeleteData(r)}
                                        className="bg-red-500 px-2 py-1 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {paginated.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center p-4 text-gray-500">
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ===== PAGINATION ===== */}
            <div className="mt-4 flex justify-center">
                <Pagination
                    page={page}
                    total={filtered.length}
                    limit={limit}
                    onPageChange={setPage}
                />
            </div>

            {/* ===== MODAL ===== */}
            <EmployeeSalaryModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditData(null);
                }}
                onSubmit={handleSubmit}
                initialData={editData}
            />

            {/* ===== DELETE MODAL ===== */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-80">
                        <p>
                            Delete salary for{" "}
                            <b>{deleteData.EmployeeInfo?.emp_full_name}</b>?
                        </p>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setDeleteData(null)}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== TOAST ===== */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                    position="top-right"
                />
            )}
        </div>
    );
}