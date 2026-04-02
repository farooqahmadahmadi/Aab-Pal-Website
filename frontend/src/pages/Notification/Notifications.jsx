import React, { useEffect, useState } from "react";
import { FiPlusCircle, FiCheck, FiCheckCircle, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
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

export default function NotificationsPage() {

    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState([]);
    const [deleteData, setDeleteData] = useState(null); // single or multiple

    const { toast, showToast, hideToast } = useToast();

    // fetch notifications
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

    // search filter
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

    // select toggle
    const toggleSelect = (id) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => setSelected(paginated.map(n => n.notification_id));
    const clearSelection = () => setSelected([]);

    // add notification
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

    // delete single or multiple
    const handleDelete = async () => {
        try {
            if (Array.isArray(deleteData)) {
                // multiple delete
                await Promise.all(deleteData.map(id => deleteNotification(id)));
                showToast("Selected deleted", "success");
                setSelected([]);
            } else {
                // single delete
                await deleteNotification(deleteData.notification_id);
                showToast("Deleted successfully", "success");
            }
            fetchData();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 w-dvw max-w-5xl mx-auto">

            {/* Header */}
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

            {/* Select Actions */}
            {paginated.length > 0 && (
                <div className="flex justify-between items-center mb-2 text-xs">
                    <div onClick={selectAll} className="text-blue-500 bg-gray-100 px-1 py-1 rounded-full font-semibold  cursor-pointer hover:bg-gray-200">Select Page</div>
                    <div onClick={clearSelection} className="text-gray-500 bg-gray-100 px-1 py-1 rounded-full font-semibold  cursor-pointer hover:bg-gray-200" >Clear</div>
                </div>
            )}

            {/* Notification List */}
            <div className="bg-white shadow  rounded divide-y-2">

                {paginated.length ? paginated.map(n => (
                    <div key={n.notification_id} className="p-4 hover:bg-gray-50">

                        {/* Line 1 */}
                        <div className="flex justify-between items-start gap-2">

                            <div className="flex items-center gap-2 flex-wrap">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(n.notification_id)}
                                    onChange={() => toggleSelect(n.notification_id)}
                                />

                                <span className="font-bold text-sm break-words">
                                    #{n.notification_id} - {n.notification_title}
                                </span>
                            </div>

                            <div
                                onClick={() => setDeleteData(n)}
                                className="text-red-500 text-sm bg-red-200 p-2 rounded-full hover:bg-red-400 hover:text-white"
                            >
                                <FiTrash2 />
                            </div>

                        </div>

                        {/* Line 2 */}
                        <p className="text-sm text-gray-700 break-words whitespace-pre-wrap mt-1">
                            {n.notification_message}
                        </p>

                        {/* Line 3 */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 text-xs text-gray-500 gap-2">

                            <div className="break-words">
                                <span className="font-semibold">Recipient:</span>{" "}
                                {n.notification_recipients}
                                {n.user_id && ` (${n.user_id})`}
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                                {n.is_read ? (
                                    
                                    <FiEye className="text-blue-600 text-sm" title="Read" />
                                ) : (
                                    <FiEyeOff  className="text-sm" title="Unread" />
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

            {/* Delete Confirmation Modal */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p className="text-gray-700 font-semibold">
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