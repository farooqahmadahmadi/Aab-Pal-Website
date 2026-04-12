import React, { useEffect, useState, useMemo } from "react";
import { getTransactions } from "../../../services/cashTransactionsService";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function CashTransactionsChart() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("month");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getTransactions();

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [];

      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FILTER =================
  const filtered = useMemo(() => {
    const now = new Date();

    return transactions.filter((t) => {
      const d = new Date(t.transaction_date);

      if (filter === "day") return d.toDateString() === now.toDateString();

      if (filter === "week") {
        const diff = (now - d) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }

      if (filter === "month")
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );

      if (filter === "year") return d.getFullYear() === now.getFullYear();

      return true;
    });
  }, [transactions, filter]);

  // ================= GROUP BY DATE =================
  const grouped = {};

  filtered.forEach((t) => {
    const date = new Date(t.transaction_date).toLocaleDateString();

    if (!grouped[date]) {
      grouped[date] = {
        date,
        income: 0,
        expense: 0,
      };
    }

    const amount = Number(t.amount || 0);

    if (t.transaction_type === "Income") {
      grouped[date].income += amount;
    } else if (t.transaction_type === "Expense") {
      grouped[date].expense += amount;
    }
  });

  const chartData = Object.values(grouped).sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  // ================= TOTALS (LEGEND) =================
  const totalIncome = chartData.reduce(
    (sum, item) => sum + (item.income || 0),
    0,
  );

  const totalExpense = chartData.reduce(
    (sum, item) => sum + (item.expense || 0),
    0,
  );

  // ================= TOOLTIP =================
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      return (
        <div className="bg-white border p-2 rounded shadow text-xs">
          <p className="font-bold">{d.date}</p>
          <p className="text-green-600">Income: {d.income}</p>
          <p className="text-red-500">Expense: {d.expense}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-bold text-gray-800">
          Cash Transactions Overview
        </h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 text-sm rounded-full"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* CHART */}
      <div className="w-full h-[400px]">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />

            <Tooltip content={<CustomTooltip />} />
            {/* <Legend /> */}

            {/* INCOME */}
            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 7 }}
            />

            {/* EXPENSE */}
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND (FINAL FIXED) */}
      <div className="flex justify-center gap-6 mt-3 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          Income ({totalIncome.toFixed(2)})
        </span>

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          Expense ({totalExpense.toFixed(2)})
        </span>
      </div>
    </div>
  );
}
