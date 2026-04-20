import React, { useEffect, useState } from "react";
import {
  getSalaries,
  createSalary,
  updateSalary,
  deleteSalary,
} from "../../services/employeeSalaryService";

import EmployeeSalaryModal from "../../components/Employees/EmployeeSalaryModal";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";

import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";


import { FiEdit3, FiPlusCircle, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";

import { useTranslation } from "react-i18next";

export default function EmployeeSalary() {
  const { t } = useTranslation(); // ✅ مهم

  const [records, setRecords] = useState([]);
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
      const res = await getSalaries();
      setRecords(res || []);
    } catch (err) {
      console.error(err);
      showToast(t("failed_fetch"), "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== SEARCH =====
  useEffect(() => {
    const q = search.toLowerCase();

    const data = records.filter((r) => {
      const name = r.EmployeeInfo?.emp_full_name || "";
      return name.toLowerCase().includes(q);
    });

    setFiltered(data);
    setPage(1);
  }, [search, records]);

  // ===== PAGINATION =====
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ===== SUBMIT =====
  const handleSubmit = async (form) => {
    try {
      if (editData) {
        await updateSalary(editData.employee_salary_id, form);
        showToast(t("updated_success"), "success");
      } else {
        await createSalary(form);
        showToast(t("added_success"), "success");
      }

      setModalOpen(false);
      setEditData(null);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast(t("operation_failed"), "error");
    }
  };

  // ===== DELETE =====
  const confirmDelete = async () => {
    try {
      await deleteSalary(deleteData.employee_salary_id);
      showToast(t("deleted_success"), "success");
      fetchData();
    } catch (err) {
      console.error(err);
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
          {t("employee_salary")}
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
            <FiPlusCircle /> {t("add_salary")}
          </button>
        </div>
      </div>

      {/* ===== TABLE / CARD ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ===== DESKTOP ===== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("emp_id")}</th>
                <th className="p-2">{t("emp_name")}</th>
                <th className="p-2">{t("base_salary")}</th>
                <th className="p-2">{t("allowance")}</th>
                <th className="p-2">{t("from")}</th>
                <th className="p-2">{t("to")}</th>
                <th className="p-2">{t("status")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? (
                paginated.map((r) => (
                  <tr
                    key={r.employee_salary_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-2">{r.employee_salary_id}</td>
                    <td className="p-2">{r.employee_id}</td>
                    <td className="p-2">
                      {r.EmployeeInfo?.emp_full_name || "-"}
                    </td>
                    <td className="p-2">{r.base_salary}</td>
                    <td className="p-2">{r.allowance}</td>
                    <td className="p-2">{r.effective_from}</td>
                    <td className="p-2">{r.effective_to}</td>

                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          r.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {r.is_active ? t("active") : t("inactive")}
                      </span>
                    </td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditData(r);
                            setModalOpen(true);
                          }}
                          className="bg-yellow-500 p-2 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteData(r)}
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
                  <td colSpan="9" className="text-center p-4 text-gray-500">
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
            paginated.map((r) => (
              <MobileCard
                key={r.employee_salary_id}
                id={r.employee_salary_id}
                actions={
                  <>
                    <button
                      onClick={() => {
                        setEditData(r);
                        setModalOpen(true);
                      }}
                      className="bg-yellow-500 p-2 text-white rounded"
                    >
                      <FiEdit3 />
                    </button>

                    <button
                      onClick={() => setDeleteData(r)}
                      className="bg-red-500 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                }
              >
                <CardRow label={t("emp_id")} value={r.employee_id} />
                <CardRow
                  label={t("emp_name")}
                  value={r.EmployeeInfo?.emp_full_name}
                />
                <CardRow label={t("base_salary")} value={r.base_salary} />
                <CardRow label={t("allowance")} value={r.allowance} />
                <CardRow label={t("from")} value={r.effective_from} />
                <CardRow label={t("to")} value={r.effective_to} />

                <CardRow
                  label={t("status")}
                  value={r.is_active ? t("active") : t("inactive")}
                />
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
      <EmployeeSalaryModal
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
            <p>
              {t("delete_confirm")}{" "}
              <strong>{deleteData.EmployeeInfo?.emp_full_name}</strong>؟
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteData(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                {t("cancel")}
              </button>

              <button
                onClick={confirmDelete}
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
