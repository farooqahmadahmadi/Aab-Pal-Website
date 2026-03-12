import { useState, useEffect, useRef } from "react";
import { FiBell, FiChevronDown, FiShield, FiUser, FiBriefcase, FiGlobe } from "react-icons/fi";
import { IconContext } from "react-icons/lib";

/**
 * Navbar Component
 * ----------------
 * Professional & clean navbar.
 * - No toggle buttons
 * - Fixed top, full width
 * - Notifications + Profile dropdown
 * - Responsive & smooth
 */

export default function Navbar({ role = "admin" }) {
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "User Registered",
            message: "New user John Doe registered successfully.",
            time: "2m ago",
            avatar: "https://i.pravatar.cc/40?img=11",
        },
        {
            id: 2,
            title: "Server Update",
            message: "Server updated successfully. All services are running normally.",
            time: "10m ago",
            avatar: "https://i.pravatar.cc/40?img=12",
        },
        {
            id: 3,
            title: "Message Received",
            message: "You have a new message from Alice. Please check your inbox.",
            time: "1h ago",
            avatar: "https://i.pravatar.cc/40?img=13",
        },
        {
            id: 4,
            title: "Maintenance Alert",
            message: "Scheduled maintenance will occur tomorrow from 1AM to 3AM.",
            time: "3h ago",
            avatar: "https://i.pravatar.cc/40?img=14",
        },
    ]);

    const navbarRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navbarRef.current && !navbarRef.current.contains(e.target)) {
                setDropdownOpen(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

    const renderRoleIcon = () => {
        switch (role) {
            case "admin":
                return <FiShield size={14} className="text-red-500" />;
            case "manager":
                return <FiBriefcase size={14} className="text-blue-500" />;
            default:
                return <FiUser size={14} className="text-green-500" />;
        }
    };

    return (
        <header
            ref={navbarRef}
            className="relative top-0 left-0 w-full h-14 bg-white shadow-md flex items-center justify-between px-6 z-20 "
        >
            {/* Dashboard title */}
            <h1 className="  hidden sm:block text-sm md:text-lg font-semibold text-gray-800 truncate">
                Dashboard Overview
            </h1>

            {/* Right actions */}
            <div className="flex items-center gap-3 ml-auto relative">
                {/* Role badge */}
                <div className="hidden md:flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {renderRoleIcon()}
                    <span className="capitalize">{role}</span>
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(dropdownOpen === "notif" ? null : "notif")}
                        className="p-1 rounded-full hover:bg-gray-100 transition relative"
                    >
                        <FiBell size={16} />
                        {notifications.length > 0 && (
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                    </button>
                    {dropdownOpen === "notif" && notifications.length > 0 && (
                        <div className="absolute right-0 mt-3 w-80 max-h-96 bg-white border rounded-lg shadow-lg z-[999] overflow-y-auto overflow-x-hidden animate-fadeIn">
                            <div className="p-3 text-sm border-b font-medium">Notifications</div>
                            {notifications.map((n, i) => (
                                <div
                                    key={n.id}
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                    className="flex items-start gap-2 p-3 border-b last:border-b-0 animate-fadeIn shadow-sm rounded-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-50"
                                >
                                    <img src={n.avatar} alt="avatar" className="w-6 h-6 rounded-full flex-shrink-0" />
                                    <div className="flex flex-col gap-1">
                                        <p className="font-semibold text-sm">{n.title}</p>
                                        <p className="text-xs text-gray-600 whitespace-pre-wrap">{n.message}</p>
                                        <span className="text-xs text-gray-400">{n.time}</span>
                                    </div>
                                    <button
                                        onClick={() => markAsRead(n.id)}
                                        className="ml-auto text-xs text-blue-500 hover:underline flex-shrink-0"
                                    >
                                        Mark as read
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(dropdownOpen === "profile" ? null : "profile")}
                        className="flex items-center gap-1 w-auto h-8 rounded-full overflow-hidden border px-1"
                    >
                        <img
                            src="https://i.pravatar.cc/40?img=12"
                            alt="user"
                            className="w-6 h-6 object-cover rounded-full"
                        />
                        <span className="hidden md:block text-xs truncate">Eng. Ahmadi </span>
                        <FiChevronDown size={14} />
                    </button>

                    {dropdownOpen === "profile" && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-xl z-[999] animate-fadeIn">
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">Profile</button>
                            <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 text-sm" >Logout</button>
                        </div>
                    )}
                </div>

                {/* Language 
                <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                    <FiGlobe size={16} />
                </button>
                */}
            </div>
        </header>
    );
}