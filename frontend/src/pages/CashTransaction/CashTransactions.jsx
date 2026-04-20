import React, { useEffect, useState } from "react";
import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import CashTransactionModal from "../../components/CashTransaction/CashTransactionModal";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";
import { useTranslation } from "react-i18next";

import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../services/cashTransactionsService";

export default function CashTransactions() {
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

  // ===== FETCH =====
  const fetchData = async () => {
    try {
      const res = await getTransactions();
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

    const f = data.filter(
      (i) =>
        i.transaction_id?.toString().includes(q) ||
        i.transaction_type?.toLowerCase().includes(q) ||
        i.transaction_description?.toLowerCase().includes(q),
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  // ===== PAGINATION =====
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ===== SUBMIT =====
  const submit = async (form) => {
    try {
      if (editData) {
        await updateTransaction(editData.transaction_id, form);
        showToast(t("updated_success"), "success");
      } else {
        await addTransaction(form);
        showToast(t("added_success"), "success");
      }
      setModalOpen(false);
      setEditData(null);
      fetchData();
    } catch {
      showToast(t("operation_failed"), "error");
    }
  };

  // ===== DELETE =====
  const handleDelete = async () => {
    try {
      await deleteTransaction(deleteData.transaction_id);
      showToast(t("deleted_success"), "success");
      fetchData();
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  const renderTypeBadge = (type) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        type === "Income"
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-red-600"
      }`}
    >
      {type}
    </span>
  );

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* ===== TOP BAR ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          {t("cash_transactions")}
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
            <FiPlusCircle /> {t("add_transaction")}
          </button>
        </div>
      </div>

      {/* ===== TABLE / CARD WRAP ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("type")}</th>
                <th className="p-2">{t("amount")}</th>
                <th className="p-2 text-left">{t("description")}</th>
                <th className="p-2">{t("date")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? (
                paginated.map((i) => {
                  const isAuto = i.reference_type !== "Manual";

                  return (
                    <tr
                      key={i.transaction_id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-2">{i.transaction_id}</td>

                      <td className="p-2">
                        {renderTypeBadge(i.transaction_type)}
                      </td>

                      <td className="p-2">{i.amount}</td>

                      <td className="p-2 text-left">
                        {i.transaction_description}
                      </td>

                      <td className="p-2">{i.transaction_date}</td>

                      <td className="p-2">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditData(i);
                              setModalOpen(true);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 p-1.5 text-white rounded"
                          >
                            <FiEdit3 />
                          </button>

                          <button
                            onClick={() => !isAuto && setDeleteData(i)}
                            disabled={isAuto}
                            className={`p-1.5 rounded text-white ${
                              isAuto
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
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
            paginated.map((i) => {
              const isAuto = i.reference_type !== "Manual";

              return (
                <MobileCard
                  key={i.transaction_id}
                  id={i.transaction_id}
                  actions={
                    <>
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
                        onClick={() => !isAuto && setDeleteData(i)}
                        disabled={isAuto}
                        className={`p-2 rounded text-white ${
                          isAuto ? "bg-gray-400" : "bg-red-500"
                        }`}
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  }
                >
                  <CardRow label={t("type")} value={i.transaction_type} />
                  <CardRow label={t("amount")} value={i.amount} />
                  <CardRow
                    label={t("description")}
                    value={i.transaction_description}
                  />
                  <CardRow label={t("date")} value={i.transaction_date} />
                </MobileCard>
              );
            })
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

      {/* ===== MODAL ===== */}
      <CashTransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={submit}
        initialData={editData}
      />

      {/* ===== DELETE ===== */}
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
