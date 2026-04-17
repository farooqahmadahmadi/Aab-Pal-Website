import React, { useEffect, useState } from "react";
import { getExpenses } from "../../../services/expensesService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function ExpensesBarCard() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("month");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getExpenses();
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [];
      setExpenses(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FILTER =================
  const filterData = () => {
    const now = new Date();

    return expenses.filter((e) => {
      if (!e.expense_date) return false;

      const d = new Date(e.expense_date);
      if (isNaN(d.getTime())) return false;

      if (filter === "week") {
        const diff = (now - d) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }

      if (filter === "month") {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }

      if (filter === "year") {
        return d.getFullYear() === now.getFullYear();
      }

      return true;
    });
  };

  const filtered = filterData();

  // ================= GROUP =================
  const typeCount = {};

  filtered.forEach((e) => {
    const type = e.expense_type || "Other";
    const amount = Number(e.expense_amount || 0);

    typeCount[type] = (typeCount[type] || 0) + amount;
  });

  const chartData = Object.keys(typeCount).map((key) => ({
    name: key,
    value: typeCount[key],
  }));

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#ec4899",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition h-full flex flex-col">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">Expenses Overview</h2>

        {/* ONLY 3 FILTERS */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 text-sm rounded-full"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

     {/* CHART */}
     <div className="w-full h-[280px]">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={chartData}>
      <CartesianGrid opacity={0.2} />
      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip />

      <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={20}>
        {chartData.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>

      {/* LEGEND */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs justify-center">
        {chartData.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            {item.name} ({item.value})
          </span>
        ))}
      </div>
    </div>
  );
}
