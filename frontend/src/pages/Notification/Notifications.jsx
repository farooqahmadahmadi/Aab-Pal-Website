import React, { useEffect, useState } from "react";
import { FiPlusCircle, FiCheck, FiCheckCircle } from "react-icons/fi";
import NotificationsModal from "../../components/Notification/NotificationsModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";

import {
    getNotifications,
    addNotification,
    markNotificationAsRead,
    deleteNotification
} from "../../services/notificationsService";

export default function NotificationsPage() {

    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);

    const { toast, showToast, hideToast } = useToast();

    // fetch
    const fetchData = async () => {
        try {
            const res = await getNotifications();
            const arr = Array.isArray(res.data) ? res.data : [];
            setData(arr);
        } catch {
            showToast("Failed to load notifications", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    // search
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

    // actions
    const submit = async (form) => {
        try {
            await addNotification(form);
            showToast("Added successfully", "success");
            setModalOpen(false);
            fetchData();
        } catch {
            showToast("Failed", "error");
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            showToast("Marked as read", "success");
            fetchData();
        } catch {
            showToast("Failed", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            showToast("Deleted", "success");
            fetchData();
        } catch {
            showToast("Delete failed", "error");
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-2 mb-4">
                <h2 className="text-xl md:text-2xl font-bold">Notifications</h2>

                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                        <FiPlusCircle /> Add
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white shadow rounded divide-y">

                {paginated.length ? paginated.map(n => (

                    <div key={n.notification_id} className="p-4 hover:bg-gray-50">

                        {/* Line 1 */}
                        <div className="flex justify-between flex-wrap gap-2">
                            <span className="font-bold text-sm">
                                #{n.notification_id} - {n.notification_title}
                            </span>
                        </div>

                        {/* Line 2 */}
                        <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">
                            {n.notification_message}
                        </p>

                        {/* Line 3 */}
                        <div className="flex flex-wrap justify-between items-center mt-2 text-xs text-gray-500 gap-2">

                            <div>
                                <span className="font-semibold">Recipient:</span>{" "}
                                {n.notification_recipients}
                                {n.user_id && ` (${n.user_id})`}
                            </div>

                            <div className="flex items-center gap-3">

                                {/* Read Status */}
                                <span className="flex items-center gap-1">
                                    {n.is_read ? (
                                        <FiCheckCircle className="text-blue-500" title="Read" />
                                    ) : (
                                        <FiCheck title="Unread" />
                                    )}
                                </span>

                                {/* Time */}
                                <span>
                                    {new Date(n.created_at).toLocaleString()}
                                </span>

                                {/* Actions */}
                                {!n.is_read && (
                                    <button
                                        onClick={() => handleMarkRead(n.notification_id)}
                                        className="text-blue-500"
                                    >
                                        Read
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(n.notification_id)}
                                    className="text-red-500"
                                >
                                    Delete
                                </button>

                            </div>
                        </div>

                    </div>

                )) : (
                    <p className="p-4 text-gray-500 text-center">
                        No notifications found
                    </p>
                )}

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

            {/* Modal */}
            <NotificationsModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={submit}
            />

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
}