import React, { useState, useEffect } from "react";
import { getActiveSalaryInfos } from "../../services/empSalaryPaymentService";
import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

import { useTranslation } from "react-i18next";

const EmpSalaryPaymentModal = ({
  isOpen,
  onClose,
  onSave,
  payment,
  allPayments = [],
}) => {
  const [form, setForm] = useState({
    employee_salary_id: "",
    salary_month: "",
    salary_bonus: 0,
    salary_deduction: 0,
    paid_amount: 0,
    payment_date: "",
    payment_status: "Pending",
  });

  const { t } = useTranslation();

  const [activeSalaries, setActiveSalaries] = useState([]);
  const [baseSalary, setBaseSalary] = useState(0);

  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const fetchActive = async () => {
      const salaries = await getActiveSalaryInfos();
      setActiveSalaries(salaries);
    };
    fetchActive();
  }, []);

  useEffect(() => {
    if (payment) {
      const salaryInfo = activeSalaries.find(
        (s) => s.employee_salary_id === payment.employee_salary_id,
      );

      let base = 0;
      if (salaryInfo) {
        base =
          parseFloat(salaryInfo.base_salary || 0) +
          parseFloat(salaryInfo.allowance || 0);
      } else {
        base =
          parseFloat(payment.paid_amount || 0) -
          parseFloat(payment.salary_bonus || 0) +
          parseFloat(payment.salary_deduction || 0);
      }

      setBaseSalary(base);

      const bonus = parseFloat(payment.salary_bonus || 0);
      const deduction = parseFloat(payment.salary_deduction || 0);

      setForm({
        employee_salary_id: payment.employee_salary_id,
        salary_month: payment.salary_month,
        salary_bonus: bonus,
        salary_deduction: deduction,
        paid_amount: parseFloat((base + bonus - deduction).toFixed(2)),
        payment_date: payment.payment_date || "",
        payment_status: payment.payment_status || "Pending",
      });
    } else {
      setForm({
        employee_salary_id: "",
        salary_month: "",
        salary_bonus: 0,
        salary_deduction: 0,
        paid_amount: 0,
        payment_date: "",
        payment_status: "Pending",
      });
      setBaseSalary(0);
    }
  }, [payment, activeSalaries]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedForm = { ...form, [name]: value };
    let base = baseSalary;

    if (name === "employee_salary_id") {
      const selected = activeSalaries.find(
        (s) => s.employee_salary_id.toString() === value,
      );

      if (selected) {
        base =
          parseFloat(selected.base_salary || 0) +
          parseFloat(selected.allowance || 0);
        setBaseSalary(base);
      }
    }

    const bonus = parseFloat(
      name === "salary_bonus" ? value : updatedForm.salary_bonus || 0,
    );

    const deduction = parseFloat(
      name === "salary_deduction" ? value : updatedForm.salary_deduction || 0,
    );

    updatedForm.paid_amount = parseFloat((base + bonus - deduction).toFixed(2));

    setForm(updatedForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.employee_salary_id) {
      showToast("Please select an Employee Salary", "error");
      return;
    }

    const duplicate = allPayments.find(
      (p) =>
        p.salary_month === form.salary_month &&
        p.EmpSalaryInfo?.employee_id ===
          activeSalaries.find(
            (s) => s.employee_salary_id == form.employee_salary_id,
          )?.employee_id &&
        (!payment || p.payment_id !== payment.payment_id),
    );

    if (duplicate) {
      showToast("This employee already has a payment for this month", "error");
      return;
    }

    const payload = {
      employee_salary_id: parseInt(form.employee_salary_id),
      salary_month: form.salary_month,
      salary_bonus: parseFloat(form.salary_bonus) || 0,
      salary_deduction: parseFloat(form.salary_deduction) || 0,
      paid_amount: parseFloat(form.paid_amount || 0),
      payment_date: form.payment_date || null,
      payment_status: form.payment_status,
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
       <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
            {payment ? t("update_payment") : t("add_payment")}
          </h2>

          {/* FORM */}
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
            {/* Employee */}

            <div className="sm:col-span-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("salary_id")}
                </label>
                {!payment ? (
                  <select
                    name="employee_salary_id"
                    value={form.employee_salary_id}
                    onChange={handleChange}
                    required
                    className="border p-2.5 rounded w-full"
                  >
                    <option value=""> </option>
                    {activeSalaries.map((s) => (
                      <option
                        key={s.employee_salary_id}
                        value={s.employee_salary_id}
                      >
                        SID-{s.employee_salary_id} | EID-{s.employee_id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={`SID-${form.employee_salary_id}`}
                    readOnly
                    className="border p-2.5 rounded w-full bg-gray-100"
                  />
                )}
              </div>
            </div>
            {/* Base Salary */}
            {payment && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  {t("base_salary")}
                </label>
                <input
                  type="number"
                  value={baseSalary.toFixed(2)}
                  readOnly
                  className="border p-2.5 rounded w-full bg-blue-50 text-blue-700 font-semibold"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("month")}
              </label>
              <input
                type="month"
                name="salary_month"
                value={form.salary_month}
                onChange={handleChange}
                required
                className="border p-2.5 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("payment_date")}
              </label>
              <input
                type="date"
                name="payment_date"
                value={form.payment_date}
                onChange={handleChange}
                className="border p-2.5 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("bonus")}
              </label>
              <input
                type="number"
                name="salary_bonus"
                value={form.salary_bonus}
                onChange={handleChange}
                placeholder="Bonus"
                step="0.01"
                className="border p-2.5 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("deduction")}
              </label>
              <input
                type="number"
                name="salary_deduction"
                value={form.salary_deduction}
                onChange={handleChange}
                placeholder="Deduction"
                step="0.01"
                className="border p-2.5 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("paid_amount")}
              </label>
              <input
                type="number"
                name="paid_amount"
                value={parseFloat(form.paid_amount || 0).toFixed(2)}
                readOnly
                className="border p-2.5 rounded w-full bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("status")}
              </label>
              <select
                name="payment_status"
                value={form.payment_status}
                onChange={handleChange}
                className="border p-2.5 rounded w-full"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                  {t("cancel")}
              </button>

              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                  {t("save")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </>
  );
};

export default EmpSalaryPaymentModal;
