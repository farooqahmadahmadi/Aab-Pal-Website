import React, { useEffect, useState } from "react";
import {
    getAttendanceShifts,
    addAttendanceShift,
    updateAttendanceShift,
    deleteAttendanceShift
} from "../../services/attendanceShiftsInfoService";
import AttendanceShiftModal from "../../components/Employees/AttendanceShiftModal";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function AttendanceShifts() {
    const [shifts, setShifts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);
    const { toast, showToast, hideToast } = useToast();

    const fetchShifts = async () => {
        try {
            const res = await getAttendanceShifts();
            setShifts(res.data || res);
        } catch {
            showToast("Failed to fetch shifts", "error");
        }
    };

    useEffect(() => { fetchShifts(); }, []);

    useEffect(() => {
        let data = [...shifts];
        if (search) {
            data = data.filter(s => s.shift_name.toLowerCase().includes(search.toLowerCase()));
        }
        setFiltered(data);
        setPage(1);
    }, [search, shifts]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const handleSubmit = async (form) => {
        try {
            if (editData) {
                await updateAttendanceShift(editData.attendance_shift_id, form);
                showToast("Shift updated", "success");
            } else {
                await addAttendanceShift(form);
                showToast("Shift added", "success");
            }
            setModalOpen(false);
            setEditData(null);
            fetchShifts();
        } catch {
            showToast("Save failed", "error");
        }
    };

    const handleDelete = async () => {
        if (!deleteData) return;
        try {
            await deleteAttendanceShift(deleteData.attendance_shift_id);
            showToast("Shift deleted", "success");
            fetchShifts();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Attendance Shifts</h2>
                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />
                    <button onClick={() => { setModalOpen(true); setEditData(null); }} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                        <FaPlus /> Add Shift
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-200 text-sm">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Shift Name</th>
                            <th className="p-2">Check In</th>
                            <th className="p-2">Check Out</th>
                            <th className="p-2">Latitude</th>
                            <th className="p-2">Longitude</th>
                            <th className="p-2">Reduce (m)</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length ? paginated.map(s => (
                            <tr key={s.attendance_shift_id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{s.attendance_shift_id}</td>
                                <td className="p-2">{s.shift_name}</td>
                                <td className="p-2">{s.check_in_start} - {s.check_in_end}</td>
                                <td className="p-2">{s.check_out_start} - {s.check_out_end}</td>
                                <td className="p-2">{s.latitude}</td>
                                <td className="p-2">{s.longitude}</td>
                                <td className="p-2">{s.reduce}</td>
                                <td className="p-2 flex justify-center gap-1.5">
                                    <button onClick={() => { setEditData(s); setModalOpen(true); }} className="bg-yellow-500 px-2 py-1 text-white rounded">Edit</button>
                                    <button onClick={() => setDeleteData(s)} className="bg-red-500 px-2 py-1 text-white rounded">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" className="p-4 text-center text-gray-500">No shifts found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center">
                <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />
            </div>

            <AttendanceShiftModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={editData} />

            {/* Delete Confirmation */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p>Are you sure you want to delete <strong>{deleteData.shift_name}</strong>?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setDeleteData(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
}

