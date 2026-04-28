import React, { useEffect, useState } from "react";
import EmployeeService from "../../../services/employeeService";
import { getEmpHiringInfo } from "../../../services/empHiringInfoService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

export default function EmployeeBarCard() {
  const [employees, setEmployees] = useState([]);
  const [hiring, setHiring] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, hireRes] = await Promise.all([
        EmployeeService.getAll(),
        getEmpHiringInfo(),
      ]);

      setEmployees(empRes.data || []);
      setHiring(hireRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EMPLOYEE DATA =================
  const total = employees.length;

  const male = employees.filter((e) => e.emp_gender === "Male").length;
  const female = employees.filter((e) => e.emp_gender === "Female").length;

  const single = employees.filter(
    (e) => e.emp_marital_status === "Single",
  ).length;

  const married = employees.filter(
    (e) => e.emp_marital_status === "Married",
  ).length;

  // ================= HIRING STATUS =================
  const active = hiring.filter((h) => h.current_status === "Active").length;

  const inactive = hiring.filter((h) => h.current_status === "InActive").length;

  // ================= CHART DATA =================
  const chartData = [
    { name: "Male", value: male },
    { name: "Female", value: female },
    { name: "Active", value: active },
    { name: "Inactive", value: inactive },
    { name: "Single", value: single },
    { name: "Married", value: married },
  ];

  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#ec4899",
    "#10b981",
    "#ef4444",
    "#f59e0b",
  ];

  // ================= LEGEND DATA (SYNC WITH COLORS) =================
  const legendData = chartData.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-bold text-gray-800">
          Employee Analytics Overview
        </h2>

        <span className="text-sm text-gray-500">Total: {total}</span>
      </div>

      {/* CHART */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />

            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={20}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* ================= DYNAMIC LEGEND ================= */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-700 justify-center">
        {legendData.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.name} ({item.value})
          </span>
        ))}
      </div>
    </div>
  );
}
