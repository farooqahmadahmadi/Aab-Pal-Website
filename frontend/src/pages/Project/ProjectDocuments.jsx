import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import ProjectDocumentModal from "../../components/Project/ProjectDocumentModal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";
import { useTranslation } from "react-i18next";

import {
  FiDownload,
  FiEdit3,
  FiEye,
  FiPlusCircle,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";

export default function ProjectDocuments() {
  const { t } = useTranslation();

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
      const res = await API.get("/project-documents");
      setDocuments(res.data || []);
    } catch {
      showToast(t("failed_fetch"), "error");
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // ===== FILTER + SORT =====
  useEffect(() => {
    let data = [...documents];

    data = data.filter(
      (doc) =>
        doc.document_id?.toString().includes(search) ||
        doc.document_name?.toLowerCase().includes(search.toLowerCase()) ||
        (doc.document_description || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
    );

    data.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      return sortOrder === "asc"
        ? valA > valB
          ? 1
          : -1
        : valA < valB
          ? 1
          : -1;
    });

    setFilteredDocs(data);
    setPage(1);
  }, [search, documents, sortField, sortOrder]);

  // ===== PAGINATION =====
  const start = (page - 1) * limit;
  const paginatedDocs = filteredDocs.slice(start, start + limit);

  // ===== SUBMIT =====
  const handleSubmit = async (formData) => {
    try {
      const data = new FormData();
      data.append("project_id", formData.project_id);
      data.append("document_name", formData.document_name);
      data.append("document_description", formData.document_description);
      if (formData.file) data.append("file", formData.file);

      if (editData) {
        await API.put(`/project-documents/${editData.document_id}`, data);
        showToast(t("updated_success"), "success");
      } else {
        await API.post("/project-documents", data);
        showToast(t("added_success"), "success");
      }

      setModalOpen(false);
      setEditData(null);
      fetchDocs();
    } catch {
      showToast(t("operation_failed"), "error");
    }
  };

  // ===== DELETE =====
  const confirmDelete = async () => {
    try {
      await API.delete(`/project-documents/${deleteData.document_id}`);
      showToast(t("deleted_success"), "success");
      fetchDocs();
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  // ===== ACTIONS =====
  const handleEdit = (doc) => {
    setEditData(doc);
    setModalOpen(true);
  };

  const handlePreview = (doc) => setPreviewData(doc);

  const handleDownload = async (doc) => {
    try {
      const res = await fetch(`${BASE_URL}${doc.document_file_url}`);
      const blob = await res.blob();

      const ext = doc.document_file_url.split(".").pop();
      const safeName = doc.document_name.replace(/\s+/g, "_");

      const fileName = `${doc.document_id}_${safeName}_${Date.now()}.${ext}`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch {
      showToast(t("download_failed"), "error");
    }
  };

  const getFileType = (url) => {
    const ext = url?.split(".").pop()?.toLowerCase();
    if (["png", "jpg", "jpeg"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    return "other";
  };

  // ===== UI =====
  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          {t("project_documents")}
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_document")}
          </button>
        </div>
      </div>

      {/* TABLE / CARD */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ===== DESKTOP ===== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("project_id")}</th>
                <th className="p-2 text-left">{t("file_name")}</th>
                <th className="p-2 text-left">{t("description")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginatedDocs.length > 0 ? (
                paginatedDocs.map((doc) => (
                  <tr
                    key={doc.document_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-2 text-center">{doc.document_id}</td>
                    <td className="p-2 text-center">{doc.project_id}</td>
                    <td className="p-2">{doc.document_name}</td>
                    <td className="p-2">{doc.document_description}</td>

                    <td className="p-2 flex justify-center gap-1.5">
                      <button
                        onClick={() => handlePreview(doc)}
                        className="bg-purple-500 p-1 text-white rounded"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="bg-blue-500 p-1 text-white rounded"
                      >
                        <FiDownload />
                      </button>
                      <button
                        onClick={() => handleEdit(doc)}
                        className="bg-yellow-500 p-1 text-white rounded"
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        onClick={() => setDeleteData(doc)}
                        className="bg-red-500 p-1 text-white rounded"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    {t("no_records")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE ===== */}
        <div className="md:hidden p-2 space-y-3">
          {paginatedDocs.length > 0 ? (
            paginatedDocs.map((doc) => (
              <MobileCard
                key={doc.document_id}
                id={doc.document_id}
                actions={
                  <>
                    <button
                      onClick={() => handlePreview(doc)}
                      className="bg-purple-500 p-2 text-white rounded"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="bg-blue-500 p-2 text-white rounded"
                    >
                      <FiDownload />
                    </button>
                    <button
                      onClick={() => handleEdit(doc)}
                      className="bg-yellow-500 p-2 text-white rounded"
                    >
                      <FiEdit3 />
                    </button>
                    <button
                      onClick={() => setDeleteData(doc)}
                      className="bg-red-500 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                }
              >
                <CardRow label={t("project")} value={doc.project_id} />
                <CardRow label={t("file_name")} value={doc.document_name} />
                <CardRow
                  label={t("description")}
                  value={doc.document_description || "-"}
                />
              </MobileCard>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              {t("no_records")}
            </div>
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex justify-center">
        <Pagination
          page={page}
          total={filteredDocs.length}
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      {/* PREVIEW */}
      {previewData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl h-[80vh] overflow-auto">
            <div className="flex justify-between p-3 border-b">
              <h3 className="font-bold">{previewData.document_name}</h3>
              <button onClick={() => setPreviewData(null)}>
                <FiXCircle className="text-red-500 text-xl" />
              </button>
            </div>

            {getFileType(previewData.document_file_url) === "image" && (
              <img
                src={`${BASE_URL}${previewData.document_file_url}`}
                className="mx-auto p-4"
              />
            )}

            {getFileType(previewData.document_file_url) === "pdf" && (
              <iframe
                src={`${BASE_URL}${previewData.document_file_url}`}
                className="w-full h-[70vh]"
              />
            )}
          </div>
        </div>
      )}

      {/* DELETE */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <p>
              {t("delete_confirm")} <b>{deleteData.document_name}</b>?
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteData(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                {t("cancel")}
              </button>

              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      <ProjectDocumentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editData}
      />

      {/* TOAST */}
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
