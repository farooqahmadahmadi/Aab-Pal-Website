import React, { useEffect, useState } from "react";
import { getProjects } from "../../../services/projectInfoService";

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

export default function ProjectBarCard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getProjects();

      setProjects(
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : []
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ================= GROUP TYPE =================
  const typeCount = {};

  projects.forEach((p) => {
    const type = p.project_type || "Other";
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  // ================= GROUP STATUS =================
  const statusCount = {};

  projects.forEach((p) => {
    const status = p.project_status || "Unknown";
    statusCount[status] = (statusCount[status] || 0) + 1;
  });

  // ================= FORMAT DATA =================
  const typeData = Object.keys(typeCount).map((key) => ({
    name: `Type: ${key}`,
    value: typeCount[key],
  }));

  const statusData = Object.keys(statusCount).map((key) => ({
    name: `Status: ${key}`,
    value: statusCount[key],
  }));

  const chartData = [...typeData, ...statusData];

  //  Dynamic colors (unlimited support)
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition h-full flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-bold text-gray-800">
          Project Analytics
        </h2>

        <span className="text-sm text-gray-500">
          Total: {projects.length}
        </span>
      </div>

      {/* CHART */}
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }}/>
            <Tooltip />

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

      {/* LEGEND (DYNAMIC) */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-700 justify-center">
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