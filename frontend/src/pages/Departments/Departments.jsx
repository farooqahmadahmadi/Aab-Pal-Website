import React, { useEffect, useState } from "react";
import DepartmentService from "../../services/departmentService";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import DepartmentModal from "../../components/Departments/DepartmentModal";
import { FiEdit3, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function Departments() {
  const { t } = useTranslation();

  const [departments, setDepartments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  // ===== FETCH =====
  const fetchDepartments = async () => {
    try {
      const res = await DepartmentService.getAll();
      setDepartments(res.data);
    } catch {
      showToast(t("failed_load_departments"), "error");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ===== SEARCH =====
  useEffect(() => {
    const f = departments.filter(
      (d) =>
        d.department_id?.toString().includes(search) ||
        d.department_name.toLowerCase().includes(search.toLowerCase()),
    );

    setFiltered(f);
    setPage(1);
  }, [search, departments]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ===== ADD / EDIT =====
  const handleSubmit = async (form) => {
    try {
      if (editData) {
        await DepartmentService.update(editData.department_id, form);
        showToast(t("updated_success"), "success");
      } else {
        await DepartmentService.create(form);
        showToast(t("added_success"), "success");
      }

      setModalOpen(false);
      setEditData(null);
      fetchDepartments();
    } catch {
      showToast(t("operation_failed"), "error");
    }
  };

  // ===== DELETE =====
  const confirmDelete = async () => {
    try {
      await DepartmentService.delete(deleteData.department_id);
      showToast(t("deleted_success"), "success");
      fetchDepartments();
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t("departments")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle />
            {t("add_department")}
          </button>
        </div>
      </div>

      {/* WRAPPER */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead className="bg-gray-200 text-sm">
              <tr>
                <th className="p-2 text-center">{t("id")}</th>
                <th className="p-2 text-left">{t("name")}</th>
                <th className="p-2 text-left">{t("description")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? (
                paginated.map((d) => (
                  <tr
                    key={d.department_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-2 text-center">{d.department_id}</td>
                    <td className="p-2">{d.department_name}</td>
                    <td className="p-2">{d.department_description}</td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditData(d);
                            setModalOpen(true);
                          }}
                          className="bg-yellow-500 p-2 text-white rounded-lg"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteData(d)}
                          className="bg-red-500 p-2 text-white rounded-lg"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    {t("no_departments")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="sm:hidden p-3 space-y-3">
          {paginated.length > 0 ? (
            paginated.map((d) => (
              <div
                key={d.department_id}
                className="border rounded-lg p-3 shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">
                    #{d.department_id}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditData(d);
                        setModalOpen(true);
                      }}
                      className="bg-yellow-500 p-2 text-white rounded"
                    >
                      <FiEdit3 />
                    </button>

                    <button
                      onClick={() => setDeleteData(d)}
                      className="bg-red-500 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="text-sm font-semibold">{d.department_name}</div>

                <div className="text-xs text-gray-600 mt-1">
                  {d.department_description}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              {t("no_departments")}
            </div>
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex justify-center">
        <Pagination
          page={page}
          total={filtered.length}
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      {/* DELETE MODAL */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded w-full max-w-sm">
            <p className="mb-4 text-gray-700">
              {t("delete_confirm")}{" "}
              <strong>{deleteData.department_name}</strong>?
            </p>

            <div className="flex justify-end gap-2">
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

      {/* MODAL */}
      <DepartmentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editData}
      />

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          position="center"
        />
      )}
    </div>
  );
}
