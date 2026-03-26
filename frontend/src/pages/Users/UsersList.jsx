import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/userService";
import UserViewModal from "../../components/Users/UserViewModal";
import UserAddModal from "../../components/Users/UserAddModal";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import { FaPlus } from "react-icons/fa";

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showView, setShowView] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [deleteData, setDeleteData] = useState(null); // For delete confirmation modal

    const { toast, showToast, hideToast } = useToast();

    const fetchUsers = async () => {
        const res = await getUsers({
            page,
            search,
            limit: 10
        });
        setUsers(res.data.users);
        setTotal(res.data.total);
    };

    useEffect(() => { fetchUsers(); }, [page, search]);

    // Delete action
    const handleDelete = (user) => {
        setDeleteData(user); // Show delete confirmation modal
    };

    const confirmDelete = async () => {
        if (!deleteData) return;
        try {
            await deleteUser(deleteData.user_id);
            showToast("User deleted successfully", "success");
            fetchUsers();
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || "Failed to delete user", "error");
        } finally {
            setDeleteData(null);
        }
    };

    const cancelDelete = () => setDeleteData(null);

    return (
        <div className="p-4">
            {/* ===== Top Bar ===== */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
                <h2 className="text-xl font-bold">System Users Account Management</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <SearchBar value={search} onChange={setSearch} />
                    <button
                        onClick={() => setShowAdd(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                        <FaPlus /> Add User
                    </button>
                </div>
            </div>

            {/* ===== Table ===== */}
            <div className="overflow-x-auto bg-white shadow rounded">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-200 text-gray-700 text-sm">
                        <tr>
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left ">Email</th>
                            <th className="p-2 text-left">Role</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.user_id} className="border-t hover:bg-gray-50 transition">
                                <td className="p-2">{u.user_id}</td>
                                <td className="p-2">{u.user_name}</td>
                                <td className="p-2"><a href="mailto:">{u.user_email}</a> </td>
                                <td className="p-2">{u.user_role}</td>
                                <td className="p-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${u.login_status === "Online" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-600"}`}>
                                        {u.login_status}
                                    </span>
                                </td>
                                <td className="p-2 flex justify-center gap-2">
                                    <button
                                        onClick={() => { setSelectedUser(u); setShowView(true); }}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                                    >
                                        View
                                    </button>

                                    <button
                                        onClick={() => handleDelete(u)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center p-4 text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center">
                <Pagination page={page} total={total} onPageChange={setPage} />
            </div>

            {/* Modals */}
            {showView && (
                <UserViewModal
                    user={selectedUser}
                    onClose={() => setShowView(false)}
                    onRefresh={fetchUsers}
                />
            )}
            {showAdd && (
                <UserAddModal
                    onClose={() => setShowAdd(false)}
                    onRefresh={fetchUsers}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <p className="mb-4 text-gray-700">
                            Are you sure you want to delete <strong>{deleteData.user_name}</strong>?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={cancelDelete} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} position="center" />}
        </div>
    );
}