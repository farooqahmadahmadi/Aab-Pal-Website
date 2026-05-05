import { useEffect, useState } from "react";

import {
  getTestimonials,
  deleteTestimonial,
} from "../../../services/testimonialsPage.service";

import TestimonialsModal from "../../../components/Testimonials/TestimonialModal";

import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../../components/common/MobileCard";
import CardRow from "../../../components/common/CardRow";

import defaultImg from "../../../assets/images/default_image.png";

export default function TestimonialsList() {
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
      const res = await getTestimonials();
      setData(res?.data || []);
    } catch {
      showToast("Failed to load testimonials", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const f = data.filter(
      (t) =>
        (t.testimonial_name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (t.testimonial_message || "")
          .toLowerCase()
          .includes(search.toLowerCase())
    );

    setFiltered(f);
    setPage(1);
  }, [search, data]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      await deleteTestimonial(deleteItem.testimonial_id);
      showToast("Deleted successfully", "success");
      fetchData();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteItem(null);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Testimonials</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search testimonials..."
          />

          <button
            onClick={() => {
              setEdit(null);
              setOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FiPlusCircle /> Add Testimonial
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        {/* DESKTOP */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Photo</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Approved</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((t) => (
                  <tr key={t.testimonial_id} className="text-center border-t">

                    <td className="p-2">{t.testimonial_id}</td>

                    {/* IMAGE */}
                    <td className="p-2">
                      <img
                        src={
                          t.testimonial_photo
                            ? `${BASE_URL}${t.testimonial_photo}`
                            : defaultImg
                        }
                        onError={(e) => {
                          e.target.src = defaultImg;
                        }}
                        className="w-10 h-10 rounded-full mx-auto object-cover border"
                      />
                    </td>

                    <td className="p-2">{t.testimonial_name}</td>
                    <td className="p-2">{t.testimonial_email}</td>
                    <td className="p-2">{t.testimonial_rating}</td>
                    <td className="p-2">
                      {t.is_approved ? "Approved" : "Pending"}
                    </td>

                    <td className="p-2">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => {
                            setEdit(t);
                            setOpen(true);
                          }}
                          className="bg-yellow-500 p-1.5 text-white rounded"
                        >
                          <FiEdit3 />
                        </button>

                        <button
                          onClick={() => setDeleteItem(t)}
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
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No testimonials found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.map((t) => (
            <MobileCard
              key={t.testimonial_id}
              id={t.testimonial_id}
              actions={
                <>
                  <button
                    onClick={() => {
                      setEdit(t);
                      setOpen(true);
                    }}
                    className="bg-yellow-500 p-2 text-white rounded"
                  >
                    <FiEdit3 />
                  </button>

                  <button
                    onClick={() => setDeleteItem(t)}
                    className="bg-red-500 p-2 text-white rounded"
                  >
                    <FiTrash2 />
                  </button>
                </>
              }
            >
              {/* PHOTO */}
              <div className="flex justify-center mb-2">
                <img
                  src={
                    t.testimonial_photo
                      ? `${BASE_URL}${t.testimonial_photo}`
                      : defaultImg
                  }
                  className="w-14 h-14 rounded-full object-cover border"
                />
              </div>

              <CardRow label="Name" value={t.testimonial_name} />
              <CardRow label="Email" value={t.testimonial_email} />
              <CardRow label="Rating" value={t.testimonial_rating} />
              <CardRow
                label="Status"
                value={t.is_approved ? "Approved" : "Pending"}
              />
            </MobileCard>
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex justify-center">
        <Pagination
          page={page}
          total={filtered.length}
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      {/* MODAL */}
      <TestimonialsModal
        open={open}
        edit={edit}
        onClose={() => setOpen(false)}
        onRefresh={fetchData}
      />

      {/* DELETE MODAL */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-5 rounded-lg w-full max-w-sm">

            <p className="mb-4">
              Delete testimonial from <b>{deleteItem.testimonial_name}</b>?
            </p>

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

      {/* TOAST */}
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