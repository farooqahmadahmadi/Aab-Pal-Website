import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FiPlusCircle, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import NotificationsModal from "../../components/Notification/NotificationsModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";

import {
  getNotifications,
  addNotification,
  deleteNotification,
} from "../../services/notificationsService";

import getSocket from "../../services/socket";

export default function NotificationsPage() {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 50;

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deleteData, setDeleteData] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await getNotifications();
      const arr = Array.isArray(res.data) ? res.data : [];
      setData(arr);
    } catch {
      showToast(t("failed_load_notifications"), "error");
    }
  };

  useEffect(() => {
    fetchData();

    const socket = getSocket();

    socket.on("notification:new", (notification) => {
      setData((prev) => [notification, ...prev]);
    });

    socket.on("notification:delete", ({ id }) => {
      setData((prev) => prev.filter((n) => n.notification_id !== id));
    });

    return () => {
      socket.off("notification:new");
      socket.off("notification:delete");
    };
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const f = data.filter(
      (n) =>
        n.notification_title.toLowerCase().includes(search.toLowerCase()) ||
        n.notification_message.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ================= SELECT =================
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => setSelected(paginated.map((n) => n.notification_id));
  const clearSelection = () => setSelected([]);

  // ================= ADD =================
  const submit = async (form) => {
    try {
      await addNotification(form);
      showToast(t("added_success"), "success");
      setModalOpen(false);
      fetchData();
    } catch {
      showToast(t("failed_add"), "error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      if (Array.isArray(deleteData)) {
        await Promise.all(deleteData.map((id) => deleteNotification(id)));
        showToast(t("selected_deleted"), "success");
        setSelected([]);
      } else {
        await deleteNotification(deleteData.notification_id);
        showToast(t("deleted_success"), "success");
      }

      fetchData();
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t("notifications")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />

          <button
            onClick={() => setModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center justify-center gap-2 text-sm"
          >
            <FiPlusCircle /> {t("add_notification")}
          </button>

          {selected.length > 0 && (
            <button
              onClick={() => setDeleteData(selected)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center justify-center gap-2 text-sm"
            >
              <FiTrash2 /> {selected.length}
            </button>
          )}
        </div>
      </div>

      {/* SELECT */}
      {paginated.length > 0 && (
        <div className="flex justify-between text-xs mb-2">
          <button onClick={selectAll} className="px-2 py-1 bg-gray-100 rounded">
            {t("select_page")}
          </button>

          <button
            onClick={clearSelection}
            className="px-2 py-1 bg-gray-100 rounded"
          >
            {t("clear")}
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="bg-white shadow rounded divide-y">
        {paginated.length ? (
          paginated.map((n) => (
            <div
              key={n.notification_id}
              className="p-3 sm:p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between gap-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(n.notification_id)}
                    onChange={() => toggleSelect(n.notification_id)}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-semibold text-sm sm:text-base">
                      #{n.notification_id} - {n.notification_title}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {n.notification_message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDeleteData(n)}
                  className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-full"
                >
                  <FiTrash2 />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between mt-2 text-xs text-gray-500 gap-1">
                <span>{n.notification_recipients}</span>

                <div className="flex items-center gap-2">
                  {n.is_read ? (
                    <FiEye className="text-blue-600" />
                  ) : (
                    <FiEyeOff />
                  )}
                  <span>{new Date(n.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">
            {t("no_notifications")}
          </p>
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
      <NotificationsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submit}
      />

      {/* DELETE */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded w-full max-w-sm">
            <p className="font-semibold text-sm sm:text-base">
              {t("delete_confirm")}
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteData(null)}
                className="bg-gray-300 px-4 py-2 rounded text-sm"
              >
                {t("cancel")}
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded text-sm"
              >
                {t("delete")}
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
