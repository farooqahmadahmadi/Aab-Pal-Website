import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../../services/user.service";

import UserModal from "../../../components/Users/UserModal";

import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../../components/common/MobileCard";
import CardRow from "../../../components/common/CardRow";
import { useTranslation } from "react-i18next";

// ✅ DEFAULT IMAGE
import defaultUserImage from "../../../assets/images/user-def-image.png";

export default function UsersList() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [deleteData, setDeleteData] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  // ================= FETCH =================
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.users || []);
    } catch {
      showToast(t("failed_fetch"), "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const f = users.filter(
      (u) =>
        u.user_id?.toString().includes(search) ||
        u.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.user_email?.toLowerCase().includes(search.toLowerCase()) ||
        u.user_role?.toLowerCase().includes(search.toLowerCase()),
    );

    setFiltered(f);
    setPage(1);
  }, [search, users]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ================= IMAGE HANDLER =================
  const getUserImage = (u) => {
    if (!u?.user_photo) return defaultUserImage;

    if (u.user_photo.startsWith("http")) return u.user_photo;

    return `${import.meta.env.VITE_IMAGE_URL || ""}${u.user_photo}`;
  };

  // ================= DELETE =================
  const confirmDelete = async () => {
    try {
      await deleteUser(deleteData.user_id);
      showToast(t("deleted_success"), "success");
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || t("operation_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t("users")}</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={t("search_users")}
          />

          <button
            onClick={() => {
              setEditUser(null);
              setOpenModal(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FiPlusCircle /> {t("add_user")}
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
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("user_name")}</th>
                <th className="p-2">{t("email")}</th>
                <th className="p-2">{t("role")}</th>
                <th className="p-2">{t("photo")}</th>
                <th className="p-2">{t("status")}</th>
                <th className="p-2">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((u) => (
                  <tr key={u.user_id} className="border-t text-center">
                    <td className="p-2">{u.user_id}</td>
                    <td className="p-2">{u.user_name}</td>
                    <td className="p-2">{u.user_email}</td>
                    <td className="p-2">{u.user_role}</td>

                    {/* PHOTO */}
                    <td className="p-2">
                      <img
                        src={getUserImage(u)}
                        alt="user"
                        className="w-10 h-10 rounded-full object-cover mx-auto border"
                      />
                    </td>

                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          u.is_active
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditUser(u);
                            setOpenModal(true);
                          }}
                          className="bg-yellow-500 p-1.5 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteData(u)}
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
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    {t("no_users")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.map((u) => (
            <MobileCard
              key={u.user_id}
              id={u.user_id}
              actions={
                <>
                  <button
                    onClick={() => {
                      setEditUser(u);
                      setOpenModal(true);
                    }}
                    className="bg-yellow-500 p-2 text-white rounded"
                  >
                    <FiEdit3 />
                  </button>

                  <button
                    onClick={() => setDeleteData(u)}
                    className="bg-red-500 p-2 text-white rounded"
                  >
                    <FiTrash2 />
                  </button>
                </>
              }
            >
              {/* AVATAR */}
              <div className="flex justify-center mb-2">
                <img
                  src={getUserImage(u)}
                  alt="user"
                  className="w-16 h-16 rounded-full object-cover border"
                />
              </div>

              <CardRow label={t("user_name")} value={u.user_name} />
              <CardRow label={t("email")} value={u.user_email} />
              <CardRow label={t("role")} value={u.user_role} />
              <CardRow
                label={t("status")}
                value={u.is_active ? "Active" : "Inactive"}
              />
            </MobileCard>
          ))}
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
      <UserModal
        open={openModal}
        editUser={editUser}
        onClose={() => setOpenModal(false)}
        onRefresh={fetchUsers}
      />

      {/* DELETE */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <p>
              {t("delete_user_confirm")} <strong>{deleteData.user_name}</strong>
              ?
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteData(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                {t("cancel")}
              </button>

              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {t("delete")}
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
          position="top-right"
        />
      )}
    </div>
  );
}
