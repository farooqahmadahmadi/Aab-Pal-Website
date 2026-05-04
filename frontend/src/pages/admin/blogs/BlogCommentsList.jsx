import React, { useEffect, useState } from "react";
import {
  getBlogComments,
  deleteBlogComment,
  approveBlogComment,
} from "../../../services/blogComments.service";

import BlogCommentModal from "../../../components/Blogs/BlogCommentModal";

import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import {
  FiTrash2,
  FiCheck,
  FiPlusCircle,
  FiEdit3,
} from "react-icons/fi";

import MobileCard from "../../../components/common/MobileCard";
import CardRow from "../../../components/common/CardRow";

import defaultImg from "../../../assets/images/default_image.png";

export default function BlogCommentsList() {
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
      const res = await getBlogComments();
      setData(res.data || []);
    } catch {
      showToast("Failed to load comments", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const f = data.filter(
      (c) =>
        (c.comment_text || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.visitor_email || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.visitor_ip || "").toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      await deleteBlogComment(deleteItem.comment_id);
      showToast("Deleted successfully", "success");
      fetchData();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteItem(null);
    }
  };

  // ================= APPROVE =================
  const handleApprove = async (id) => {
    try {
      await approveBlogComment(id);
      showToast("Approved successfully", "success");
      fetchData();
    } catch {
      showToast("Failed", "error");
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">

        <h2 className="text-xl sm:text-2xl font-bold">
          Blog Comments
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search comments..."
          />

          {/* ADD BUTTON */}
          <button
            onClick={() => {
              setEdit(null);
              setOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FiPlusCircle /> Add Comment
          </button>

        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        {/* DESKTOP */}
        <div className="hidden md:block">
          <table className="w-full text-sm">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Photo</th>
                <th className="p-2">Blog ID</th>
                <th className="p-2">Email</th>
                <th className="p-2">IP</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Comment</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((c) => (
                  <tr key={c.comment_id} className="text-center border-t">

                    <td className="p-2">{c.comment_id}</td>

                    {/* IMAGE */}
                    <td className="p-2">
                      <img
                        src={
                          c.visitor_photo
                            ? `${BASE_URL}${c.visitor_photo}`
                            : defaultImg
                        }
                        onError={(e) => (e.target.src = defaultImg)}
                        className="w-10 h-10 rounded-full mx-auto object-cover border"
                      />
                    </td>

                    <td className="p-2">{c.blog_id}</td>
                    <td className="p-2">{c.visitor_email}</td>
                    <td className="p-2">{c.visitor_ip}</td>
                    <td className="p-2">{c.visitor_rating}</td>
                    <td className="p-2">{c.comment_text}</td>

                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          c.is_approved
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {c.is_approved ? "Approved" : "Pending"}
                      </span>
                    </td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">

                        {/* EDIT */}
                        <button
                          onClick={() => {
                            setEdit(c);
                            setOpen(true);
                          }}
                          className="bg-yellow-500 p-1.5 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        {/* APPROVE */}
                        {!c.is_approved && (
                          <button
                            onClick={() => handleApprove(c.comment_id)}
                            className="bg-green-500 p-1.5 text-white rounded"
                          >
                            <FiCheck />
                          </button>
                        )}

                        {/* DELETE */}
                        <button
                          onClick={() => setDeleteItem(c)}
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
                  <td colSpan="9" className="p-4 text-center text-gray-500">
                    No comments found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden space-y-3 p-2">
          {paginated.map((c) => (
            <MobileCard
              key={c.comment_id}
              id={c.comment_id}
              actions={
                <>
                  <button
                    onClick={() => {
                      setEdit(c);
                      setOpen(true);
                    }}
                    className="bg-yellow-500 p-2 text-white rounded"
                  >
                    <FiEdit3 />
                  </button>

                  {!c.is_approved && (
                    <button
                      onClick={() => handleApprove(c.comment_id)}
                      className="bg-green-500 p-2 text-white rounded"
                    >
                      <FiCheck />
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteItem(c)}
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
                    src={
                          c.visitor_photo
                            ? `${BASE_URL}${c.visitor_photo}`
                            : defaultImg
                        }
                        onError={(e) => (e.target.src = defaultImg)}
                  className="w-14 h-14 rounded-full object-cover border"
                />
              </div>

              <CardRow label="Blog ID" value={c.blog_id} />
              <CardRow label="Email" value={c.visitor_email} />
              <CardRow label="IP" value={c.visitor_ip} />
              <CardRow label="Rating" value={c.visitor_rating} />
              <CardRow label="Comment" value={c.comment_text} />
              <CardRow
                label="Status"
                value={c.is_approved ? "Approved" : "Pending"}
              />
            </MobileCard>
          ))}
        </div>

      </div>

      {/* ================= PAGINATION ================= */}
      <div className="mt-4 flex justify-center">
        <Pagination
          page={page}
          total={filtered.length}
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      {/* ================= DELETE MODAL ================= */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-5 rounded-lg w-full max-w-sm">

            <p className="mb-4">Delete this comment?</p>

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

      {/* ================= MODAL ================= */}
      {open && (
        <BlogCommentModal
          open={open}
          edit={edit}
          onClose={() => setOpen(false)}
          onRefresh={fetchData}
        />
      )}

      {/* ================= TOAST ================= */}
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