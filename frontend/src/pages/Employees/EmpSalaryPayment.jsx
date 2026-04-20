import React, { useEffect, useState } from "react";
import {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getActiveSalaryInfos,
} from "../../services/empSalaryPaymentService";

import EmpSalaryPaymentModal from "../../components/Employees/EmpSalaryPaymentModal";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";

import { FaPlus } from "react-icons/fa";
import { FiEdit3, FiPlusCircle, FiTrash2 } from "react-icons/fi";

import MobileCard from "../../components/common/MobileCard";
import CardRow from "../../components/common/CardRow";

import { useTranslation } from "react-i18next";

const EmpSalaryPayment = () => {
  const { t } = useTranslation();

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

  // ===== FETCH =====
  const fetchPayments = async () => {
    try {
      const data = await getAllPayments();
      setPayments(data || []);
    } catch {
      showToast(t("failed_fetch"), "error");
    }
  };

  const fetchActiveSalaries = async () => {
    try {
      const salaries = await getActiveSalaryInfos();
      setActiveSalaries(salaries || []);
    } catch {
      showToast(t("failed_fetch"), "error");
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchActiveSalaries();
  }, []);

  // ===== SEARCH =====
  useEffect(() => {
    const q = search.toLowerCase();

    const data = payments.filter((p) => {
      return (
        p.payment_id?.toString().includes(q) ||
        p.employee_salary_id?.toString().includes(q) ||
        p.employee_id?.toString().includes(q) ||
        p.salary_month?.toLowerCase().includes(q) ||
        p.payment_status?.toLowerCase().includes(q)
      );
    });

    setFiltered(data);
    setPage(1);
  }, [search, payments]);

  // ===== PAGINATION =====
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // ===== SAVE =====
  const handleSave = async (data) => {
    try {
      if (selectedPayment) {
        await updatePayment(selectedPayment.payment_id, data);
        showToast(t("updated_success"), "success");
      } else {
        await createPayment(data);
        showToast(t("added_success"), "success");
      }

      setModalOpen(false);
      setSelectedPayment(null);
      fetchPayments();
      fetchActiveSalaries();
    } catch {
      showToast(t("operation_failed"), "error");
    }
  };

  // ===== DELETE =====
  const handleDelete = async () => {
    try {
      await deletePayment(deleteData.payment_id);
      showToast(t("deleted_success"), "success");
      fetchPayments();
    } catch {
      showToast(t("delete_failed"), "error");
    } finally {
      setDeleteData(null);
    }
  };

  // ===== HELPERS =====
  const getEmployeeID = (p) => p.EmpSalaryInfo?.employee_id || "-";

  const getStatus = (status) => {
    const base = "px-2 py-1 rounded text-xs font-semibold";

    if (status === "Paid")
      return (
        <span className={`${base} bg-green-100 text-green-700`}>
          {t("paid")}
        </span>
      );

    if (status === "Pending")
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700`}>
          {t("pending")}
        </span>
      );

    if (status === "Failed")
      return (
        <span className={`${base} bg-red-100 text-red-700`}>{t("failed")}</span>
      );

    return (
      <span className={`${base} bg-gray-100 text-gray-600`}>
        {t("unknown")}
      </span>
    );
  };

  const getBadge = (value, type) => {
    const base = "px-2 py-1 rounded text-xs font-semibold";

    if (!value || value === 0)
      return <span className={`${base} bg-gray-100 text-gray-600`}>0</span>;

    if (type === "bonus")
      return (
        <span className={`${base} bg-green-100 text-green-700`}>{value}</span>
      );

    if (type === "deduction")
      return <span className={`${base} bg-red-100 text-red-700`}>{value}</span>;

    if (type === "paid")
      return (
        <span className={`${base} bg-blue-100 text-blue-700`}>{value}</span>
      );

    return <span className={`${base} bg-gray-100 text-gray-600`}>{value}</span>;
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* ===== TOP BAR ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          {t("salary_payments")}
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="border p-2 rounded"
          />

          <button
            onClick={() => {
              setModalOpen(true);
              setSelectedPayment(null);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiPlusCircle /> {t("add_payment")}
          </button>
        </div>
      </div>

      {/* ===== TABLE / MOBILE ===== */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* ===== DESKTOP ===== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">{t("id")}</th>
                <th className="p-2">{t("salary_id")}</th>
                <th className="p-2">{t("emp_id")}</th>
                <th className="p-2">{t("month")}</th>
                <th className="p-2">{t("bonus")}</th>
                <th className="p-2">{t("deduction")}</th>
                <th className="p-2">{t("paid_amount")}</th>
                <th className="p-2">{t("payment_date")}</th>
                <th className="p-2">{t("status")}</th>
                <th className="p-2 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? (
                paginated.map((p) => (
                  <tr key={p.payment_id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{p.payment_id}</td>
                    <td className="p-2">{p.employee_salary_id}</td>
                    <td className="p-2">{getEmployeeID(p)}</td>
                    <td className="p-2">{p.salary_month}</td>
                    <td className="p-2">{getBadge(p.salary_bonus, "bonus")}</td>
                    <td className="p-2">
                      {getBadge(p.salary_deduction, "deduction")}
                    </td>
                    <td className="p-2">{getBadge(p.paid_amount, "paid")}</td>
                    <td className="p-2">{p.payment_date}</td>
                    <td className="p-2">{getStatus(p.payment_status)}</td>

                    <td className="p-2 flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedPayment(p);
                          setModalOpen(true);
                        }}
                        className="bg-yellow-500 p-2 text-white rounded"
                      >
                        <FiEdit3 />
                      </button>

                      <button
                        onClick={() => setDeleteData(p)}
                        className="bg-red-500 p-2 text-white rounded"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center p-4 text-gray-500">
                    {t("no_records")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE ===== */}
        <div className="md:hidden p-2 space-y-3">
          {paginated.length > 0 ? (
            paginated.map((p) => (
              <MobileCard
                key={p.payment_id}
                id={p.payment_id}
                actions={
                  <>
                    <button
                      onClick={() => {
                        setSelectedPayment(p);
                        setModalOpen(true);
                      }}
                      className="bg-yellow-500 p-2 text-white rounded"
                    >
                      <FiEdit3 />
                    </button>

                    <button
                      onClick={() => setDeleteData(p)}
                      className="bg-red-500 p-2 text-white rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                }
              >
                <CardRow label={t("emp_id")} value={getEmployeeID(p)} />
                <CardRow label={t("month")} value={p.salary_month} />
                <CardRow label={t("bonus")} value={p.salary_bonus} />
                <CardRow label={t("deduction")} value={p.salary_deduction} />
                <CardRow label={t("paid_amount")} value={p.paid_amount} />
                <CardRow label={t("payment_date")} value={p.payment_date} />
                <CardRow label={t("status")} value={p.payment_status} />
              </MobileCard>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              {t("no_records")}
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL ===== */}
      <EmpSalaryPaymentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPayment(null);
        }}
        onSave={handleSave}
        payment={selectedPayment}
        allPayments={payments}
      />

      {/* ===== DELETE ===== */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <p>{t("delete_confirm")}</p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteData(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                {t("cancel")}
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TOAST ===== */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default EmpSalaryPayment;
