import React, { useEffect, useState } from "react";
import {
  getAboutPages,
  deleteAboutPage,
} from "../../../services/aboutPage.service";

import AboutModal from "../../../components/About/AboutModal";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import defaultImg from "../../../assets/images/about-default.jpg";

export default function AboutPageList() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  // ✅ USE ENV (NO HARDCODED LOCALHOST)
  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  const fetchData = async () => {
    try {
      const res = await getAboutPages();
      setData(res.data || []);
    } catch {
      showToast("Failed to load data", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteAboutPage(deleteItem.about_id);
      showToast("Deleted successfully", "success");
      fetchData();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteItem(null);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">About Page</h2>

        <button
          onClick={() => {
            setEdit(null);
            setOpen(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FiPlusCircle /> Add
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-gray-200">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.about_id} className="text-center border-t">

                <td>{item.about_id}</td>

                {/* IMAGE */}
                <td className="flex justify-center p-2">
                  <img
                    src={
                      item.about_image
                        ? `${BASE_URL}${item.about_image}`
                        : defaultImg
                    }
                    onError={(e) => {
                      e.target.src = defaultImg;
                    }}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                </td>

                <td>{item.about_title}</td>
                <td>{item.display_order}</td>

                <td className="flex justify-center gap-2 p-2">

                  <button
                    onClick={() => {
                      setEdit(item);
                      setOpen(true);
                    }}
                    className="bg-yellow-500 text-white p-1 rounded"
                  >
                    <FiEdit3 />
                  </button>

                  <button
                    onClick={() => setDeleteItem(item)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    <FiTrash2 />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {open && (
        <AboutModal
          open={open}
          edit={edit}
          onClose={() => setOpen(false)}
          onRefresh={fetchData}
        />
      )}

      {/* DELETE */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <p>Delete this record?</p>

            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setDeleteItem(null)}>Cancel</button>
              <button onClick={handleDelete} className="text-red-500">
                Delete
              </button>
            </div>

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