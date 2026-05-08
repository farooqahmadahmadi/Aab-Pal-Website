import React, { useEffect, useState } from "react";

import {
  getContactMessages,
  deleteContactMessage,
} from "../../../services/contactUsPage.service";

import ContactUsModal from "../../../components/ContactUs/ContactUsModal";

import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../../components/common/MobileCard";
import CardRow from "../../../components/common/CardRow";

export default function ContactUsPage() {
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
      const res = await getContactMessages();
      setData(res.data || []);
    } catch {
      showToast("Failed to load messages", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SEARCH
  useEffect(() => {
    const s = search.toLowerCase();

    const f = data.filter(
      (m) =>
        (m.contact_name || "").toLowerCase().includes(s) ||
        (m.contact_email || "").toLowerCase().includes(s) ||
        (m.contact_phone || "").toLowerCase().includes(s) ||
        (m.contact_title || "").toLowerCase().includes(s)
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // DELETE
  const handleDelete = async () => {
    try {
      await deleteContactMessage(deleteItem.contact_id);

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
        <h2 className="text-xl sm:text-2xl font-bold">
          Contact Messages
        </h2>

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
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Title</th>
                <th className="p-2">Replied</th>
                <th className="p-2">Created</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((m) => (
                  <tr
                    key={m.contact_id}
                    className="text-center border-t hover:bg-gray-50"
                  >
                    <td className="p-2">{m.contact_id}</td>

                    <td className="p-2">{m.contact_name}</td>

                    <td className="p-2">{m.contact_email}</td>

                    <td className="p-2">
                      {m.contact_phone || "-"}
                    </td>

                    <td className="p-2">
                      {m.contact_title || "-"}
                    </td>

                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs text-white ${
                          m.is_replied
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {m.is_replied ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="p-2">
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEdit(m);
                            setOpen(true);
                          }}
                          className="bg-yellow-500 p-1.5 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteItem(m)}
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
                  <td
                    colSpan="8"
                    className="p-4 text-center text-gray-500"
                  >
                    No messages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.length ? (
            paginated.map((m) => (
              <MobileCard
                key={m.contact_id}
                id={m.contact_id}
                actions={
                  <>
                    <button
                      onClick={() => {
                        setEdit(m);
                        setOpen(true);
                      }}
                      className="bg-yellow-500 p-2 text-white rounded"
                    >
                      <FiEdit3 />
                    </button>

                    <button
                      onClick={() => setDeleteItem(m)}
                      className="bg-red-500 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                }
              >
                <CardRow label="Name" value={m.contact_name} />
                <CardRow label="Email" value={m.contact_email} />
                <CardRow
                  label="Phone"
                  value={m.contact_phone || "-"}
                />
                <CardRow
                  label="Title"
                  value={m.contact_title || "-"}
                />

                <CardRow
                  label="Replied"
                  value={m.is_replied ? "Yes" : "No"}
                />

                <CardRow
                  label="Created"
                  value={new Date(
                    m.created_at
                  ).toLocaleDateString()}
                />
              </MobileCard>
            ))
          ) : (
            <div className="text-center text-gray-500 p-4">
              No messages found
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
      <ContactUsModal
        open={open}
        edit={edit}
        onClose={() => setOpen(false)}
        onRefresh={fetchData}
      />

      {/* DELETE */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-5 rounded-lg w-full max-w-sm">
            <p className="mb-4">
              Delete{" "}
              <b>{deleteItem.contact_name}</b> ?
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
      {toast && (
        <Toast {...toast} onClose={hideToast} />
      )}
    </div>
  );
}