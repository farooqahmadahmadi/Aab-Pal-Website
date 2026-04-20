import React, { useEffect, useState } from "react";
import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import EquipmentUsageModal from "../../components/Equipments/EquipmentUsageModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";

import { useTranslation } from "react-i18next";

import {
  getEquipmentUsage,
  addEquipmentUsage,
  updateEquipmentUsage,
  deleteEquipmentUsage,
} from "../../services/equipmentUsageService";

export default function EquipmentUsage() {
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
      const res = await getEquipmentUsage();
      setData(res.data || []);
    } catch {
      showToast(t("failed_fetch"), "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const f = data.filter(
      (i) =>
        i.equipment_id.toString().includes(search) ||
        i.employee_id.toString().includes(search) ||
        (i.project_id || "").toString().includes(search),
    );
    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const submit = async (form) => {
    try {
      if (editData) {
        await updateEquipmentUsage(editData.equipment_usage_id, form);
        showToast(t("updated_success"), "success");
      } else {
        await addEquipmentUsage(form);
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
      await deleteEquipmentUsage(deleteData.equipment_usage_id);
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
        <h2 className="text-xl sm:text-2xl font-bold">
          {t("equipment_usage")}
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
            <FiPlusCircle /> {t("add")}
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
                <th className="p-2">{t("equipment")}</th>
                <th className="p-2">{t("employee")}</th>
                <th className="p-2">{t("project")}</th>
                <th className="p-2 text-left">{t("description")}</th>
                <th className="p-2">{t("start")}</th>
                <th className="p-2">{t("end")}</th>
                <th className="p-2">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((i) => (
                  <tr
                    key={i.equipment_usage_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-2">{i.equipment_usage_id}</td>
                    <td className="p-2">{i.equipment_id}</td>
                    <td className="p-2">{i.employee_id}</td>
                    <td className="p-2">{i.project_id}</td>
                    <td className="p-2 text-left">{i.usage_description}</td>
                    <td className="p-2">{i.usage_start_date}</td>
                    <td className="p-2">{i.usage_end_date}</td>

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
                  <td colSpan="8" className="p-4 text-gray-500">
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
                key={i.equipment_usage_id}
                id={i.equipment_usage_id}
                actions={
                  <>
                    <button
                      onClick={() => {
                        setEditData(i);
                        setModalOpen(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 p-2 text-white rounded"
                    >
                      <FiEdit3 />
                    </button>

                    <button
                      onClick={() => setDeleteData(i)}
                      className="bg-red-500 hover:bg-red-600 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                }
              >
                <CardRow label={t("equipment")} value={i.equipment_id} />
                <CardRow label={t("employee")} value={i.employee_id} />
                <CardRow label={t("project")} value={i.project_id} />
                <CardRow label={t("description")} value={i.usage_description} />
                <CardRow label={t("start")} value={i.usage_start_date} />
                <CardRow label={t("end")} value={i.usage_end_date} />
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
      <EquipmentUsageModal
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
              {t("delete_confirm")}{" "}
              <strong>{deleteData.equipment_id || "record"}</strong>?
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
