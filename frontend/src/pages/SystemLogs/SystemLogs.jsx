import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";

import { getSystemLogs, deleteSystemLog } from "../../services/systemLogsService";

export default function SystemLogs() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [deleteData, setDeleteData] = useState(null);
  const [selected, setSelected] = useState([]); // ✅ multi select

  const { toast, showToast, hideToast } = useToast();

  // fetch logs
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

  useEffect(() => { fetchData(); }, []);

  // search filter
  useEffect(() => {
    const f = data.filter(n =>
      (n.action || "").toLowerCase().includes(search.toLowerCase()) ||
      (n.reference_table || "").toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = Array.isArray(filtered) ? filtered.slice(start, start + limit) : [];

  // ✅ select toggle
  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => setSelected(paginated.map(n => n.log_id));
  const clearSelection = () => setSelected([]);

  // delete single
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

  // ✅ delete multi
  const handleMultiDelete = async () => {
    try {
      await Promise.all(selected.map(id => deleteSystemLog(id)));
      showToast("Selected deleted", "success");
      setSelected([]);
      fetchData();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteData(null);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">

      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">System Logs</h2>

        {/* ✅ multi delete button */}
        {selected.length > 0 && (
          <button
            onClick={() => setDeleteData({ multi: true })}
            className="bg-red-500 text-white px-3 py-2 rounded flex items-center gap-2"
          >
            <FiTrash2 /> Delete ({selected.length})
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
      </div>

      {/* Select Actions */}
      {paginated.length > 0 && (
        <div className="flex justify-between items-center mb-2 text-sm">
          <button onClick={selectAll} className="text-blue-500">Select Page</button>
          <button onClick={clearSelection} className="text-gray-500">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-center text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2"></th> {/* checkbox */}
              <th className="p-2">ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Action</th>
              <th className="p-2">Reference Table</th>
              <th className="p-2">Record ID</th>
              <th className="p-2">Old Data</th>
              <th className="p-2">New Data</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length ? paginated.map(n => (
              <tr key={n.log_id} className="border-t">

                {/* ✅ checkbox */}
                <td className="p-2">
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
                <td className="p-2">{n.reference_record_id}</td>
                <td className="p-2">{n.old_value}</td>
                <td className="p-2">{n.new_value}</td>
                <td className="p-2">{new Date(n.created_at).toLocaleString()}</td>

                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => setDeleteData(n)}
                    className="bg-red-500 px-2 py-1 text-white rounded flex items-center gap-1"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </td>

              </tr>
            )) : (
              <tr>
                <td colSpan="10" className="p-4 text-gray-500">No logs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />
      </div>

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

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}