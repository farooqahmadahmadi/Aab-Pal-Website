import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import EquipmentUsageModal from "../../components/Equipments/EquipmentUsageModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";

import {
    getEquipmentUsage,
    addEquipmentUsage,
    updateEquipmentUsage,
    deleteEquipmentUsage
} from "../../services/equipmentUsageService";

export default function EquipmentUsage() {

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
            const res = await getEquipmentUsage();
            setData(res.data || []);
        } catch {
            showToast("Failed to load", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const f = data.filter(i =>
            i.equipment_id.toString().includes(search) ||
            i.employee_id.toString().includes(search) ||
            (i.project_id || "").toString().includes(search)
        );
        setFiltered(f);
        setPage(1);
    }, [search, data]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const submit = async (form) => {
        try {
            if (editData) {
                await updateEquipmentUsage(editData.equipment_usage_id, form);
                showToast("Updated successfully", "success");
            } else {
                await addEquipmentUsage(form);
                showToast("Added successfully", "success");
            }
            setModalOpen(false);
            setEditData(null);
            fetchData();
        } catch {
            showToast("Error", "error");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteEquipmentUsage(deleteData.equipment_usage_id);
            showToast("Deleted", "success");
            fetchData();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Equipment Usage</h2>

                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />

                    <button onClick={() => { setModalOpen(true); setEditData(null); }}
                        className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                        <FaPlus /> Add
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-center text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Equipment</th>
                            <th className="p-2">Employee</th>
                            <th className="p-2">Project</th>
                            <th className="p-2 text-left" >Description</th>
                            <th className="p-2">Start</th>
                            <th className="p-2">End</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.length ? paginated.map(i => (
                            <tr key={i.equipment_usage_id} className="border-t">
                                <td className="p-2">{i.equipment_usage_id}</td>
                                <td className="p-2">{i.equipment_id}</td>
                                <td className="p-2">{i.employee_id}</td>
                                <td className="p-2">{i.project_id}</td>
                                <td className="p-2 text-left">{i.usage_description}</td>
                                <td className="p-2">{i.usage_start_date}</td>
                                <td className="p-2">{i.usage_end_date}</td>
                                <td className="p-2 flex justify-center gap-1">
                                    <button onClick={() => { setEditData(i); setModalOpen(true); }} className="bg-yellow-500 px-2 py-1 text-white rounded">Edit</button>
                                    <button onClick={() => setDeleteData(i)} className="bg-red-500 px-2 py-1 text-white rounded">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="p-4 text-gray-500">No equipment usage records found!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />

            <EquipmentUsageModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={submit}
                initialData={editData}
            />

            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-96">
                        <p>Are you sure to delete <strong>{deleteData.equipment_id || "record"}</strong>?</p>
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
