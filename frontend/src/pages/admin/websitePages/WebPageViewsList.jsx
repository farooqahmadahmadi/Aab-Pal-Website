import React, { useEffect, useState } from "react";
import { getViews, deleteView } from "../../../services/webPageViews.service";

import WebPageViewsModal from "../../../components/WebsitePages/WebPageViewsModal";

import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../../components/common/MobileCard";
import CardRow from "../../../components/common/CardRow";

export default function WebPageViewsList() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  // FETCH
  const fetchData = async () => {
    try {
      const res = await getViews();
      setData(res.data || []);
    } catch {
      showToast("Failed to load views", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SEARCH
  useEffect(() => {
    const f = data.filter(
      (v) =>
        (v.visitor_ip || "").toLowerCase().includes(search.toLowerCase()) ||
        (v.visitor_agent || "").toLowerCase().includes(search.toLowerCase()),
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // DELETE
  const handleDelete = async () => {
    try {
      await deleteView(deleteItem.view_id);
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
        <h2 className="text-xl font-bold">Page Views</h2>

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

      {/* MOBILE */}
      <div className="grid gap-3 sm:hidden">
        {paginated.length ? (
          paginated.map((v) => (
            <MobileCard key={v.view_id}>
              <CardRow label="ID" value={v.view_id} />
              <CardRow label="Page ID" value={v.web_page_id} />
              <CardRow label="IP" value={v.visitor_ip} />
              <CardRow label="Agent" value={v.visitor_agent} />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setEdit(v);
                    setOpen(true);
                  }}
                  className="bg-yellow-500 p-1.5 text-white rounded"
                >
                  <FiEdit3 />
                </button>

                <button
                  onClick={() => setDeleteItem(v)}
                  className="bg-red-500 p-1.5 text-white rounded"
                >
                  <FiTrash2 />
                </button>
              </div>
            </MobileCard>
          ))
        ) : (
          <div className="text-center text-gray-500">No data found</div>
        )}
      </div>

      {/* TABLE */}
      <div className="hidden sm:block bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Page</th>
              <th className="p-2">IP</th>
              <th className="p-2">Agent</th>
              <th className="p-2">Time</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length ? (
              paginated.map((v) => (
                <tr key={v.view_id} className="text-center border-t">
                  <td className="p-2">{v.view_id}</td>
                  <td className="p-2">{v.web_page_id}</td>
                  <td className="p-2">{v.visitor_ip}</td>
                  <td className="p-2 truncate max-w-[200px]">
                    {v.visitor_agent}
                  </td>
                  <td className="p-2">
                    {new Date(v.viewed_at).toLocaleString()}
                  </td>

                  <td className="p-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEdit(v);
                          setOpen(true);
                        }}
                        className="bg-yellow-500 p-1.5 text-white rounded"
                      >
                        <FiEdit3 />
                      </button>

                      <button
                        onClick={() => setDeleteItem(v)}
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
                  No data found
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
      <WebPageViewsModal
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
              Delete view <b>{deleteItem.view_id}</b>?
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
