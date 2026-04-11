// frontend/pages/SystemLogs/SystemLogs.jsx
import React, { useEffect, useState } from "react";
import { FiTrash2, FiExternalLink, FiX, FiXCircle } from "react-icons/fi";

import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";

import {
  getSystemLogs,
  deleteSystemLog,
} from "../../services/systemLogsService";

export default function SystemLogs() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selected, setSelected] = useState([]);
  const [deleteData, setDeleteData] = useState(null);

  const [exportModal, setExportModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fileName, setFileName] = useState("system_logs");

  const [drawer, setDrawer] = useState(null);

  const { toast, showToast, hideToast } = useToast();

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
      showToast("Failed to load logs", "error");
    }
  };

  useEffect(() => {
    fetchData();
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

  // ---------------- SELECT (RESTORED) ----------------
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
      showToast("Deleted successfully", "success");
      fetchData();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteData(null);
    }
  };

  const handleMultiDelete = async () => {
    try {
      await Promise.all(selected.map((id) => deleteSystemLog(id)));
      showToast("Selected deleted", "success");
      setSelected([]);
      fetchData();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteData(null);
    }
  };

  // ---------------- EXPORT ----------------
  const handleExport = () => {
    if (!fromDate || !toDate) {
      showToast("Select date range", "error");
      return;
    }

    const filteredData = data.filter((n) => {
      const d = new Date(n.created_at);
      return d >= new Date(fromDate) && d <= new Date(toDate);
    });

    if (!filteredData.length) {
      showToast("No data found", "error");
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
    showToast("Exported successfully", "success");
  };

  // ---------------- DRAWER CLOSE OUTSIDE ----------------
  const closeDrawer = (e) => {
    if (e.target.id === "drawer-bg") setDrawer(null);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">System Logs</h2>

        <div className="flex gap-2">
          {/* SEARCH */}
          <SearchBar value={search} onChange={setSearch} />
          {/* ADD Button */}
          <button
            onClick={() => setExportModal(true)}
            className="bg-green-500 text-white px-3 py-2 rounded flex items-center gap-2"
          >
            <FiExternalLink /> Export
          </button>

          {/* Multi Delete Button */}
          {selected.length > 0 && (
            <button
              onClick={() => setDeleteData({ multi: true })}
              className="bg-red-500 text-white px-3 py-2 rounded flex items-center gap-2"
            >
              <FiTrash2 /> ({selected.length})
            </button>
          )}
        </div>
      </div>

      {/* SELECT CONTROLS (RESTORED) */}
      {paginated.length > 0 && (
        <div className="flex justify-between text-sm my-2">
          <button
            onClick={selectAll}
            className="bg-gray-100 px-3 py-1 rounded text-blue-600"
          >
            Select All
          </button>

          <button
            onClick={clearSelection}
            className="bg-gray-100 px-3 py-1 rounded"
          >
            Clear
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-center text-sm">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="p-2">Select</th>
              <th className="p-2">ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Action</th>
              <th className="p-2">Table</th>
              <th className="p-2">Old</th>
              <th className="p-2">New</th>
              <th className="p-2">Created</th>
              <th className="p-2">Action</th>
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

                <td className="p-2 max-w-[120px] truncate" title={n.old_value}>
                  {n.old_value}
                </td>

                <td className="p-2 max-w-[120px] truncate" title={n.new_value}>
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

      {deleteData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-80">
            <h3 className="font-bold mb-3">Confirm Delete?</h3>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteData(null)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={deleteData.multi ? handleMultiDelete : handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
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

      {/* DRAWER (FIXED + CLEAN) */}
      {drawer && (
        <div
          id="drawer-bg"
          onClick={closeDrawer}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
        >
          <div className="w-[420px] bg-white h-full p-4 overflow-y-auto">
            <div className="flex justify-between mb-4 ">
              <h3 className="font-bold text-blue-600">Log Details</h3>

              {/* Drawer Close Button */}
              <div
                className=" p-1 rounded-full text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => setDrawer(null)}
              >
                <FiXCircle />
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p>
                <b>Log ID:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.log_id}
                </pre>
              </p>
              <p>
                <b>User ID:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.user_id}
                </pre>
              </p>
              <p>
                <b>Action:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.action}
                </pre>
              </p>
              <p>
                <b>Reference Table:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.reference_table}
                </pre>
              </p>
              <p>
                <b>Record ID:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.reference_record_id}
                </pre>
              </p>

              <div>
                <b>Old Value:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.old_value}
                </pre>
              </div>

              <div>
                <b>New Value:</b>
                <pre className="bg-gray-100 hover:bg-gray-200 p-2 text-xs whitespace-pre-wrap break-words">
                  {drawer.new_value}
                </pre>
              </div>
              <p>
                <b>Created at:</b>
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
          <div className="bg-white p-5 rounded-xl w-96 ">
            <h3 className="font-bold mb-3">Export Logs</h3>

            <div className="text-md">
            <div>
              <label htmlFor="" className="text-gray-500">
                Start Date:
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full mb-2 border p-2 rounded-md "
              />
            </div>
            <div>
              <label htmlFor="" className="text-gray-500">
                End Date:
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full mb-2 border p-2 rounded-md "
              />
            </div>

            <div>
              <label htmlFor="" className="text-gray-500">
                File Name:
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full mb-3 border p-2 rounded-md "
              />
            </div>

            <div className="flex justify-end gap-2 ">
              <button
                onClick={() => setExportModal(false)}
                type="button"
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                type="submit"
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
              >
                Export
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
