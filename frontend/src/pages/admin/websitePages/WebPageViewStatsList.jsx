import React, { useEffect, useState } from "react";
import {
  getStats,
  deleteStat,
} from "../../../services/webPageViewStats.service";

import WebPageViewStatsModal from "../../../components/WebsitePages/WebPageViewStatsModal";

import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

export default function WebPageViewStatsList() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  const fetchData = async () => {
    try {
      const res = await getStats();
      setData(res.data || []);
    } catch {
      showToast("Failed to load stats", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const f = data.filter((s) => String(s.web_page_id).includes(search));

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const handleDelete = async () => {
    try {
      await deleteStat(deleteItem.view_state_id);
      showToast("Deleted successfully", "success");
      fetchData();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteItem(null);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Page View Stats</h2>

        <div className="flex gap-2">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setEdit(null);
              setOpen(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FiPlusCircle /> Add
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Page ID</th>
              <th className="p-2">Date</th>
              <th className="p-2">Total</th>
              <th className="p-2">Unique</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length ? (
              paginated.map((s) => (
                <tr key={s.view_state_id} className="text-center border-t">
                  <td className="p-2">{s.view_state_id}</td>
                  <td className="p-2">{s.web_page_id}</td>
                  <td className="p-2">{s.view_date}</td>
                  <td className="p-2">{s.total_views}</td>
                  <td className="p-2">{s.unique_views}</td>

                  <td className="p-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEdit(s);
                          setOpen(true);
                        }}
                        className="bg-yellow-500 p-1.5 text-white rounded"
                      >
                        <FiEdit3 />
                      </button>

                      <button
                        onClick={() => setDeleteItem(s)}
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
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No stats found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
      <WebPageViewStatsModal
        open={open}
        edit={edit}
        onClose={() => setOpen(false)}
        onRefresh={fetchData}
      />

      {/* DELETE */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-5 rounded">
            <p className="mb-3">
              Delete stats ID <b>{deleteItem.view_state_id}</b>?
            </p>

            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteItem(null)}>Cancel</button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={hideToast} />}
    </div>
  );
}
