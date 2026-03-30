import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { getItems, addItem, updateItem, deleteItem } from "../../services/purchaseOrderItemsService";
import PurchaseOrderItemsModal from "../../components/Inventory/PurchaseOrderItemsModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";

export default function PurchaseOrderItems() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);

    const { toast, showToast, hideToast } = useToast();

    const fetchData = async () => {
        try {
            const res = await getItems();
            setData(res.data || []);
        } catch {
            showToast("Load failed", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const f = data.filter(i =>
            i.po_item_id.toString().includes(search) ||
            i.po_id.toString().includes(search)
        );
        setFiltered(f);
        setPage(1);
    }, [search, data]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const submit = async (formData) => {
        try {
            if (editData) {
                await updateItem(editData.po_item_id, formData);
                showToast("Updated successfully", "success");
            } else {
                await addItem(formData);
                showToast("Added successfully", "success");
            }
            setModalOpen(false);
            setEditData(null);
            fetchData();
        } catch {
            showToast("Error", "error");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteItem(deleteData.po_item_id);
            showToast("Deleted successfully", "success");
            fetchData();
        } catch {
            showToast("Delete failed", "error");
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">PO Items</h2>

                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />
                    <button onClick={() => { setModalOpen(true); setEditData(null); }}
                        className="bg-green-500 text-white px-4 py-2 flex gap-2 items-center rounded">
                        <FaPlus /> Add PO Items
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-center">
                    <thead className="bg-gray-200">
                        <tr>
                            <th>ID</th>
                            <th>PO</th>
                            <th>Material</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.length ? paginated.map(i => (
                            <tr key={i.po_item_id} className="border-t hover:bg-gray-50">
                                <td>{i.po_item_id}</td>
                                <td>{i.po_id}</td>
                                <td>{i.material_id}</td>
                                <td>{i.po_item_quantity}</td>
                                <td>{i.po_item_unit_price}</td>
                                <td>{i.total_amount}</td>

                                <td className="flex justify-center gap-1.5 p-2">
                                    <button onClick={() => { setEditData(i); setModalOpen(true); }} className="bg-yellow-500 px-2 py-1 text-white rounded">Edit</button>
                                    <button onClick={() => setDeleteData(i)} className="bg-red-500 px-2 py-1 text-white rounded">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="p-4 text-gray-500">No data</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center">
                <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />
            </div>

            <PurchaseOrderItemsModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={submit}
                initialData={editData}
            />

            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-96">
                        <p>Delete item #{deleteData.po_item_id}?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setDeleteData(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
}
