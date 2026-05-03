import React, { useEffect, useState } from "react";
import {
  getHomePages,
  deleteHomePage,
} from "../../../services/homePage.service";

import HomeModal from "../../../components/Home/HomeModal";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

import defaultImg from "../../../assets/images/about-default.jpg";

export default function HomePageList() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  const fetchData = async () => {
    try {
      const res = await getHomePages();
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
      await deleteHomePage(deleteItem.section_id);
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
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Home Page</h2>

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
              <tr key={item.section_id} className="text-center border-t">
                <td>{item.section_id}</td>

                <td className="flex justify-center p-2">
                  <img
                    src={
                      item.section_image
                        ? `${BASE_URL}${item.section_image}`
                        : defaultImg
                    }
                    className="w-12 h-12 rounded object-cover border"
                  />
                </td>

                <td>{item.section_title}</td>
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

      {open && (
        <HomeModal
          open={open}
          edit={edit}
          onClose={() => setOpen(false)}
          onRefresh={fetchData}
        />
      )}

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

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
