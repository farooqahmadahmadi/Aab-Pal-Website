import React, { useEffect, useState } from "react";
import {
  getHomePages,
  deleteHomePage,
} from "../../../services/homePage.service";

import HomeModal from "../../../components/Home/HomeModal";

import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../../components/common/MobileCard";
import CardRow from "../../../components/common/CardRow";
import { useTranslation } from "react-i18next";

import defaultImg from "../../../assets/images/about-default.jpg";

export default function HomePageList() {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [openModal, setOpenModal] = useState(false);
  const [edit, setEdit] = useState(null);

  const [deleteData, setDeleteData] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await getHomePages();
      setData(res.data || []);
    } catch {
      showToast(t("operation_failed"), "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const f = data.filter(
      (item) =>
        item.section_id?.toString().includes(search) ||
        item.section_name?.toLowerCase().includes(search.toLowerCase()) ||
        item.section_title?.toLowerCase().includes(search.toLowerCase()),
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ================= IMAGE =================
  const getImage = (item) => {
    if (!item?.section_image) return defaultImg;

    if (item.section_image.startsWith("http"))
      return item.section_image;

    return `${BASE_URL}${item.section_image}`;
  };

  // ================= DELETE =================
  const confirmDelete = async () => {
    try {
      await deleteHomePage(deleteData.section_id);
      showToast(t("deleted_success"), "success");
      fetchData();
    } catch {
      showToast(t("operation_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          {t("home_page")}
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search sections..."
          />

          <button
            onClick={() => {
              setEdit(null);
              setOpenModal(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FiPlusCircle /> Add Section
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
                <th className="p-2">ID</th>
                <th className="p-2">Image</th>
                <th className="p-2">Name</th>
                <th className="p-2">Title</th>
                <th className="p-2">Order</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((item) => (
                  <tr key={item.section_id} className="border-t text-center">

                    <td className="p-2">{item.section_id}</td>

                    {/* IMAGE */}
                    <td className="p-2">
                      <img
                        src={getImage(item)}
                        className="w-10 h-10 rounded object-cover mx-auto border"
                      />
                    </td>

                    <td className="p-2">{item.section_name}</td>
                    <td className="p-2">{item.section_title}</td>
                    <td className="p-2">{item.display_order}</td>

                    {/* STATUS */}
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          item.is_active
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-2">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => {
                            setEdit(item);
                            setOpenModal(true);
                          }}
                          className="bg-yellow-500 p-1.5 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteData(item)}
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
                    No data found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.map((item) => (
            <MobileCard
              key={item.section_id}
              id={item.section_id}
              actions={
                <>
                  <button
                    onClick={() => {
                      setEdit(item);
                      setOpenModal(true);
                    }}
                    className="bg-yellow-500 p-2 text-white rounded"
                  >
                    <FiEdit3 />
                  </button>

                  <button
                    onClick={() => setDeleteData(item)}
                    className="bg-red-500 p-2 text-white rounded"
                  >
                    <FiTrash2 />
                  </button>
                </>
              }
            >
              {/* IMAGE */}
              <div className="flex justify-center mb-2">
                <img
                  src={getImage(item)}
                  className="w-16 h-16 rounded object-cover border"
                />
              </div>

              <CardRow label="Name" value={item.section_name} />
              <CardRow label="Title" value={item.section_title} />
              <CardRow label="Order" value={item.display_order} />
              <CardRow
                label="Status"
                value={item.is_active ? "Active" : "Inactive"}
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
      <HomeModal
        open={openModal}
        edit={edit}
        onClose={() => setOpenModal(false)}
        onRefresh={fetchData}
      />

      {/* DELETE */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <p>
              Delete this section? <strong>{deleteData.section_title}</strong>
            </p>

            <div className="flex justify-end gap-2 mt-4">
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
          position="top-right"
        />
      )}
    </div>
  );
}