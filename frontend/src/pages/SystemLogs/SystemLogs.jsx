// frontend/pages/SystemLogs/SystemLogs.jsx
import React, { useEffect, useState } from "react";
import { FiTrash2, FiExternalLink } from "react-icons/fi";
import Pagination from "../../components/common/Pagination";
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

  const [deleteData, setDeleteData] = useState(null);
  const [selected, setSelected] = useState([]);

  // export states
  const [exportModal, setExportModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fileName, setFileName] = useState("system_logs");

  const { toast, showToast, hideToast } = useToast();

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

  useEffect(() => {
    const f = data.filter(
      (n) =>
        (n.action || "").toLowerCase().includes(search.toLowerCase()) ||
        (n.reference_table || "").toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = Array.isArray(filtered)
    ? filtered.slice(start, start + limit)
    : [];

  //  select toggle
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => setSelected(paginated.map((n) => n.log_id));
  const clearSelection = () => setSelected([]);

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

  // EXPORT
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
      showToast("No data in selected range", "error");
      return;
    }

    const csv = [
      [
        "ID",
        "User",
        "Action",
        "Table",
        "Record ID",
        "Old",
        "New",
        "Created At",
      ],
      ...filteredData.map((n) => [
        n.log_id,
        n.user_id,
        n.action,
        n.reference_table,
        n.reference_record_id,
        n.old_value,
        n.new_value,
        new Date(n.created_at).toLocaleString(),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName || ""}.csv`;
    a.click();

    setExportModal(false);
    showToast("Exported successfully", "success");
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">System Logs</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setExportModal(true)}
            className="bg-green-500 text-white hover:bg-green-600  px-3 py-2 rounded flex items-center gap-2"
          >
            <FiExternalLink /> Export
          </button>

          {selected.length > 0 && (
            <button
              onClick={() => setDeleteData({ multi: true })}
              className="bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded flex items-center gap-2"
            >
              <FiTrash2 /> Delete ({selected.length})
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
      </div>

      {/* Muli record selection */}
      {paginated.length > 0 && (
        <div className="flex justify-between items-center mb-2 text-sm">
          <div
            onClick={selectAll}
            className="text-blue-500 bg-gray-100 px-1 py-1 rounded-full font-semibold  cursor-pointer hover:bg-gray-200"
          >
            Select Page
          </div>
          <div
            onClick={clearSelection}
            className="text-gray-500 bg-gray-100 px-1 py-1 rounded-full font-semibold  cursor-pointer hover:bg-gray-200"
          >
            Clear
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Action</th>
              <th>Table</th>
              <th>Record</th>
              <th>Old Date</th>
              <th>New Date</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((n) => (
              <tr key={n.log_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(n.log_id)}
                    onChange={() => toggleSelect(n.log_id)}
                  />
                </td>
                <td>{n.log_id}</td>
                <td>{n.user_id}</td>
                <td>{n.action}</td>
                <td>{n.reference_table}</td>
                <td>{n.reference_record_id}</td>
                <td>{n.old_value}</td>
                <td>{n.new_value}</td>
                <td>{new Date(n.created_at).toLocaleString()}</td>
                <td className="p-2 flex justify-center">
                  <button
                    onClick={() => setDeleteData(n)}
                    className="bg-red-500 hover:bg-red-600 px-2 py-1 text-white rounded flex items-center gap-1"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          page={page}
          total={filtered.length}
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      {/* Export Modal */}
      {exportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96 space-y-3">
            <h3 className="font-bold text-lg">Export Logs</h3>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border p-2 w-full rounded"
              title="Start Date"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border p-2 w-full rounded"
              title="End Date"
            />
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="File Name"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setExportModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <p>
              {deleteData.multi
                ? `Delete ${selected.length} logs?`
                : "Delete this log?"}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteData(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteData.multi ? handleMultiDelete : handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
