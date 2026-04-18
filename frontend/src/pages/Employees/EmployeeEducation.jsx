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
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          {t("employee_education")}
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

      {/* ===== TABLE / CARD VIEW ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
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
                paginated.map((e) => (
                  <tr key={e.employee_id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{e.employee_id}</td>
                    <td className="p-2">{e.emp_full_name}</td>
                    <td className="p-2">{e.emp_father_name}</td>
                    <td className="p-2">{e.emp_nid_number}</td>
                    <td className="p-2">{e.emp_gender}</td>
                    <td className="p-2">{e.emp_phone}</td>
                    <td className="p-2">{e.emp_email}</td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditData(e);
                            setModalOpen(true);
                          }}
                          className="bg-yellow-500 p-1 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteData(e)}
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
          {paginated.length > 0 ? (
            paginated.map((r) => (
              <MobileCard
                key={r.eei_id}
                id={r.eei_id}
                actions={
                  <>
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
                  </>
                }
              >
                <CardRow label={t("emp_id")} value={r.employee_id} />
                <CardRow
                  label={t("emp_name")}
                  value={r.EmployeeInfo?.emp_full_name}
                />
                <CardRow label={t("degree")} value={r.educational_degree} />
                <CardRow
                  label={t("institution")}
                  value={r.educational_institution}
                />
                <CardRow label={t("field")} value={r.educational_field} />
                <CardRow label={t("graduation")} value={r.graduation_date} />

                {/* Description full width */}
                <div className="text-sm mt-2">
                  <span className="font-semibold">{t("description")}:</span>
                  <p className="text-gray-600 mt-1 break-words">
                    {r.description || "-"}
                  </p>
                </div>
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
