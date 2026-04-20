import React, { useEffect, useState } from "react";
import {
  getClients,
  addClient,
  updateClient,
  deleteClient,
} from "../../services/clientInfoService";

import ClientInfoModal from "../../components/Client/ClientInfoModal";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";

import clientDefImage from "../../assets/images/client-def-image.png";
import { FiEdit3, FiPlusCircle, FiTrash2, FiXCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function ClientInfoPage() {
  const { t } = useTranslation();

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

  // ===== FETCH =====
  const fetchData = async () => {
    try {
      const res = await getClients();
      setData(res.data || []);
    } catch {
      showToast(t("failed_fetch"), "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== SEARCH =====
  useEffect(() => {
    const q = search.toLowerCase();

    const f = data.filter((c) => {
      return (
        c.client_id?.toString().includes(q) ||
        c.client_name?.toLowerCase().includes(q) ||
        c.client_email?.toLowerCase().includes(q) ||
        c.client_phone?.toLowerCase().includes(q) ||
        c.client_status?.toLowerCase().includes(q) ||
        c.client_nid_number?.toLowerCase().includes(q)
      );
    });

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  // ===== PAGINATION =====
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ===== SUBMIT =====
  const handleSubmit = async (formData) => {
    try {
      if (editData) await updateClient(editData.client_id, formData);
      else await addClient(formData);

      showToast(t("saved_success"), "success");
      setModalOpen(false);
      setEditData(null);
      fetchData();
    } catch {
      showToast(t("operation_failed"), "error");
    }
  };

  // ===== DELETE =====
  const confirmDelete = async () => {
    try {
      await deleteClient(deleteData.client_id);
      showToast(t("deleted_success"), "success");
      fetchData();
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t("client_info")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_new")}
          </button>
        </div>
      </div>

      {/* ===== TABLE / CARD ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("name")}</th>
                <th className="p-2">{t("nid")}</th>
                <th className="p-2">{t("phone")}</th>
                <th className="p-2">{t("email")}</th>
                <th className="p-2">{t("status")}</th>
                <th className="p-2">{t("photo")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? (
                paginated.map((c) => (
                  <tr key={c.client_id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{c.client_id}</td>
                    <td className="p-2">{c.client_name}</td>
                    <td className="p-2">{c.client_nid_number}</td>
                    <td className="p-2">{c.client_phone}</td>
                    <td className="p-2">
                      <a
                        href={`mailto:${c.client_email}`}
                        className="text-blue-600"
                      >
                        {c.client_email}
                      </a>
                    </td>
                    <td className="p-2">{c.client_status}</td>

                    <td className="p-2">
                      <img
                        src={
                          c.client_photo_url
                            ? `${BASE_URL}/uploads/documents/client/${c.client_photo_url}`
                            : DEFAULT_AVATAR
                        }
                        className="w-8 h-8 rounded-full cursor-pointer"
                        onClick={() => setPreview(c)}
                      />
                    </td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditData(c);
                            setModalOpen(true);
                          }}
                          className="bg-yellow-500 p-2 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteData(c)}
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
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    {t("no_records")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE CARDS ===== */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.length > 0 ? (
            paginated.map((c) => (
              <MobileCard
                key={c.client_id}
                id={c.client_id}
                actions={
                  <>
                    <button
                      onClick={() => {
                        setEditData(c);
                        setModalOpen(true);
                      }}
                      className="bg-yellow-500 p-2 text-white rounded"
                    >
                      <FiEdit3 />
                    </button>

                    <button
                      onClick={() => setDeleteData(c)}
                      className="bg-red-500 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                }
              >
                <div className="flex justify-center mb-2">
                  <img
                    src={
                      c.client_photo_url
                        ? `${BASE_URL}/uploads/documents/client/${c.client_photo_url}`
                        : DEFAULT_AVATAR
                    }
                    className="w-16 h-16 rounded-full cursor-pointer"
                    onClick={() => setPreview(c)}
                  />
                </div>

                <CardRow label={t("name")} value={c.client_name} />
                <CardRow label={t("nid")} value={c.client_nid_number} />
                <CardRow label={t("phone")} value={c.client_phone} />
                <CardRow label={t("email")} value={c.client_email} />
                <CardRow label={t("status")} value={c.client_status} />
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
          total={filtered.length}
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      {/* ===== PREVIEW ===== */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-xl relative">
            <button
              onClick={() => setPreview(null)}
              className="absolute top-1 right-1 p-1 text-red-600 hover:bg-gray-200 rounded-full"
            >
              <FiXCircle />
            </button>

            <img
              src={`${BASE_URL}/uploads/documents/client/${preview.client_photo_url}`}
              className="w-64 h-64 object-cover"
            />
          </div>
        </div>
      )}

      {/* ===== DELETE ===== */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <p>
              {t("delete_confirm")} <b>{deleteData.client_name}</b>?
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
      <ClientInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
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
