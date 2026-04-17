import React, { useEffect, useState } from "react";
import { getUsers } from "../../../services/userService";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function UsersPieCard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.users)
          ? res.data.users
          : Array.isArray(res.data.data)
            ? res.data.data
            : [];

      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- TOTAL ----------------
  const total = users.length;

  // ---------------- STATUS ----------------
  const online = users.filter((u) => u.login_status === "Online").length;
  const offline = total - online;

  const active = users.filter((u) => u.is_active).length;
  const inactive = total - active;

  // ---------------- ROLE ----------------
  const admin = users.filter((u) => u.user_role === "Admin").length;
  const financial = users.filter((u) => u.user_role === "Financial").length;
  const hr = users.filter((u) => u.user_role === "HR").length;
  const pm = users.filter((u) => u.user_role === "PM").length;
  const client = users.filter((u) => u.user_role === "Client").length;
  const employee = users.filter((u) => u.user_role === "Employee").length;

  // ---------------- CHART DATA ----------------
  const chartData = [
    { name: "Online", value: online },
    { name: "Offline", value: offline },
    { name: "Active", value: active },
    { name: "Inactive", value: inactive },
    { name: "Admin", value: admin },
    { name: "Financial", value: financial },
    { name: "HR", value: hr },
    { name: "PM", value: pm },
    { name: "Client", value: client },
    { name: "Employee", value: employee },
  ];

  const COLORS = [
    "#22c55e",
    "#9ca3af",
    "#3b82f6",
    "#ef4444",
    "#f59e0b",
    "#a855f7",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-bold">Users Overview</h2>
        <span className="text-sm text-gray-500">Total: {total}</span>
      </div>

      {/* CHART */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* SINGLE CLEAN LEGEND */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs justify-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          Active ({active})
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          Online ({online})
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
          Offline ({offline})
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          InActive ({inactive})
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
          Admin ({admin})
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
          Financial ({financial})
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
          HR ({hr})
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-lime-500 rounded-full"></span>
          PM ({pm})
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-orange-600 rounded-full"></span>
          Client ({client})
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
          Employee ({employee})
        </div>
      </div>
    </div>
  );
}
