import React, { useEffect, useState } from "react";
import {
  createTestimonial,
  updateTestimonial,
} from "../../services/testimonialsPage.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function TestimonialsModal({
  open,
  onClose,
  edit,
  onRefresh,
}) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [fileName, setFileName] = useState("");

  const [form, setForm] = useState({
    testimonial_name: "",
    testimonial_email: "",
    testimonial_photo: null,
    testimonial_message: "",
    testimonial_rating: 5,
    is_approved: "0",
  });

  // ================= EDIT LOAD =================
  useEffect(() => {
    if (edit) {
      setForm({
        testimonial_name: edit.testimonial_name || "",
        testimonial_email: edit.testimonial_email || "",
        testimonial_photo: null,
        testimonial_message: edit.testimonial_message || "",
        testimonial_rating: edit.testimonial_rating || 5,
        is_approved: edit.is_approved ? "1" : "0",
      });

      setFileName("");
    }
  }, [edit]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // IMAGE
    if (name === "testimonial_photo") {
      const file = files[0];
      setForm((prev) => ({ ...prev, testimonial_photo: file }));
      setFileName(file?.name || "");
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.testimonial_name || !form.testimonial_message) {
        showToast("Name and message required", "error");
        return;
      }

      const fd = new FormData();

      Object.keys(form).forEach((k) => {
        if (form[k] !== null) fd.append(k, form[k]);
      });

      if (isEdit) {
        await updateTestimonial(edit.testimonial_id, fd);
        showToast("Updated successfully", "success");
      } else {
        await createTestimonial(fd);
        showToast("Created successfully", "success");
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.log(err);
      showToast("Operation failed", "error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">

      <div className="bg-white w-full max-w-2xl p-5 rounded-lg overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit Testimonial" : "Add Testimonial"}
        </h2>

        {/* NAME */}
        <label className="text-sm">Name</label>
        <input
          name="testimonial_name"
          value={form.testimonial_name}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* EMAIL */}
        <label className="text-sm">Email</label>
        <input
          name="testimonial_email"
          value={form.testimonial_email}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* MESSAGE */}
        <label className="text-sm">Message</label>
        <textarea
          name="testimonial_message"
          value={form.testimonial_message}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded min-h-[120px]"
        />

        {/* RATING */}
        <label className="text-sm">Rating</label>
        <select
          name="testimonial_rating"
          value={form.testimonial_rating}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* APPROVED DROPDOWN */}
        <label className="text-sm">Approved</label>
        <select
          name="is_approved"
          value={form.is_approved}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="0">Pending</option>
          <option value="1">Approved</option>
        </select>

        {/* IMAGE */}
        <label className="text-sm">Photo</label>
        <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer mb-3">
          <span className="text-gray-500 text-sm">
            {fileName || "Choose Image"}
          </span>

          <input
            type="file"
            name="testimonial_photo"
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