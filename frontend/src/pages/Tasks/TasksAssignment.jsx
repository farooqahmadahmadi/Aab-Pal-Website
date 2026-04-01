import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import TaskModal from "../../components/Tasks/TaskAssignmentModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";

import {
    getTasks,
    addTask,
    updateTask,
    deleteTask
} from "../../services/tasksAssignmentService";

export default function Tasks() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);

    const { toast, showToast, hideToast } = useToast();

    // 🔥 fetch
    const fetchData = async () => {
        try {
            const res = await getTasks();
            setData(res.data.data || res.data || []);
        } catch {
            showToast("Failed to load tasks", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    // 🔍 search
    useEffect(() => {
        const f = data.filter(i =>
            i.task_assignment_id.toString().includes(search) ||
            i.task_title?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(f);
        setPage(1);
    }, [search, data]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    // ✅ submit
    const submit = async (form) => {
        try {
            if (editData) {
                await updateTask(editData.task_assignment_id, form);
                showToast("Updated successfully", "success");
            } else {
                await addTask(form);
                showToast("Added successfully", "success");
            }

            setModalOpen(false);
            setEditData(null);
            fetchData();
        } catch {
            showToast("Error saving task", "error");
        }
    };

    // ❌ delete
    const handleDelete = async () => {
        try {
            await deleteTask(deleteData.task_assignment_id);
            showToast("Deleted successfully", "success");
            fetchData();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            {/* header */}
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Tasks Assignment</h2>

                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />

                    <button
                        onClick={() => { setModalOpen(true); setEditData(null); }}
                        className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                        <FaPlus /> Add Task
                    </button>
                </div>
            </div>

            {/* table */}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-center text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2 text-left">Title</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Due Date</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.length ? paginated.map(i => (
                            <tr key={i.task_assignment_id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{i.task_assignment_id}</td>
                                <td className="p-2 text-left">{i.task_title}</td>
                                <td className="p-2">{i.task_status}</td>
                                <td className="p-2">{i.task_due_date}</td>

                                <td className="p-2 flex justify-center gap-2">
                                    <button
                                        onClick={() => { setEditData(i); setModalOpen(true); }}
                                        className="bg-yellow-500 px-2 py-1 text-white rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => setDeleteData(i)}
                                        className="bg-red-500 px-2 py-1 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-4 text-gray-500">
                                    No tasks found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* pagination */}
            <div className="mt-4 flex justify-center">
                <Pagination
                    page={page}
                    total={filtered.length}
                    limit={limit}
                    onPageChange={setPage}
                />
            </div>

            {/* modal */}
            <TaskModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={submit}
                initialData={editData}
            />

            {/* delete modal */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <p>
                            Are you sure to delete <strong>{deleteData.task_title}</strong>?
                        </p>

                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setDeleteData(null)} className="bg-gray-300 px-4 py-2 rounded">
                                Cancel
                            </button>

                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* toast */}
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