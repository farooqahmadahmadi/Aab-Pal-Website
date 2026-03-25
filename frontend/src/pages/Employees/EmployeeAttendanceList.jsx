import React, { useEffect, useState } from "react";
import {
    getAttendance,
    deleteAttendance
} from "../../services/employeeAttendanceService";
import EmployeeAttendanceModal from "../../components/Employees/EmployeeAttendanceModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";

export default function EmployeeAttendanceList() {

    const [records, setRecords] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);

    const { toast, showToast, hideToast } = useToast();

    // ===== Fetch =====
    const fetchData = async () => {
        try {
            const res = await getAttendance();
            setRecords(res.data || []);
        } catch {
            showToast("Failed to load attendance", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ===== Search Filter =====
    useEffect(() => {
        let data = records.filter(r =>
            r.employee_id.toString().includes(search) ||
            r.emp_attendance_id.toString().includes(search) ||
            r.attendance_status?.toLowerCase().includes(search.toLowerCase()) ||
            r.attendance_date?.includes(search)
        );

        setFiltered(data);
        setPage(1);
    }, [search, records]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    // ===== Delete =====
    const handleDelete = async () => {
        try {
            await deleteAttendance(deleteData.emp_attendance_id);
            showToast("Deleted successfully", "success");
            fetchData();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    // ===== Status Badge =====
    const getStatusBadge = (status) => {
        const base = "px-2 py-1 rounded text-xs font-semibold";

        switch (status) {
            case "Present":
                return <span className={`${base} bg-green-100 text-green-700`}>Present</span>;
            case "Absent":
                return <span className={`${base} bg-red-100 text-red-700`}>Absent</span>;
            case "Leave":
                return <span className={`${base} bg-yellow-100 text-yellow-700`}>Leave</span>;
            case "Sick":
                return <span className={`${base} bg-purple-100 text-purple-700`}>Sick</span>;
            default:
                return <span className={`${base} bg-gray-100 text-gray-600`}>Unknown</span>;
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Attendance List</h2>

                <div className="flex gap-2">
                    <input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 rounded"
                    />

                    <button
                        onClick={() => { setModalOpen(true); setEditData(null); }}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Add Attendance
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full text-center">

                    <thead className="bg-gray-200 text-sm">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Employee</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Check In</th>
                            <th className="p-2">Check Out</th>
                            <th className="p-2">Hours</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.length ? paginated.map(r => (
                            <tr key={r.emp_attendance_id} className="border-t hover:bg-gray-50">

                                <td className="p-2">{r.emp_attendance_id}</td>
                                <td className="p-2">{r.employee_id}</td>
                                <td className="p-2">{r.attendance_date}</td>

                                <td className="p-2">
                                    {getStatusBadge(r.attendance_status)}
                                </td>

                                <td className="p-2">{r.check_in_time || "-"}</td>
                                <td className="p-2">{r.check_out_time || "-"}</td>
                                <td className="p-2">{r.total_work_hours || "-"}</td>

                                <td className="p-2 flex justify-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditData(r);
                                            setModalOpen(true);
                                        }}
                                        className="bg-yellow-500 px-2 py-1 text-white rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => setDeleteData(r)}
                                        className="bg-red-500 px-2 py-1 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" className="p-4 text-gray-500">
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center">
                <Pagination
                    page={page}
                    total={filtered.length}
                    limit={limit}
                    onPageChange={setPage}
                />
            </div>

            {/* Modal */}
            <EmployeeAttendanceModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditData(null);
                }}
                initialData={editData}
                onSuccess={fetchData}
            />

            {/* Delete Confirm */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p>Are you sure to delete this record?</p>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setDeleteData(null)}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

        </div>
    );
}
