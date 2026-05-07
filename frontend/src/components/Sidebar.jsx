import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { updateNotification } from "../services/websiteNotifications.service";
import {
  FiPieChart,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiBell,
  FiLogOut,
  FiGlobe,
  FiHome,
  FiInfo,
} from "react-icons/fi";

import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import defaultAvatar from "../assets/images/user-def-image.png";
import { getNotifications } from "../services/websiteNotifications.service";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef();

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa" || i18n.language === "ps";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [tab, setTab] = useState("unread");
  const [limit, setLimit] = useState(10);

  const [indicatorStyle, setIndicatorStyle] = useState({
    top: 0,
    height: 0,
  });

  const itemRefs = useRef({});
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = String(user?.user_role || "").toLowerCase();

  const BASE_URL =
    import.meta.env.VITE_IMAGE_URL || import.meta.env.VITE_API_URL;

  // ================= FETCH =================
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getNotifications();
        const list = Array.isArray(data) ? data : data?.data || [];

        setNotifications(
          list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        );
      } catch {}
    };
    fetch();
  }, []);

  const unreadList = notifications.filter((n) => !n?.is_read);
  const readList = notifications.filter((n) => n?.is_read);

  const currentList = tab === "unread" ? unreadList : readList;
  const visibleList = currentList.slice(0, limit);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const markAsRead = async (id) => {
    try {
      await updateNotification(id, { is_read: true });

      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: true } : n,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };
  // ================= TIME =================
  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  // ================= CLICK OUTSIDE =================
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ================= RESPONSIVE =================
  useEffect(() => {
    const resize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ================= ACTIVE =================
  useEffect(() => {
    const el = itemRefs.current[location.pathname];
    if (el) {
      setIndicatorStyle({
        top: el.offsetTop,
        height: el.offsetHeight,
      });
    }
  }, [location.pathname, sidebarOpen]);

  const getAvatar = () => {
    if (!user?.user_photo) return defaultAvatar;
    if (user.user_photo.startsWith("http")) return user.user_photo;
    return `${BASE_URL}${user.user_photo}`;
  };

  // ================= MENU =================
  const menuItems = {
    admin: [
      {
        name: "dashboard",
        path: "/admin/dashboard",
        icon: <FiPieChart className="animate-bounce" />,
      },
      {
        name: "Website Languages",
        path: "/admin/languages",
        icon: <FiGlobe className="animate-bounce" />,
      },
      {
        name: "Website Pages",
        path: "/admin/website-pages",
        icon: <FiGlobe className="animate-bounce" />,
      },
      {
        name: "Web Page Views",
        path: "/admin/web-page-views",
        icon: <FiGlobe className="animate-bounce" />,
      },
      {
        name: "Web Page View Stats",
        path: "/admin/web-page-view-stats",
        icon: <FiGlobe className="animate-bounce" />,
      },
      {
        name: "Home Page",
        path: "/admin/home",
        icon: <FiHome className="animate-bounce" />,
      },
      {
        name: "Our Team",
        path: "/admin/our-team",
        icon: <FiUsers className="animate-bounce" />,
      },
      {
        name: "Blogs",
        path: "/admin/blogs",
        icon: <FiUsers className="animate-bounce" />,
      },
      {
        name: "Blog Comments",
        path: "/admin/blog-comments",
        icon: <FiUsers className="animate-bounce" />,
      },
      {
        name: "Our Projects",
        path: "/admin/our-projects",
        icon: <FiInfo className="animate-bounce" />,
      },
      {
        name: "Our Services",
        path: "/admin/our-services",
        icon: <FiInfo className="animate-bounce" />,
      },
      {
        name: "About",
        path: "/admin/about",
        icon: <FiInfo className="animate-bounce" />,
      },
      {
        name: "FAQs",
        path: "/admin/faqs",
        icon: <FiInfo className="animate-bounce" />,
      },
      {
        name: "Privacy Policy",
        path: "/admin/privacy-policy",
        icon: <FiInfo className="animate-bounce" />,
      },
      {
        name: "Terms & Conditions",
        path: "/admin/terms",
        icon: <FiInfo className="animate-bounce" />,
      },
      {
        name: "Testimonials",
        path: "/admin/testimonials",
        icon: <FiInfo className="animate-bounce" />,
      },
      {
        name: "Users",
        path: "/admin/users",
        icon: <FiUsers className="animate-bounce" />,
      },
      {
        name: "Website Notifications",
        path: "/admin/website-notifications",
        icon: <FiUsers className="animate-bounce" />,
      },
    ],
  };

  return (
    <>
      <div
        style={{
          marginRight: sidebarOpen ? "12rem" : "",
          transition: "ease 0.5s",
        }}
      >
        {/* TOGGLE */}
        <div
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-3 z-[9999] w-7 h-7 flex items-center justify-center bg-white border shadow-sm rounded-full cursor-pointer hover:bg-blue-100"
          style={{
            left: !isRTL ? (sidebarOpen ? "13.5rem" : "0.3rem") : "auto",
            right: isRTL ? (sidebarOpen ? "13.5rem" : "0.3rem") : "auto",
          }}
        >
          {sidebarOpen ? (
            isRTL ? (
              <FiChevronRight />
            ) : (
              <FiChevronLeft />
            )
          ) : (
            <Menu />
          )}
        </div>

        {/* SIDEBAR */}
        <div
          className={`fixed top-0 pb-12 h-screen bg-white shadow-lg z-50 transition-all duration-300 ${
            sidebarOpen ? "w-[14.5rem]" : "w-0"
          } overflow-hidden`}
          style={{
            left: isRTL ? "auto" : 0,
            right: isRTL ? 0 : "auto",
          }}
        >
          {/* HEADER */}
          <div
            className={`p-2 border-b bg-zinc-100 transition-all duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex flex-col gap-1">
              {/* USER INFO */}
              <div className="flex items-center gap-3">
                <img
                  src={getAvatar()}
                  className="w-11 h-11 rounded-full border object-cover flex-shrink-0"
                />

                <div className="min-w-0">
                  {/* BRAND NAME */}
                  <p className="text-sm font-bold text-blue-600 tracking-wide">
                    AabPal-Website
                  </p>
                  <p className="text-sm font-semibold truncate">
                    {user.user_name}
                  </p>

                  <p className="text-xs text-gray-500 truncate">
                    {user.user_email}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-b-2 mt-3  border-dashed"></div>
            {/* ACTIONS */}
            <div className="flex items-center justify-between mt-2 pl-2 pr-2">
              {/* Logout */}
              <div
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-white text-sm hover:bg-red-500 px-2 py-1 font-semibold rounded-full cursor-pointer"
              >
                <FiLogOut /> Logout
              </div>

              {/* Notification */}
              <div className="relative w-full flex justify-end" ref={notifRef}>
                <div
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-full hover:bg-gray-200 cursor-pointer"
                >
                  <FiBell size={18} />

                  {unreadList.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1  rounded-full animate-pulse">
                      {unreadList.length}
                    </span>
                  )}
                </div>

                {/* DROPDOWN */}
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="fixed top-14 bg-white border shadow-xl rounded-xl z-[9999] flex flex-col"
                      style={{
                        width: window.innerWidth < 768 ? "90vw" : "320px",
                        maxWidth: "340px",

                        //  desktop alignment with sidebar
                        right: isRTL
                          ? window.innerWidth < 768
                            ? "1rem"
                            : "14.5rem"
                          : "auto",

                        left: isRTL
                          ? "auto"
                          : window.innerWidth < 768
                            ? "1rem"
                            : "14.5rem",

                        height: "420px",
                      }}
                    >
                      {/* HEADER */}
                      <div className="p-3 font-semibold border-b shrink-0">
                        Notifications
                      </div>

                      {/* TABS */}
                      <div className="flex border-b text-sm shrink-0 text-center cursor-pointer">
                        <div
                          onClick={() => {
                            setTab("unread");
                            setLimit(10);
                          }}
                          className={`flex-1 py-2 hover:bg-gray-100 ${
                            tab === "unread"
                              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                              : ""
                          }`}
                        >
                          Unread ({unreadList.length})
                        </div>

                        <div
                          onClick={() => {
                            setTab("read");
                            setLimit(10);
                          }}
                          className={`flex-1 py-2 hover:bg-gray-100 ${
                            tab === "read"
                              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                              : ""
                          }`}
                        >
                          Read ({readList.length})
                        </div>
                      </div>

                      {/* LIST */}
                      <div className="flex-1 overflow-y-auto">
                        {visibleList.length === 0 && (
                          <p className="p-3 text-sm text-gray-500 text-center">
                            No notifications
                          </p>
                        )}

                        {visibleList.map((n) => (
                          <div
                            key={n.notification_id}
                            className={`p-3 border-b hover:bg-gray-100 cursor-pointer ${
                              !n.is_read ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="text-sm font-semibold">
                              {n.notification_title || "Notification"}
                            </div>

                            <div className="text-xs text-gray-600 mt-1">
                              {n.notification_message}
                            </div>

                            <div className="flex justify-between items-center mt-2">
                              <span className="text-[10px] text-gray-400">
                                {formatTime(n.created_at)}
                              </span>

                              {!n.is_read && (
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(n.notification_id);
                                  }}
                                  className="text-xs text-blue-500 hover:underline p-1 bg-blue-100 rounded "
                                >
                                  Mark as read
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* MORE */}
                      {currentList.length > limit && (
                        <div
                          onClick={() => setLimit((prev) => prev + 10)}
                          className="p-2 text-center text-sm text-blue-600 hover:bg-gray-100 cursor-pointer border-t shrink-0"
                        >
                          More notifications...
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* MENU */}
          <div className="relative p-2 text-sm space-y-1 overflow-y-auto h-[calc(100%-120px)] scrollbar-hide">
            <div
              className="absolute w-1 bg-blue-500 rounded-full transition-all duration-300"
              style={{
                top: indicatorStyle.top,
                height: indicatorStyle.height,
                left: isRTL ? "auto" : 0,
                right: isRTL ? 0 : "auto",
              }}
            />

            {menuItems[role]?.map((item, i) => (
              <Link
                key={i}
                ref={(el) => (itemRefs.current[item.path] = el)}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-black ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "hover:bg-gray-100  hover:text-blue-700"
                }`}
              >
                {item.icon}
                <span>{t(item.name)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
