import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { FiBell, FiUnlock, FiLogOut, FiUser, FiGlobe } from "react-icons/fi";

import UserChangePasswordModal from "../components/Users/UserChangePasswordModal";
import { motion, AnimatePresence } from "framer-motion";

import defaultAvatar from "../assets/images/user-def-image.png";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";

export default function Navbar({ sidebarOpen, role }) {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const isRTL = i18n.language === "fa" || i18n.language === "ps";

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState("unread");
  const [limit, setLimit] = useState(6);

  const [avatarError, setAvatarError] = useState(false);

  const notifRef = useRef();
  const profileRef = useRef();
  const langRef = useRef();
  const socketRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ---------------- AVATAR ----------------
  const getAvatar = (u) => {
    if (!u?.user_photo_url) return defaultAvatar;
    if (u.user_photo_url.startsWith("http")) return u.user_photo_url;
    return `${import.meta.env.VITE_IMAGE_URL}${u.user_photo_url}`;
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

  // ---------------- FILTERS ----------------
  const unread = notifications.filter((n) => !n?.is_read);
  const read = notifications.filter((n) => n?.is_read);

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
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

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

  // ---------------- SOCKET ----------------
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
      setNotifications((prev) =>
        prev.filter((n) => n.notification_id !== id),
      );
    });

    socket.on("notification_read", ({ id }) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: 1 } : n,
        ),
      );
    });

    return () => socket.disconnect();
  }, []);

  return (
    <>
      <div
        className="flex items-center justify-between bg-white shadow-sm px-4 py-1 relative w-dvw z-40"
        style={{ marginLeft: sidebarOpen ? "16rem" : "" }}
      >
        <h1 className="font-bold text-lg ml-6 mr-6">
          {role} {t("panel")}
        </h1>

        <div className="flex items-center gap-4">

          {/* LANGUAGE */}
          <div className="relative" ref={langRef}>
            <div
              onClick={() => setLangOpen(!langOpen)}
              className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer flex items-center gap-1 text-xs"
            >
              <FiGlobe size={18} />
              <span className="hidden sm:block uppercase">
                {i18n.language}
              </span>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="relative" ref={notifRef}>
            <div
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <FiBell size={20} />
            </div>
          </div>

          {/* PROFILE */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={avatarError ? defaultAvatar : getAvatar(user)}
                onError={() => setAvatarError(true)}
                className="w-8 h-8 rounded-full border object-cover"
              />
            </div>
          </div>

        </div>
      </div>

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