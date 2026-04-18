import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import DocumentModal from "../../components/Company/DocumentModal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import {
  FiDownload,
  FiEdit3,
  FiEye,
  FiPlusCircle,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function CompanyDocuments() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa" || i18n.language === "ps";

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
      setDocuments(res.data || []);
    } catch {
      showToast(t("load_documents_error"), "error");
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
        doc.doc_name?.toLowerCase().includes(search.toLowerCase()) ||
        (doc.doc_description || "")
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

  // ===== ADD / UPDATE =====
  const handleSubmit = async (formData) => {
    try {
      const data = new FormData();
      data.append("doc_name", formData.doc_name);
      data.append("doc_description", formData.doc_description);
      if (formData.file) data.append("file", formData.file);

      if (editData) {
        await API.put(`/company-documents/${editData.document_id}`, data);
        showToast(t("updated_success"), "success");
      } else {
        await API.post("/company-documents", data);
        showToast(t("added_success"), "success");
      }

      setModalOpen(false);
      setEditData(null);
      fetchDocs();
    } catch {
      showToast(t("save_failed"), "error");
    }
  };

  // ===== DELETE =====
  const confirmDelete = async () => {
    try {
      await API.delete(`/company-documents/${deleteData.document_id}`);

      setDocuments((prev) =>
        prev.filter((d) => d.document_id !== deleteData.document_id),
      );

      showToast(t("deleted_success"), "success");
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  // ===== DOWNLOAD =====
  const handleDownload = async (doc) => {
    try {
      const res = await fetch(`${BASE_URL}${doc.doc_file_url}`);
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = doc.doc_name;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch {
      showToast(t("download_failed"), "error");
    }
  };

  const handleEdit = (doc) => {
    setEditData(doc);
    setModalOpen(true);
  };

  const handlePreview = (doc) => setPreviewData(doc);

  const getFileType = (url) => {
    const ext = url.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    return "other";
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* ===== TOP BAR ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold">{t("company_documents")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />
          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_document")}
          </button>
        </div>
      </div>

      {/* ===== MOBILE CARDS ===== */}
      <div className="block md:hidden space-y-3">
        {paginatedDocs.length > 0 ? (
          paginatedDocs.map((doc) => (
            <div
              key={doc.document_id}
              className="bg-white shadow rounded-xl p-3 border"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">
                  {t("id")}: {doc.document_id}
                </span>
              </div>

              <div className="mb-1">
                <p className="text-xs text-gray-400">{t("file_name")}</p>
                <p className="font-semibold text-sm truncate">{doc.doc_name}</p>
              </div>

              <div className="mb-2">
                <p className="text-xs text-gray-400">{t("description")}</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {doc.doc_description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => handlePreview(doc)}
                  className="bg-purple-500 p-2 text-white rounded-lg"
                >
                  <FiEye size={16} />
                </button>

                <button
                  onClick={() => handleDownload(doc)}
                  className="bg-blue-500 p-2 text-white rounded-lg"
                >
                  <FiDownload size={16} />
                </button>

                <button
                  onClick={() => handleEdit(doc)}
                  className="bg-yellow-500 p-2 text-white rounded-lg"
                >
                  <FiEdit3 size={16} />
                </button>

                <button
                  onClick={() => setDeleteData(doc)}
                  className="bg-red-500 p-2 text-white rounded-lg"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">{t("no_records")}</p>
        )}
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("file_name")}</th>
                <th className="p-2">{t("description")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginatedDocs.map((doc) => (
                <tr key={doc.document_id} className="border-t hover:bg-gray-50">
                  <td className="p-2 text-center">{doc.document_id}</td>
                  <td className="p-2">{doc.doc_name}</td>
                  <td className="p-2">{doc.doc_description}</td>

                  <td className="p-2">
                    <div className="flex justify-center gap-2">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

      {/* ===== PREVIEW ===== */}
      {previewData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-3 rounded-xl w-[95%] md:w-[60%] h-[80%] overflow-auto">
            <div className="flex justify-between mb-2">
              <h3 className="font-bold">{previewData.doc_name}</h3>
              <FiXCircle
                onClick={() => setPreviewData(null)}
                className="text-red-500 cursor-pointer"
              />
            </div>

            {getFileType(previewData.doc_file_url) === "image" && (
              <img
                src={`${BASE_URL}${previewData.doc_file_url}`}
                className="mx-auto"
              />
            )}

            {getFileType(previewData.doc_file_url) === "pdf" && (
              <iframe
                src={`${BASE_URL}${previewData.doc_file_url}`}
                className="w-full h-[90%]"
              />
            )}
          </div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-80">
            <p>
              {t("delete_confirm")} <strong>{deleteData.doc_name}</strong>?
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

      {/* ===== MODAL ===== */}
      <DocumentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editData}
      />

      {/* ===== TOAST ===== */}
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
