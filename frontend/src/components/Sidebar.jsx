import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiClipboard, FiDollarSign, FiBriefcase, FiChevronDown, FiChevronUp, FiMaximize2, FiMinimize2, FiBarChart, FiBarChart2, FiPieChart, } from "react-icons/fi";

export default function Sidebar({ role }) {
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (windowWidth < 768) setSidebarOpen(false);
        else setSidebarOpen(true);
    }, [windowWidth]);

    const toggleMenu = (menu) => setOpenMenu(prev => ({ ...prev, [menu]: !prev[menu] }));
    const isActive = (path) => location.pathname === path ? "bg-gray-800" : "";

    return (
        <>
            {/* Toggle button */}
            <div className="fixed top-0.5 left-0.5 z-50">
                <div onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 bg-white text-gray-900 font-bold rounded  hover:bg-gray-100">
                    {sidebarOpen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
                </div>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && windowWidth < 768 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div className={`fixed top-9 left-0 h-screen w-56 bg-gray-900 text-white p-4 z-40 transform transition-transform duration-700 shadow-lg ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

                {role === "Admin" && (
                    <>
                        <Link to="/admin/dashboard" className={`flex items-center mb-2 p-2 rounded hover:bg-gray-700 ${isActive("/admin/dashboard")}`}>
                            <FiPieChart className="mr-2" /> Dashboard
                        </Link>
                        <div>
                            <div className="flex items-center justify-between cursor-pointer mb-2 p-2 rounded hover:bg-gray-800" onClick={() => toggleMenu("company")}>
                                <div className="flex items-center"><FiHome className="mr-2" />Company</div>
                                {openMenu["company"] ? <FiChevronUp /> : <FiChevronDown />}
                            </div>
                            <div className={`ml-6 flex flex-col transition-all duration-500 overflow-hidden ${openMenu["company"] ? "max-h-40" : "max-h-0"}`}>
                                <Link to="/admin/company/company-info" className="mb-2 hover:text-gray-300 text-sm">Company Info</Link>
                                <Link to="/admin/company/company-documents" className="mb-2 hover:text-gray-300 text-sm">Company Documents</Link>
                                <Link to="/admin/departments/departments-info" className="mb-2 hover:text-gray-300 text-sm">Departments</Link>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between cursor-pointer mb-2 p-2 rounded hover:bg-gray-800" onClick={() => toggleMenu("hr")}>
                                <div className="flex items-center"><FiUsers className="mr-2" />HR</div>
                                {openMenu["hr"] ? <FiChevronUp /> : <FiChevronDown />}
                            </div>
                            <div className={`ml-6 flex flex-col transition-all duration-500 overflow-hidden ${openMenu["hr"] ? "max-h-40" : "max-h-0"}`}>
                                <Link to="/admin/employees/employee-info" className="mb-2 hover:text-gray-300 text-sm">Employees</Link>
                                <Link to="/admin/employees/employee-education-info" className="mb-2 hover:text-gray-300 text-sm">Employee Education</Link>
                                <Link to="/admin/departments/departments-info" className="mb-2 hover:text-gray-300 text-sm">Departments</Link>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between cursor-pointer mb-2 p-2 rounded hover:bg-gray-800" onClick={() => toggleMenu("users")}>
                                <div className="flex items-center"><FiUsers className="mr-2" />Users</div>
                                {openMenu["users"] ? <FiChevronUp /> : <FiChevronDown />}
                            </div>
                            <div className={`ml-6 flex flex-col transition-all duration-500 overflow-hidden ${openMenu["users"] ? "max-h-40" : "max-h-0"}`}>
                                <Link to="/admin/users/user-list" className="mb-2 hover:text-gray-300 text-sm">Users List</Link>
                            </div>
                        </div>

                    </>
                )}

                {role === "HR" && (
                    <>
                        <Link to="/hr/dashboard" className={`flex items-center mb-2 p-2 rounded hover:bg-gray-700 ${isActive("/hr/dashboard")}`}>
                            <FiPieChart className="mr-2" /> Dashboard
                        </Link>
                        <div>
                            <div className="flex items-center justify-between cursor-pointer mb-2 p-2 rounded hover:bg-gray-800" onClick={() => toggleMenu("HR")}>
                                <div className="flex items-center"><FiUsers className="mr-2" /> HR</div>
                                {openMenu["HR"] ? <FiChevronUp /> : <FiChevronDown />}
                            </div>
                            <div className={`ml-6 flex flex-col transition-all duration-500 overflow-hidden ${openMenu["HR"] ? "max-h-40" : "max-h-0"}`}>
                                <Link to="/hr/employees/employee-info" className="mb-1 hover:text-gray-300">Employees</Link>
                                <Link to="/hr/employees/list" className="mb-1 hover:text-gray-300">Employees List</Link>
                                <Link to="/hr/employees/salary" className="mb-1 hover:text-gray-300">Employees Salary</Link>
                            </div>
                        </div>
                    </>
                )}

                {/* Financial */}
                {role === "Financial" && (
                    <>
                        <Link to="/financial/dashboard" className={`flex items-center mb-2 p-2 rounded hover:bg-gray-800 ${isActive("/financial/dashboard")}`}>
                            <FiHome className="mr-2" /> Dashboard
                        </Link>
                        <Link to="/financial/reports" className={`flex items-center mb-2 p-2 rounded hover:bg-gray-800 ${isActive("/financial/reports")}`}>
                            <FiDollarSign className="mr-2" /> Reports
                        </Link>
                    </>
                )}

                {/* PM */}
                {role === "PM" && (
                    <>
                        <Link to="/pm/dashboard" className={`flex items-center mb-2 p-2 rounded hover:bg-gray-800 ${isActive("/pm/dashboard")}`}>
                            <FiHome className="mr-2" /> Dashboard
                        </Link>
                        <Link to="/pm/projects" className={`flex items-center mb-2 p-2 rounded hover:bg-gray-800 ${isActive("/pm/projects")}`}>
                            <FiBriefcase className="mr-2" /> Projects
                        </Link>
                    </>
                )}

                {/* Employee */}
                {role === "Employee" && (
                    <>
                        <Link to="/employee/dashboard" className={`flex items-center mb-2 p-2 rounded hover:bg-gray-800 ${isActive("/employee/dashboard")}`}>
                            <FiHome className="mr-2" /> Dashboard
                        </Link>
                        <Link to="/employee/tasks" className={`flex items-center mb-2 p-2 rounded hover:bg-gray-800 ${isActive("/employee/tasks")}`}>
                            <FiClipboard className="mr-2" /> Tasks
                        </Link>
                    </>
                )}

                {/* Client */}
                {role === "Client" && (
                    <Link to="/client/dashboard" className={`flex items-center mb-2 p-2 rounded hover:bg-gray-800 ${isActive("/client/dashboard")}`}>
                        <FiHome className="mr-2" /> Dashboard
                    </Link>
                )}

            </div>
        </>
    );
}