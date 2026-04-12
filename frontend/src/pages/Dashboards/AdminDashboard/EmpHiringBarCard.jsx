import React, { useEffect, useState } from "react";
import EmployeeService from "../../../services/employeeService";
import { getEmpHiringInfo } from "../../../services/empHiringInfoService";
import DepartmentService from "../../../services/departmentService";

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

export default function EmpHiringBarCard() {
  const [hiring, setHiring] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hireRes, deptRes] = await Promise.all([
        getEmpHiringInfo(),
        DepartmentService.getAll(),
      ]);

      setHiring(hireRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= MAP DEPARTMENT =================
  const deptMap = {};
  departments.forEach((d) => {
    deptMap[d.department_id] = d.department_name;
  });

  // ================= DEPARTMENTS =================
  const departmentCount = {};
  hiring.forEach((h) => {
    const name = deptMap[h.department_id] || "Unknown";
    departmentCount[name] = (departmentCount[name] || 0) + 1;
  });

  const deptData = Object.keys(departmentCount).map((key) => ({
    name: key,
    value: departmentCount[key],
  }));

  // ================= POSITIONS =================
  const positionCount = {};
  hiring.forEach((h) => {
    if (h.position) {
      positionCount[h.position] =
        (positionCount[h.position] || 0) + 1;
    }
  });

  const posData = Object.keys(positionCount).map((key) => ({
    name: key,
    value: positionCount[key],
  }));

  // ================= CHART DATA =================
  const chartData = [
    ...deptData.map((d) => ({
      name: `Dept: ${d.name}`,
      value: d.value,
      type: "dept",
    })),
    ...posData.map((p) => ({
      name: `Pos: ${p.name}`,
      value: p.value,
      type: "pos",
    })),
  ];

  // 🔥 MULTI COLOR PALETTE (FIXED)
  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#ec4899",
    "#6366f1",
    "#84cc16",
    "#f97316",
  ];

  return (
     <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition h-full flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-bold text-gray-800">
          Hiring Structure Overview
        </h2>

        <span className="text-sm text-gray-500">
          Total: {hiring.length}
        </span>
      </div>

      {/* CHART */}
      <div className="w-full h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />

            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={20}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= DYNAMIC LEGEND ================= */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-700 justify-around">

        {chartData.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: COLORS[index % COLORS.length],
              }}
            ></span>

            {item.name.replace("Dept: ", "").replace("Pos: ", "")}
            ({item.value})
          </span>
        ))}

      </div>

    </div>
  );
}