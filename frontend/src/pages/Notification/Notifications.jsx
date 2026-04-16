import React, { useEffect, useState } from "react";
import { FiPlusCircle, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import NotificationsModal from "../../components/Notification/NotificationsModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";

import {
    getNotifications,
    addNotification,
    deleteNotification
} from "../../services/notificationsService";

// 🔥 GLOBAL SOCKET
import getSocket from "../../services/socket";

export default function NotificationsPage() {

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
            showToast("Failed to load notifications", "error");
        }
    };

    // ================= INIT =================
    useEffect(() => {
        fetchData();

        const socket = getSocket();

        // 🔥 REAL-TIME NEW
        socket.on("notification:new", (notification) => {
            setData(prev => [notification, ...prev]);
        });

        // 🔥 REAL-TIME DELETE
        socket.on("notification:delete", ({ id }) => {
            setData(prev =>
                prev.filter(n => n.notification_id !== id)
            );
        });

        return () => {
            socket.off("notification:new");
            socket.off("notification:delete");
        };
    }, []);

    // ================= SEARCH =================
    useEffect(() => {
        const f = data.filter(n =>
            n.notification_title.toLowerCase().includes(search.toLowerCase()) ||
            n.notification_message.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(f);
        setPage(1);
    }, [search, data]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    // ================= SELECT =================
    const toggleSelect = (id) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => setSelected(paginated.map(n => n.notification_id));
    const clearSelection = () => setSelected([]);

    // ================= ADD =================
    const submit = async (form) => {
        try {
            await addNotification(form);
            showToast("Added successfully", "success");
            setModalOpen(false);
            fetchData(); // fallback safety
        } catch {
            showToast("Failed", "error");
        }
    };

    // ================= DELETE =================
    const handleDelete = async () => {
        try {
            if (Array.isArray(deleteData)) {
                await Promise.all(deleteData.map(id => deleteNotification(id)));
                showToast("Selected deleted", "success");
                setSelected([]);
            } else {
                await deleteNotification(deleteData.notification_id);
                showToast("Deleted successfully", "success");
            }

            fetchData(); // fallback safety
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 w-dvw max-w-5xl mx-auto">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between gap-2 mb-4">
                <h2 className="text-xl md:text-2xl font-bold">Notifications</h2>

                <div className="flex flex-wrap gap-2">
                    <SearchBar value={search} onChange={setSearch} />

                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-green-500 text-white px-3 py-2 rounded flex items-center gap-2 text-sm"
                    >
                        <FiPlusCircle /> Add Notification
                    </button>

                    {selected.length > 0 && (
                        <button
                            onClick={() => setDeleteData(selected)}
                            className="bg-red-500 text-white px-3 py-2 rounded flex items-center gap-2 text-sm"
                        >
                            <FiTrash2 /> Delete ({selected.length})
                        </button>
                    )}
                </div>
            </div>

            {/* SELECT ACTION */}
            {paginated.length > 0 && (
                <div className="flex justify-between items-center mb-2 text-xs">
                    <div onClick={selectAll} className="text-blue-500 bg-gray-100 px-2 py-1 rounded cursor-pointer">
                        Select Page
                    </div>
                    <div onClick={clearSelection} className="text-gray-500 bg-gray-100 px-2 py-1 rounded cursor-pointer">
                        Clear
                    </div>
                </div>
            )}

            {/* LIST */}
            <div className="bg-white shadow rounded divide-y-2">
                {paginated.length ? paginated.map(n => (
                    <div key={n.notification_id} className="p-4 hover:bg-gray-50">

                        <div className="flex justify-between items-start gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(n.notification_id)}
                                    onChange={() => toggleSelect(n.notification_id)}
                                />

                                <span className="font-bold text-sm">
                                    #{n.notification_id} - {n.notification_title}
                                </span>
                            </div>

                            <div
                                onClick={() => setDeleteData(n)}
                                className="text-red-500 p-2 rounded-full hover:bg-red-400 hover:text-white cursor-pointer"
                            >
                                <FiTrash2 />
                            </div>
                        </div>

                        <p className="text-sm text-gray-700 mt-1">
                            {n.notification_message}
                        </p>

                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <div>
                                {n.notification_recipients}
                            </div>

                            <div className="flex items-center gap-3">
                                {n.is_read ? (
                                    <FiEye className="text-blue-600" />
                                ) : (
                                    <FiEyeOff />
                                )}
                                <span>{new Date(n.created_at).toLocaleString()}</span>
                            </div>
                        </div>

                    </div>
                )) : (
                    <p className="p-4 text-gray-500 text-center">
                        No notifications found
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

            {/* DELETE MODAL */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p className="font-semibold">
                            {Array.isArray(deleteData)
                                ? `Delete ${deleteData.length} selected notifications?`
                                : "Delete this notification?"}
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setDeleteData(null)}
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

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
}