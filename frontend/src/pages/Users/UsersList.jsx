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
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selectedUser, setSelectedUser] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  // ---------------- FETCH ALL USERS ----------------
  const fetchUsers = async () => {
    try {
      const res = await getUsers(); // 👈 NO pagination, NO search
      setUsers(res.data.users || []);
    } catch (err) {
      showToast("Failed to load users", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---------------- SEARCH (FRONTEND LIKE EMPLOYEES) ----------------
  useEffect(() => {
    const f = users.filter(
      (u) =>
        u.user_id?.toString().includes(search) ||
        u.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.user_email?.toLowerCase().includes(search.toLowerCase()) ||
        u.user_role?.toLowerCase().includes(search.toLowerCase()),
    );

    setFiltered(f);
    setPage(1); // reset page like Employees pattern
  }, [search, users]);

  // ---------------- PAGINATION (FRONTEND SLICE) ----------------
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ---------------- DELETE ----------------
  const handleDelete = (user) => {
    setDeleteData(user);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(deleteData.user_id);
      showToast("User deleted successfully", "success");
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed", "error");
    } finally {
      setDeleteData(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* TOP BAR */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">System Users Account</h2>

        <div className="flex gap-2">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search users..."
          />

          <button
            onClick={() => setShowAdd(true)}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Add User
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="p-2 text">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 ">Role</th>
              <th className="p-2 ">Status</th>
              <th className="p-2 ">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((u) => (
              <tr
                key={u.user_id}
                className="border-t hover:bg-gray-50 text-center"
              >
                <td className="p-2 ">{u.user_id}</td>
                <td className="p-2">{u.user_name}</td>
                <td className="p-2 text-left">
                  <a href="mailto:">{u.user_email}</a>
                </td>
                <td className="p-2 ">{u.user_role}</td>
                <td className="p-2 ">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.login_status === "Online"
                        ? "bg-green-100 text-green-600 animate-pulse"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {u.login_status}
                  </span>
                </td>

                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setShowView(true);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(u)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

      {/* MODALS */}
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

      {/* DELETE MODAL */}
      {deleteData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <p className="mb-4">
              Delete <strong>{deleteData.user_name}</strong>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteData(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
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
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          position="center"
        />
      )}
    </div>
  );
}
