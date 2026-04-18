import React, { useEffect, useState } from "react";
import {getAttendance} from "../../../services/employeeAttendanceService";

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

export default function EmpAttendanceBarCard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- FETCH ----------------
  const fetchData = async () => {
    try {
      const res = await getAttendance();

      const arr = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [];

      const today = new Date().toISOString().slice(0, 10);

      const todayData = arr.filter(
        (a) => a.attendance_date?.slice(0, 10) === today,
      );

      setData(todayData);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- PROCESS ----------------
  const grouped = {};

  data.forEach((d) => {
    const key = `${d.attendance_status} | ${d.attendance_type}`;

    if (!grouped[key]) {
      grouped[key] = {
        name: key,
        value: 0,
        employees: [],
      };
    }

    grouped[key].value += 1;
    grouped[key].employees.push(d.employee_id);
  });

  const chartData = Object.values(grouped);

  // ---------------- COLORS ----------------
  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#ec4899",
    "#6366f1",
  ];

  // ---------------- TOOLTIP ----------------
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      return (
        <div className="bg-white p-3 shadow-lg rounded text-xs max-w-[220px]">
          <p>
            <b>{d.name}</b>
          </p>
          <p>Count: {d.value}</p>

          <div className="mt-2 max-h-[100px] overflow-y-auto border p-1 rounded">
            {d.employees.length > 0 ? (
              d.employees.map((id, i) => (
                <div key={i} className="border-b py-1">
                  ID: {id}
                </div>
              ))
            ) : (
              <p>No employees</p>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-bold text-gray-800">
          Daily Attendance Overview
        </h2>

        <span className="text-sm text-gray-500">Total: {data.length}</span>
      </div>

      {/* CHART */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={20}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ---------------- LEGEND ---------------- */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-700 justify-around">
        {chartData.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: COLORS[index % COLORS.length],
              }}
            ></span>
            {item.name} ({item.value})
          </span>
        ))}
      </div>
    </div>
  );
}
