import React, { useEffect, useState } from "react";
import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../services/suppliersService";
import SuppliersModal from "../../components/Inventory/SuppliersModal";

import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";

import { useTranslation } from "react-i18next";

export default function Suppliers() {
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

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await getSuppliers();
      setData(res.data || []);
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
        i.supplier_id.toString().includes(q) ||
        i.supplier_name?.toLowerCase().includes(q) ||
        i.supplier_phone?.toLowerCase().includes(q) ||
        i.supplier_email?.toLowerCase().includes(q) ||
        i.supplier_status?.toLowerCase().includes(q) ||
        i.supplier_address?.toLowerCase().includes(q),
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  // ================= PAGINATION =================
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ================= SUBMIT =================
  const submit = async (formData) => {
    try {
      if (editData) {
        await updateSupplier(editData.supplier_id, formData);
        showToast(t("updated_success"), "success");
      } else {
        await addSupplier(formData);
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
      await deleteSupplier(deleteData.supplier_id);
      showToast(t("deleted_success"), "success");
      fetchData();
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  const renderStatus = (status) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        status === "Active"
          ? "bg-green-100 text-green-600"
          : "bg-gray-200 text-gray-600"
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* ================= TOP BAR ================= */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t("suppliers")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_supplier")}
          </button>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="bg-white shadow rounded-lg overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">{t("id")}</th>
              <th className="p-2 text-left">{t("name")}</th>
              <th className="p-2">{t("phone")}</th>
              <th className="p-2 text-left">{t("email")}</th>
              <th className="p-2 text-left">{t("address")}</th>
              <th className="p-2">{t("status")}</th>
              <th className="p-2 text-center">{t("actions")}</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length > 0 ? (
              paginated.map((i) => (
                <tr key={i.supplier_id} className="border-t hover:bg-gray-50">
                  <td className="p-2 text-center">{i.supplier_id}</td>
                  <td className="p-2">{i.supplier_name}</td>
                  <td className="p-2">{i.supplier_phone}</td>
                  <td className="p-2">
                    <a
                      href={`mailto:${i.supplier_email}`}
                      className="text-blue-500"
                    >
                      {i.supplier_email}
                    </a>
                  </td>
                  <td className="p-2">{i.supplier_address}</td>
                  <td className="p-2">{renderStatus(i.supplier_status)}</td>

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
              key={i.supplier_id}
              id={i.supplier_id}
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
              <CardRow label={t("name")} value={i.supplier_name} />
              <CardRow label={t("phone")} value={i.supplier_phone} />
              <CardRow label={t("email")} value={i.supplier_email} />
              <CardRow label={t("address")} value={i.supplier_address} />
              <CardRow label={t("status")} value={i.supplier_status} />
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
      <SuppliersModal
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
            <p>
              {t("delete_confirm")} <strong>{deleteData.supplier_name}</strong>?
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
