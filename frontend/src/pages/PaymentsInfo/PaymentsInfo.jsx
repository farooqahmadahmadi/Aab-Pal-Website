import React, { useEffect, useState } from "react";
import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import PaymentsInfoModal from "../../components/PaymentsInfo/PaymentsInfoModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";
import { useTranslation } from "react-i18next";

import {
  getPayments,
  addPayment,
  updatePayment,
  deletePayment,
} from "../../services/paymentsInfoService";
import API from "../../services/api";

export default function PaymentsInfo() {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const [invoiceStatusMap, setInvoiceStatusMap] = useState({});

  const { toast, showToast, hideToast } = useToast();

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await getPayments();
      setData(res.data || []);

      const invRes = await API.get("/invoices");
      const map = {};
      (invRes.data || []).forEach((inv) => {
        map[inv.invoice_id] = inv.invoice_status;
      });
      setInvoiceStatusMap(map);
    } catch {
      showToast(t("failed_fetch"), "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const q = search.toLowerCase();

    const f = data.filter(
      (i) =>
        i.payment_id.toString().includes(q) ||
        i.invoice_id.toString().includes(q) ||
        i.payment_method?.toLowerCase().includes(q),
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  // ================= PAGINATION =================
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ================= RULE =================
  const isEditable = (invoiceId) => {
    const status = invoiceStatusMap[invoiceId];
    return status === "Pending" || status === "Partial";
  };

  // ================= SUBMIT =================
  const submit = async (form) => {
    try {
      if (editData) {
        await updatePayment(editData.payment_id, form);
        showToast(t("updated_success"), "success");
      } else {
        await addPayment(form);
        showToast(t("added_success"), "success");
      }
      setModalOpen(false);
      setEditData(null);
      fetchData();
    } catch {
      showToast(t("operation_failed"), "error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      await deletePayment(deleteData.payment_id);
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
      {/* ================= TOP BAR ================= */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t("payments")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_payment")}
          </button>
        </div>
      </div>

      {/* ================= TABLE (DESKTOP) ================= */}
      <div className="bg-white shadow rounded-lg overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">{t("id")}</th>
              <th className="p-2">{t("invoice")}</th>
              <th className="p-2">{t("amount")}</th>
              <th className="p-2">{t("date")}</th>
              <th className="p-2">{t("payment_method")}</th>
              <th className="p-2">{t("status")}</th>
              <th className="p-2 text-center">{t("actions")}</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length > 0 ? (
              paginated.map((i) => (
                <tr key={i.payment_id} className="border-t hover:bg-gray-50">
                  <td className="p-2 text-center">{i.payment_id}</td>
                  <td className="p-2">{i.invoice_id}</td>
                  <td className="p-2">{i.payment_amount}</td>
                  <td className="p-2">{i.payment_date}</td>
                  <td className="p-2">{i.payment_method}</td>
                  <td className="p-2">{i.payment_status}</td>

                  <td className="p-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditData(i);
                          setModalOpen(true);
                        }}
                        disabled={!isEditable(i.invoice_id)}
                        className={`p-1.5 rounded text-white ${
                          isEditable(i.invoice_id)
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <FiEdit3 />
                      </button>

                      <button
                        onClick={() => setDeleteData(i)}
                        disabled={!isEditable(i.invoice_id)}
                        className={`p-1.5 rounded text-white ${
                          isEditable(i.invoice_id)
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  {t("no_records")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD ================= */}
      <div className="md:hidden space-y-3">
        {paginated.length > 0 ? (
          paginated.map((i) => (
            <MobileCard
              key={i.payment_id}
              id={i.payment_id}
              actions={
                <>
                  <button
                    onClick={() => {
                      setEditData(i);
                      setModalOpen(true);
                    }}
                    disabled={!isEditable(i.invoice_id)}
                    className="bg-yellow-500 p-2 rounded text-white"
                  >
                    <FiEdit3 />
                  </button>

                  <button
                    onClick={() => setDeleteData(i)}
                    disabled={!isEditable(i.invoice_id)}
                    className="bg-red-500 p-2 rounded text-white"
                  >
                    <FiTrash2 />
                  </button>
                </>
              }
            >
              <CardRow label={t("invoice")} value={i.invoice_id} />
              <CardRow label={t("amount")} value={i.payment_amount} />
              <CardRow label={t("date")} value={i.payment_date} />
              <CardRow label={t("payment_method")} value={i.payment_method} />
              <CardRow label={t("status")} value={i.payment_status} />
            </MobileCard>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            {t("no_records")}
          </div>
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="mt-4 flex justify-center">
        <Pagination
          page={page}
          total={filtered.length}
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      {/* ================= MODAL ================= */}
      <PaymentsInfoModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={submit}
        initialData={editData}
      />

      {/* ================= DELETE ================= */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
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

      {/* ================= TOAST ================= */}
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
