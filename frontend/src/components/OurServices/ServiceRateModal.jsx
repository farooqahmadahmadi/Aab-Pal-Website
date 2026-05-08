import { useState } from "react";
import { FiX, FiStar } from "react-icons/fi";
import { updateServiceRating } from "../../services/servicesPage.service";

export default function ServiceRateModal({ isOpen, onClose, serviceId }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await updateServiceRating(serviceId, {
        rating: Number(rating),
      });

      onClose();
      setRating(0);
    } catch (err) {
      console.error("RATING ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 relative">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <FiX size={20} />
        </button>

        {/* TITLE */}
        <h2 className="text-lg font-bold text-center mb-4">
          Rate This Service
        </h2>

        {/* STARS */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              size={28}
              className={`cursor-pointer transition ${
                (hover || rating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!rating || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Rating"}
        </button>
      </div>
    </div>
  );
}
