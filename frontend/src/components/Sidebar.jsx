import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  FiHome,
  FiPieChart,
  FiChevronsDown,
  FiChevronsUp,
  FiChevronLeft,
  FiGlobe,
  FiInfo,
  FiCreditCard,
  FiUsers,
} from "react-icons/fi";

import { FaIdCard } from "react-icons/fa";

import { FileBracesCorner, Menu } from "lucide-react";

import defaultAvatar from "../assets/images/user-def-image.png";

export default function Sidebar() {
  const location = useLocation();
  const sidebarRef = useRef();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "fa" || i18n.language === "ps";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [indicatorStyle, setIndicatorStyle] = useState({
    top: 0,
    height: 0,
  });

  const itemRefs = useRef({});

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ FIX: role normalize
  const role = String(user?.user_role || "").toLowerCase();

  const BASE_URL =
    import.meta.env.VITE_IMAGE_URL || import.meta.env.VITE_API_URL;

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
    if (!user?.user_photo) return defaultAvatar;
    if (user.user_photo.startsWith("http")) return user.user_photo;
    return `${BASE_URL}${user.user_photo}`;
  };

  const isActive = (path) => location.pathname === path;

  const toggleMenu = (name) => {
    setOpenMenu((prev) => (prev === name ? null : name));
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
        name: "Home Page",
        path: "/admin/home",
        icon: <FiHome className="animate-bounce" />,
      },
      {
        name: "Blogs Page",
        icon: <FiCreditCard className="animate-bounce" />,
        submenu: [
          {
            name: "Blos",
            path: "/admin/blogs",
          },
          {
            name: "Blog Comments",
            path: "/admin/blog-comments",
          },
        ],
      },
      {
        name: "About Page",
        path: "/admin/about",
        icon: <FiInfo className="animate-bounce" />,
      },

      {
        name: "Users",
        path: "/admin/users",
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
              <FiChevronRight size={18} />
            ) : (
              <FiChevronLeft size={18} />
            )
          ) : (
            <Menu size={19} />
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
          className="fixed top-0 h-screen bg-white shadow-lg z-50 overflow-hidden transition-all duration-300"
          style={{
            width: sidebarOpen ? "14.5rem" : "0rem",
            left: isRTL ? "auto" : 0,

            right: isRTL ? 0 : "auto",
          }}
        >
          {/* HEADER */}
          <div className="p-3 border-b flex items-center gap-3 bg-zinc-100 rounded">
            <img
              src={getAvatar()}
              onError={(e) => (e.target.src = defaultAvatar)}
              className="w-12 h-12 rounded-full object-cover border shadow"
            />

            <div className="flex flex-col min-w-0">
              <h1 className="text-sm font-bold text-blue-600">
                AabPal Website
              </h1>
              <p className="text-sm font-semibold truncate">{user.user_name}</p>
              <p className="text-[11px] truncate text-gray-500">
                {user.user_email}
              </p>
            </div>
          </div>

          {/* MENU */}
          <div className="relative p-2 text-sm space-y-1 overflow-y-auto h-[calc(100%-80px)]">
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
                    <span>{t(item.name)}</span>
                  </Link>
                ) : (
                  <>
                    <div
                      onClick={() => toggleMenu(item.name)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      {item.icon}
                      <span className="flex-1">{t(item.name)}</span>
                      {openMenu === item.name ? (
                        <FiChevronsUp />
                      ) : (
                        <FiChevronsDown />
                      )}
                    </div>

                    {openMenu === item.name && (
                      <div className={`mt-1 ${isRTL ? "mr-8" : "ml-8"}`}>
                        {item.submenu.map((sub, j) => (
                          <Link
                            key={j}
                            to={sub.path}
                            className="block px-2 py-1 hover:bg-gray-100 rounded"
                          >
                            {t(sub.name)}
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
      </div>
    </>
  );
}
