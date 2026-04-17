import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiPieChart,
  FiDollarSign,
  FiChevronsDown,
  FiChevronsUp,
  FiBox,
  FiShoppingBag,
  FiTruck,
  FiBookOpen,
  FiList,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import defaultAvatar from "../assets/images/client-def-image.png";

export default function Sidebar({ role }) {
  const location = useLocation();
  const sidebarRef = useRef();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [indicatorStyle, setIndicatorStyle] = useState({
    top: 0,
    height: 0,
  });

  const itemRefs = useRef({});

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const BASE_URL = import.meta.env.VITE_API_URL;

  // ================= RESPONSIVE =================
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= ACTIVE INDICATOR =================
  useEffect(() => {
    const el = itemRefs.current[location.pathname];

    if (el) {
      setIndicatorStyle({
        top: el.offsetTop,
        height: el.offsetHeight,
      });
    }
  }, [location.pathname, sidebarOpen, openMenu]);

  const getAvatar = () => {
    if (!user?.user_photo_url) return defaultAvatar;
    if (user.user_photo_url.startsWith("http")) return user.user_photo_url;
    return `${BASE_URL}${user.user_photo_url}`;
  };

  const isActive = (path) => location.pathname === path;

  const toggleMenu = (name) => {
    setOpenMenu((prev) => (prev === name ? null : name));
  };

  // ================= FUTURE SOCKET SAFE HOOK =================
  useEffect(() => {
    // reserved for socket integration later
    // prevents future breaking changes
  }, []);

  const menuItems = {
    // >>>>>>>>>>>>>>>> Sidebar for Admin Role:
    Admin: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <FiPieChart className=" animate-bounce" />,
      },
      {
        name: "Company",
        icon: <FiHome className=" animate-bounce" />,
        submenu: [
          { name: "Company Info", path: "/admin/company/company-info" },
          {
            name: "Company Documents",
            path: "/admin/company/company-documents",
          },
          { name: "Departments", path: "/admin/departments/departments-info" },
        ],
      },
      {
        name: "HR",
        icon: <FiUsers className=" animate-bounce" />,
        submenu: [
          { name: "Employees", path: "/admin/employees/employee-info" },
          {
            name: "Employee Education",
            path: "/admin/employees/employee-education-info",
          },
          {
            name: "Employee Documents",
            path: "/admin/employees/employee-documents",
          },
          {
            name: "Employee Salary",
            path: "/admin/employees/employee-salary-info",
          },
          {
            name: "Attendance Shifts",
            path: "/admin/employees/attendance-shifts",
          },
          {
            name: "Employee Hiring",
            path: "/admin/employees/employee-hiring-info",
          },
          {
            name: "Employee Attendance List",
            path: "/admin/employees/employee-attendance-list",
          },
          {
            name: "Attendance Checker",
            path: "/admin/employees/employee-attendance",
          },
          {
            name: "Salary Payment",
            path: "/admin/employees/employee-salary-payment",
          },
        ],
      },
      {
        name: "Projects",
        icon: <FiBox className=" animate-bounce" />,
        submenu: [
          { name: "Clients", path: "/admin/clients/clients-info" },
          { name: "Projects", path: "/admin/projects/project-info" },
          { name: "BOQ Items", path: "/admin/projects/boq-items" },
          {
            name: "Projects Phases",
            path: "/admin/projects/project-phases-info",
          },
          {
            name: "Projects Documents",
            path: "/admin/projects/project-documents",
          },
        ],
      },
      {
        name: "Financial",
        icon: <FiDollarSign className=" animate-bounce" />,
        submenu: [
          { name: "Expenses", path: "/admin/financial/expenses" },
          { name: "Invoices", path: "/admin/financial/invoices" },
          {
            name: "Cash Transactions",
            path: "/admin/financial/cash-transactions",
          },
          { name: "Payments Info", path: "/admin/financial/payments-info" },
        ],
      },
      {
        name: "Inventory",
        icon: <FiShoppingBag className=" animate-bounce" />,
        submenu: [
          { name: "Suppliers", path: "/admin/inventory/suppliers" },
          { name: "Materials", path: "/admin/inventory/materials" },
          { name: "Purchase Orders", path: "/admin/inventory/purchase-orders" },
          { name: "P.O Items", path: "/admin/inventory/purchase-order-items" },
        ],
      },
      {
        name: "Equipments",
        icon: <FiTruck className=" animate-bounce" />,
        submenu: [
          {
            name: "Equipments (Machinery)",
            path: "/admin/equipments/equipments",
          },
          {
            name: "Equipments Documents",
            path: "/admin/equipments/equipments-documents",
          },
          {
            name: "Equipments Usage",
            path: "/admin/equipments/equipments-usage",
          },
          {
            name: "Equipments Maintenance",
            path: "/admin/equipments/equipment-maintenance",
          },
        ],
      },
      {
        name: "Contracts",
        icon: <FiBookOpen className=" animate-bounce" />,
        submenu: [
          { name: "Contracts", path: "/admin/contracts/contracts" },
          {
            name: "Contract Milestones",
            path: "/admin/contracts/contract-milestones",
          },
        ],
      },
      {
        name: "Tasks",
        icon: <FiList className="animate-bounce" />,
        submenu: [
          { name: "Tasks Assignment", path: "/admin/tasks/tasks-assignment" },
          {
            name: "Site Reports",
            path: "/admin/site-daily-reports/site-daily-reports",
          },
          {
            name: "Safety Incident",
            path: "/admin/safety-incident/safety-incident-info",
          },
        ],
      },
      {
        name: "System",
        icon: <FiSettings className="animate-spin" />,
        submenu: [
          { name: "User Accounts", path: "/admin/users/user-list" },
          { name: "User Profile", path: "/admin/users/user-profile" },
          { name: "Notification Center", path: "/admin/system/notifications" },
          { name: "Settings", path: "/admin/system/system-settings" },
          { name: "System Logs", path: "/admin/system/system-logs" },
          { name: "Database Backup", path: "/admin/users/user-list" },
        ],
      },
    ],

    // >>>>>>>>>>>>>>>> Sidebar for HR Role:
    HR: [
      { name: "Dashboard", path: "/hr/dashboard", icon: <FiPieChart /> },
      {
        name: "HR",
        icon: <FiUsers />,
        submenu: [
          { name: "Department", path: "/hr/departments/departments-inf" },
          { name: "Employee", path: "/hr/employees/employee-info" },
          {
            name: "Employee Docuemnt",
            path: "/hr/employees/employee-documents",
          },
          {
            name: "Employee Salary",
            path: "/hr/employees/employee-salary-info",
          },
          {
            name: "Attendance Shifts",
            path: "/hr/employees/attendance-shifts",
          },
          {
            name: "Employee Hiring",
            path: "/hr/employees/employee-hiring-info",
          },
        ],
      },
    ],

    // >>>>>>>>>>>>>>>> Sidebar for Financial Role:
    Finanacial: [
      { name: "Dashboard", path: "/pm/dashboard", icon: <FiPieChart /> },
      {
        name: "Projects",
        icon: <FiUsers />,
        submenu: [
          { name: "Employees", path: "/hr/employees/employee-info" },
          {
            name: "Attendance Checker",
            path: "/hr/employees/employee-attendance",
          },
        ],
      },
    ],

    // >>>>>>>>>>>>>>>> Sidebar for PM Role:
    PM: [
      { name: "Dashboard", path: "/pm/dashboard", icon: <FiPieChart /> },
      {
        name: "Projects",
        icon: <FiUsers />,
        submenu: [
          { name: "Employees", path: "/hr/employees/employee-info" },
          {
            name: "Attendance Checker",
            path: "/hr/employees/employee-attendance",
          },
        ],
      },
    ],

    // >>>>>>>>>>>>>>>> Sidebar for Employee Role:
    Employee: [
      { name: "Dashboard", path: "/employee/dashboard", icon: <FiPieChart /> },
      {
        name: "Projects",
        icon: <FiUsers />,
        submenu: [
          { name: "Employees", path: "/employee/employees/employee-info" },
          {
            name: "Attendance Checker",
            path: "/employee/employees/employee-attendance",
          },
        ],
      },
    ],

    // >>>>>>>>>>>>>>>> Sidebar for Client Role:
    Client: [
      { name: "Dashboard", path: "/client/dashboard", icon: <FiPieChart /> },
      {
        name: "System",
        icon: <FiSettings />,
        submenu: [{ name: "Notification Center", path: "/client/" }],
      },
    ],
  };

  const isAnyChildActive = (item) => {
    if (!item.submenu) return false;
    return item.submenu.some((sub) => sub.path === location.pathname);
  };

  return (
    <>
      {/* TOGGLE */}
      <div
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-3 z-[9999] w-7 h-7  flex items-center justify-center bg-white border shadow-sm rounded-full cursor-pointer hover:bg-blue-100 "
        style={{ left: sidebarOpen ? "13.5rem" : "0.3rem" }}
      >
        {sidebarOpen ? (
          <FiChevronLeft size={18} />
        ) : (
          <FiChevronRight size={18} />
        )}
      </div>

      {/* BACKDROP */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/10 md:hidden z-40"
        />
      )}

      {/* SIDEBAR */}
      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 h-screen bg-white shadow-lg z-50 overflow-hidden transition-all duration-300"
        style={{ width: sidebarOpen ? "14.5rem" : "0rem" }}
      >
        {/* HEADER */}
        <div className="p-3 border-b flex items-center gap-3 bg-zinc-100 rounded">
          <img
            src={getAvatar()}
            onError={(e) => (e.target.src = defaultAvatar)}
            className="w-12 h-12 rounded-full object-cover border shadow"
          />

          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-bold text-blue-600">CC-MIS</h1>
            <p className="text-sm font-semibold truncate">{user.user_name}</p>
            <p className="text-[11px] truncate">
              <a href="mailto:" className="text-gray-500">
                {user.user_email}
              </a>
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="relative p-2 text-sm space-y-1 overflow-y-auto h-[calc(100%-80px)]">
          <div
            className="absolute left-0 w-1 bg-blue-500 rounded-full transition-all duration-300"
            style={{
              top: indicatorStyle.top,
              height: indicatorStyle.height,
            }}
          />

          {menuItems[role]?.map((item, i) => (
            <div key={i}>
              {item.path ? (
                <Link
                  ref={(el) => (itemRefs.current[item.path] = el)}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ) : (
                <>
                  <div
                    ref={(el) => {
                      if (isAnyChildActive(item)) {
                        itemRefs.current[item.name] = el;
                      }
                    }}
                    onClick={() => toggleMenu(item.name)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                      isAnyChildActive(item)
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1">{item.name}</span>
                    {openMenu === item.name ? (
                      <FiChevronsUp />
                    ) : (
                      <FiChevronsDown />
                    )}
                  </div>

                  {openMenu === item.name && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((sub, j) => (
                        <Link
                          key={j}
                          ref={(el) => (itemRefs.current[sub.path] = el)}
                          to={sub.path}
                          className={`block px-2 py-1 rounded ${
                            isActive(sub.path)
                              ? "bg-gray-100 text-blue-600 font-semibold"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
