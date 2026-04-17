import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { FiBell, FiUnlock, FiLogOut, FiUser, FiGlobe } from "react-icons/fi";

import UserChangePasswordModal from "../components/Users/UserChangePasswordModal";
import { motion, AnimatePresence } from "framer-motion";

import defaultAvatar from "../assets/images/client-def-image.png";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";

export default function Navbar({ sidebarOpen, role }) {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const isRTL = i18n.language === "fa" || i18n.language === "ps";

  // ---------------- STATES ----------------
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState("unread");
  const [limit, setLimit] = useState(6);

  // ---------------- REFS ----------------
  const notifRef = useRef();
  const profileRef = useRef();
  const langRef = useRef();
  const socketRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ---------------- HELPERS (MISSING FIXED) ----------------
  const getAvatar = (u) => {
    if (!u?.user_photo_url) return defaultAvatar;
    if (u.user_photo_url.startsWith("http")) return u.user_photo_url;
    return `${import.meta.env.VITE_API_URL}${u.user_photo_url}`;
  };

  const getStatusClass = (status) =>
    status === "Online" ? "border-green-500 animate-pulse" : "border-gray-300";

  const getProfileRoute = (role) => {
    switch (role) {
      case "Admin":
        return "/admin/users/user-profile";
      case "HR":
        return "/hr/users/user-profile";
      case "PM":
        return "/pm/user-profile";
      default:
        return "/user-profile";
    }
  };

  const logout = async () => {
    try {
      await API.post("/users/logout");
    } catch {}
    localStorage.clear();
    navigate("/");
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- DERIVED ----------------
  const unread = notifications.filter((n) => !n.is_read);
  const read = notifications.filter((n) => n.is_read);

  const currentList = tab === "unread" ? unread : read;
  const visible = currentList.slice(0, limit);

  // ---------------- CLICK OUTSIDE ----------------
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (langRef.current && !langRef.current.contains(e.target))
        setLangOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ---------------- RTL ----------------
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    document.documentElement.dir =
      lang === "fa" || lang === "ps" ? "rtl" : "ltr";
  }, []);

  // ---------------- LANGUAGE ----------------
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);

    document.documentElement.dir = lng === "fa" || lng === "ps" ? "rtl" : "ltr";

    setLangOpen(false);
  };

  // ---------------- FETCH NOTIFICATIONS ----------------
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      const data = Array.isArray(res.data) ? res.data : [];

      const filtered = data.filter(
        (n) =>
          !n.user_id ||
          n.user_id === user.user_id ||
          n.notification_recipients === role,
      );

      setNotifications(
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("new_notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    socket.on("delete_notification", ({ id }) => {
      setNotifications((prev) => prev.filter((n) => n.notification_id !== id));
    });

    socket.on("notification_read", ({ id }) => {
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_read: 1 } : n)),
      );
    });

    return () => socket.disconnect();
  }, []);

  return (
    <>
      <div
        className="flex items-center justify-between bg-white shadow-sm px-4 py-1 relative w-dvw z-40"
        style={{
          marginLeft: sidebarOpen ? "16rem" : "",
        }}
      >
        <h1 className="font-bold text-lg ml-6 mr-6">
          {role} {t("panel")}
        </h1>

        <div className="flex items-center gap-4">
          {/* ---------------- LANGUAGE ---------------- */}
          <div className="relative" ref={langRef}>
            <div
              onClick={() => setLangOpen(!langOpen)}
              className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer flex items-center gap-1 text-xs"
            >
              <FiGlobe size={18} />
              <span className="hidden sm:block uppercase">{i18n.language}</span>
            </div>

            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute mt-1 w-28 bg-white shadow-lg rounded-lg border z-50
                ${isRTL ? "left-0" : "right-0"}
              `}
              >
                <div
                  onClick={() => changeLanguage("en")}
                  className="px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                >
                  {t("english")}
                </div>

                <div
                  onClick={() => changeLanguage("fa")}
                  className="px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                >
                  {t("persian")}
                </div>

                <div
                  onClick={() => changeLanguage("ps")}
                  className="px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                >
                  {t("pashto")}
                </div>
              </motion.div>
            )}
          </div>

          {/* ---------------- NOTIFICATIONS ---------------- */}
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
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full animate-pulse"
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
                  className={`absolute mt-1 w-80 max-h-[450px] bg-white shadow-lg rounded-lg border flex flex-col overflow-hidden z-50
                  ${isRTL ? "left-0" : "right-0"}
                `}
                >
                  {/* Tabs */}
                  <div className="flex border-b text-sm">
                    <div
                      onClick={() => setTab("unread")}
                      className={`flex-1 py-2 text-center cursor-pointer ${
                        tab === "unread"
                          ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                          : ""
                      }`}
                    >
                      {t("unread")}
                    </div>

                    <div
                      onClick={() => setTab("read")}
                      className={`flex-1 py-2 text-center cursor-pointer ${
                        tab === "read"
                          ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                          : ""
                      }`}
                    >
                      {t("read")}
                    </div>
                  </div>

                  {/* LIST */}
                  <div className="flex-1 overflow-y-auto">
                    {visible.length === 0 ? (
                      <p className="text-center text-gray-400 py-4 text-sm">
                        {t("no_notifications")}
                      </p>
                    ) : (
                      visible.map((n) => {
                        const nUser = n.user || {};

                        return (
                          <div
                            key={n.notification_id}
                            className="p-3 border-b hover:bg-gray-50 text-sm"
                          >
                            <div className="flex gap-2">
                              <div
                                className={`relative rounded-full p-[2px] ${getStatusClass(
                                  nUser.login_status,
                                )}`}
                              >
                                <img
                                  src={getAvatar(nUser)}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              </div>

                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="font-semibold text-xs">
                                    {n.notification_title}
                                  </span>

                                  {!n.is_read && (
                                    <div
                                      onClick={() =>
                                        markAsRead(n.notification_id)
                                      }
                                      className="p-2 rounded-full text-green-600 text-xs hover:bg-gray-200 hover:text-red-500 cursor-pointer"
                                    >
                                      {t("mark_read")}
                                    </div>
                                  )}
                                </div>

                                <p className="text-xs text-gray-600">
                                  {n.notification_message}
                                </p>

                                <p className="text-[10px] text-gray-500">
                                  {t("by")}: {nUser.user_name || "System"}
                                </p>

                                <span className="text-[10px] text-gray-400">
                                  {new Date(n.created_at).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {visible.length < currentList.length && (
                      <div
                        onClick={() => setLimit((l) => l + 10)}
                        className="text-center text-blue-500 text-xs py-2 cursor-pointer"
                      >
                        {t("more_notifications")}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ---------------- PROFILE ---------------- */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-1 py-1 rounded-full"
            >
              <img
                src={getAvatar(user)}
                className="w-8 h-8 rounded-full border object-cover"
              />
            </div>

            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute mt-1 w-48 bg-white shadow-lg rounded-lg border z-50
                ${isRTL ? "left-0" : "right-0"}
              `}
              >
                <div
                  onClick={() => navigate(getProfileRoute(role))}
                  className="p-2 hover:bg-gray-100 text-sm flex gap-2 cursor-pointer"
                >
                  <FiUser /> {t("profile")}
                </div>

                <div
                  onClick={() => {
                    setShowChangePass(true);
                    setProfileOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 text-sm flex gap-2 cursor-pointer"
                >
                  <FiUnlock /> {t("change_password")}
                </div>

                <div
                  onClick={logout}
                  className="p-2 hover:bg-red-100 text-sm text-red-600 flex gap-2 cursor-pointer"
                >
                  <FiLogOut /> {t("logout")}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {showChangePass && (
          <UserChangePasswordModal onClose={() => setShowChangePass(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
