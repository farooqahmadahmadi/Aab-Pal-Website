// Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { FiBell, FiUser, FiLogOut } from "react-icons/fi";
import UserChangePasswordModal from "../pages/Users/UserChangePasswordModal";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ sidebarOpen, setSidebarOpen, role }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  const profileRef = useRef();
  const notifRef = useRef();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // Close menus if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    try { await API.post("/users/logout"); } catch (err) { console.error(err); }
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div
        className="flex items-center justify-between bg-white shadow px-4 py-1 relative w-svw top-0 left-0 right-0 z-40 transition-all"
        style={{ marginLeft: sidebarOpen ? "16rem" : "0", transition: "margin-left 0.3s" }}
      >

        {/* Title */}
        <div className="flex ml-6 items-center space-x-4">
          <h1 className=" text-xl font-bold text-black">{role} Panel</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <div
              className="p-1 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <FiBell size={20} />
            </div>
            {notifOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white shadow rounded border overflow-hidden z-20">
                <p className="p-2 text-sm hover:bg-gray-100 cursor-pointer">New task assigned</p>
                <p className="p-2 text-sm hover:bg-gray-100 cursor-pointer">Attendance approved</p>
                <p className="p-2 text-sm hover:bg-gray-100 cursor-pointer">Salary updated</p>
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div className="relative" ref={profileRef}>
            <div
              className="flex items-center bg-gray-50 space-x-2 p-1 px-2 text-green-700 font-semibold hover:bg-gray-100 rounded-full cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <FiUser size={20} />
              <span className="hidden md:inline">{user?.user_name || "User"}</span>
            </div>

            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-1 w-48 bg-white shadow rounded-b-md border overflow-hidden z-20"
              >
                <button
                  onClick={() => { setShowChangePass(true); setProfileOpen(false); }}
                  className="flex items-center space-x-2 p-2 w-full text-left hover:bg-gray-100 rounded-none"
                >
                  <FiUser /> <span>Change Password</span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 p-2 w-full text-left hover:bg-red-100 text-red-600 rounded-none"
                >
                  <FiLogOut /> <span>Logout</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePass && (
          <UserChangePasswordModal
            onClose={() => setShowChangePass(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}