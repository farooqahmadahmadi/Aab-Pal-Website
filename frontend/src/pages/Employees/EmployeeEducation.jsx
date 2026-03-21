import React, { useEffect, useState } from "react";
import {
    getEmployeeEducation,
    createEmployeeEducation,
    updateEmployeeEducation,
    deleteEmployeeEducation
} from "../../services/employeeEducationService";

import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import EmployeeEducationModal from "./EmployeeEducationModal";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function EmployeeEducation() {

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
            const res = await getEmployeeEducation();
            setRecords(res.data);
        } catch {
            showToast("Failed to fetch records", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ===== SEARCH FILTER =====
    useEffect(() => {
        const filteredData = records.filter(r => {
            const name = r.EmployeeInfo?.emp_full_name || "";
            const degree = r.educational_degree || "";
            const institution = r.educational_institution || "";

            return (
                name.toLowerCase().includes(search.toLowerCase()) ||
                degree.toLowerCase().includes(search.toLowerCase()) ||
                institution.toLowerCase().includes(search.toLowerCase())
            );
        });

        setFiltered(filteredData);
        setPage(1);

    }, [search, records]);

    // ===== PAGINATION =====
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    // ===== SUBMIT =====
    const handleSubmit = async (form) => {
        try {
            if (editData) {
                await updateEmployeeEducation(editData.eei_id, form);
                showToast("Updated successfully", "success");
            } else {
                await createEmployeeEducation(form);
                showToast("Added successfully", "success");
            }

            setModalOpen(false);
            setEditData(null);
            fetchData();

        } catch {
            showToast("Operation failed", "error");
        }
    };

    // ===== DELETE =====
    const confirmDelete = async () => {
        try {
            await deleteEmployeeEducation(deleteData.eei_id);
            showToast("Deleted successfully", "success");
            fetchData();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            {/* ===== TOP BAR ===== */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Employee Education Info</h2>

                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />

                    <button
                        onClick={() => { setModalOpen(true); setEditData(null); }}
                        className="bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center"
                    >
                        <FaPlus /> Add New
                    </button>
                </div>
            </div>

            {/* ===== TABLE ===== */}
            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2">Edu ID</th>
                            <th className="p-2">Employee ID</th>
                            <th className="p-2">Employee Name</th>
                            <th className="p-2">Degree</th>
                            <th className="p-2">Institution</th>
                            <th className="p-2">Field</th>
                            <th className="p-2">Graduation</th>
                            <th className="p-2">Description</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map(r => (
                            <tr key={r.eei_id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{r.eei_id}</td>
                                <td className="p-2">{r.employee_id}</td>
                                <td className="p-2">{r.EmployeeInfo?.emp_full_name || "-"}</td>
                                <td className="p-2">{r.educational_degree}</td>
                                <td className="p-2">{r.educational_institution}</td>
                                <td className="p-2">{r.educational_field}</td>
                                <td className="p-2">{r.graduation_date || "-"}</td>
                                <td className="p-2">{r.description}</td>
                                <td className="p-2 flex justify-center gap-1">
                                    <button
                                        onClick={() => { setEditData(r); setModalOpen(true); }}
                                        className="bg-yellow-500 px-2 py-1 text-white rounded"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => setDeleteData(r)}
                                        className="bg-red-500 px-2 py-1 text-white rounded"
                                    >
                                        <FaTrash />
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
            <EmployeeEducationModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={handleSubmit}
                initialData={editData}
            />

            {/* ===== DELETE MODAL ===== */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-80">
                        <p>
                            Delete <b>{deleteData.educational_degree}</b>?
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