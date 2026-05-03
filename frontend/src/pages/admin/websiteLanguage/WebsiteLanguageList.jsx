import React, { useEffect, useState } from "react";
import {
  getLanguages,
  deleteLanguage,
} from "../../../services/websiteLanguage.service";

import LanguageModal from "../../../components/WebsiteLanguage/LanguageModal";

import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../../components/common/MobileCard";
import CardRow from "../../../components/common/CardRow";
import { useTranslation } from "react-i18next";

export default function WebsiteLanguageList() {
  const { t } = useTranslation();

  const [languages, setLanguages] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await getLanguages();

      const data = res?.data || res || [];
      setLanguages(Array.isArray(data) ? data : []);
    } catch {
      showToast(t("operation_failed"), "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const f = languages.filter(
      (l) =>
        (l.language_name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (l.language_code || "")
          .toLowerCase()
          .includes(search.toLowerCase())
    );

    setFiltered(f);
    setPage(1);
  }, [search, languages]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ================= DELETE =================
  const confirmDelete = async () => {
    try {
      await deleteLanguage(deleteData?.language_id);
      showToast(t("deleted_success"), "success");
      fetchData();
    } catch {
      showToast(t("operation_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">

        <h2 className="text-xl sm:text-2xl font-bold">
          {t("languages")}
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search language..."
          />

          <button
            onClick={() => {
              setSelected(null);
              setShowModal(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FiPlusCircle /> Add
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        {/* DESKTOP */}
        <div className="hidden md:block">
          <table className="w-full text-sm">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("code")}</th>
                <th className="p-2">{t("name")}</th>
                <th className="p-2">{t("direction")}</th>
                <th className="p-2">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((l) => (
                  <tr key={l.language_id} className="border-t text-center">

                    <td className="p-2">{l.language_id}</td>
                    <td className="p-2">{l.language_code}</td>
                    <td className="p-2">{l.language_name}</td>
                    <td className="p-2">{l.language_direction}</td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => {
                            setSelected(l);
                            setShowModal(true);
                          }}
                          className="bg-yellow-500 p-1.5 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteData(l)}
                          className="bg-red-500 p-1.5 text-white rounded"
                        >
                          <FiTrash2 />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    {t("no_data")}
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.map((l) => (
            <MobileCard
              key={l.language_id}
              id={l.language_id}
              actions={
                <>
                  <button
                    onClick={() => {
                      setSelected(l);
                      setShowModal(true);
                    }}
                    className="bg-yellow-500 p-2 text-white rounded"
                  >
                    <FiEdit3 />
                  </button>

                  <button
                    onClick={() => setDeleteData(l)}
                    className="bg-red-500 p-2 text-white rounded"
                  >
                    <FiTrash2 />
                  </button>
                </>
              }
            >
              <CardRow label="Code" value={l.language_code} />
              <CardRow label="Name" value={l.language_name} />
              <CardRow label="Direction" value={l.language_direction} />
            </MobileCard>
          ))}
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

      {/* MODAL */}
      <LanguageModal
        isOpen={showModal}
        initialData={selected}
        onClose={() => {
          setShowModal(false);
          setSelected(null);
        }}
        onRefresh={fetchData}
      />

      {/* DELETE */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">

            <p>
              {t("delete_confirm")}{" "}
              <strong>{deleteData.language_name}</strong>?
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

      {/* TOAST */}
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