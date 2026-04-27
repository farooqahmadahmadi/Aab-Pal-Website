import React, { useEffect, useState } from "react";
import EquipmentDocumentsModal from "../../components/Equipments/EquipmentDocumentsModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
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

import {
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../../services/equipmentDocumentsService";

export default function EquipmentDocuments() {
  const { t } = useTranslation();

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
  const BASE_URL = import.meta.env.VITE_IMAGE_URL;
  // const BASE_URL = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    try {
      const res = await getDocuments();
      setData(res.data || []);
    } catch {
      showToast(t("failed_fetch"), "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let f = [...data];

    f = f.filter(
      (i) =>
        i.document_id.toString().includes(search) ||
        i.document_name?.toLowerCase().includes(search.toLowerCase()),
    );

    f.sort((a, b) => {
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

    setFiltered(f);
    setPage(1);
  }, [search, data, sortField, sortOrder]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const submit = async (formData) => {
    try {
      if (editData) {
        await updateDocument(editData.document_id, formData);
        showToast(t("updated_success"), "success");
      } else {
        await addDocument(formData);
        showToast(t("added_success"), "success");
      }
      setModalOpen(false);
      setEditData(null);
      fetchData();
    } catch {
      showToast(t("operation_failed"), "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDocument(deleteData.document_id);
      showToast(t("deleted_success"), "success");
      fetchData();
    } catch {
      showToast(t("delete_failed"), "error");
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
      const res = await fetch(`${BASE_URL}${doc.document_file_url}`);
      const blob = await res.blob();
      const ext = doc.document_file_url.split(".").pop();
      const safeName = doc.document_name.replace(/\s+/g, "_");
      const fileName = `${doc.document_id}_${safeName}_${new Date(
        doc.updated_at,
      ).getTime()}.${ext}`;

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

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* ===== TOP ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          {t("equipment_documents")}
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
        {/* DESKTOP */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-center">ID</th>
                <th className="p-2">Equipment</th>
                <th className="p-2 text-left">File</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((i) => (
                  <tr key={i.document_id} className="border-t hover:bg-gray-50">
                    <td className="p-2 text-center">{i.document_id}</td>
                    <td className="p-2">{i.equipment_id}</td>
                    <td className="p-2 text-left">{i.document_name}</td>
                    <td className="p-2 text-left">{i.document_description}</td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handlePreview(i)}
                          className="bg-purple-500 p-1.5 text-white rounded"
                        >
                          <FiEye />
                        </button>

                        <button
                          onClick={() => handleDownload(i)}
                          className="bg-blue-500 p-1.5 text-white rounded"
                        >
                          <FiDownload />
                        </button>

                        <button
                          onClick={() => {
                            setEditData(i);
                            setModalOpen(true);
                          }}
                          className="bg-yellow-500 p-1.5 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteData(i)}
                          className="bg-red-500 p-1.5 text-white rounded"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    {t("no_records")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.length ? (
            paginated.map((i) => (
              <MobileCard
                key={i.document_id}
                id={i.document_id}
                actions={
                  <>
                    <button
                      onClick={() => handlePreview(i)}
                      className="bg-purple-500 p-2 text-white rounded"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => handleDownload(i)}
                      className="bg-blue-500 p-2 text-white rounded"
                    >
                      <FiDownload />
                    </button>
                    <button
                      onClick={() => {
                        setEditData(i);
                        setModalOpen(true);
                      }}
                      className="bg-yellow-500 p-2 text-white rounded"
                    >
                      <FiEdit3 />
                    </button>
                    <button
                      onClick={() => setDeleteData(i)}
                      className="bg-red-500 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                }
              >
                <CardRow label={t("equipment")} value={i.equipment_id} />
                <CardRow label={t("file_name")} value={i.document_name} />
                <CardRow
                  label={t("description")}
                  value={i.document_description}
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
          total={filtered.length}
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      {/* MODAL */}
      <EquipmentDocumentsModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={submit}
        initialData={editData}
      />

      {/* DELETE */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <p>{t("delete_confirm")}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteData(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {previewData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-2 rounded-2xl w-[90%] md:w-[50%] h-[80%] overflow-auto">
            <div className="flex justify-between m-2">
              <h3 className="font-bold">{previewData.document_name}</h3>
              <span
                onClick={() => setPreviewData(null)}
                className="cursor-pointer text-red-500"
              >
                <FiXCircle />
              </span>
            </div>

            {getFileType(previewData.document_file_url) === "image" && (
              <img
                src={`${BASE_URL}${previewData.document_file_url}`}
                className="mx-auto"
              />
            )}

            {getFileType(previewData.document_file_url) === "pdf" && (
              <iframe
                src={`${BASE_URL}${previewData.document_file_url}`}
                className="w-full h-[90%]"
              />
            )}
          </div>
        </div>
      )}

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
