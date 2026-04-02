
import React, { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import PaymentsInfoModal from "../../components/PaymentsInfo/PaymentsInfoModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import SearchBar from "../../components/common/SearchBar";

import { getPayments, addPayment, updatePayment, deletePayment } from "../../services/paymentsInfoService";

export default function PaymentsInfo() {
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
        try { const res = await getPayments(); setData(res.data || []); } 
        catch { showToast("Failed to load payments", "error"); }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const f = data.filter(i =>
            i.payment_id.toString().includes(search) ||
            i.invoice_id.toString().includes(search) ||
            i.payment_method?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(f); setPage(1);
    }, [search, data]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const submit = async form => {
        try {
            if(editData) { await updatePayment(editData.payment_id, form); showToast("Updated successfully", "success"); }
            else { await addPayment(form); showToast("Added successfully", "success"); }
            setModalOpen(false); setEditData(null); fetchData();
        } catch { showToast("Operation failed", "error"); }
    };

    const handleDelete = async () => {
        try { await deletePayment(deleteData.payment_id); showToast("Deleted successfully", "success"); fetchData(); }
        catch { showToast("Delete failed", "error"); }
        finally { setDeleteData(null); }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Payments</h2>
                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />
                    <button onClick={() => { setModalOpen(true); setEditData(null); }} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                        <FiPlusCircle /> Add Payment
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full text-center text-sm">
                    <thead className="bg-gray-200 text-sm">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Invoice</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Method</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length ? paginated.map(i => (
                            <tr key={i.payment_id} className="border-t hover:bg-gray-50">
                                <td>{i.payment_id}</td>
                                <td>{i.invoice_id}</td>
                                <td>{i.payment_amount}</td>
                                <td>{i.payment_date}</td>
                                <td>{i.payment_method}</td>
                                <td>{i.payment_status}</td>
                                <td className="p-2 flex justify-center gap-1.5">
                                    <button onClick={() => { setEditData(i); setModalOpen(true); }} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                                    <button onClick={() => setDeleteData(i)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="p-4 text-gray-500">No payments found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center">
                <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />
            </div>

            <PaymentsInfoModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditData(null); }} onSubmit={submit} initialData={editData} />

            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-96">
                        <p className="mb-4">Delete this payment?</p>
                        <div className="flex justify-end gap-2">
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