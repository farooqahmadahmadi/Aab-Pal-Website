import React, { useEffect, useState } from "react";
import {
  getAttendanceShifts,
  addAttendanceShift,
  updateAttendanceShift,
  deleteAttendanceShift,
} from "../../services/attendanceShiftsInfoService";

import AttendanceShiftModal from "../../components/Employees/AttendanceShiftModal";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";

import { FiEdit3, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";

import { useTranslation } from "react-i18next";

export default function AttendanceShifts() {
  const { t } = useTranslation();

  const [shifts, setShifts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  // ===== FETCH =====
  const fetchShifts = async () => {
    try {
      const res = await getAttendanceShifts();
      setShifts(res.data || res);
    } catch {
      showToast(t("failed_fetch_shifts"), "error");
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  // ===== SEARCH =====
  useEffect(() => {
    let data = [...shifts];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((s) => s.shift_name?.toLowerCase().includes(q));
    }

    setFiltered(data);
    setPage(1);
  }, [search, shifts]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ===== SUBMIT =====
  const handleSubmit = async (form) => {
    try {
      if (editData) {
        await updateAttendanceShift(editData.attendance_shift_id, form);
        showToast(t("updated_success"), "success");
      } else {
        await addAttendanceShift(form);
        showToast(t("added_success"), "success");
      }

      setModalOpen(false);
      setEditData(null);
      fetchShifts();
    } catch {
      showToast(t("save_failed"), "error");
    }
  };

  // ===== DELETE =====
  const handleDelete = async () => {
    if (!deleteData) return;

    try {
      await deleteAttendanceShift(deleteData.attendance_shift_id);
      showToast(t("deleted_success"), "success");
      fetchShifts();
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
          {t("attendance_shifts")}
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_shift")}
          </button>
        </div>
      </div>

      {/* ===== TABLE + MOBILE ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("shift_name")}</th>
                <th className="p-2">{t("check_in")}</th>
                <th className="p-2">{t("check_out")}</th>
                <th className="p-2">{t("latitude")}</th>
                <th className="p-2">{t("longitude")}</th>
                <th className="p-2">{t("reduce")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? (
                paginated.map((s) => (
                  <tr
                    key={s.attendance_shift_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-2">{s.attendance_shift_id}</td>
                    <td className="p-2">{s.shift_name}</td>
                    <td className="p-2">
                      {s.check_in_start} - {s.check_in_end}
                    </td>
                    <td className="p-2">
                      {s.check_out_start} - {s.check_out_end}
                    </td>
                    <td className="p-2">{s.latitude}</td>
                    <td className="p-2">{s.longitude}</td>
                    <td className="p-2">{s.reduce}</td>

                    <td className="p-2 flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditData(s);
                          setModalOpen(true);
                        }}
                        className="bg-yellow-500 p-1 text-white rounded"
                      >
                        <FiEdit3 />
                      </button>

                      <button
                        onClick={() => setDeleteData(s)}
                        className="bg-red-500 p-1 text-white rounded"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    {t("no_shifts_found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE CARDS ===== */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.length > 0 ? (
            paginated.map((s) => (
              <MobileCard
                key={s.attendance_shift_id}
                id={s.attendance_shift_id}
                actions={
                  <>
                    <button
                      onClick={() => {
                        setEditData(s);
                        setModalOpen(true);
                      }}
                      className="bg-yellow-500 p-2 text-white rounded"
                    >
                      <FiEdit3 />
                    </button>

                    <button
                      onClick={() => setDeleteData(s)}
                      className="bg-red-500 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                }
              >
                <CardRow label={t("shift_name")} value={s.shift_name} />
                <CardRow
                  label={t("check_in")}
                  value={`${s.check_in_start} - ${s.check_in_end}`}
                />
                <CardRow
                  label={t("check_out")}
                  value={`${s.check_out_start} - ${s.check_out_end}`}
                />
                <CardRow label={t("latitude")} value={s.latitude} />
                <CardRow label={t("longitude")} value={s.longitude} />
                <CardRow label={t("reduce")} value={s.reduce} />
              </MobileCard>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              {t("no_shifts_found")}
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
      <AttendanceShiftModal
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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <p>
              {t("delete_confirm")} <b>{deleteData.shift_name}</b>?
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
