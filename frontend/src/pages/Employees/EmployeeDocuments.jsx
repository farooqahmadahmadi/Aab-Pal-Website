import React, { useEffect, useState } from "react";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import {
  getEmployeeDocuments,
  addEmployeeDocument,
  updateEmployeeDocument,
  deleteEmployeeDocument,
} from "../../services/employeeDocumentsService";
import DocumentModal from "../../components/Employees/EmployeeDocumentModal";

import {
  FiDownload,
  FiEdit3,
  FiEye,
  FiPlusCircle,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";

import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";
import { useTranslation } from "react-i18next";

export default function EmployeeDocuments() {
  const { t } = useTranslation(); // ✅ FIXED

  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const { toast, showToast, hideToast } = useToast();
  const BASE_URL = import.meta.env.VITE_API_URL;

  // ===== FETCH =====
  const fetchDocs = async () => {
    try {
      const res = await getEmployeeDocuments();
      setDocuments(res.data || []);
    } catch {
      showToast(t("load_failed"), "error");
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // ===== SEARCH =====
  useEffect(() => {
    const q = search.toLowerCase();

    const data = documents.filter((doc) => {
      return (
        doc.document_id?.toString().includes(search) ||
        doc.doc_name?.toLowerCase().includes(q) ||
        doc.doc_description?.toLowerCase().includes(q) ||
        doc.employee_id?.toString().includes(search) ||
        doc.EmployeeInfo?.emp_full_name?.toLowerCase().includes(q)
      );
    });

    setFilteredDocs(data);
    setPage(1);
  }, [search, documents]);

  // ===== PAGINATION =====
  const start = (page - 1) * limit;
  const paginatedDocs = filteredDocs.slice(start, start + limit);

  // ===== SUBMIT =====
  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await updateEmployeeDocument(editData.document_id, formData);
        showToast(t("updated_success"), "success");
      } else {
        await addEmployeeDocument(formData);
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
      await deleteEmployeeDocument(deleteData.document_id);
      showToast(t("deleted_success"), "success");
      fetchDocs();
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

      const fileName =
        doc.doc_name || doc.doc_file_url.split("/").pop();

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

  // ===== PREVIEW =====
  const handlePreview = (doc) => setPreviewData(doc);

  const getFileType = (url) => {
    const ext = url.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    return "other";
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">

      {/* ===== TOP BAR ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          {t("employee_documents")}
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

      {/* ===== TABLE / CARD ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        {/* ===== DESKTOP ===== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("emp_id")}</th>
                <th className="p-2">{t("emp_name")}</th>
                <th className="p-2">{t("file_name")}</th>
                <th className="p-2">{t("description")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginatedDocs.length > 0 ? (
                paginatedDocs.map((doc) => (
                  <tr key={doc.document_id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{doc.document_id}</td>
                    <td className="p-2">{doc.employee_id}</td>
                    <td className="p-2">{doc.EmployeeInfo?.emp_full_name || "-"}</td>
                    <td className="p-2">{doc.doc_name}</td>
                    <td className="p-2">{doc.doc_description || "-"}</td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handlePreview(doc)} className="bg-purple-500 p-2 text-white rounded">
                          <FiEye />
                        </button>

                        <button onClick={() => handleDownload(doc)} className="bg-blue-500 p-2 text-white rounded">
                          <FiDownload />
                        </button>

                        <button
                          onClick={() => {
                            setEditData(doc);
                            setModalOpen(true);
                          }}
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
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
                    <button onClick={() => handlePreview(doc)} className="bg-purple-500 p-2 text-white rounded">
                      <FiEye />
                    </button>

                    <button onClick={() => handleDownload(doc)} className="bg-blue-500 p-2 text-white rounded">
                      <FiDownload />
                    </button>

                    <button
                      onClick={() => {
                        setEditData(doc);
                        setModalOpen(true);
                      }}
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
                <CardRow label={t("emp_id")} value={doc.employee_id} />
                <CardRow label={t("emp_name")} value={doc.EmployeeInfo?.emp_full_name} />
                <CardRow label={t("file_name")} value={doc.doc_name} />

                <div className="text-sm mt-2">
                  <span className="font-semibold">{t("description")}:</span>
                  <p className="text-gray-600 mt-1 break-words">
                    {doc.doc_description || "-"}
                  </p>
                </div>
              </MobileCard>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              {t("no_records")}
            </div>
          )}
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
          <div className="bg-white p-2 rounded-xl w-[90%] md:w-[60%] h-[80%] overflow-auto">

            <div className="flex justify-between items-center m-2">
              <h3>{previewData.doc_name}</h3>
              <button onClick={() => setPreviewData(null)}>
                <FiXCircle className="text-red-500" />
              </button>
            </div>

            {getFileType(previewData.doc_file_url) === "image" && (
              <img
                src={`${BASE_URL}${previewData.doc_file_url}`}
                className="w-full"
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

      {/* ===== DELETE ===== */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <p>
              {t("delete_confirm")} <strong>{deleteData.doc_name}</strong>؟
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