import React, { useEffect, useState } from "react";
import {
  getProjects,
  deleteProject,
} from "../../../services/ourProjectsPage.service";

import OurProjectsModal from "../../../components/OurProjects/OurProjectsModal";

import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../../components/common/MobileCard";
import CardRow from "../../../components/common/CardRow";

import defaultImg from "../../../assets/images/default_image.png";

export default function OurProjectsList() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  // FETCH
  const fetchData = async () => {
    try {
      const res = await getProjects();
      setData(res.data || []);
    } catch {
      showToast("Failed to load projects", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SEARCH
  useEffect(() => {
    const f = data.filter(
      (p) =>
        (p.project_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.project_address || "").toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // DELETE
  const handleDelete = async () => {
    try {
      await deleteProject(deleteItem.project_id);
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Projects</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => {
              setEdit(null);
              setOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FiPlusCircle /> Add
          </button>
        </div>
      </div>

      {/* TABLE + MOBILE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        {/* DESKTOP */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Image</th>
                <th className="p-2">Name</th>
                <th className="p-2">Address</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((p) => (
                  <tr key={p.project_id} className="text-center border-t">
                    <td className="p-2">{p.project_id}</td>

                    <td className="p-2">
                      <img
                        src={
                          p.project_image
                            ? `${BASE_URL}${p.project_image}`
                            : defaultImg
                        }
                        className="w-10 h-10 rounded-full mx-auto object-cover"
                      />
                    </td>

                    <td className="p-2">{p.project_name}</td>
                    <td className="p-2">{p.project_address}</td>
                    <td className="p-2">{p.project_status}</td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEdit(p);
                            setOpen(true);
                          }}
                          className="bg-yellow-500 p-1.5 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteItem(p)}
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
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.length ? (
            paginated.map((p) => (
              <MobileCard
                key={p.project_id}
                id={p.project_id}
                actions={
                  <>
                    <button
                      onClick={() => {
                        setEdit(p);
                        setOpen(true);
                      }}
                      className="bg-yellow-500 p-2 text-white rounded"
                    >
                      <FiEdit3 />
                    </button>

                    <button
                      onClick={() => setDeleteItem(p)}
                      className="bg-red-500 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                }
              >
                {/* IMAGE */}
                <div className="flex justify-center mb-2">
                  <img
                    src={
                      p.project_image
                        ? `${BASE_URL}${p.project_image}`
                        : defaultImg
                    }
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                </div>

                <CardRow label="Name" value={p.project_name} />
                <CardRow label="Address" value={p.project_address} />
                <CardRow label="Status" value={p.project_status} />
              </MobileCard>
            ))
          ) : (
            <div className="text-center text-gray-500 p-4">
              No projects found
            </div>
          )}
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
      <OurProjectsModal
        open={open}
        edit={edit}
        onClose={() => setOpen(false)}
        onRefresh={fetchData}
      />

      {/* DELETE */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
          <div className="bg-white p-5 rounded-lg w-full max-w-sm">
            <p className="mb-4">
              Delete <b>{deleteItem.project_name}</b>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteItem(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <Toast {...toast} onClose={hideToast} />}
    </div>
  );
}