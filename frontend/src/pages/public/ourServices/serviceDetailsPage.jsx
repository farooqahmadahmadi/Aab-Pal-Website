import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getService } from "../../../services/servicesPage.service";
import { FiArrowLeft } from "react-icons/fi";

export default function ServiceDetailsPage() {
  // ================= STATES =================
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= PARAMS =================
  const { serviceId } = useParams(); // ✅ FIXED (must match route)

  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getService(serviceId); // ✅ already normalized in service file

        setService(data);
      } catch (err) {
        console.error("SERVICE DETAILS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  // ================= STARS =================
  const renderStars = (rating = 5) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`text-xl ${
          i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <p className="text-gray-500 text-lg">Loading service details...</p>
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && !service && (
        <div className="flex items-center justify-center py-32">
          <p className="text-gray-500 text-lg">Service not found.</p>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      {!loading && service && (
        <>
          {/* HERO IMAGE */}
          <section className="relative h-[450px] overflow-hidden">
            <img
              src={
                service.service_image
                  ? BASE_URL + service.service_image
                  : "https://via.placeholder.com/1200x600"
              }
              alt={service.service_title}
              className="w-full h-full object-cover"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* back button */}
            <Link
              to="/our-services"
              className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition"
            >
              <FiArrowLeft />
              Back
            </Link>

            {/* content */}
            <div className="absolute inset-0 z-10 flex items-center">
              <div className="max-w-5xl mx-auto px-4 w-full">
                <div className="max-w-3xl">
                  <span className="inline-block bg-blue-500/20 backdrop-blur-md border border-blue-300/20 text-white text-sm px-4 py-2 rounded-full mb-5">
                    Premium Service
                  </span>

                  <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                    {service.service_title}
                  </h1>

                  {/* stars */}
                  <div className="flex items-center gap-1 mt-6">
                    {renderStars(service.service_rating)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DETAILS */}
          <section className="max-w-5xl mx-auto px-4 py-20">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-8 md:p-12">

              {/* heading */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-800">
                  Service Details
                </h2>
                <div className="w-24 h-1 bg-blue-600 rounded-full mt-4" />
              </div>

              {/* description */}
              <div className="text-gray-600 leading-8 text-base whitespace-pre-line">
                {service.service_description}
              </div>

              {/* footer */}
              <div className="mt-12 pt-8 border-t flex flex-wrap items-center justify-between gap-4">

                <div>
                  <p className="text-sm text-gray-500 mb-2">Service Rating</p>
                  <div className="flex items-center gap-1">
                    {renderStars(service.service_rating)}
                  </div>
                </div>

                <span className="bg-green-100 text-green-700 text-sm px-5 py-2 rounded-full font-semibold">
                  Active Service
                </span>

              </div>

            </div>
          </section>
        </>
      )}
    </div>
  );
}