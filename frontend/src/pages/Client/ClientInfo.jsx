
import React, { useEffect, useState } from "react";
import { getClients, addClient, updateClient, deleteClient } from "../../services/clientInfoService";
import ClientInfoModal from "../../components/Client/ClientInfoModal";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import clientDefImage from "../../assets/images/client-def-image.png";
import { FaPlus, FaTimes } from "react-icons/fa";


export default function ClientInfoPage() {

    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);
    const [preview, setPreview] = useState(null);

    const { toast, showToast, hideToast } = useToast();
    const BASE_URL = import.meta.env.VITE_API_URL;

    const DEFAULT_AVATAR = clientDefImage;

    const fetchData = async () => {
        try {
            const res = await getClients();
            setData(res.data);
        } catch {
            showToast("Failed to load clients", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const f = data.filter(c =>
            c.client_id?.toString().includes(search) ||
            c.client_name?.toLowerCase().includes(search.toLowerCase()) ||
            c.client_email?.toLowerCase().includes(search.toLowerCase()) ||
            c.client_phone?.toLowerCase().includes(search.toLowerCase()) ||
            c.client_nid_number?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(f);
        setPage(1);
    }, [search, data]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const handleSubmit = async (formData) => {
        try {
            if (editData) await updateClient(editData.client_id, formData);
            else await addClient(formData);

            showToast("Saved successfully", "success");
            setModalOpen(false);
            setEditData(null);
            fetchData();
        } catch {
            showToast("Save failed", "error");
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteClient(deleteData.client_id);
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
                <h2 className="text-2xl font-bold">Client Info</h2>

                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />
                    <button onClick={() => { setModalOpen(true); setEditData(null); }} className="bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center">
                        <FaPlus /> Add Client
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-200 text-sm text-left">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Name</th>
                            <th className="p-2 ">NID</th>
                            <th className="p-2 ">Phone</th>
                            <th className="p-2 ">Email</th>
                            <th className="p-2">Photo</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {paginated.length > 0 ? (
                            paginated.map(c => (
                                <tr key={c.client_id} className="border-t hover:bg-gray-50">
                                    <td className="p-2 text-center">{c.client_id}</td>
                                    <td className="p-2">{c.client_name}</td>
                                    <td className="p-2 ">{c.client_nid_number}</td>
                                    <td className="p-2 "> {c.client_phone}</td>
                                    <td className="p-2 "><a href="mailto:">{c.client_email}</a></td>
                                    <td>
                                        <img
                                            src={c.client_photo_url
                                                ? `${BASE_URL}/uploads/documents/client/${c.client_photo_url}`
                                                : DEFAULT_AVATAR}
                                            className="w-8 h-8 rounded-full cursor-pointer"
                                            onClick={() => setPreview(c)}
                                        />
                                    </td>
                                    <td className="p-2 flex justify-center gap-1">
                                        <button onClick={() => { setEditData(c); setModalOpen(true); }} className="bg-yellow-500 px-2 py-1 text-white rounded">Edit</button>
                                        <button onClick={() => setDeleteData(c)} className="bg-red-500 px-2 py-1 text-white rounded">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-4 text-gray-500">
                                    No records found
                                </td>
                            </tr>
                        )
                        }
                    </tbody>
                </table>
            </div>

            <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />

            {/* PREVIEW */}
            {preview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-xl relative">
                        <button onClick={() => setPreview(null)} className="absolute top-1 right-1 p-1 text-red-600  hover:bg-gray-200 text-sm rounded-full"><FaTimes /></button>
                        <img
                            src={`${BASE_URL}/uploads/documents/client/${preview.client_photo_url}`}
                            className="w-64 h-64 object-cover"
                        />
                    </div>
                </div>
            )}

            {/* DELETE */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded">
                        <p>Delete {deleteData.client_name}?</p>
                        <button onClick={confirmDelete}>Yes</button>
                        <button onClick={() => setDeleteData(null)}>No</button>
                    </div>
                </div>
            )}

            <ClientInfoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={editData} />

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
}



