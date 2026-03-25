import React, { useState, useEffect } from "react";
import EmpHiringModal from "../../components/Employees/EmpHiringModal";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import Pagination from "../../components/common/Pagination";
import { FaPlus } from "react-icons/fa";

import { getEmpHiringInfo, addEmpHiring, updateEmpHiring, deleteEmpHiring } from "../../services/empHiringInfoService";

export default function EmpHiringInfoPage() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);

    const { toast, showToast, hideToast } = useToast();

    const fetchData = async () => {
        try {
            const res = await getEmpHiringInfo();
            setData(res.data || []);
        } catch {
            showToast("Failed to load data", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        let filteredData = data.filter(item =>
            item.hiring_id.toString().includes(search) ||
            item.employee_id.toString().includes(search) ||
            item.department_id.toString().includes(search) ||
            item.attendance_shift_id.toString().includes(search) ||
            item.employment_type.toLowerCase().includes(search.toLowerCase()) ||
            item.current_status.toLowerCase().includes(search.toLowerCase()) ||
            item.position?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(filteredData);
        setPage(1);
    }, [search, data]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const handleSubmit = async (formData) => {
        try {
            if (editData) {
                await updateEmpHiring(editData.hiring_id, formData);
                showToast("Updated successfully", "success");
            } else {
                await addEmpHiring(formData);
                showToast("Added successfully", "success");
            }
            setModalOpen(false);
            setEditData(null);
            fetchData();
        } catch {
            showToast("Save failed", "error");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteEmpHiring(deleteData.hiring_id);
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

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Employee Hiring Info</h2>
                <div className="flex gap-2">
                    <input type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded" />
                    <button onClick={() => { setModalOpen(true); setEditData(null); }} className="bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center"><FaPlus /> Add</button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-center">
                    <thead className="bg-gray-200 text-sm">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Employee ID</th>
                            <th className="p-2">Department ID</th>
                            <th className="p-2">Shift ID</th>
                            <th className="p-2">Position</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Hire Date</th>
                            <th className="p-2">End Date</th>
                            <th className="p-2">Status</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length ? paginated.map(item => (
                            <tr key={item.hiring_id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{item.hiring_id}</td>
                                <td className="p-2">{item.employee_id}</td>
                                <td className="p-2">{item.department_id}</td>
                                <td className="p-2">{item.attendance_shift_id}</td>
                                <td className="p-2">{item.position}</td>
                                <td className="p-2">{item.employment_type}</td>
                                <td className="p-2">{item.hire_date}</td>
                                <td className="p-2">{item.end_date}</td>
                                <td className="p-2">{item.current_status}</td>
                                <td className="p-2 flex justify-center gap-1.5">
                                    <button onClick={() => { setEditData(item); setModalOpen(true); }} className="bg-yellow-500 px-2 py-1 text-white rounded">Edit</button>
                                    <button onClick={() => setDeleteData(item)} className="bg-red-500 px-2 py-1 text-white rounded">Delete</button>
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

            <EmpHiringModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={handleSubmit}
                initialData={editData}
            />

            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p>Are you sure to delete <strong>{deleteData.position || "record"}</strong>?</p>
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