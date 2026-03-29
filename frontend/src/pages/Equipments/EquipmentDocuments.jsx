import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaDownload, FaEye, FaTimes } from "react-icons/fa";
import EquipmentDocumentsModal from "../../components/Equipments/EquipmentDocumentsModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import { getDocuments, addDocument, updateDocument, deleteDocument } from "../../services/equipmentDocumentsService";

export default function EquipmentDocuments() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);
    const [previewData, setPreviewData] = useState(null);

    const [sortField, setSortField] = useState("document_id");
    const [sortOrder, setSortOrder] = useState("asc");

    const { toast, showToast, hideToast } = useToast();
    const BASE_URL = import.meta.env.VITE_API_URL;

    const fetchData = async () => {
        try {
            const res = await getDocuments();
            setData(res.data || []);
        } catch {
            showToast("Failed to load", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        let f = [...data];
        f = f.filter(i =>
            i.document_id.toString().includes(search) ||
            i.doc_name?.toLowerCase().includes(search.toLowerCase())
        );
        f.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();
            return sortOrder === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });
        setFiltered(f);
        setPage(1);
    }, [search, data, sortField, sortOrder]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const submit = async (formData) => {
        try {
            if (editData) {
                await updateDocument(editData.document_id, formData);
                showToast("Updated successfully", "success");
            } else {
                await addDocument(formData);
                showToast("Added successfully", "success");
            }
            setModalOpen(false);
            setEditData(null);
            fetchData();
        } catch {
            showToast("Error saving document", "error");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDocument(deleteData.document_id);
            showToast("Deleted successfully", "success");
            fetchData();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    const handlePreview = (doc) => setPreviewData(doc);
    const getFileType = (url) => {
        const ext = url.split(".").pop().toLowerCase();
        if (["png", "jpg", "jpeg"].includes(ext)) return "image";
        if (ext === "pdf") return "pdf";
        return "other";
    };
    const handleDownload = async (doc) => {
        try {
            const res = await fetch(`${BASE_URL}${doc.doc_file_url}`);
            const blob = await res.blob();
            const ext = doc.doc_file_url.split(".").pop();
            const safeName = doc.doc_name.replace(/\s+/g, "_");
            const fileName = `${doc.document_id}_${safeName}_${new Date(doc.updated_at).getTime()}.${ext}`;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch { showToast("Download failed", "error"); }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Equipment Documents</h2>
                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />
                    <button onClick={() => { setModalOpen(true); setEditData(null); }} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                        <FaPlus /> Add Document
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-center text-sm">
                    <thead className="bg-gray-200 text-sm">
                        <tr>
                            <th className="p-2 cursor-pointer" onClick={() => { setSortField("document_id"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>ID</th>
                            <th className="p-2 cursor-pointer" onClick={() => { setSortField("equipment_id"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>Equipment ID</th>
                            <th className="p-2 text-left cursor-pointer" onClick={() => { setSortField("doc_name"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>File Name</th>
                            <th className="p-2 text-left">Description</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length ? paginated.map(i => (
                            <tr key={i.document_id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{i.document_id}</td>
                                <td className="p-2">{i.equipment_id}</td>
                                <td className="p-2 text-left">{i.doc_name}</td>
                                <td className="p-2 text-left">{i.doc_description}</td>

                                <td className="p-2 flex justify-center gap-1.5">
                                    <button onClick={() => handlePreview(i)} className="bg-purple-500 px-2 py-1 text-white rounded"><FaEye /></button>
                                    <button onClick={() => handleDownload(i)} className="bg-blue-500 px-2 py-1 text-white rounded"><FaDownload /></button>
                                    <button onClick={() => { setEditData(i); setModalOpen(true); }} className="bg-yellow-500 px-2 py-1 text-white rounded"><FaEdit /></button>
                                    <button onClick={() => setDeleteData(i)} className="bg-red-500 px-2 py-1 text-white rounded"><FaTrash /></button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center p-4 text-gray-500">No documents found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center">
                <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />
            </div>

            <EquipmentDocumentsModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={submit}
                initialData={editData}
            />

            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p>Are you sure to delete <strong>{deleteData.doc_name || "record"}</strong>?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setDeleteData(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {previewData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-2 rounded-2xl w-[50%] h-[80%] overflow-auto">
                        <div className="flex justify-between m-2">
                            <h3 className="font-bold">{previewData.doc_name}</h3>
                            <span onClick={() => setPreviewData(null)} className="cursor-pointer text-red-500"><FaTimes /></span>
                        </div>
                        {getFileType(previewData.doc_file_url) === "image" && (
                            <img src={`${BASE_URL}${previewData.doc_file_url}`} className="mx-auto" />
                        )}
                        {getFileType(previewData.doc_file_url) === "pdf" && (
                            <iframe src={`${BASE_URL}${previewData.doc_file_url}`} className="w-full h-[90%]" />
                        )}
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
}