import React, { useEffect, useState } from "react";
import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";
import {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} from "../../services/purchaseOrdersService";
import PurchaseOrdersModal from "../../components/Inventory/PurchaseOrdersModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";
import { useTranslation } from "react-i18next";

export default function PurchaseOrders() {
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

  const fetchData = async () => {
    try {
      const res = await getOrders();
      setData(res.data || []);
    } catch {
      showToast(t("failed_fetch"), "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();

    const f = data.filter(
      (i) =>
        i.po_id.toString().includes(q) ||
        i.po_status?.toLowerCase().includes(q),
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const submit = async (formData) => {
    try {
      if (editData) {
        await updateOrder(editData.po_id, formData);
        showToast(t("updated_success"), "success");
      } else {
        await addOrder(formData);
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
      await deleteOrder(deleteData.po_id);
      showToast(t("deleted_success"), "success");
      fetchData();
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  const renderType = (type) => (
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
      {/* ===== TOP ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          {t("purchase_orders")}
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
            <FiPlusCircle /> {t("add_purchase_order")}
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
                <th className="p-2">{t("supplier")}</th>
                <th className="p-2">{t("project")}</th>
                <th className="p-2">{t("type")}</th>
                <th className="p-2">{t("date")}</th>
                <th className="p-2">{t("total")}</th>
                <th className="p-2">{t("status")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((i) => (
                  <tr key={i.po_id} className="border-t hover:bg-gray-50">
                    <td className="p-2 text-center">{i.po_id}</td>
                    <td className="p-2">{i.supplier_id}</td>
                    <td className="p-2">{i.project_id}</td>
                    <td className="p-2">{renderType(i.po_type)}</td>
                    <td className="p-2">{i.order_date}</td>
                    <td className="p-2">{i.total_amount}</td>
                    <td className="p-2">{i.po_status}</td>

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
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    {t("no_records")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE ===== */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.length ? (
            paginated.map((i) => (
              <MobileCard
                key={i.po_id}
                id={i.po_id}
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
                <CardRow label={t("supplier")} value={i.supplier_id} />
                <CardRow label={t("project")} value={i.project_id} />
                <CardRow label={t("type")} value={i.po_type} />
                <CardRow label={t("date")} value={i.order_date} />
                <CardRow label={t("total")} value={i.total_amount} />
                <CardRow label={t("status")} value={i.po_status} />
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
      <PurchaseOrdersModal
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
              {t("delete_confirm")} #{deleteData.po_id}?
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
