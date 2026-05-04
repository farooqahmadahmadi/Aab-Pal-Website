import React, { useEffect, useState } from "react";
import { getBlogs, deleteBlog } from "../../../services/blogsPage.service";

import BlogModal from "../../../components/Blogs/BlogModal";

import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../../components/common/MobileCard";
import CardRow from "../../../components/common/CardRow";

import defaultImg from "../../../assets/images/default_image.png";

export default function BlogsList() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await getBlogs();
      setData(res.data || []);
    } catch {
      showToast("Failed to load blogs", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const f = data.filter(
      (b) =>
        (b.blog_title || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.blog_author_name || "").toLowerCase().includes(search.toLowerCase()),
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      await deleteBlog(deleteItem.blog_id);
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Blogs</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search blogs..."
          />

          <button
            onClick={() => {
              setEdit(null);
              setOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FiPlusCircle /> Add Blog
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
                <th className="p-2">Title</th>
                <th className="p-2">Author</th>
                <th className="p-2">Views</th>
                <th className="p-2">Likes</th>
                <th className="p-2">Shares</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((b) => (
                  <tr key={b.blog_id} className="text-center border-t">
                    <td className="p-2">{b.blog_id}</td>

                    {/* IMAGE */}
                    <td className="p-2">
                      <img
                        src={
                          b.blog_image
                            ? `${BASE_URL}${b.blog_image}`
                            : defaultImg
                        }
                        onError={(e) => {
                          e.target.src = defaultImg;
                        }}
                        className="w-10 h-10 rounded-full mx-auto object-cover border"
                      />
                    </td>

                    <td className="p-2">{b.blog_title}</td>
                    <td className="p-2">{b.blog_author_name}</td>
                    <td className="p-2">{b.blog_views}</td>
                    <td className="p-2">{b.blog_likes}</td>
                    <td className="p-2">{b.blog_shares}</td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEdit(b);
                            setOpen(true);
                          }}
                          className="bg-yellow-500 p-1.5 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteItem(b)}
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
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No blogs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.map((b) => (
            <MobileCard
              key={b.blog_id}
              id={b.blog_id}
              actions={
                <>
                  <button
                    onClick={() => {
                      setEdit(b);
                      setOpen(true);
                    }}
                    className="bg-yellow-500 p-2 text-white rounded"
                  >
                    <FiEdit3 />
                  </button>

                  <button
                    onClick={() => setDeleteItem(b)}
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
                  src={b.blog_image ? `${BASE_URL}${b.blog_image}` : defaultImg}
                  className="w-14 h-14 rounded-full object-cover border"
                />
              </div>

              <CardRow label="Title" value={b.blog_title} />
              <CardRow label="Author" value={b.blog_author_name} />
              <CardRow label="Views" value={b.blog_views} />
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
      <BlogModal
        open={open}
        edit={edit}
        onClose={() => setOpen(false)}
        onRefresh={fetchData}
      />

      {/* DELETE MODAL */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-5 rounded-lg w-full max-w-sm">
            <p className="mb-4">
              Delete this blog: <b>{deleteItem.blog_title}</b>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteItem(null)}
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
