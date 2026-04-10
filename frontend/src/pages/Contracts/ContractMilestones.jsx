import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { getMilestones, addMilestone, updateMilestone, deleteMilestone } from "../../services/contractMilestoneService";
import ContractMilestoneModal from "../../components/Contracts/ContractMilestoneModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";

export default function ContractMilestones() {
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
            const res = await getMilestones();
            setData(res.data || []);
        } catch {
            showToast("Failed to load", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const f = data.filter(i =>
            i.milestone_id.toString().includes(search) ||
            i.title?.toLowerCase().includes(search.toLowerCase()) ||
            i.status?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(f);
        setPage(1);
    }, [search, data]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const submit = async (formData) => {
        try {
            if (editData) {
                await updateMilestone(editData.milestone_id, formData);
                showToast("Updated successfully", "success");
            } else {
                await addMilestone(formData);
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
            await deleteMilestone(deleteData.milestone_id);
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
                <h2 className="text-2xl font-bold">Contract Milestones</h2>

                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />
                    <button onClick={() => { setModalOpen(true); setEditData(null); }}
                        className="bg-green-500 text-white px-4 py-2 flex gap-2 items-center rounded">
                        <FaPlus /> Add Milestone
                    </button>
                </div>
            </div>

             <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-200 text-sm">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Contract</th>
                            <th className="p-2 text-left">Title</th>
                            <th className="p-2">Due Date</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.length ? paginated.map(i => (
                            <tr key={i.milestone_id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{i.milestone_id}</td>
                                <td className="p-2">{i.contract_id}</td>
                                <td className="p-2 text-left">{i.title}</td>
                                <td className="p-2">{i.due_date}</td>
                                <td className="p-2">{i.amount}</td>
                                <td className="p-2">{i.status}</td>

                                <td className="flex justify-center gap-1.5 p-2">
                                    <button onClick={() => { setEditData(i); setModalOpen(true); }} className="bg-yellow-500 px-2 py-1 text-white rounded">Edit</button>
                                    <button onClick={() => setDeleteData(i)} className="bg-red-500 px-2 py-1 text-white rounded">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="p-4 text-gray-500">No contract milestone records found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center">
                <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />
            </div>

            <ContractMilestoneModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={submit}
                initialData={editData}
            />

            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-96">
                        <p>Delete <strong>{deleteData.title}</strong>?</p>
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