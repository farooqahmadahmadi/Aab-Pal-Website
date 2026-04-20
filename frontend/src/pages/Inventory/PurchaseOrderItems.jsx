import React, { useEffect, useState } from "react";
import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import {
  getItems,
  addItem,
  updateItem,
  deleteItem,
} from "../../services/purchaseOrderItemsService";
import PurchaseOrderItemsModal from "../../components/Inventory/PurchaseOrderItemsModal";

import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";

import { useTranslation } from "react-i18next";
import API from "../../services/api";

export default function PurchaseOrderItems() {
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

  const [poStatuses, setPoStatuses] = useState({});

  // ===== FETCH =====
  const fetchData = async () => {
    try {
      const res = await getItems();
      setData(res.data || []);

      const poRes = await API.get("/purchase-orders");
      const statusMap = {};
      poRes.data.forEach((po) => {
        statusMap[po.po_id] = po.po_status;
      });
      setPoStatuses(statusMap);
    } catch {
      showToast(t("failed_fetch"), "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== SEARCH =====
  useEffect(() => {
    const f = data.filter(
      (i) =>
        i.po_item_id.toString().includes(search) ||
        i.po_id.toString().includes(search),
    );
    setFiltered(f);
    setPage(1);
  }, [search, data]);

  // ===== PAGINATION =====
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ===== SUBMIT =====
  const submit = async (formData) => {
    try {
      const poStatus = poStatuses[formData.po_id];
      if (poStatus !== "Pending") {
        showToast("Cannot add or edit items: PO is not Pending", "error");
        return;
      }

      if (editData) {
        await updateItem(editData.po_item_id, formData);
        showToast(t("updated_success"), "success");
      } else {
        await addItem(formData);
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
      const poStatus = poStatuses[deleteData.po_id];
      if (poStatus !== "Pending") {
        showToast("Cannot delete item: PO is not Pending", "error");
        setDeleteData(null);
        return;
      }

      await deleteItem(deleteData.po_item_id);
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
      {/* ===== TOP BAR ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t("po_items")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_po_item")}
          </button>
        </div>
      </div>

      {/* ===== TABLE / CARD ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ===== DESKTOP ===== */}
        <div className="hidden md:block">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("po")}</th>
                <th className="p-2">{t("material")}</th>
                <th className="p-2">{t("qty")}</th>
                <th className="p-2">{t("price")}</th>
                <th className="p-2">{t("total")}</th>
                <th className="p-2">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((i) => {
                  const pending = poStatuses[i.po_id] === "Pending";

                  return (
                    <tr
                      key={i.po_item_id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-2">{i.po_item_id}</td>
                      <td className="p-2">{i.po_id}</td>
                      <td className="p-2">{i.material_id}</td>
                      <td className="p-2">{i.po_item_quantity}</td>
                      <td className="p-2">{i.po_item_unit_price}</td>
                      <td className="p-2">{i.total_amount}</td>

                      <td className="p-2">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditData(i);
                              setModalOpen(true);
                            }}
                            disabled={!pending}
                            className={`p-1.5 rounded text-white ${pending ? "bg-yellow-500" : "bg-gray-400 cursor-not-allowed"}`}
                          >
                            <FiEdit3 />
                          </button>

                          <button
                            onClick={() => setDeleteData(i)}
                            disabled={!pending}
                            className={`p-1.5 rounded text-white ${pending ? "bg-red-500" : "bg-gray-400 cursor-not-allowed"}`}
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
                  <td colSpan="7" className="p-4 text-gray-500">
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
            paginated.map((i) => {
              const pending = poStatuses[i.po_id] === "Pending";

              return (
                <MobileCard
                  key={i.po_item_id}
                  id={i.po_item_id}
                  actions={
                    <>
                      <button
                        onClick={() => {
                          setEditData(i);
                          setModalOpen(true);
                        }}
                        disabled={!pending}
                        className={`p-2 text-white rounded ${pending ? "bg-yellow-500" : "bg-gray-400"}`}
                      >
                        <FiEdit3 />
                      </button>

                      <button
                        onClick={() => setDeleteData(i)}
                        disabled={!pending}
                        className={`p-2 text-white rounded ${pending ? "bg-red-500" : "bg-gray-400"}`}
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  }
                >
                  <CardRow label={t("po")} value={i.po_id} />
                  <CardRow label={t("material")} value={i.material_id} />
                  <CardRow label={t("qty")} value={i.po_item_quantity} />
                  <CardRow label={t("price")} value={i.po_item_unit_price} />
                  <CardRow label={t("total")} value={i.total_amount} />
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
      <PurchaseOrderItemsModal
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
            <p>
              {t("delete_confirm")} #{deleteData.po_item_id}?
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
