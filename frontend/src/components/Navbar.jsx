import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { FiBell, FiUser, FiLogOut, FiCheck, FiUnlock, FiUserCheck, FiUsers, FiUserPlus, FiUserX } from "react-icons/fi";
import UserChangePasswordModal from "../components/Users/UserChangePasswordModal";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ sidebarOpen, role }) {

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState("unread");
  const [limit, setLimit] = useState(6);

  const notifRef = useRef();
  const profileRef = useRef();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // fetch
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      const data = Array.isArray(res.data) ? res.data : [];

      // filter personal + role
      const filtered = data.filter(n =>
        !n.user_id || n.user_id === user.user_id || n.notification_recipients === role
      );

      setNotifications(filtered.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // mark as read
  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`); 
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unread = notifications.filter(n => !n.is_read);
  const read = notifications.filter(n => n.is_read);

  const currentList = tab === "unread" ? unread : read;
  const visible = currentList.slice(0, limit);

  const logout = async () => {
    try { await API.post("/users/logout"); } catch {}
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div
        className="flex items-center justify-between bg-white shadow px-4 py-1 relative w-dvw top-0 left-0 right-0 z-40 transition-all"
        style={{ marginLeft: sidebarOpen ? "16rem" : "0" }}
      >

        <h1 className="font-bold text-lg ml-5">{role} Panel</h1>

        <div className="flex items-center gap-4">

          {/* 🔔 Notifications */}
          <div className="relative" ref={notifRef}>
            <div
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <FiBell size={20} />

              {unread.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-1 bg-red-500 text-white text-[10px] px-1 py-[1px] rounded-full"
                >
                  {unread.length}
                </motion.span>
              )}
            </div>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-1 w-72 max-h-[450px] bg-white shadow-lg rounded-lg border flex flex-col overflow-hidden z-50"
                >

                  {/* Tabs */}
                  <div className="flex border-b text-sm cursor-pointer" >
                    <div
                      onClick={() => setTab("unread")}
                      className={`flex-1 py-2 text-center hover:bg-gray-100 ${tab === "unread" ? "border-b-2 border-blue-500 font-semibold text-blue-500" : ""}`}
                    >
                      Unread ({unread.length})
                    </div>
                    <div
                      onClick={() => setTab("read")}
                      className={`flex-1 py-2 text-center hover:bg-gray-100 ${tab === "read" ? "border-b-2 border-blue-500 font-semibold text-blue-500" : ""}`}
                    >
                      Read ({read.length})
                    </div>
                  </div>

                  {/* List */}
                  <div className="overflow-y-auto overflow-x-hidden flex-1">

                    {visible.length === 0 && (
                      <p className="text-center text-gray-400 py-4 text-sm">
                        No notifications
                      </p>
                    )}

                    {visible.map(n => (
                      <div
                        key={n.notification_id}
                        className="p-3 border-b hover:bg-gray-50 text-sm space-y-1"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold break-words">
                            {n.notification_title}
                          </span>

                          {!n.is_read && (
                            <div
                              onClick={() => markAsRead(n.notification_id)}
                              className="text-gray-600 bg-green-200 rounded-full p-0.5 font-semibold hover:bg-blue-300 cursor-pointer"
                            >
                              <FiCheck />
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 break-words whitespace-pre-wrap text-xs">
                          {n.notification_message}
                        </p>

                        <span className="text-[10px] text-gray-400">
                          {new Date(n.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}

                    {/* More */}
                    {visible.length < currentList.length && (
                      <div
                        onClick={() => setLimit(prev => prev + 10)}
                        className="w-full text-center text-blue-500 text-xs py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        More...
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 👤 Profile */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center p-1.5 gap-1  hover:bg-gray-100 px-2 py-1 rounded-full cursor-pointer  "
            >
              <FiUserCheck className="text-blue-500" />
              <span className="hidden md:inline text-sm text-red-500">{user?.user_name}</span>
            </div>

            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-1 w-44 max-h-[450px] bg-white shadow-lg rounded-lg border flex flex-col overflow-hidden z-50"
              >
                <div
                  onClick={() => { setShowChangePass(true); setProfileOpen(false); }}
                  className="w-full flex gap-2 text-left p-2 hover:bg-gray-100 text-sm font-semibold"
                  
                >
                  <FiUnlock/> Change Password
                </div>

                <div
                  onClick={logout}
                  className="w-full flex gap-2 text-left p-2 hover:bg-red-100 text-red-600 text-sm font-semibold"
                >
                  <FiLogOut/>Logout

                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>

      <AnimatePresence>
        {showChangePass && (
          <UserChangePasswordModal onClose={() => setShowChangePass(false)} />
        )}
      </AnimatePresence>
    </>
  );
}