import React, { useState, useEffect } from "react";
import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";
import {
  createBlogComment,
  updateBlogComment,
} from "../../services/blogComments.service";

import { getBlogs } from "../../services/blogsPage.service";

export default function BlogCommentModal({
  open,
  onClose,
  blogId,
  parentId,
  onRefresh,
  edit,
}) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [blogs, setBlogs] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [fileName, setFileName] = useState("");

  const [form, setForm] = useState({
    blog_id: blogId || "",
    visitor_email: "",
    visitor_ip: "",
    visitor_rating: "5",
    comment_text: "",
    visitor_photo: null,
    is_approved: "0",
    parent_id: parentId || null,
  });

  const isReply = !!(parentId || form.parent_id) && !isEdit;

  // ================= LOAD BLOGS =================
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getBlogs();
        setBlogs(res?.data || []);
      } catch {
        showToast("Failed to load blogs", "error");
      }
    };

    fetchBlogs();
  }, []);

  // ================= EDIT LOAD =================
  useEffect(() => {
    if (edit) {
      setForm({
        blog_id: edit.blog_id || "",
        visitor_email: edit.visitor_email || "",
        visitor_ip: edit.visitor_ip || "",
        visitor_rating: edit.visitor_rating?.toString() || "5",
        comment_text: edit.comment_text || "",
        visitor_photo: null,
        is_approved: edit.is_approved ? "1" : "0",
        parent_id: edit.parent_id || null,
      });

      setFileName("");
    }
  }, [edit]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "visitor_photo") {
      const file = files?.[0];
      setForm((p) => ({ ...p, visitor_photo: file || null }));
      setFileName(file?.name || "");
      return;
    }

    if (name === "blog_id") {
      setForm((p) => ({ ...p, blog_id: value }));
      setShowDropdown(true);
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  // ================= SELECT BLOG =================
  const selectBlog = (id) => {
    setForm((p) => ({ ...p, blog_id: id }));
    setShowDropdown(false);
  };

  const filteredBlogs = blogs.filter((b) =>
    `${b.blog_id} ${b.blog_title}`
      .toLowerCase()
      .includes(form.blog_id.toString().toLowerCase()),
  );

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.comment_text) {
        showToast("Comment is required", "error");
        return;
      }

      const fd = new FormData();

      Object.keys(form).forEach((k) => {
        if (form[k] !== null && form[k] !== undefined) {
          fd.append(k, form[k]);
        }
      });

      if (isEdit) {
        await updateBlogComment(edit.comment_id, fd);
      } else {
        await createBlogComment(fd);
      }

      showToast(isEdit ? "Updated successfully" : "Comment added", "success");

      onRefresh();
      onClose();
    } catch (err) {
      showToast(err?.message || "Operation failed", "error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg p-5 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        {/* HEADER */}
        <h2 className="text-lg font-bold mb-4">
          {isEdit
            ? "Edit Blog Comment"
            : isReply
              ? "Reply to Comment"
              : "Add Blog Comment"}
        </h2>

        {/* BLOG SELECT (SEARCH + DROPDOWN) */}
        <div className="mb-3 relative">
          <label className="text-sm">Blog</label>

          <input
            name="blog_id"
            value={form.blog_id}
            onChange={handleChange}
            onFocus={() => setShowDropdown(true)}
            readOnly={isReply}
            placeholder="Search blog..."
            className={`border p-2 w-full rounded ${
              isReply ? "bg-gray-100" : ""
            }`}
          />

          {/* DROPDOWN */}
          {showDropdown && !isReply && (
            <div className="absolute w-full bg-white border rounded shadow max-h-40 overflow-y-auto z-10">
              {filteredBlogs.length ? (
                filteredBlogs.map((b) => (
                  <div
                    key={b.blog_id}
                    onClick={() => selectBlog(b.blog_id)}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    #{b.blog_id} - {b.blog_title}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-400 text-sm">No results</div>
              )}
            </div>
          )}
        </div>

        {/* EMAIL + IP */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            name="visitor_email"
            value={form.visitor_email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 rounded"
          />

          <input
            name="visitor_ip"
            value={form.visitor_ip}
            onChange={handleChange}
            placeholder="IP Address"
            className="border p-2 rounded"
          />
        </div>

        {/* COMMENT */}
        <textarea
          name="comment_text"
          value={form.comment_text}
          onChange={handleChange}
          placeholder="Write comment..."
          className="border p-2 w-full mb-3 rounded min-h-[120px]"
        />

        {/* IMAGE */}
        <label className="flex justify-center border-2 border-dashed p-3 rounded cursor-pointer mb-3">
          <span className="text-gray-500 text-sm">
            {fileName || "Choose image"}
          </span>

          <input
            type="file"
            name="visitor_photo"
            onChange={handleChange}
            className="hidden"
          />
        </label>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-400 px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
