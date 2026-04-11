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

  // ================= HIRING STATUS (FIXED HERE) =================
  const active = hiring.filter((h) => h.current_status === "Active").length;
  const inactive = hiring.filter((h) => h.current_status === "InActive").length;

  // ================= CHART DATA =================
  const chartData = [
    // { name: "Total", value: total },
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
    "#3b82f6",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-bold text-gray-800">
          Employee Analytics Overview
        </h2>

        <span className="text-sm text-gray-500">Total: {total}</span>
      </div>

      {/* CHART */}
      <div className="w-full h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={35}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-700 justify-center">
        <span>🟦 Employees ({total})</span>
        <span>🟢 Male ({male})</span>
        <span>🩷 Female ({female})</span>
        <span>🟩 Active ({active})</span>
        <span>🔴 InActive ({inactive})</span>
        <span>🟡 Single ({single})</span>
        <span>🟣 Married ({married})</span>
      </div>
    </div>
  );
}
