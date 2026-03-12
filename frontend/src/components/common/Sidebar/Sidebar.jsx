import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  LucideFolders,
  PlusCircle,
  List,
  FileCheck,
  FileChartLine,
  GitFork,
  UserCircle,
  ChevronDown,
  SidebarClose,
  SidebarOpen,
} from "lucide-react";

export default function Sidebar({ role = "admin" }) {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState({});
  const location = useLocation();

  // ================= MENU ITEMS BASED ON ROLE =================
  const allMenuItems = {
    admin: [
      { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
      {
        name: "Company",
        icon: <Building2 size={20} />,
        subMenu: [
          { name: "Company Profile", icon: <UserCircle size={16} />, path: "/admin/company-info" },
          { name: "Departments", icon: <GitFork size={16} />, path: "/admin/departments" },
        ],
      },
      {
        name: "HR / Employees",
        icon: <Users size={20} />,
        subMenu: [
          { name: "New Employee", icon: <PlusCircle size={16} />, path: "/admin/add-new-employee" },
          { name: "Employees List", icon: <List size={16} />, path: "/admin/employees-list" },
          { name: "Attendance", icon: <FileCheck size={16} />, path: "/admin/attendance" },
          { name: "Attendance Report", icon: <FileChartLine size={16} />, path: "/admin/attendance-report" },
        ],
      },
      {
        name: "Projects",
        icon: <LucideFolders size={20} />,
        subMenu: [
          { name: "New Project", icon: <PlusCircle size={16} />, path: "/projects/add-new-project" },
          { name: "All Projects", icon: <List size={16} />, path: "/projects/projects-list" },
        ],
      },
    ],

    manager: [
      { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/hr/dashboard" },
      {
        name: "HR / Employees",
        icon: <Users size={20} />,
        subMenu: [
          { name: "New Employee", icon: <PlusCircle size={16} />, path: "/hr/add-new-employee" },
          { name: "Employees List", icon: <List size={16} />, path: "/hr/employees-list" },
          { name: "Attendance", icon: <FileCheck size={16} />, path: "/hr/attendance" },
          { name: "Attendance Report", icon: <FileChartLine size={16} />, path: "/hr/attendance-report" },
        ],
      },
    ],

    user: [
      { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
      // Add client-specific menu here if needed
    ],
  };

  const menuItems = allMenuItems[role] || [];

  const toggleSubMenu = (name) => {
    setSubMenuOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {/* ================= MOBILE MENU TOGGLE ================= */}
      <div className="lg:hidden p-2 bg-slate-950 relative shadow-md h-14 ">

        <button
          onClick={() => setMobileOpen(true)}
          className="h-10 p-2 flex items-center justify-center bg-slate-950 text-white  hover:bg-slate-800 border-none transition"
        >
          <SidebarOpen size={22} color="gold" />
        </button>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed top-0 left-0 h-screen bg-slate-950 text-yellow-500 z-50 transition-transform duration-300
        ${isOpen ? "w-64" : "w-16"} 
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:block overflow-y-auto flex flex-col`}
      >
        {/* ================= LOGO ================= */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <span className={`text-2xl font-bold ${!isOpen ? "hidden" : "block"}`}>Nexora-Link</span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5  bg-slate-950 hover:bg-slate-900 border-none transition"
          >
            {isOpen ? <SidebarClose size={20} /> : <SidebarOpen size={20} />}
          </button>
        </div>

        {/* ================= MENU ITEMS ================= */}
        <ul className="mt-4 space-y-1 px-2 flex-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div>
                <Link
                  to={item.path || "#"}
                  className={`flex items-center justify-between gap-3 p-3 rounded-lg transition-all
                    ${location.pathname === item.path ? "bg-slate-900" : "hover:bg-slate-900"}`}
                  onClick={() => item.subMenu && toggleSubMenu(item.name)}
                >
                  <div className="flex items-center gap-3">
                    {item.icon} {isOpen && item.name}
                  </div>
                  {item.subMenu && isOpen && (
                    <ChevronDown
                      size={18}
                      className={`${subMenuOpen[item.name] ? "rotate-180" : ""} transition-transform`}
                    />
                  )}
                </Link>

                {/* Submenu */}
                {item.subMenu && subMenuOpen[item.name] && isOpen && (
                  <ul className="pl-10 mt-1 space-y-1">
                    {item.subMenu.map((sub, idx) => (
                      <li key={idx}>
                        <Link
                          to={sub.path}
                          className={`flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-slate-900
                            ${location.pathname === sub.path ? "bg-slate-900" : ""}`}
                        >
                          {sub.icon} {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}