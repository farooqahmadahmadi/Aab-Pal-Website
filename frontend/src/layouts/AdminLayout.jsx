import { Outlet } from "react-router-dom";
import { useState } from "react";

// Components
import Navbar from "../components/common/Navbar/Navbar";
import Sidebar from "../components/common/Sidebar/Sidebar";

export default function AdminLayout() {
  // You can fetch the role from auth/user context or props
  const [role] = useState("admin"); // admin, manager, user

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* ================== SIDEBAR ================== */}
      <Sidebar role={role} />

      {/* ================== MAIN CONTENT ================== */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <Navbar role={role} />

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-14 px-4 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}