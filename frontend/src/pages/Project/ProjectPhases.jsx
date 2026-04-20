import React, { useState, useEffect } from "react";

import ProjectPhaseModal from "../../components/Project/ProjectPhaseModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";
import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";

import {
  getProjectPhases,
  addProjectPhase,
  updateProjectPhase,
  deleteProjectPhase,
} from "../../services/projectPhasesService";

import { FiEdit3, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function ProjectPhasesPage() {
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
      const res = await getProjectPhases();
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

    const filteredData = data.filter(
      (item) =>
        item.phase_id.toString().includes(q) ||
        item.project_id.toString().includes(q) ||
        item.phase_name?.toLowerCase().includes(q) ||
        item.phase_status?.toLowerCase().includes(q),
    );

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
        await updateProjectPhase(editData.phase_id, formData);
        showToast(t("updated_success"), "success");
      } else {
        await addProjectPhase(formData);
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
      await deleteProjectPhase(deleteData.phase_id);
      showToast(t("deleted_success"), "success");
      fetchData();
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  // ===== STATUS BADGE =====
  const renderStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";

    switch (status) {
      case "Planed":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>{status}</span>
        );
      case "InProgress":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            {status}
          </span>
        );
      case "Completed":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            {status}
          </span>
        );
      case "OnHold":
        return (
          <span className={`${base} bg-orange-100 text-orange-700`}>
            {status}
          </span>
        );
      case "Failed":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>{status}</span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>
        );
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t("project_phases")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setModalOpen(true);
              setEditData(null);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_phase")}
          </button>
        </div>
      </div>

      {/* ===== TABLE + CARD ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-center">{t("id")}</th>
                <th className="p-2">{t("project_id")}</th>
                <th className="p-2">{t("phase_name")}</th>
                <th className="p-2">{t("start_date")}</th>
                <th className="p-2">{t("end_date")}</th>
                <th className="p-2">{t("status")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((item) => (
                  <tr key={item.phase_id} className="border-t hover:bg-gray-50">
                    <td className="p-2 text-center">{item.phase_id}</td>
                    <td className="p-2">{item.project_id}</td>
                    <td className="p-2">{item.phase_name}</td>
                    <td className="p-2">{item.phase_start_date}</td>
                    <td className="p-2">{item.phase_end_date}</td>
                    <td className="p-2">
                      {renderStatusBadge(item.phase_status)}
                    </td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditData(item);
                            setModalOpen(true);
                          }}
                          className="bg-yellow-500 p-1 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteData(item)}
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
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    {t("no_records")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE CARDS ===== */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.length ? (
            paginated.map((item) => (
              <MobileCard
                key={item.phase_id}
                id={item.phase_id}
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
                <CardRow label={t("project_id")} value={item.project_id} />
                <CardRow label={t("phase_name")} value={item.phase_name} />
                <CardRow
                  label={t("start_date")}
                  value={item.phase_start_date}
                />
                <CardRow label={t("end_date")} value={item.phase_end_date} />
                <CardRow label={t("status")} value={item.phase_status} />
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
      <ProjectPhaseModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editData}
      />

      {/* ===== DELETE CONFIRM ===== */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <p>
              {t("delete_confirm")} <b>{deleteData.phase_name}</b>?
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
