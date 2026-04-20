import React, { useEffect, useState } from "react";
import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import InvoicesModal from "../../components/Invoices/InvoicesModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";
import { useTranslation } from "react-i18next";

import {
  getInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
} from "../../services/invoicesService";

export default function Invoices() {
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
      const res = await getInvoices();
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

    const f = data.filter((i) =>
      i.invoice_id.toString().includes(q) ||
      i.project_id.toString().includes(q) ||
      i.client_id.toString().includes(q) ||
      i.invoice_status?.toLowerCase().includes(q) ||
      i.invoice_type?.toLowerCase().includes(q) ||
      i.invoice_description?.toLowerCase().includes(q)
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
        await updateInvoice(editData.invoice_id, form);
        showToast(t("updated_success"), "success");
      } else {
        await addInvoice(form);
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
      await deleteInvoice(deleteData.invoice_id);
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
        type === "In"
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
          {t("invoices")}
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
            <FiPlusCircle /> {t("add_invoice")}
          </button>
        </div>
      </div>

      {/* ===== TABLE / CARD ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        {/* ===== DESKTOP ===== */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-center">{t("id")}</th>
                <th className="p-2">{t("project_id")}</th>
                <th className="p-2">{t("client_id")}</th>
                <th className="p-2">{t("type")}</th>
                <th className="p-2">{t("amount")}</th>
                <th className="p-2">{t("paid")}</th>
                <th className="p-2">{t("due_date")}</th>
                <th className="p-2">{t("status")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? (
                paginated.map((i) => (
                  <tr key={i.invoice_id} className="border-t hover:bg-gray-50">
                    <td className="p-2 text-center">{i.invoice_id}</td>
                    <td className="p-2">{i.project_id}</td>
                    <td className="p-2">{i.client_id}</td>
                    <td className="p-2">{renderTypeBadge(i.invoice_type)}</td>
                    <td className="p-2">{i.invoice_amount}</td>
                    <td className="p-2">{i.paid_amount}</td>
                    <td className="p-2">{i.invoice_due_date}</td>
                    <td className="p-2">{i.invoice_status}</td>

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
                          onClick={() => setDeleteData(i)}
                          className="bg-red-500 hover:bg-red-600 p-1.5 text-white rounded"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">
                    {t("no_records")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE ===== */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.length > 0 ? (
            paginated.map((i) => (
              <MobileCard
                key={i.invoice_id}
                id={i.invoice_id}
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
                      onClick={() => setDeleteData(i)}
                      className="bg-red-500 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                }
              >
                <CardRow label={t("project_id")} value={i.project_id} />
                <CardRow label={t("client_id")} value={i.client_id} />
                <CardRow label={t("type")} value={i.invoice_type} />
                <CardRow label={t("amount")} value={i.invoice_amount} />
                <CardRow label={t("paid")} value={i.paid_amount} />
                <CardRow label={t("due_date")} value={i.invoice_due_date} />
                <CardRow label={t("status")} value={i.invoice_status} />
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

      {/* ===== MODAL ===== */}
      <InvoicesModal
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
            <p className="text-gray-700">
              {t("delete_confirm")}
            </p>

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