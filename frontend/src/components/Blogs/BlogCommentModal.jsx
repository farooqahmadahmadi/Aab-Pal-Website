import React, { useState, useEffect } from "react";
import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";
import {
  createBlogComment,
  updateBlogComment,
} from "../../services/blogComments.service";

export default function BlogCommentModal({
  open,
  onClose,
  blogId,
  parentId, // ✅ NEW
  onRefresh,
  edit,
}) {
  const isEdit = !!edit;

  const { toast, showToast, hideToast } = useToast();

  const [fileName, setFileName] = useState("");

  const [form, setForm] = useState({
    blog_id: blogId || "",
    visitor_email: "",
    visitor_ip: "",
    visitor_rating: "5",
    comment_text: "",
    visitor_photo: null,
    is_approved: "0",
    parent_id: parentId || null, // ✅
  });

  const isReply = !!(parentId || form.parent_id) && !isEdit;

  
  // ================= LOAD EDIT =================
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

  // ================= HANDLE REPLY INIT =================
  useEffect(() => {
    if (!edit) {
      setForm((prev) => ({
        ...prev,
        blog_id: blogId || prev.blog_id,
        parent_id: parentId || null,
      }));
    }
  }, [blogId, parentId, edit]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "visitor_photo") {
      const file = files?.[0];
      setForm((p) => ({ ...p, visitor_photo: file || null }));
      setFileName(file?.name || "");
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

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

        {/* BLOG + PARENT */}
        <div
          className={`grid gap-2 mb-3 ${
            isReply ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* BLOG ID */}
          <div>
            <label className="text-sm">Blog ID</label>
            <input
              name="blog_id"
              value={form.blog_id}
              onChange={handleChange}
              readOnly={isReply}
              className={`border p-2 w-full rounded ${
                isReply ? "bg-gray-100" : ""
              }`}
            />
          </div>

          {/* PARENT ID */}
          {isReply && (
            <div>
              <label className="text-sm">Parent Comment ID</label>
              <input
                name="parent_id"
                value={form.parent_id || ""}
                readOnly
                className="border p-2 w-full rounded bg-gray-100"
              />
            </div>
          )}
        </div>

        {/* EMAIL + IP */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-sm">Email</label>
            <input
              name="visitor_email"
              value={form.visitor_email}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label className="text-sm">IP Address</label>
            <input
              name="visitor_ip"
              value={form.visitor_ip}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              placeholder="192.168.1.1"
            />
          </div>
        </div>

        {/* RATING + STATUS */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-sm">Rating</label>
            <select
              name="visitor_rating"
              value={form.visitor_rating}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">Status</label>
            <select
              name="is_approved"
              value={form.is_approved}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="0">Pending</option>
              <option value="1">Approved</option>
            </select>
          </div>
        </div>

        {/* COMMENT */}
        <label className="text-sm">Comment</label>
        <textarea
          name="comment_text"
          value={form.comment_text}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded min-h-[120px]"
          placeholder="Write your comment..."
        />

        {/* FILE */}
        <label className="text-sm">Visitor Photo</label>
        <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer hover:bg-gray-50 mb-4">
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

      {/* TOAST */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
