import React, { useEffect, useState, useMemo } from "react";
import { getProjects } from "../../../services/projectInfoService";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ProjectTimelineChart() {
  const [projects, setProjects] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getProjects();
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [];
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= HELPERS =================
  const toDayOfYear = (dateStr) => {
    const d = new Date(dateStr);
    const start = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d - start) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (d) => new Date(d).toLocaleDateString();

  // ================= FILTER =================
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (!p.project_start_date || !p.project_end_date) return false;
      return new Date(p.project_start_date).getFullYear() === year;
    });
  }, [projects, year]);

  // ================= COLORS =================
  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ec4899",
    "#3b82f6",
    "#14b8a6",
    "#8b5cf6",
  ];

  // ================= BUILD DATA =================
  const chartData = [];

  filtered.forEach((p, i) => {
    const start = toDayOfYear(p.project_start_date);
    const end = toDayOfYear(p.project_end_date);

    chartData.push(
      {
        x: start,
        y: i + 1,
        type: "start",
        name: p.project_name,
        startDate: p.project_start_date,
        endDate: p.project_end_date,
        duration: end - start, // ✅ duration added
        color: COLORS[i % COLORS.length],
      },
      {
        x: end,
        y: i + 1,
        type: "end",
        name: p.project_name,
        startDate: p.project_start_date,
        endDate: p.project_end_date,
        duration: end - start, // ✅ duration added
        color: COLORS[i % COLORS.length],
      },
    );
  });

  // ================= TOOLTIP =================
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      return (
        <div className="bg-white border p-2 rounded shadow text-xs">
          <p className="font-bold">{d.name}</p>
          <p>Start: {formatDate(d.startDate)}</p>
          <p>End: {formatDate(d.endDate)}</p>
          <p className="text-indigo-600 font-medium">
            Duration: {d.duration} days
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between mb-3">
        <h2 className="text-md font-bold text-gray-800">Project Timeline</h2>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border px-2 py-1 text-sm rounded-full"
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* CHART */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid stroke="#f1f5f9" />

            <XAxis
              type="number"
              dataKey="x"
              tick={{ fontSize: 12 }}
              domain={[0, 365]}
              tickFormatter={(v) => {
                const m = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];
                return m[Math.floor(v / 30)] || "";
              }}
            />

            <YAxis type="number" dataKey="y" tick={{ fontSize: 12 }} />

            <Tooltip content={<CustomTooltip />} />

            <Scatter
              data={chartData}
              line={{
                strokeWidth: 2,
                style: { transition: "all 0.4s ease" },
              }}
              shape={(props) => {
                const { cx, cy, payload } = props;

                if (payload.type === "start") {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill={payload.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  );
                }

                return (
                  <rect
                    x={cx - 5}
                    y={cy - 5}
                    width={10}
                    height={10}
                    transform={`rotate(45 ${cx} ${cy})`}
                    fill={payload.color}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND (BOTTOM) */}
      <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs text-gray-600">
        {filtered.map((p, i) => (
          <span key={i} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            {p.project_name}
          </span>
        ))}
      </div>
    </div>
  );
}
