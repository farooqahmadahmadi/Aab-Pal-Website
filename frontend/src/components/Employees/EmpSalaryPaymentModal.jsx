import React, { useState, useEffect } from "react";
import { getActiveSalaryInfos } from "../../services/empSalaryPaymentService";
import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

const EmpSalaryPaymentModal = ({ isOpen, onClose, onSave, payment, allPayments = [] }) => {
  const [form, setForm] = useState({
    employee_salary_id: "",
    salary_month: "",
    salary_bonus: 0,
    salary_deduction: 0,
    paid_amount: 0,
    payment_date: "",
    payment_status: "Pending"
  });

  const [activeSalaries, setActiveSalaries] = useState([]);
  const [baseSalary, setBaseSalary] = useState(0);

  // Toast
  const { toast, showToast, hideToast } = useToast();

  // Fetch Active Salaries
  useEffect(() => {
    const fetchActive = async () => {
      const salaries = await getActiveSalaryInfos();
      setActiveSalaries(salaries);
    };
    fetchActive();
  }, []);

  // Initialize Form
  useEffect(() => {
    if (payment) {
      const salaryInfo = activeSalaries.find(
        s => s.employee_salary_id === payment.employee_salary_id
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
        payment_status: payment.payment_status || "Pending"
      });
    } else {
      setForm({
        employee_salary_id: "",
        salary_month: "",
        salary_bonus: 0,
        salary_deduction: 0,
        paid_amount: 0,
        payment_date: "",
        payment_status: "Pending"
      });
      setBaseSalary(0);
    }
  }, [payment, activeSalaries]);

  // Handle Change
  const handleChange = e => {
    const { name, value } = e.target;

    let updatedForm = { ...form, [name]: value };
    let base = baseSalary;

    if (name === "employee_salary_id") {
      const selected = activeSalaries.find(
        s => s.employee_salary_id.toString() === value
      );

      if (selected) {
        base =
          parseFloat(selected.base_salary || 0) +
          parseFloat(selected.allowance || 0);
        setBaseSalary(base);
      }
    }

    const bonus = parseFloat(
      name === "salary_bonus" ? value : updatedForm.salary_bonus || 0
    );
    const deduction = parseFloat(
      name === "salary_deduction" ? value : updatedForm.salary_deduction || 0
    );

    updatedForm.paid_amount = parseFloat((base + bonus - deduction).toFixed(2));

    setForm(updatedForm);
  };

  //  Submit 
  const handleSubmit = e => {
    e.preventDefault();

    if (!form.employee_salary_id) {
      showToast("Please select an Employee Salary", "error");
      return;
    }

    // UNIQUE CHECK (Employee + Month)
    const duplicate = allPayments.find(p =>
      p.salary_month === form.salary_month &&
      (
        p.EmpSalaryInfo?.employee_id ===
        activeSalaries.find(s => s.employee_salary_id == form.employee_salary_id)?.employee_id
      ) &&
      (!payment || p.payment_id !== payment.payment_id)
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
      payment_status: form.payment_status
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4">
            {payment ? "Update " : "Add "}
            Payment
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {!payment ? (
              <select
                name="employee_salary_id"
                value={form.employee_salary_id}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Employee Salary</option>
                {activeSalaries.map(s => (
                  <option key={s.employee_salary_id} value={s.employee_salary_id}>
                    SID-{s.employee_salary_id} | EID-{s.employee_id}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={`SID-${form.employee_salary_id}`}
                readOnly
                className="border p-2 rounded bg-gray-100"
              />
            )}

            {payment && (
              <input
                type="number"
                value={baseSalary.toFixed(2)}
                readOnly
                className="border p-2 rounded bg-blue-50 text-blue-700 font-semibold"
              />
            )}

            <input type="month" name="salary_month" title="Year & Month" value={form.salary_month} onChange={handleChange} required className="border p-2 rounded" />

            <input type="number" name="salary_bonus" value={form.salary_bonus} onChange={handleChange} placeholder="Bonus" step="0.01" className="border p-2 rounded" />

            <input type="number" name="salary_deduction" value={form.salary_deduction} onChange={handleChange} placeholder="Deduction" step="0.01" className="border p-2 rounded" />

            <input type="number" name="paid_amount" value={parseFloat(form.paid_amount || 0).toFixed(2)} readOnly step="0.01" className="border p-2 rounded bg-gray-100" />

            <input type="date" name="payment_date" title="Payment Date" value={form.payment_date} onChange={handleChange} className="border p-2 rounded" />

            <select name="payment_status" title="Status" value={form.payment_status} onChange={handleChange} className="border p-2 rounded">
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex justify-end gap-2 mt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">Save</button>
            </div>

          </form>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
};

export default EmpSalaryPaymentModal;