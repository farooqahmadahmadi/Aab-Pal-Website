import React, { useEffect, useState } from "react";
import EmployeeService from "../../services/employeeService";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import EmployeeModal from "../../components/Employees/EmployeeModal";
import { FiEdit3, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function Employees() {
  const { t } = useTranslation();

  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  // ===== FETCH =====
  const fetchEmployees = async () => {
    try {
      const res = await EmployeeService.getAll();
      setEmployees(res.data);
    } catch {
      showToast(t("load_failed"), "error");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ===== FILTER =====
  useEffect(() => {
    const f = employees.filter(
      (e) =>
        e.employee_id?.toString().includes(search) ||
        e.emp_phone?.toString().includes(search) ||
        e.emp_nid_number?.toLowerCase().includes(search.toLowerCase()) ||
        e.emp_gender?.toLowerCase().includes(search.toLowerCase()) ||
        e.emp_email?.toLowerCase().includes(search.toLowerCase()) ||
        e.emp_full_name?.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(f);
    setPage(1);
  }, [search, employees]);

  // ===== PAGINATION =====
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ===== SUBMIT =====
  const handleSubmit = async (form) => {
    try {
      if (editData) {
        await EmployeeService.update(editData.employee_id, form);
        showToast(t("updated_success"), "success");
      } else {
        await EmployeeService.create(form);
        showToast(t("added_success"), "success");
      }
      setModalOpen(false);
      setEditData(null);
      fetchEmployees();
    } catch {
      showToast(t("operation_failed"), "error");
    }
  };

  // ===== DELETE =====
  const confirmDelete = async () => {
    try {
      await EmployeeService.delete(deleteData.employee_id);
      showToast(t("deleted_success"), "success");
      fetchEmployees();
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
        <h2 className="text-xl sm:text-2xl font-bold">{t("employees")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_employee")}
          </button>
        </div>
      </div>

      {/* ===== TABLE / MOBILE VIEW ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("full_name")}</th>
                <th className="p-2">{t("father_name")}</th>
                <th className="p-2">{t("nid")}</th>
                <th className="p-2">{t("gender")}</th>
                <th className="p-2">{t("phone")}</th>
                <th className="p-2">{t("email")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((e) => (
                <tr key={e.employee_id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{e.employee_id}</td>
                  <td className="p-2">{e.emp_full_name}</td>
                  <td className="p-2">{e.emp_father_name}</td>
                  <td className="p-2">{e.emp_nid_number}</td>
                  <td className="p-2">{e.emp_gender}</td>
                  <td className="p-2">{e.emp_phone}</td>
                  <td className="p-2">{e.emp_email}</td>

                  <td className="p-2 flex justify-center gap-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE CARDS ===== */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.length > 0 ? (
            paginated.map((e) => (
              <div
                key={e.employee_id}
                className="border rounded-lg p-3 shadow-sm bg-gray-50"
              >
                <p>
                  <strong>{t("id")}:</strong> {e.employee_id}
                </p>
                <p>
                  <strong>{t("full_name")}:</strong> {e.emp_full_name}
                </p>
                <p>
                  <strong>{t("father_name")}:</strong> {e.emp_father_name}
                </p>
                <p>
                  <strong>{t("nid")}:</strong> {e.emp_nid_number}
                </p>
                <p>
                  <strong>{t("gender")}:</strong> {e.emp_gender}
                </p>
                <p>
                  <strong>{t("phone")}:</strong> {e.emp_phone}
                </p>
                <p>
                  <strong>{t("email")}:</strong> {e.emp_email}
                </p>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setEditData(e);
                      setModalOpen(true);
                    }}
                    className="bg-yellow-500 p-2 text-white rounded"
                  >
                    <FiEdit3 />
                  </button>

                  <button
                    onClick={() => setDeleteData(e)}
                    className="bg-red-500 p-2 text-white rounded"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">{t("no_employees")}</p>
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

      {/* ===== DELETE MODAL ===== */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-2">
          <div className="bg-white p-5 rounded-xl w-full max-w-sm">
            <p className="mb-4 text-gray-700 text-sm sm:text-base">
              {t("delete_confirm")} <strong>{deleteData.emp_full_name}</strong>؟
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setDeleteData(null)}
                className="bg-gray-300 px-4 py-2 rounded w-full sm:w-auto"
              >
                {t("cancel")}
              </button>

              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL ===== */}
      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editData}
      />

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
