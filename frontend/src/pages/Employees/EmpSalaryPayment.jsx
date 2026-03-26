import React, { useEffect, useState } from "react";
import {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getActiveSalaryInfos
} from "../../services/empSalaryPaymentService";
import EmpSalaryPaymentModal from "../../components/Employees/EmpSalaryPaymentModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";

const EmpSalaryPayment = () => {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [activeSalaries, setActiveSalaries] = useState([]);

  const { toast, showToast, hideToast } = useToast();

  // Fetch Payments & Active Salaries
  const fetchPayments = async () => {
    try {
      const data = await getAllPayments();
      setPayments(data);
    } catch {
      showToast("Failed to load payments", "error");
    }
  };

  const fetchActiveSalaries = async () => {
    try {
      const salaries = await getActiveSalaryInfos();
      setActiveSalaries(salaries);
    } catch {
      showToast("Failed to load active salaries", "error");
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchActiveSalaries();
  }, []);

  // Search Filter
  useEffect(() => {
    const data = payments.filter(p =>
      p.payment_id.toString().includes(search) ||
      p.employee_salary_id.toString().includes(search) ||
      p.employee_id.toString().includes(search) ||
      p.salary_deduction.toString().includes(search) ||
      p.salary_bonus.toString().includes(search) ||
      (p.EmpSalaryInfo?.employee_id?.toString() || "-").includes(search) ||
      p.payment_status?.toLowerCase().includes(search.toLowerCase()) ||
      p.salary_month?.includes(search)
    );
    setFiltered(data);
    setPage(1);
  }, [search, payments]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // Add / Edit / Delete Handlers
  const handleAdd = () => {
    setSelectedPayment(null);
    setModalOpen(true);
  };

  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      await deletePayment(deleteData.payment_id);
      showToast("Deleted successfully", "success");
      fetchPayments();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteData(null);
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedPayment) await updatePayment(selectedPayment.payment_id, data);
      else await createPayment(data);

      setModalOpen(false);
      fetchPayments();
      fetchActiveSalaries();
      showToast("Saved successfully", "success");
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    }
  };

  const getEmployeeID = (payment) => payment.EmpSalaryInfo ? payment.EmpSalaryInfo.employee_id : "-";

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case "Paid": return <span className={`${base} rounded-full bg-green-100 text-green-700`}>Paid</span>;
      case "Pending": return <span className={`${base} rounded-full bg-yellow-100 text-yellow-700`}>Pending</span>;
      case "Failed": return <span className={`${base} rounded-full bg-red-100 text-red-700`}>Failed</span>;
      case "Other": return <span className={`${base} rounded-full bg-gray-300 text-gray-700`}>Other</span>;
      default: return <span className={`${base} rounded-full bg-gray-100 text-gray-600`}>Unknown</span>;
    }
  };

  const getBadge = (amount, type) => {
    const base = "px-2 py-1 rounded text-xs font-semibold";
    if (!amount || parseFloat(amount) === 0) return <span className={`${base} rounded-full bg-gray-100 text-gray-600`}>{amount || 0}</span>;
    if (type === "bonus") return <span className={`${base} rounded-full bg-green-100 text-green-700`}>{amount}</span>;
    if (type === "deduction") return <span className={`${base} rounded-full bg-red-100 text-red-700`}>{amount}</span>;
    if (type === "paid") return <span className={`${base} rounded-full bg-blue-100 text-blue-700`}>{amount}</span>;
    return <span className={`${base} rounded-full bg-gray-100 text-gray-600`}>{amount}</span>;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employee Salary Payments</h1>
        <div className="flex gap-2">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
          <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded">Add Payment</button>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-center text-sm">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Salary ID</th>
              <th className="p-2">Employee ID</th>
              <th className="p-2">Month</th>
              <th className="p-2">Bonus</th>
              <th className="p-2">Deduction</th>
              <th className="p-2">Paid Amount</th>
              <th className="p-2">Payment Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length ? paginated.map(p => (
              <tr key={p.payment_id} className="border-t hover:bg-gray-50">
                <td className="p-2">{p.payment_id}</td>
                <td className="p-2">{p.employee_salary_id}</td>
                <td className="p-2">{getEmployeeID(p)}</td>
                <td className="p-2">{p.salary_month}</td>
                <td className="p-2">{getBadge(p.salary_bonus, "bonus")}</td>
                <td className="p-2">{getBadge(p.salary_deduction, "deduction")}</td>
                <td className="p-2">{getBadge(p.paid_amount, "paid")}</td>
                <td className="p-2">{p.payment_date}</td>
                <td className="p-2">{getStatusBadge(p.payment_status)}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button onClick={() => handleEdit(p)} className="bg-yellow-500 px-2 py-1 text-white rounded">Edit</button>
                  <button onClick={() => setDeleteData(p)} className="bg-red-500 px-2 py-1 text-white rounded">Delete</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="10" className="p-4 text-gray-500">No payment records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination
          page={page}
          total={filtered.length}
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      <EmpSalaryPaymentModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedPayment(null); }}
        onSave={handleSave}
        payment={selectedPayment}
        allPayments={payments}
      />

      {deleteData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <p>Are you sure to delete this payment?</p>
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
};

export default EmpSalaryPayment;
