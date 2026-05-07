import { useState } from "react";
import { FiX, FiSend } from "react-icons/fi";
import { askFaqQuestion } from "../../services/faqsPage.service";

export default function AskQuestionModal({ isOpen, onClose }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // ================= LANGUAGE (DB BASED) =================
  const languageId =
    Number(localStorage.getItem("language_id")) || 1;

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = question.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      setSuccess("");

      // ================= ONLY USER INPUT =================
      const payload = {
        language_id: languageId,
        faqs_question: trimmed,

        // AUTO DEFAULTS (backend will also enforce)
        faqs_answer: "Pending approval",
        faqs_category: "General",
        is_active: false,
      };

      await askFaqQuestion(payload);

      setSuccess("Your question has been submitted successfully.");
      setQuestion("");

      // auto close
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1200);
    } catch (err) {
      console.error("QUESTION SUBMIT ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= CLOSE =================
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div>
            <h2 className="text-lg font-bold">
              Ask Your Question
            </h2>

            <p className="text-xs text-blue-100 mt-1">
              Your question will appear after admin approval.
            </p>
          </div>

          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-full transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* TEXTAREA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Question
            </label>

            <textarea
              rows={5}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Write your question here..."
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* SUCCESS */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
              {success}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-xl transition disabled:opacity-50"
            >
              <FiSend />

              {loading ? "Submitting..." : "Submit Question"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}