import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiPieChart,
  FiSettings,
  FiDollarSign,
  FiTruck,
  FiBox,
  FiShoppingBag,
  FiList,
  FiBookOpen,
  FiMenu,
} from "react-icons/fi";

export default function Sidebar({ role }) {
  const location = useLocation();
  const sidebarRef = useRef();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [popupMenu, setPopupMenu] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 768) setSidebarOpen(false);
    else setSidebarOpen(true);
    setPopupMenu(null);
  }, [windowWidth]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setPopupMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopup = (menu) =>
    setPopupMenu((prev) => (prev === menu ? null : menu));
  const isActiveParent = (item) => {
    if (!item.submenu) return location.pathname === item.path;
    return item.submenu.some((sub) => sub.path === location.pathname);
  };

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
            path: "/hr/employees/employee-education-info",
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

  const renderMenu = (items) =>
    items.map((item, idx) => {
      const activeParent = isActiveParent(item);

      if (!item.submenu) {
        return (
          <Link
            key={idx}
            to={item.path}
            className={`flex items-center justify-center mb-2 p-2 rounded text-black hover:bg-gray-200 hover:text-black transition-all duration-300
            ${activeParent ? "bg-gray-200 text-blue-700 font-semibold shadow-md" : ""}`}
          >
            <span className="text-xl relative">
              {item.icon}
              {!sidebarOpen && (
                <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50">
                  {item.name}
                </span>
              )}
            </span>
          </Link>
        );
      }

      return (
        <div key={idx} className="relative group">
          <div
            className={`flex items-center justify-center mb-3 p-2  rounded hover:bg-gray-200 transition-all duration-300 cursor-pointer
            ${activeParent ? "bg-gray-200 text-blue-700 font-semibold shadow-md" : ""}`}
            onClick={() => togglePopup(item.name)}
          >
            <span className="text-xl relative">
              {item.icon}
              {!sidebarOpen && (
                <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-white text-black text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50">
                  {item.name}
                </span>
              )}
            </span>
          </div>

          {/* Sub menu */}
          {popupMenu === item.name && (
            <div className="absolute top-0 left-full ml-0 w-48 text-sm bg-white rounded shadow-lg py-2 z-50 transition-transform duration-300 transform scale-95 opacity-0 animate-popup">
              {item.submenu.map((sub, subIdx) => (
                <Link
                  key={subIdx}
                  to={sub.path}
                  className="flex items-center px-3 py-2 rounded text-black hover:bg-gray-200 hover:text-black transition-all duration-300"
                  onClick={() => {
                    setPopupMenu(null);
                    if (windowWidth < 768) setSidebarOpen(false);
                  }}
                >
                  <span>{sub.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    });

  return (
    <>
      <div className=" fixed top-2.5 left-1 z-50">
        <div
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-1 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all duration-300 cursor-pointer animate-bounce"
        >
          {sidebarOpen ? <FiMenu size={20} /> : <FiMenu size={20} />}
        </div>
      </div>

      {sidebarOpen && windowWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen w-9 bg-white text-black z-40 transform shadow-lg transition-all duration-500 ease-in-out
          ${sidebarOpen ? "translate-x-0 w-20" : "-translate-x-full w-20"}`}
      >
        <div className="p-4 mt-16 flex flex-col items-center">
          {menuItems[role] && renderMenu(menuItems[role])}
        </div>
      </div>

      <style>{`
        @keyframes popup {
          0% { opacity: 0; transform: scale(0.95) translateX(-10px); }
          100% { opacity: 1; transform: scale(1) translateX(0); }
        }
        .animate-popup { animation: popup 0.25s forwards; }
      `}</style>
    </>
  );
}
