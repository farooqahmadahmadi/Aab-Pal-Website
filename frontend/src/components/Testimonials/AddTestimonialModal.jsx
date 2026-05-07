import { useState } from "react";
import { FiX, FiSend } from "react-icons/fi";
import { createPublicTestimonial } from "../../services/testimonialsPage.service";

export default function AddTestimonialModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    testimonial_name: "",
    testimonial_email: "",
    testimonial_message: "",
    testimonial_rating: 5,
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= FILE CHANGE =================
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.testimonial_name.trim() ||
      !form.testimonial_message.trim()
    ) return;

    try {
      setLoading(true);
      setSuccess("");

      // 🔥 FORM DATA (IMPORTANT FOR FILE UPLOAD)
      const formData = new FormData();

      formData.append("testimonial_name", form.testimonial_name);
      formData.append("testimonial_email", form.testimonial_email);
      formData.append("testimonial_message", form.testimonial_message);
      formData.append("testimonial_rating", Number(form.testimonial_rating));

      if (file) {
        formData.append("testimonial_photo", file);
      }

      await createPublicTestimonial(formData);

      setSuccess("Thank you! Your testimonial is submitted for review.");

      setForm({
        testimonial_name: "",
        testimonial_email: "",
        testimonial_message: "",
        testimonial_rating: 5,
      });

      setFile(null);

      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1200);
    } catch (err) {
      console.error("TESTIMONIAL SUBMIT ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div>
            <h2 className="text-lg font-bold">Share Your Experience</h2>
            <p className="text-xs text-blue-100">
              Your review will appear after admin approval
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* NAME */}
          <input
            name="testimonial_name"
            value={form.testimonial_name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* EMAIL */}
          <input
            name="testimonial_email"
            value={form.testimonial_email}
            onChange={handleChange}
            placeholder="Your Email (optional)"
            className="w-full border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* MESSAGE */}
          <textarea
            name="testimonial_message"
            value={form.testimonial_message}
            onChange={handleChange}
            rows={4}
            placeholder="Write your feedback..."
            className="w-full border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          {/* RATING */}
          <select
            name="testimonial_rating"
            value={form.testimonial_rating}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star
              </option>
            ))}
          </select>

         {/* IMAGE */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Photo
  </label>

  <label className="flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-4 cursor-pointer transition bg-gray-50 hover:bg-blue-50">

    <span className="text-gray-500 text-sm text-center">
      {file?.name || "Choose Image"}
    </span>

    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
    />
  </label>
</div>

          {/* SUCCESS */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
              {success}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm disabled:opacity-50"
            >
              <FiSend />
              {loading ? "Submitting..." : "Submit"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}