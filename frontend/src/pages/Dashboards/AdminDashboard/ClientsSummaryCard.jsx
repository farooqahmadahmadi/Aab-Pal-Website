 import { useEffect, useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiUserMinus,
} from "react-icons/fi";

import { getClients } from "../../../services/clientInfoService"; 


export default function ClientsSummaryCard() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  // ================= FETCH =================
  const fetchClients = async () => {
    try {
      const res = await getClients();

      const arr =
        res?.data?.data ||
        res?.data ||
        [];

      setClients(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error(err);
      setClients([]);
    }
  };

  // ================= GROUP STATUS =================
  const total = clients.length;

  const active = clients.filter(
    (c) => c.client_status === "Active"
  ).length;

  const inactive = clients.filter(
    (c) => c.client_status === "InActive"
  ).length;

  const pending = clients.filter(
    (c) => c.client_status === "Pending"
  ).length;

  // ================= UI =================
  return (
    <div className="relative bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-md p-4 w-full 
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-24  h-18 bg-emerald-50 rounded-full blur-2xl opacity-50"></div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 relative z-10 gap-1">
        <h3 className="text-xs font-semibold text-gray-700">
         
          Clients Overview
        </h3>

        <span className="text-xs text-gray-500">
          Total: {total}
        </span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-3 relative z-10">

        {/* ACTIVE */}
        <div className="bg-green-50 rounded-xl p-3 border border-green-100 text-center">
          <FiUserCheck className="text-green-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-lg font-bold text-green-700">{active}</p>
        </div>

        {/* INACTIVE */}
        <div className="bg-red-50 rounded-xl p-3 border border-red-100 text-center">
          <FiUserX className="text-red-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Inactive</p>
          <p className="text-lg font-bold text-red-600">{inactive}</p>
        </div>

        {/* PENDING */}
        <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100 text-center">
          <FiUserMinus className="text-yellow-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-lg font-bold text-yellow-600">{pending}</p>
        </div>

      </div>

    </div>
  );
}