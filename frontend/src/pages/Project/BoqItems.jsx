import React, { useEffect, useState } from "react";
import {
  getItems,
  addItem,
  updateItem,
  deleteItem,
} from "../../services/boqItemsService";

import BoqItemModal from "../../components/Project/BoqItemModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";

import { FiEdit3, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function BoqItems() {
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
      const res = await getItems();
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
        i.boq_id.toString().includes(q) ||
        i.project_id.toString().includes(q) ||
        i.unit?.toLowerCase().includes(q) ||
        i.item_name?.toLowerCase().includes(q),
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
      if (editData) {
        await updateItem(editData.boq_id, formData);
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
      await deleteItem(deleteData.boq_id);
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
        <h2 className="text-xl sm:text-2xl font-bold">{t("boq_items")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_boq")}
          </button>
        </div>
      </div>

      {/* ===== TABLE + CARD ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-center">{t("id")}</th>
                <th className="p-2">{t("project_id")}</th>
                <th className="p-2">{t("name")}</th>
                <th className="p-2">{t("unit")}</th>
                <th className="p-2">{t("quantity")}</th>
                <th className="p-2">{t("price")}</th>
                <th className="p-2">{t("total")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((i) => (
                  <tr key={i.boq_id} className="border-t hover:bg-gray-50">
                    <td className="p-2 text-center">{i.boq_id}</td>
                    <td className="p-2">{i.project_id}</td>
                    <td className="p-2">{i.item_name}</td>
                    <td className="p-2">{i.unit}</td>
                    <td className="p-2">{i.item_quantity}</td>
                    <td className="p-2">{i.unit_price}</td>
                    <td className="p-2 font-semibold">{i.total_amount}</td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditData(i);
                            setModalOpen(true);
                          }}
                          className="bg-yellow-500 p-1 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteData(i)}
                          className="bg-red-500 p-1 text-white rounded"
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
          {paginated.length ? (
            paginated.map((i) => (
              <MobileCard
                key={i.boq_id}
                id={i.boq_id}
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
                <CardRow label={t("name")} value={i.item_name} />
                <CardRow label={t("unit")} value={i.unit} />
                <CardRow label={t("quantity")} value={i.item_quantity} />
                <CardRow label={t("price")} value={i.unit_price} />
                <CardRow label={t("total")} value={i.total_amount} />
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
      <BoqItemModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={submit}
        initialData={editData}
      />

      {/* ===== DELETE CONFIRM ===== */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <p>
              {t("delete_confirm")} <b>{deleteData.item_name}</b>?
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
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
