import React, { useEffect, useState } from "react";
import {
  getNotifications,
  deleteNotification,
} from "../../../services/websiteNotifications.service";

import WebsiteNotificationsModal from "../../../components/WebsiteNotifications/WebsiteNotificationsModal";

import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../../components/common/MobileCard";
import CardRow from "../../../components/common/CardRow";

export default function WebsiteNotificationsList() {
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
      const res = await getNotifications();
      setData(res.data || []);
    } catch {
      showToast("Failed to load notifications", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const f = data.filter(
      (n) =>
        (n.notification_title || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (n.notification_message || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      await deleteNotification(deleteItem.notification_id);
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
        <h2 className="text-xl font-bold">Notifications</h2>

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
      <div className="bg-white shadow rounded-lg overflow-hidden hidden sm:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Message</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length ? (
              paginated.map((n) => (
                <tr key={n.notification_id} className="text-center border-t">
                  <td className="p-2">{n.notification_id}</td>
                  <td className="p-2">{n.notification_title}</td>
                  <td className="p-2">{n.notification_message}</td>
                  <td className="p-2">{n.is_read ? "Read" : "Unread"}</td>

                  <td className="p-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEdit(n);
                          setOpen(true);
                        }}
                        className="bg-yellow-500 p-1.5 text-white rounded"
                      >
                        <FiEdit3 />
                      </button>

                      <button
                        onClick={() => setDeleteItem(n)}
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
                  No notifications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="sm:hidden space-y-3">
        {paginated.length ? (
          paginated.map((n) => (
            <MobileCard
              key={n.notification_id}
              title={n.notification_title}
              onEdit={() => {
                setEdit(n);
                setOpen(true);
              }}
              onDelete={() => setDeleteItem(n)}
            >
              <CardRow label="ID" value={n.notification_id} />
              <CardRow label="Message" value={n.notification_message} />
              <CardRow label="Status" value={n.is_read ? "Read" : "Unread"} />
            </MobileCard>
          ))
        ) : (
          <p className="text-center text-gray-500">No data found</p>
        )}
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
      <WebsiteNotificationsModal
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
              Delete <b>{deleteItem.notification_title}</b>?
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
