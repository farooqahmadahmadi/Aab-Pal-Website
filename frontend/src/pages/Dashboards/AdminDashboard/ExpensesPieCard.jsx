import React, { useEffect, useState } from "react";
import { getExpenses } from "../../../services/expensesService";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function ExpensesPieCard() {
  const [expenses, setExpenses] = useState([]);

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

  // ================= TODAY SAFE FILTER =================
  const today = new Date();

  const todayExpenses = expenses.filter((e) => {
    if (!e.expense_date) return false;

    // IMPORTANT FIX for DATEONLY
    const d = new Date(e.expense_date + "T00:00:00");

    if (isNaN(d.getTime())) return false;

    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });

  // ================= GROUP BY TYPE =================
  const typeCount = {};

  todayExpenses.forEach((e) => {
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
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-bold text-gray-800">Today Expenses</h2>
        <span className="text-sm text-gray-500">
          {todayExpenses.length} Records
        </span>
      </div>

      {/* EMPTY STATE FIX */}
      {chartData.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No expenses for today
        </div>
      ) : (
        <>
          {/* PIE CHART */}
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* LEGEND */}
          <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-700 justify-center">
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
        </>
      )}
    </div>
  );
}
