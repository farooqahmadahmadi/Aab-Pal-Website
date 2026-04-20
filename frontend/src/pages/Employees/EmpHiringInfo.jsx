import React, { useState, useEffect } from "react";
import EmpHiringModal from "../../components/Employees/EmpHiringModal";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";

import { FiEdit3, FiPlusCircle, FiTrash2 } from "react-icons/fi";

import { useTranslation } from "react-i18next";

import {
  getEmpHiringInfo,
  addEmpHiring,
  updateEmpHiring,
  deleteEmpHiring,
} from "../../services/empHiringInfoService";

export default function EmpHiringInfoPage() {
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
      const res = await getEmpHiringInfo();
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

    const filteredData = data.filter((item) => {
      return (
        item.hiring_id?.toString().includes(q) ||
        item.employee_id?.toString().includes(q) ||
        item.department_id?.toString().includes(q) ||
        item.attendance_shift_id?.toString().includes(q) ||
        item.employment_type?.toLowerCase().includes(q) ||
        item.current_status?.toLowerCase().includes(q) ||
        item.position?.toLowerCase().includes(q)
      );
    });

    setFiltered(filteredData);
    setPage(1);
  }, [search, data]);

  // ===== PAGINATION =====
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ===== SUBMIT =====
  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await updateEmpHiring(editData.hiring_id, formData);
        showToast(t("updated_success"), "success");
      } else {
        await addEmpHiring(formData);
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
      await deleteEmpHiring(deleteData.hiring_id);
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
        <h2 className="text-xl sm:text-2xl font-bold">
          {t("employee_hiring")}
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
                <th className="p-2">{t("emp_id")}</th>
                <th className="p-2">{t("department_id")}</th>
                <th className="p-2">{t("shift_id")}</th>
                <th className="p-2">{t("position")}</th>
                <th className="p-2">{t("type")}</th>
                <th className="p-2">{t("hire_date")}</th>
                <th className="p-2">{t("end_date")}</th>
                <th className="p-2">{t("status")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? (
                paginated.map((item) => (
                  <tr
                    key={item.hiring_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-2">{item.hiring_id}</td>
                    <td className="p-2">{item.employee_id}</td>
                    <td className="p-2">{item.department_id}</td>
                    <td className="p-2">{item.attendance_shift_id}</td>
                    <td className="p-2">{item.position}</td>
                    <td className="p-2">{item.employment_type}</td>
                    <td className="p-2">{item.hire_date}</td>
                    <td className="p-2">{item.end_date}</td>
                    <td className="p-2">{item.current_status}</td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditData(item);
                            setModalOpen(true);
                          }}
                          className="bg-yellow-500 p-2 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteData(item)}
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
                  <td colSpan="10" className="text-center p-4 text-gray-500">
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
            paginated.map((item) => (
              <MobileCard
                key={item.hiring_id}
                id={item.hiring_id}
                actions={
                  <>
                    <button
                      onClick={() => {
                        setEditData(item);
                        setModalOpen(true);
                      }}
                      className="bg-yellow-500 p-2 text-white rounded"
                    >
                      <FiEdit3 />
                    </button>

                    <button
                      onClick={() => setDeleteData(item)}
                      className="bg-red-500 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                }
              >
                <CardRow label={t("emp_id")} value={item.employee_id} />
                <CardRow
                  label={t("department_id")}
                  value={item.department_id}
                />
                <CardRow
                  label={t("shift_id")}
                  value={item.attendance_shift_id}
                />
                <CardRow label={t("position")} value={item.position} />
                <CardRow label={t("type")} value={item.employment_type} />
                <CardRow label={t("hire_date")} value={item.hire_date} />
                <CardRow label={t("end_date")} value={item.end_date} />
                <CardRow label={t("status")} value={item.current_status} />
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
      <EmpHiringModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editData}
      />

      {/* ===== DELETE ===== */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <p className="text-gray-700">
              {t("delete_confirm")} <b>{deleteData.position || "record"}</b>?
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
