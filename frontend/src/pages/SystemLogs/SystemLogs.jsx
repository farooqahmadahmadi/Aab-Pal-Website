import React, { useEffect, useState, useRef } from "react";
import { FiTrash2, FiExternalLink, FiX, FiXCircle } from "react-icons/fi";

import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import { useTranslation } from "react-i18next";

import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";

import {
  getSystemLogs,
  deleteSystemLog,
} from "../../services/systemLogsService";

import { io } from "socket.io-client";

export default function SystemLogs() {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 100;

  const [selected, setSelected] = useState([]);
  const [deleteData, setDeleteData] = useState(null);

  const [exportModal, setExportModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fileName, setFileName] = useState("system_logs");

  const [drawer, setDrawer] = useState(null);

  const { toast, showToast, hideToast } = useToast();
  const socketRef = useRef(null);

  // ---------------- FETCH ----------------
  const fetchData = async () => {
    try {
      const res = await getSystemLogs();

      const arr = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [];

      setData(arr);
    } catch {
      showToast(t("failed_load_logs"), "error");
    }
  };

  // ---------------- SOCKET ----------------
  useEffect(() => {
    fetchData();

    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // NEW LOG (optional backend emit)
    socket.on("system_log_created", (log) => {
      setData((prev) => [log, ...prev]);
    });

    // DELETE LOG
    socket.on("system_log_deleted", ({ id }) => {
      setData((prev) => prev.filter((l) => l.log_id !== id));
      setSelected((prev) => prev.filter((i) => i !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ---------------- SEARCH ----------------
  useEffect(() => {
    const s = search.toLowerCase();

    const f = data.filter(
      (n) =>
        n.log_id?.toString().includes(s) ||
        n.user_id?.toString().includes(s) ||
        n.action?.toLowerCase().includes(s) ||
        n.reference_table?.toLowerCase().includes(s) ||
        n.reference_record_id?.toString().includes(s),
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ---------------- SELECT ----------------
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => setSelected(paginated.map((n) => n.log_id));

  const clearSelection = () => setSelected([]);

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    try {
      await deleteSystemLog(deleteData.log_id);
      showToast(t("deleted_success"), "success");
      fetchData();
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  const handleMultiDelete = async () => {
    try {
      await Promise.all(selected.map((id) => deleteSystemLog(id)));
      showToast(t("deleted_success"), "success");
      setSelected([]);
      fetchData();
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  // ---------------- EXPORT ----------------
  const handleExport = () => {
    if (!fromDate || !toDate) {
      showToast(t("select_date_range"), "error");
      return;
    }

    const filteredData = data.filter((n) => {
      const d = new Date(n.created_at);
      return d >= new Date(fromDate) && d <= new Date(toDate);
    });

    if (!filteredData.length) {
      showToast(t("no_data_found"), "error");
      return;
    }

    const escapeCSV = (val) =>
      val ? `"${String(val).replace(/"/g, '""')}"` : "";

    const rows = [
      [
        "log_id",
        "user_id",
        "action",
        "reference_table",
        "reference_record_id",
        "old_value",
        "new_value",
        "created_at",
      ],
      ...filteredData.map((n) => [
        n.log_id,
        n.user_id,
        n.action,
        n.reference_table,
        n.reference_record_id,
        escapeCSV(n.old_value),
        escapeCSV(n.new_value),
        new Date(n.created_at).toLocaleString(),
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();

    setExportModal(false);
    showToast(t("export_success"), "success");
  };

  // ---------------- DRAWER CLOSE OUTSIDE ----------------
  const closeDrawer = (e) => {
    if (e.target.id === "drawer-bg") setDrawer(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t("system_logs")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          {/* SEARCH */}
          <SearchBar value={search} onChange={setSearch} />
          {/* Export Button */}
          <button
            onClick={() => setExportModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center justify-center gap-2 text-sm"
          >
            <FiExternalLink /> {t("export")}
          </button>

          {/* Multi Delete Button */}
          {selected.length > 0 && (
            <button
              onClick={() => setDeleteData({ multi: true })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
            >
              <FiTrash2 /> ({selected.length})
            </button>
          )}
        </div>
      </div>

      {/* SELECT CONTROLS */}
      {paginated.length > 0 && (
        <div className="flex justify-between text-sm my-2">
          <button
            onClick={selectAll}
            className="bg-gray-100 px-3 py-1 rounded text-blue-600"
          >
            {t("select_page")}
          </button>

          <button
            onClick={clearSelection}
            className="bg-gray-100 px-3 py-1 rounded"
          >
            {t("clear")}
          </button>
        </div>
      )}

      {/* TABLE / CARD */}
      <div className="bg-white shadow rounded overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[900px] text-center text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("select")}</th>
                <th className="p-2">ID</th>
                <th className="p-2">{t("user")}</th>
                <th className="p-2">{t("action")}</th>
                <th className="p-2">{t("table")}</th>
                <th className="p-2">{t("old")}</th>
                <th className="p-2">{t("new")}</th>
                <th className="p-2">{t("created")}</th>
                <th className="p-2">{t("action")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((n) => (
                <tr
                  key={n.log_id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setDrawer(n)}
                >
                  <td className="p-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.includes(n.log_id)}
                      onChange={() => toggleSelect(n.log_id)}
                    />
                  </td>

                  <td className="p-2">{n.log_id}</td>
                  <td className="p-2">{n.user_id}</td>
                  <td className="p-2">{n.action}</td>
                  <td className="p-2">{n.reference_table}</td>

                  <td
                    className="p-2 max-w-[120px] truncate"
                    title={n.old_value}
                  >
                    {n.old_value}
                  </td>

                  <td
                    className="p-2 max-w-[120px] truncate"
                    title={n.new_value}
                  >
                    {n.new_value}
                  </td>

                  <td className="p-2">
                    {new Date(n.created_at).toLocaleString()}
                  </td>

                  <td className="p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteData(n);
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD - WITH CLICK WRAPPER FOR RELIABLE DRAWER OPEN */}
        <div className="md:hidden p-2 space-y-2">
          {paginated.length ? (
            paginated.map((n) => (
              <div
                key={n.log_id}
                onClick={() => setDrawer(n)}
                className="cursor-pointer"
              >
                <MobileCard
                  id={n.log_id}
                  className="p-2"
                  actions={
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(n.log_id)}
                        onChange={() => toggleSelect(n.log_id)}
                        onClick={(e) => e.stopPropagation()} // Prevent drawer open when checking
                        className="w-4 h-4"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteData(n);
                        }}
                        className="bg-red-500 p-1.5 text-white rounded text-xs"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  }
                >
                  {/* Compact card content */}
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">ID: {n.log_id}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <span>
                        <span className="font-medium">{t("user")}:</span>{" "}
                        {n.user_id}
                      </span>
                      <span>
                        <span className="font-medium">{t("action")}:</span>{" "}
                        {n.action}
                      </span>
                      <span>
                        <span className="font-medium">{t("table")}:</span>{" "}
                        {n.reference_table}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 text-gray-600">
                      <span className="truncate max-w-[120px]">
                        {t("old")}: {n.old_value || "—"}
                      </span>
                      <span>→</span>
                      <span className="truncate max-w-[120px]">
                        {t("new")}: {n.new_value || "—"}
                      </span>
                    </div>
                  </div>
                </MobileCard>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              {t("no_records")}
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-80">
            <h3 className="font-bold mb-3">{t("confirm_delete")}</h3>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteData(null)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                {t("cancel")}
              </button>

              <button
                onClick={deleteData.multi ? handleMultiDelete : handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGINATION */}
      <div className="mt-4 flex justify-center">
        <Pagination
          page={page}
          total={filtered.length}
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      {/* RESPONSIVE DRAWER - WORKS ON ALL SCREEN SIZES */}
      {drawer && (
        <div
          id="drawer-bg"
          onClick={closeDrawer}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
        >
          <div className="w-full sm:w-[420px] max-w-full bg-white h-full p-4 overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-blue-600">{t("log_details")}</h3>

              {/* Improved close button with larger touch target */}
              <div
                className="p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                onClick={() => setDrawer(null)}
              >
                <FiXCircle size={20} />
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p>
                <b>{t("log_id")}:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.log_id}
                </pre>
              </p>
              <p>
                <b>{t("user_id")}:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.user_id}
                </pre>
              </p>
              <p>
                <b>{t("action")}:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.action}
                </pre>
              </p>
              <p>
                <b>{t("reference_table")}:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.reference_table}
                </pre>
              </p>
              <p>
                <b>{t("record_id")}:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.reference_record_id}
                </pre>
              </p>

              <div>
                <b>{t("old_value")}:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.old_value}
                </pre>
              </div>

              <div>
                <b>{t("new_value")}:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.new_value}
                </pre>
              </div>
              <p>
                <b>{t("created_at")}:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.created_at}
                </pre>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT MODAL */}
      {exportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl w-96">
            <h3 className="font-bold mb-3">{t("export_logs")}</h3>

            <div className="text-md">
              <div>
                <label htmlFor="" className="text-gray-500">
                  {t("start_date")}
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full mb-2 border p-2 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="" className="text-gray-500">
                  {t("end_date")}
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full mb-2 border p-2 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="" className="text-gray-500">
                  {t("file_name")}
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full mb-3 border p-2 rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setExportModal(false)}
                  type="button"
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleExport}
                  type="submit"
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                >
                  {t("export")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
