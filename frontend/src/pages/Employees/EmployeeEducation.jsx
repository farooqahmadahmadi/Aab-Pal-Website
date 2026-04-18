import React, { useEffect, useState } from "react";
import {
  getEmployeeEducation,
  createEmployeeEducation,
  updateEmployeeEducation,
  deleteEmployeeEducation,
} from "../../services/employeeEducationService";

import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import EmployeeEducationModal from "../../components/Employees/EmployeeEducationModal";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import { FiEdit3, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function EmployeeEducation() {
  const { t } = useTranslation();

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
      const res = await getEmployeeEducation();
      setRecords(res.data || []);
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

    const filteredData = records.filter((r) => {
      const name = r.EmployeeInfo?.emp_full_name || "";
      const degree = r.educational_degree || "";
      const institution = r.educational_institution || "";

      return (
        name.toLowerCase().includes(q) ||
        degree.toLowerCase().includes(q) ||
        institution.toLowerCase().includes(q)
      );
    });

    setFiltered(filteredData);
    setPage(1);
  }, [search, records]);

  // ===== PAGINATION =====
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ===== SUBMIT =====
  const handleSubmit = async (form) => {
    try {
      if (editData) {
        await updateEmployeeEducation(editData.eei_id, form);
        showToast(t("updated_success"), "success");
      } else {
        await createEmployeeEducation(form);
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
  const confirmDelete = async () => {
    try {
      await deleteEmployeeEducation(deleteData.eei_id);
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
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold">{t("employee_education")}</h2>

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

      {/* ===== TABLE / CARD VIEW ===== */}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-center">{t("edu_id")}</th>
              <th className="p-2">{t("emp_id")}</th>
              <th className="p-2">{t("emp_name")}</th>
              <th className="p-2">{t("degree")}</th>
              <th className="p-2">{t("institution")}</th>
              <th className="p-2">{t("field")}</th>
              <th className="p-2">{t("graduation")}</th>
              <th className="p-2">{t("description")}</th>
              <th className="p-2 text-center">{t("actions")}</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length > 0 ? (
              paginated.map((r) => (
                <tr key={r.eei_id} className="border-t hover:bg-gray-50">
                  <td className="p-2 text-center">{r.eei_id}</td>
                  <td className="p-2">{r.employee_id}</td>
                  <td className="p-2">
                    {r.EmployeeInfo?.emp_full_name || "-"}
                  </td>
                  <td className="p-2">{r.educational_degree}</td>
                  <td className="p-2">{r.educational_institution}</td>
                  <td className="p-2">{r.educational_field}</td>
                  <td className="p-2">{r.graduation_date || "-"}</td>
                  <td className="p-2">{r.description}</td>

                  <td className="p-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditData(r);
                          setModalOpen(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 p-2 text-white rounded"
                      >
                        <FiEdit3 />
                      </button>

                      <button
                        onClick={() => setDeleteData(r)}
                        className="bg-red-500 hover:bg-red-600 p-2 text-white rounded"
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginated.length > 0 ? (
          paginated.map((r) => (
            <div
              key={r.eei_id}
              className="bg-white shadow rounded-xl p-3 border space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{t("edu_id")}</span>
                <span>{r.eei_id}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold">{t("emp_id")}</span>
                <span>{r.employee_id}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold">{t("emp_name")}</span>
                <span>{r.EmployeeInfo?.emp_full_name || "-"}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold">{t("degree")}</span>
                <span>{r.educational_degree}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold">{t("institution")}</span>
                <span>{r.educational_institution}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold">{t("field")}</span>
                <span>{r.educational_field}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold">{t("graduation")}</span>
                <span>{r.graduation_date || "-"}</span>
              </div>

              <div className="text-sm">
                <span className="font-semibold">{t("description")}:</span>
                <p className="text-gray-600 mt-1 break-words">
                  {r.description || "-"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t">
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
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            {t("no_records")}
          </div>
        )}
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
      <EmployeeEducationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editData}
      />

      {/* ===== DELETE MODAL ===== */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <p className="text-gray-700">
              {t("delete_confirm")} <b>{deleteData.educational_degree}</b>?
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
