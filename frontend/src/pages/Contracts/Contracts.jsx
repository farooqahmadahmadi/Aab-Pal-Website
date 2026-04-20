import React, { useEffect, useState } from "react";
import {
  getContracts,
  addContract,
  updateContract,
  deleteContract,
} from "../../services/contractService";
import ContractModal from "../../components/Contracts/ContractModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";
import { useTranslation } from "react-i18next";

import { FiDownload, FiEdit3, FiPlusCircle, FiTrash2 } from "react-icons/fi";

export default function Contracts() {
  const { t } = useTranslation();

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
      showToast(t("failed_fetch"), "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== Search =====
  useEffect(() => {
    const f = data.filter(
      (i) =>
        i.contract_id?.toString().includes(search) ||
        i.project_id?.toString().includes(search) ||
        i.contract_name?.toLowerCase().includes(search.toLowerCase()) ||
        i.contract_number?.toLowerCase().includes(search.toLowerCase()) ||
        i.contract_status?.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ===== Submit =====
  const submit = async (formData) => {
    try {
      if (editData) {
        await updateContract(editData.contract_id, formData);
        showToast(t("updated_success"), "success");
      } else {
        await addContract(formData);
        showToast(t("added_success"), "success");
      }
      setModalOpen(false);
      setEditData(null);
      fetchData();
    } catch {
      showToast(t("operation_failed"), "error");
    }
  };

  // ===== Delete =====
  const handleDelete = async () => {
    try {
      await deleteContract(deleteData.contract_id);
      showToast(t("deleted_success"), "success");
      fetchData();
    } catch {
      showToast(t("delete_failed"), "error");
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
      const fileName = `contract_${item.contract_id}_${Date.now()}.${ext}`;

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
        <h2 className="text-xl sm:text-2xl font-bold">{t("contracts")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_contract")}
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
                <th className="p-2">{t("project")}</th>
                <th className="p-2 text-left">{t("name")}</th>
                <th className="p-2">{t("number")}</th>
                <th className="p-2">{t("status")}</th>
                <th className="p-2">{t("date")}</th>
                <th className="p-2">{t("value")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((i) => (
                  <tr key={i.contract_id} className="border-t hover:bg-gray-50">
                    <td className="p-2 text-center">{i.contract_id}</td>
                    <td className="p-2">{i.project_id}</td>
                    <td className="p-2 text-left">{i.contract_name}</td>
                    <td className="p-2">{i.contract_number}</td>
                    <td className="p-2">{i.contract_status}</td>
                    <td className="p-2">{i.signed_date}</td>
                    <td className="p-2">{i.total_value}</td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
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
                  <td colSpan="8" className="p-4 text-center text-gray-500">
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
                key={i.contract_id}
                id={i.contract_id}
                actions={
                  <>
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
                <CardRow label={t("project")} value={i.project_id} />
                <CardRow label={t("name")} value={i.contract_name} />
                <CardRow label={t("number")} value={i.contract_number} />
                <CardRow label={t("status")} value={i.contract_status} />
                <CardRow label={t("date")} value={i.signed_date} />
                <CardRow label={t("value")} value={i.total_value} />
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
      <ContractModal
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
