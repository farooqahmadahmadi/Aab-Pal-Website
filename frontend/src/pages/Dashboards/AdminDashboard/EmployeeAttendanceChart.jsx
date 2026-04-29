import React, { useEffect, useState } from "react";
import { getAttendance } from "../../../services/employeeAttendanceService";

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

  // ---------------- FETCH SAFE ----------------
  const fetchData = async () => {
    try {
      const res = await getAttendance();

      // ✅ SAFE extraction (fixes your issue)
      const arr =
        res?.data?.data ||
        res?.data ||
        [];

      if (!Array.isArray(arr)) {
        console.warn("Attendance API not array:", arr);
        setData([]);
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      const todayData = arr.filter((a) => {
        if (!a?.attendance_date) return false;

        // safer date match
        return a.attendance_date.toString().slice(0, 10) === today;
      });

      setData(todayData);
    } catch (err) {
      console.error("Attendance fetch error:", err);
      setData([]);
    }
  };

  // ---------------- GROUPING ----------------
  const grouped = data.reduce((acc, d) => {
    const key = `${d.attendance_status || "Unknown"} | ${d.attendance_type || "NA"}`;

    if (!acc[key]) {
      acc[key] = {
        name: key,
        value: 0,
        employees: [],
      };
    }

    acc[key].value += 1;
    acc[key].employees.push(d.employee_id);

    return acc;
  }, {});

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
    if (!active || !payload?.length) return null;

    const d = payload[0].payload;

    return (
      <div className="bg-white p-3 shadow-lg rounded text-xs max-w-[220px] border">
        <p className="font-bold">{d.name}</p>
        <p>Count: {d.value}</p>

        <div className="mt-2 max-h-[100px] overflow-y-auto">
          {d.employees?.map((id, i) => (
            <div key={i} className="border-b py-1">
              ID: {id}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative bg-gradient-to-br from-white to-sky-50 rounded-2xl shadow-md p-4 w-full 
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-bold text-gray-800">
          Daily Attendance Overview
        </h2>

        <span className="text-sm text-gray-500">
          Total: {data.length}
        </span>
      </div>

      {/* EMPTY STATE FIX */}
      {chartData.length === 0 ? (
        <div className="text-center text-gray-400 py-10 text-sm">
          No attendance data for today
        </div>
      ) : (
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={20}>
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* LEGEND */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-700 justify-around">
        {chartData.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            {item.name} ({item.value})
          </span>
        ))}
      </div>

    </div>
  );
}