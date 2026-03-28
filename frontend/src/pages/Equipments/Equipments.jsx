import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import EquipmentModal from "../../components/Equipments/EquipmentModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";

import {
    getEquipments,
    addEquipment,
    updateEquipment,
    deleteEquipment
} from "../../services/equipmentService";

export default function Equipments() {

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
            const res = await getEquipments();
            setData(res.data || []);
        } catch {
            showToast("Failed to load", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const f = data.filter(i =>
            i.equipment_id.toString().includes(search) ||
            i.equip_name?.toLowerCase().includes(search.toLowerCase()) ||
            i.equip_company?.toLowerCase().includes(search.toLowerCase()) ||
            i.equip_current_status?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(f);
        setPage(1);
    }, [search, data]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const handleSubmit = async (form) => {
        try {
            if (editData) {
                await updateEquipment(editData.equipment_id, form);
                showToast("Equipment Updated", "success");
            } else {
                await addEquipment(form);
                showToast("Equipment Added", "success");
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
            await deleteEquipment(deleteData.equipment_id);
            showToast("Equipment deleted successfully", "success");
            fetchData();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case "NotUsed": return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">{status}</span>;
            case "InUse": return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">{status}</span>;
            case "Damaged": return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700">{status}</span>;
            case "Other": return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">{status}</span>;
            default: return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">{status}</span>;
        }
    };


    return (
        <div className="p-6 max-w-6xl mx-auto">

            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Equipment</h2>
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
                    <thead className="bg-gray-200 text-sm">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Name</th>
                            <th className="p-2">Company</th>
                            <th className="p-2">Serial Number</th>
                            <th className="p-2">Status</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.length ? paginated.map(i => (
                            <tr key={i.equipment_id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{i.equipment_id}</td>
                                <td className="p-2">{i.equip_name}</td>
                                <td className="p-2">{i.equip_company}</td>
                                <td className="p-2">{i.equip_serial_number}</td>
                                <td className="p-2">{renderStatusBadge(i.equip_current_status)}</td>
                                <td className="p-2 flex justify-center gap-1.5">
                                    <button onClick={() => { setEditData(i); setModalOpen(true); }} className="bg-yellow-500 px-2 py-1 text-white rounded">Edit</button>
                                    <button onClick={() => setDeleteData(i)} className="bg-red-500 px-2 py-1 text-white rounded">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center p-4 text-gray-500">
                                    No equipment (Machinery) records found
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center">
                <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />
            </div>

            <EquipmentModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={handleSubmit}
                initialData={editData}
            />

            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p>Are you sure to delete <strong>{deleteData.equip_name || "record"}</strong>?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setDeleteData(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}


            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div >
    );
}