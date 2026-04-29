import React, { useEffect, useState } from "react";
import {
  getAttendance,
  deleteAttendance,
} from "../../services/employeeAttendanceService";

import EmployeeAttendanceModal from "../../components/Employees/EmployeeAttendanceModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";

import { FiEdit3, FiPlusCircle, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";

import { useTranslation } from "react-i18next";

export default function EmployeeAttendanceList() {
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
      const res = await getAttendance();
      setRecords(res.data || []);
    } catch {
      showToast(t("failed_load_attendance"), "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== SEARCH =====
  useEffect(() => {
    const q = search.toLowerCase();

    const data = records.filter((r) => {
      return (
        r.employee_id?.toString().includes(q) ||
        r.emp_attendance_id?.toString().includes(q) ||
        r.attendance_status?.toLowerCase().includes(q) ||
        r.attendance_date?.includes(q)
      );
    });

    setFiltered(data);
    setPage(1);
  }, [search, records]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ===== DELETE =====
  const handleDelete = async () => {
    try {
      await deleteAttendance(deleteData.emp_attendance_id);
      showToast(t("deleted_success"), "success");
      fetchData();
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  // ===== STATUS BADGE =====
  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-xs font-semibold";

    switch (status) {
      case "Present":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            {t("present")}
          </span>
        );
      case "Absent":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>
            {t("absent")}
          </span>
        );
      case "Leave":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            {t("leave")}
          </span>
        );
      case "Sick":
        return (
          <span className={`${base} bg-purple-100 text-purple-700`}>
            {t("sick")}
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-600`}>
            {t("unknown")}
          </span>
        );
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          {t("attendance_list")}
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />

          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_attendance")}
          </button>
        </div>
      </div>

      {/* ===== TABLE + MOBILE ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("employee")}</th>
                <th className="p-2">{t("date")}</th>
                <th className="p-2">{t("status")}</th>
                <th className="p-2">{t("check_in")}</th>
                <th className="p-2">{t("check_out")}</th>
                <th className="p-2">{t("work_hours")}</th>
                <th className="p-2">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? (
                paginated.map((r) => (
                  <tr
                    key={r.emp_attendance_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-2">{r.emp_attendance_id}</td>
                    <td className="p-2">{r.employee_id}</td>
                    <td className="p-2">{r.attendance_date}</td>
                    <td className="p-2">
                      {getStatusBadge(r.attendance_status)}
                    </td>
                    <td className="p-2">{r.check_in_time || "-"}</td>
                    <td className="p-2">{r.check_out_time || "-"}</td>
                    <td className="p-2">{r.total_work_hours || "-"}</td>

                    <td className="p-2 flex justify-center gap-2">
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-gray-500">
                    {t("no_data")}
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
                key={r.emp_attendance_id}
                id={r.emp_attendance_id}
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
                <CardRow label={t("employee")} value={r.employee_id} />
                <CardRow label={t("date")} value={r.attendance_date} />
                <CardRow label={t("status")} value={r.attendance_status} />
                <CardRow label={t("check_in")} value={r.check_in_time} />
                <CardRow label={t("check_out")} value={r.check_out_time} />
                <CardRow label={t("hours")} value={r.total_work_hours} />
              </MobileCard>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">{t("no_data")}</div>
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
      <EmployeeAttendanceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        initialData={editData}
        onSuccess={fetchData}
      />

      {/* ===== DELETE ===== */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <p>{t("delete_confirm")}</p>

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
