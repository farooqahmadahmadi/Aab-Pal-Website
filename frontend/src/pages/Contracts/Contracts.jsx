import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { getContracts, addContract, updateContract, deleteContract } from "../../services/contractService";
import ContractModal from "../../components/Contracts/ContractModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";

export default function Contracts() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);

    const { toast, showToast, hideToast } = useToast();
    const BASE_URL = import.meta.env.VITE_API_URL;

    // ===== Fetch =====
    const fetchData = async () => {
        try {
            const res = await getContracts();
            setData(res.data || []);
        } catch {
            showToast("Failed to load contracts", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ===== Search Filter =====
    useEffect(() => {
        const f = data.filter(i =>
            i.contract_id?.toString().includes(search) ||
            i.project_id?.toString().includes(search) ||
            i.contract_name?.toLowerCase().includes(search.toLowerCase()) ||
            i.contract_number?.toLowerCase().includes(search.toLowerCase()) ||
            i.contract_status?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(f);
        setPage(1);
    }, [search, data]);

    // ===== Pagination =====
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    // ===== Submit =====
    const submit = async (formData) => {
        try {
            if (editData) {
                await updateContract(editData.contract_id, formData);
                showToast("Updated successfully", "success");
            } else {
                await addContract(formData);
                showToast("Added successfully", "success");
            }
            setModalOpen(false);
            setEditData(null);
            fetchData();
        } catch {
            showToast("Save failed", "error");
        }
    };

    // ===== Delete =====
    const handleDelete = async () => {
        try {
            await deleteContract(deleteData.contract_id);
            showToast("Deleted successfully", "success");
            fetchData();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    // ===== Download =====
    const handleDownload = async (item) => {
        try {
            const res = await fetch(`${BASE_URL}${item.contract_file_url}`);
            const blob = await res.blob();

            const ext = item.contract_file_url.split(".").pop();
            const fileName = `contract_${item.contract_id}_${Date.now()}_${item.contract_name}.${ext}`;

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch {
            showToast("Download failed", "error");
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Contracts</h2>

                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />

                    <button
                        onClick={() => { setModalOpen(true); setEditData(null); }}
                        className="bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center"
                    >
                        <FaPlus /> Add Contract
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-center">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Project</th>
                            <th className="p-2">Name (Subject)</th>
                            <th className="p-2">Number</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Signed Date</th>
                            <th className="p-2">Value</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.length ? paginated.map(i => (
                            <tr key={i.contract_id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{i.contract_id}</td>
                                <td className="p-2">{i.project_id}</td>
                                <td className="p-2">{i.contract_name}</td>
                                <td className="p-2">{i.contract_number}</td>
                                <td className="p-2">{i.contract_status}</td>
                                <td className="p-2">{i.signed_date}</td>
                                <td className="p-2">{i.total_value}</td>

                                <td className="p-2 flex justify-center gap-1.5">
                                    <button
                                        onClick={() => handleDownload(i)}
                                        className="bg-blue-500 px-2 py-1 text-white rounded"
                                    >
                                        <FaDownload />
                                    </button>

                                    <button
                                        onClick={() => { setEditData(i); setModalOpen(true); }}
                                        className="bg-yellow-500 px-2 py-1 text-white rounded"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={() => setDeleteData(i)}
                                        className="bg-red-500 px-2 py-1 text-white rounded"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="p-4 text-gray-500 text-center">
                                    No contracts found
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
            <ContractModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={submit}
                initialData={editData}
            />

            {/* Delete Modal */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p>Delete contract <strong>{deleteData.contract_number || deleteData.contract_id}</strong>?</p>

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

            {/* Toast */}
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