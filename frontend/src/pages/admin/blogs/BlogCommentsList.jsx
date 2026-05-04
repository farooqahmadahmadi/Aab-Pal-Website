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
  FiCornerDownRight,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

import MobileCard from "../../../components/common/MobileCard";
import CardRow from "../../../components/common/CardRow";

import defaultImg from "../../../assets/images/user-def-image.png";

export default function BlogCommentsList() {
  const [data, setData] = useState([]);
  const [tree, setTree] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [currentBlogId, setCurrentBlogId] = useState(null);

  const [expanded, setExpanded] = useState({});

  // const [expandedMobile, setExpandedMobile] = useState({});
  // const [expanded, setExpanded] = useState({});

  const { toast, showToast, hideToast } = useToast();

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  // ================= BUILD TREE =================
  const buildTree = (list) => {
    const map = {};
    const roots = [];

    list.forEach((c) => {
      map[c.comment_id] = { ...c, children: [] };
    });

    list.forEach((c) => {
      if (c.parent_id) {
        map[c.parent_id]?.children.push(map[c.comment_id]);
      } else {
        roots.push(map[c.comment_id]);
      }
    });

    return roots;
  };

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await getBlogComments();
      const list = res.data || [];
      setData(list);
      setTree(buildTree(list));
    } catch {
      showToast("Failed to load comments", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SEARCH =================
  const filtered = data.filter(
    (c) =>
      (c.comment_text || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.visitor_email || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.visitor_ip || "").toLowerCase().includes(search.toLowerCase()),
  );

  // const paginated = filtered.slice((page - 1) * limit, page * limit);

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

  // ================= TOGGLE =================
  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ================= DESKTOP ROW =================
  const renderRow = (c, level = 0) => {
    const hasChildren = c.children?.length > 0;

    return (
      <React.Fragment key={c.comment_id}>
        <tr className="border-t text-center">
          <td className="p-2">
            <div className="flex items-center justify-center gap-1">
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(c.comment_id)}
                  className="bg-gray-200 rounded-full p-1"
                >
                  {expanded[c.comment_id] ? (
                    <FiChevronDown />
                  ) : (
                    <FiChevronRight />
                  )}
                </button>
              )}
              <span>{c.comment_id}</span>
            </div>
          </td>

          <td className="p-2">
            <img
              src={
                c.visitor_photo ? `${BASE_URL}${c.visitor_photo}` : defaultImg
              }
              onError={(e) => (e.target.src = defaultImg)}
              className="w-10 h-10 rounded-full mx-auto object-cover border"
            />
          </td>

          <td className="p-2">{c.blog_id}</td>
          <td className="p-2">{c.visitor_email}</td>
          <td className="p-2">{c.visitor_ip}</td>
          <td className="p-2">{c.visitor_rating}</td>
          <td className="p-2 text-left">{c.comment_text}</td>

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
            <div className="flex justify-center gap-1">
              <button
                onClick={() => {
                  setParentId(c.comment_id);
                  setCurrentBlogId(c.blog_id);
                  setEdit(null);
                  setOpen(true);
                }}
                className="bg-blue-500 p-1.5 text-white rounded-full"
              >
                <FiCornerDownRight />
              </button>

              <button
                onClick={() => {
                  setEdit(c);
                  setOpen(true);
                }}
                className="bg-yellow-500 p-1.5 text-white rounded-full"
              >
                <FiEdit3 />
              </button>

              {!c.is_approved && (
                <button
                  onClick={() => handleApprove(c.comment_id)}
                  className="bg-green-500 p-1.5 text-white rounded-full"
                >
                  <FiCheck />
                </button>
              )}

              <button
                onClick={() => setDeleteItem(c)}
                className="bg-red-500 p-1.5 text-white rounded-full"
              >
                <FiTrash2 />
              </button>
            </div>
          </td>
        </tr>

        {/* CHILDREN (FLAT STYLE) */}
        {expanded[c.comment_id] &&
          c.children?.map((child) => renderRow(child, level))}
      </React.Fragment>
    );
  };

  // ================= FILTER =================
  const filteredTree = tree.filter(
    (c) =>
      (c.comment_text || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.visitor_email || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.visitor_ip || "").toLowerCase().includes(search.toLowerCase()),
  );

  const paginatedTree = filteredTree.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setPage(1);
  }, [search, data]);

  // ================= MOBILE CARD =================
  const renderMobileCard = (c) => {
    const hasChildren = c.children?.length > 0;

    return (
      <React.Fragment key={c.comment_id}>
        <MobileCard
          id={c.comment_id}
          actions={
            <>
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(c.comment_id)}
                  className="bg-gray-500 p-2 text-white rounded-full"
                >
                  {expanded[c.comment_id] ? (
                    <FiChevronDown />
                  ) : (
                    <FiChevronRight />
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  setParentId(c.comment_id);
                  setCurrentBlogId(c.blog_id);
                  setEdit(null);
                  setOpen(true);
                }}
                className="bg-blue-500 p-2 text-white rounded-full"
              >
                <FiCornerDownRight />
              </button>

              <button
                onClick={() => {
                  setEdit(c);
                  setOpen(true);
                }}
                className="bg-yellow-500 p-2 text-white rounded-full"
              >
                <FiEdit3 />
              </button>

              {!c.is_approved && (
                <button
                  onClick={() => handleApprove(c.comment_id)}
                  className="bg-green-500 p-2 text-white rounded-full"
                >
                  <FiCheck />
                </button>
              )}

              <button
                onClick={() => setDeleteItem(c)}
                className="bg-red-500 p-2 text-white rounded-full"
              >
                <FiTrash2 />
              </button>
            </>
          }
        >
          <div className="flex justify-center mb-2">
            <img
              src={
                c.visitor_photo ? `${BASE_URL}${c.visitor_photo}` : defaultImg
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

        {/* CHILDREN (FLAT SAME SIZE) */}
        {expanded[c.comment_id] &&
          c.children?.map((child) => renderMobileCard(child))}
      </React.Fragment>
    );
  };

  // ================= RETURN =================
  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Blog Comments</h2>

        <div className="flex gap-2">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search..."
          />

          <button
            onClick={() => {
              setEdit(null);
              setParentId(null);
              setOpen(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center"
          >
            <FiPlusCircle /> Add
          </button>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Photo</th>
              <th className="p-2">Blog</th>
              <th className="p-2">Email</th>
              <th className="p-2">IP</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Comment</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedTree.length ? (
              paginatedTree.map((c) => renderRow(c))
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
      <div className="md:hidden p-2 space-y-3">
        {paginatedTree.length ? (
          paginatedTree.map((c) => renderMobileCard(c))
        ) : (
          <p className="text-center text-gray-500">No comments found</p>
        )}
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex justify-center">
        <Pagination
          page={page}
          total={filteredTree.length}
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      {/* MODAL */}
      {open && (
        <BlogCommentModal
          open={open}
          edit={edit}
          blogId={currentBlogId}
          parentId={parentId}
          onClose={() => {
            setOpen(false);
            setEdit(null);
            setParentId(null);
            setCurrentBlogId(null);
          }}
          onRefresh={fetchData}
        />
      )}

      {/* DELETE */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded">
            <p>Delete?</p>
            <button onClick={handleDelete}>Yes</button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
