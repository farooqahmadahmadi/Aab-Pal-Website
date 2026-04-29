import { useEffect, useState } from "react";
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";

import { getTransactions } from "../../../services/cashTransactionsService";

export default function FinanceCard() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("daily");

  const today = new Date().toISOString().split("T")[0];
  const currentMonth = today.slice(0, 7);
  const currentYear = today.slice(0, 4);

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FILTER =================
  const filtered = transactions.filter((t) => {
    if (!t.transaction_date) return false;

    if (filterType === "daily") {
      return t.transaction_date === selectedDate;
    }

    if (filterType === "monthly") {
      return t.transaction_date.slice(0, 7) === selectedMonth;
    }

    if (filterType === "yearly") {
      return t.transaction_date.slice(0, 4) === selectedYear;
    }

    return true;
  });

  // ================= CALCULATE =================
  let income = 0;
  let expense = 0;

  filtered.forEach((t) => {
    if (t.transaction_type === "Income") {
      income += Number(t.amount || 0);
    } else {
      expense += Number(t.amount || 0);
    }
  });

  const profit = income - expense;

  // ================= UI =================
  return (
    <div
      className="relative bg-gradient-to-br from-white to-sky-50 rounded-2xl shadow-md p-4 w-full 
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-24  h-18 bg-blue-100 rounded-full blur-2xl opacity-50"></div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2 relative z-10 gap-1">
        <h3 className="text-xs font-semibold text-gray-700">
          Cash Transactions
        </h3>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-xs rounded-full text-gray-500"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {/* FILTER INPUT */}
        <div>
          {filterType === "daily" && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className=" w-full rounded-full text-xs text-gray-500"
            />
          )}

          {filterType === "monthly" && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full  rounded text-xs text-gray-500"
            />
          )}

          {filterType === "yearly" && (
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded text-xs text-gray-500"
              placeholder="Year"
            />
          )}
        </div>
      </div>

      {/* PROFIT */}
      <div className="flex flex-col items-center justify-center mb-4 relative z-10">
        <div className="bg-green-100 text-green-600 p-2 rounded-full mb-2 shadow-sm">
          <FiDollarSign className="text-lg" />
        </div>

        <p className="text-gray-400 text-xs font-semibold">Profit</p>

        <h2
          className={`text-2xl font-extrabold mt-0.5 ${
            profit >= 0 ? "text-green-700" : "text-red-600"
          }`}
        >
          {profit.toFixed(2)}
        </h2>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-dashed border-gray-200 my-1"></div>

      {/* INCOME / EXPENSE */}
      <div className="flex justify-between items-center text-xs relative z-10">
        {/* INCOME */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1 text-green-600 font-medium">
            <FiTrendingUp />
            <span>Income</span>{" "}
            <p className="text-sm font-semibold text-gray-800">
              {income.toFixed(2)}
            </p>
          </div>
        </div>

        {/* LINE */}
        <div className="h-6 w-px bg-gray-200"></div>

        {/* EXPENSE */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-red-500 font-medium">
            <FiTrendingDown />
            <span>Expense</span>{" "}
            <p className="text-sm font-semibold text-gray-800">
              {expense.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
