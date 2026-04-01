import React, { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";

import CashTransactionModal from "../../components/CashTransaction/CashTransactionModal";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";

import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
} from "../../services/cashTransactionsService";

export default function CashTransactions() {
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
            const res = await getTransactions();
            setData(res.data || []);
        } catch {
            showToast("Load failed", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const f = data.filter(i =>
            i.transaction_id.toString().includes(search) ||
            i.transaction_description?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(f);
        setPage(1);
    }, [search, data]);

    const paginated = filtered.slice((page - 1) * limit, page * limit);

    const submit = async (form) => {
        try {
            if (editData) {
                await updateTransaction(editData.transaction_id, form);
                showToast("Updated successfully", "success");
            } else {
                await addTransaction(form);
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
            await deleteTransaction(deleteData.transaction_id);
            showToast("Deleted", "success");
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
                <h2 className="text-2xl font-bold">Cash Transactions</h2>

                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} />
                    <button onClick={() => { setModalOpen(true); setEditData(null); }} className="bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center">
                        <FiPlusCircle /> Add Transaction
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-center text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.length ? paginated.map(i => (
                            <tr key={i.transaction_id} className="border-t">
                                <td>{i.transaction_id}</td>
                                <td>{i.transaction_type}</td>
                                <td>{i.amount}</td>
                                <td>{i.transaction_description}</td>
                                <td>{i.transaction_date}</td>
                                <td className="flex justify-center gap-2">
                                    <button onClick={() => { setEditData(i); setModalOpen(true); }} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                                    <button onClick={() => setDeleteData(i)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="p-4 text-gray-500">No cash transaction records found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center">
                <Pagination page={page} total={filtered.length} limit={limit} onPageChange={setPage} />
            </div>

            <CashTransactionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={submit}
                initialData={editData}
            />

            {deleteData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-96">
                        <p>Delete this transaction?</p>
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