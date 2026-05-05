import { useEffect, useState } from "react";
import {
  getPrivacyPolicies,
  deletePrivacyPolicy,
} from "../../../services/privacyAndPolicyPage.service";

import PrivacyPolicyModal from "../../../components/PrivacyPolicy/PrivacyPolicyModal";

import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../../components/common/MobileCard";
import CardRow from "../../../components/common/CardRow";

export default function PrivacyPolicyList() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await getPrivacyPolicies();
      setData(res?.data || []);
    } catch {
      showToast("Failed to load", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const f = data.filter((i) =>
      (i.pp_title || "").toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      await deletePrivacyPolicy(deleteItem.pp_id);
      showToast("Deleted", "success");
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
        <h2 className="text-xl sm:text-2xl font-bold">Privacy Policy</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search..."
          />

          <button
            onClick={() => {
              setEdit(null);
              setOpen(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center justify-center"
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
                <th className="p-2">ID</th>
                <th className="p-2">Title</th>
                <th className="p-2">Order</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((i) => (
                  <tr key={i.pp_id} className="border-t text-center">
                    <td className="p-2">{i.pp_id}</td>
                    <td className="p-2">{i.pp_title}</td>
                    <td className="p-2">{i.display_order}</td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => {
                            setEdit(i);
                            setOpen(true);
                          }}
                          className="bg-yellow-500 p-1.5 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteItem(i)}
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
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.length ? (
            paginated.map((i) => (
              <MobileCard
                key={i.pp_id}
                id={i.pp_id}
                actions={
                  <>
                    {/* EDIT */}
                    <button
                      onClick={() => {
                        setEdit(i);
                        setOpen(true);
                      }}
                      className="bg-yellow-500 p-2 text-white rounded"
                    >
                      <FiEdit3 />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => setDeleteItem(i)}
                      className="bg-red-500 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                }
              >
                <CardRow label="Title" value={i.pp_title} />
                <CardRow label="Order" value={i.display_order} />
              </MobileCard>
            ))
          ) : (
            <p className="text-center text-gray-500">No data</p>
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
      <PrivacyPolicyModal
        open={open}
        edit={edit}
        onClose={() => setOpen(false)}
        onRefresh={fetchData}
      />

      {/* DELETE MODAL */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded">
            <p className="mb-3">Delete this item?</p>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteItem(null)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>

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

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

    </div>
  );
}