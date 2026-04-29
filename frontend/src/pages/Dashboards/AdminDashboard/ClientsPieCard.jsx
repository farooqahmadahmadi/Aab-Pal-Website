import React, { useEffect, useState } from "react";
import { getClients } from "../../../services/clientInfoService";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function ClientsPieCard() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await getClients();

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [];

      setClients(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= TOTAL =================
  const total = clients.length;

  // ================= STATUS (Dynamic safe) =================
  const pending = clients.filter((c) => c.client_status === "Pending").length;
  const active = clients.filter((c) => c.client_status === "Active").length;
  const inactive = clients.filter((c) => c.client_status === "InActive").length;

  // ================= CHART DATA =================
  const chartData = [
    { name: "Pending", value: pending },
    { name: "Active", value: active },
    { name: "InActive", value: inactive },
  ];

  const COLORS = ["#f59e0b", "#22c55e", "#ef4444"];

  // ================= LEGEND =================
  const legendData = chartData.map((item, index) => ({
    ...item,
    color: COLORS[index],
  }));

  return (
  <div
      className="relative bg-gradient-to-br from-white to-sky-50 rounded-2xl shadow-md p-4 w-full 
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-bold text-gray-800">Clients Overview</h2>

        <span className="text-sm text-gray-500">Total: {total}</span>
      </div>

      {/* CHART */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              outerRadius={100}
              innerRadius={50}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
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
