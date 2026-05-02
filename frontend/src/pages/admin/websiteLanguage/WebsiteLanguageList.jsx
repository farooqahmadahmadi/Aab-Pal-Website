import React, { useEffect, useState } from "react";
import { getLanguages, deleteLanguage } from "../../../services";

import LanguageModal from "../../../components/WebsiteLanguage/LanguageModal";
import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import Toast from "../../../components/common/Toast";
import useToast from "../../../hooks/useToast";

import { FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";

export default function WebsiteLanguageList() {
  const [languages, setLanguages] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  const fetchData = async () => {
    try {
      const res = await getLanguages();
      setLanguages(res.data || []);
    } catch {
      showToast("Failed to load languages", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const f = languages.filter(
      (l) =>
        l.language_name.toLowerCase().includes(search.toLowerCase()) ||
        l.language_code.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(f);
    setPage(1);
  }, [search, languages]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const handleDelete = (item) => setDeleteData(item);

  const confirmDelete = async () => {
    try {
      await deleteLanguage(deleteData.language_id);
      showToast("Deleted successfully", "success");
      fetchData();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteData(null);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Website Languages</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FiPlusCircle /> Add
        </button>
      </div>

      {/* SEARCH */}
      <SearchBar value={search} onChange={setSearch} />

      {/* TABLE */}
      <div className="bg-white shadow rounded mt-3 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Direction</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((l) => (
              <tr key={l.language_id} className="text-center border-t">
                <td>{l.language_id}</td>
                <td>{l.language_code}</td>
                <td>{l.language_name}</td>
                <td>{l.language_direction}</td>

                <td className="flex justify-center gap-2 p-2">
                  <button
                    onClick={() => {
                      setSelected(l);
                      setShowModal(true);
                    }}
                    className="bg-yellow-500 text-white p-1 rounded"
                  >
                    <FiEdit3 />
                  </button>

                  <button
                    onClick={() => handleDelete(l)}
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
      {showModal && (
        <LanguageModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelected(null);
          }}
          initialData={selected}
          onRefresh={fetchData}
        />
      )}

      {/* DELETE */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <p>Delete {deleteData.language_name}?</p>

            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setDeleteData(null)}>Cancel</button>
              <button onClick={confirmDelete} className="text-red-500">
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
