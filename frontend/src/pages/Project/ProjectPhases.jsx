import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import ProjectPhaseModal from "../../components/Project/ProjectPhaseModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar"; // ✅ دلته اضافه شو
import { getProjectPhases, addProjectPhase, updateProjectPhase, deleteProjectPhase } from "../../services/projectPhasesService";

export default function ProjectPhasesPage() {
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
            const res = await getProjectPhases();
            setData(res.data || []);
        } catch {
            showToast("Failed to load phases", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const filteredData = data.filter(item =>
            item.phase_id.toString().includes(search) ||
            item.project_id.toString().includes(search) ||
            item.phase_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.phase_status?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(filteredData);
        setPage(1);
    }, [search, data]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const handleSubmit = async (formData) => {
        try {
            if (editData) {
                await updateProjectPhase(editData.phase_id, formData);
                showToast("Updated successfully", "success");
            } else {
                await addProjectPhase(formData);
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
            await deleteProjectPhase(deleteData.phase_id);
            showToast("Deleted successfully", "success");
            fetchData();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case "Planed": return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">{status}</span>;
            case "InProgress": return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">{status}</span>;
            case "Completed": return <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">{status}</span>;
            case "OnHold": return <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700">{status}</span>;
            case "Failed": return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700">{status}</span>;
            case "Other": return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">{status}</span>;
            default: return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">{status}</span>;
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Project Phases</h2>
                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} /> 
                    <button onClick={() => { setModalOpen(true); setEditData(null); }} className="bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center"><FaPlus />Add Phase</button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-center text-sm">
                    <thead className="bg-gray-200 text-sm">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Project ID</th>
                            <th className="p-2">Phase Name</th>
                            <th className="p-2">Start Date</th>
                            <th className="p-2">End Date</th>
                            <th className="p-2">Status</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length ? paginated.map(item => (
                            <tr key={item.phase_id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{item.phase_id}</td>
                                <td className="p-2">{item.project_id}</td>
                                <td className="p-2">{item.phase_name}</td>
                                <td className="p-2">{item.phase_start_date}</td>
                                <td className="p-2">{item.phase_end_date}</td>
                                <td className="p-2">{renderStatusBadge(item.phase_status)}</td>
                                <td className="p-2 flex justify-center gap-1.5">
                                    <button onClick={() => { setEditData(item); setModalOpen(true); }} className="bg-yellow-500 px-2 py-1 text-white rounded">Edit</button>
                                    <button onClick={() => setDeleteData(item)} className="bg-red-500 px-2 py-1 text-white rounded">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="p-4 text-center text-gray-500">No project phase found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center">
                <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />
            </div>

            <ProjectPhaseModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={handleSubmit}
                initialData={editData}
            />

            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p>Are you sure to delete <strong>{deleteData.phase_name || "record"}</strong>?</p>
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