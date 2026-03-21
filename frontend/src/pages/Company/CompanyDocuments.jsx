import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import DocumentModal from "./DocumentModal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import { FaTimes, FaPlus, FaEdit, FaTrash, FaDownload, FaEye } from "react-icons/fa";

export default function CompanyDocuments() {

    const [documents, setDocuments] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [sortField, setSortField] = useState("document_id");
    const [sortOrder, setSortOrder] = useState("asc");

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);
    const [previewData, setPreviewData] = useState(null);

    const { toast, showToast, hideToast } = useToast();
    const BASE_URL = import.meta.env.VITE_API_URL;

    // ===== FETCH =====
    const fetchDocs = async () => {
        try {
            const res = await API.get("/company-documents");
            setDocuments(res.data);
        } catch {
            showToast("Failed to load documents", "error");
        }
    };

    useEffect(() => { fetchDocs(); }, []);

    // ===== FILTER + SORT =====
    useEffect(() => {
        let data = [...documents];

        // Search
        data = data.filter(doc =>
            doc.doc_name.toLowerCase().includes(search.toLowerCase()) ||
            (doc.doc_description || "").toLowerCase().includes(search.toLowerCase())
        );

        // Sort
        data.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];

            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();

            if (sortOrder === "asc") return valA > valB ? 1 : -1;
            else return valA < valB ? 1 : -1;
        });

        setFilteredDocs(data);
        setPage(1);
    }, [search, documents, sortField, sortOrder]);

    // ===== PAGINATION =====
    const start = (page - 1) * limit;
    const paginatedDocs = filteredDocs.slice(start, start + limit);

    // ===== ADD / UPDATE =====
    const handleSubmit = async (formData) => {
        try {
            const data = new FormData();
            data.append("doc_name", formData.doc_name);
            data.append("doc_description", formData.doc_description);
            if (formData.file) data.append("file", formData.file);

            if (editData) {
                await API.put(`/company-documents/${editData.document_id}`, data);
                showToast("Updated", "success");
            } else {
                await API.post("/company-documents", data);
                showToast("Added", "success");
            }

            setModalOpen(false);
            setEditData(null);
            fetchDocs();
        } catch {
            showToast("Save failed", "error");
        }
    };

    // ===== DELETE =====
    const confirmDelete = async () => {
        try {
            await API.delete(`/company-documents/${deleteData.document_id}`);
            showToast("Deleted", "success");
            fetchDocs();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    // ===== EDIT =====
    const handleEdit = (doc) => {
        setEditData(doc);
        setModalOpen(true);
    };

    // ===== DOWNLOAD =====
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

        } catch {
            showToast("Download failed", "error");
        }
    };

    // ===== PREVIEW =====
    const handlePreview = (doc) => setPreviewData(doc);
    const getFileType = (url) => {
        const ext = url.split(".").pop().toLowerCase();
        if (["png", "jpg", "jpeg"].includes(ext)) return "image";
        if (ext === "pdf") return "pdf";
        return "other";
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* ===== TOP BAR ===== */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Company Documents</h2>
                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />
                    <button
                        onClick={() => { setModalOpen(true); setEditData(null); }}
                        className="bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center"
                    >
                        <FaPlus /> Add Document
                    </button>
                </div>
            </div>

            {/* ===== TABLE ===== */}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-200 text-sm">
                        <tr>
                            <th className="p-3 cursor-pointer" onClick={() => setSortField("document_id")}>ID</th>
                            <th className="p-3 cursor-pointer" onClick={() => setSortField("doc_name")}>Name</th>
                            <th className="p-3">Description</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDocs.map(doc => (
                            <tr key={doc.document_id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{doc.document_id}</td>
                                <td className="p-3">{doc.doc_name}</td>
                                <td className="p-3">{doc.doc_description}</td>
                                <td className="p-3 flex justify-center gap-1.5">
                                    <button onClick={() => handlePreview(doc)} className="bg-purple-500 px-2 py-1 text-white rounded"><FaEye /></button>
                                    <button onClick={() => handleEdit(doc)} className="bg-yellow-500 px-2 py-1 text-white rounded"><FaEdit /></button>
                                    <button onClick={() => setDeleteData(doc)} className="bg-red-500 px-2 py-1 text-white rounded"><FaTrash /></button>
                                    <button onClick={() => handleDownload(doc)} className="bg-blue-500 px-2 py-1 text-white rounded"><FaDownload /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ===== PAGINATION ===== */}
            <div className="mt-4 flex justify-center">
                <Pagination
                    page={page}
                    total={filteredDocs.length}
                    limit={limit}
                    onPageChange={setPage}
                />
            </div>

            {/* ===== PREVIEW MODAL ===== */}
            {previewData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-2 rounded-2xl w-[50%] h-[80%] overflow-auto">
                        <div className="flex justify-between text-right m-2">
                            <h3 className="font-bold mb-2">{previewData.doc_name}</h3>
                            <span onClick={() => setPreviewData(null)} className="text-red-500 hover:bg-red-500 hover:text-white px-2 py-2 rounded-full">
                                <FaTimes />
                            </span>
                        </div>
                        {getFileType(previewData.doc_file_url) === "image" && (
                            <img src={`${BASE_URL}${previewData.doc_file_url}`} className="max-h-full mx-auto" />
                        )}
                        {getFileType(previewData.doc_file_url) === "pdf" && (
                            <iframe src={`${BASE_URL}${previewData.doc_file_url}`} className="w-full h-[90%]" />
                        )}
                    </div>
                </div>
            )}

            {/* ===== DELETE MODAL ===== */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p className="mb-4 text-gray-700">
                            Are you sure you want to delete <strong>{deleteData.doc_name}</strong>?
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setDeleteData(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== MODAL ===== */}
            <DocumentModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={handleSubmit}
                initialData={editData}
            />

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} position="top-right" />}
        </div>
    );
}