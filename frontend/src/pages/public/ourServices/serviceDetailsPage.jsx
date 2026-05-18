import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getService } from "../../../services/servicesPage.service";
import { FiArrowLeft } from "react-icons/fi";

import { formatNumber } from "../../../utils/formatNumber";
import defaultImg from "../../../assets/images/default_image.png";

// ⭐ MODAL
import ServiceRateModal from "../../../components/OurServices/ServiceRateModal";

export default function ServiceDetailsPage() {
  // ================= STATES =================
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ MODAL
  const [openRate, setOpenRate] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // ================= PARAMS =================
  const { serviceId } = useParams();
  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getService(serviceId);
        setService(data);
      } catch (err) {
        console.error("SERVICE DETAILS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  // ================= TOTAL =================
  const total = Number(service?.service_rating || 0);

  // ================= STARS (STATIC UI ONLY) =================
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="text-2xl text-yellow-400">
        ★
      </span>
    ));
  };

  // ================= OPEN MODAL =================
  const handleOpenRate = () => {
    setSelectedService(service.service_id);
    setOpenRate(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">

      {/* ⭐ MODAL */}
      <ServiceRateModal
        isOpen={openRate}
        onClose={() => setOpenRate(false)}
        serviceId={selectedService}
      />

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
          {/* HERO */}
          <section className="relative h-[450px] overflow-hidden">
            <img
              src={
                service.service_image
                  ? BASE_URL + service.service_image
                  : defaultImg
              }
              className="w-full h-full object-cover"
              alt="service"
            />

            <div className="absolute inset-0 bg-black/60" />

            {/* BACK */}
            <Link
              to="/our-services"
              className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl"
            >
              <FiArrowLeft />
              Back
            </Link>

            {/* TITLE */}
            <div className="absolute inset-0 flex items-center z-10">
              <div className="max-w-5xl mx-auto px-4 w-full">

                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  {service.service_title}
                </h1>

                {/* ⭐ RATING SECTION (NO CALCULATION) */}
                <div className="flex items-center gap-4 mt-6 flex-wrap">

                  <div
                    onClick={handleOpenRate}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    {renderStars()}
                  </div>

                  {/* TOTAL ONLY */}
                  <span className="text-white text-sm">
                    {formatNumber(total)} Ratings
                  </span>

                  <button
                    onClick={handleOpenRate}
                    className="bg-yellow-500 px-5 py-2 rounded-full text-white text-sm"
                  >
                    Rate Service
                  </button>

                </div>
              </div>
            </div>
          </section>

          {/* DETAILS */}
          <section className="max-w-5xl mx-auto px-4 py-20">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8">

              <h2 className="text-3xl font-bold mb-6">
                Service Details
              </h2>

              <p className="text-gray-600 leading-8 whitespace-pre-line">
                {service.service_description}
              </p>

              {/* FOOTER */}
              <div className="mt-10 pt-6 border-t flex justify-between items-center flex-wrap gap-4">

                {/* TOTAL */}
                <div className="flex items-center gap-3">
                  {renderStars()}

                  <span className="text-sm text-gray-600">
                    {formatNumber(total)} Ratings
                  </span>
                </div>
                
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
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