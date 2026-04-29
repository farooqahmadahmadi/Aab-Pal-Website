import { useEffect, useState } from "react";
import {
  FiFolder,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiActivity,
} from "react-icons/fi";

import { getProjects } from "../../../services/projectInfoService";

export default function ProjectsSummaryCard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  // ================= FETCH =================
  const fetchProjects = async () => {
    try {
      const res = await getProjects();

      const arr = res?.data?.data || res?.data || [];

      setProjects(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error(err);
      setProjects([]);
    }
  };

  // ================= GROUP STATUS =================
  const total = projects.length;

  const active = projects.filter((p) => p.project_status === "Active").length;

  const completed = projects.filter(
    (p) => p.project_status === "Completed",
  ).length;

  const pending = projects.filter((p) => p.project_status === "Pending").length;

  const cancelled = projects.filter(
    (p) => p.project_status === "Cancelled",
  ).length;

  // ================= UI =================
  return (
    <div
      className="relative bg-gradient-to-br from-white to-sky-50 rounded-2xl shadow-md p-4 w-full 
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* glow */}
      <div className="absolute -top-10 -right-10 w-24  h-18 bg-blue-100 rounded-full blur-2xl opacity-50"></div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2 relative z-10 gap-1">
        <h3 className="text-xs font-semibold text-gray-700">
          Projects Overview
        </h3>

        <span className="text-xs text-gray-500">Total: {total}</span>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-2 gap-1 relative z-10">
        {/* ACTIVE */}
        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
          <div className="flex justify-between items-center">
            <FiActivity className="text-green-600" />
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <p className="text-lg font-bold text-green-700 mt-1">{active}</p>
        </div>

        {/* COMPLETED */}
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
          <div className="flex justify-between items-center">
            <FiCheckCircle className="text-blue-600" />
            <span className="text-xs text-gray-500">Completed</span>
          </div>
          <p className="text-lg font-bold text-blue-700 mt-1">{completed}</p>
        </div>

        {/* PENDING */}
        <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
          <div className="flex justify-between items-center">
            <FiClock className="text-yellow-600" />
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <p className="text-lg font-bold text-yellow-700 mt-1">{pending}</p>
        </div>

        {/* CANCELLED */}
        <div className="bg-red-50 rounded-xl p-3 border border-red-100">
          <div className="flex justify-between items-center">
            <FiXCircle className="text-red-600" />
            <span className="text-xs text-gray-500">Cancelled</span>
          </div>
          <p className="text-lg font-bold text-red-600 mt-1">{cancelled}</p>
        </div>
      </div>
    </div>
  );
}
