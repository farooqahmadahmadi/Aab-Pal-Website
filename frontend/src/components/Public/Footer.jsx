import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

import { useTranslation } from "react-i18next";

//  LOCAL LOGO
import logo from "../../assets/images/logo.png";

export default function Footer() {
  const { t, i18n } = useTranslation();

  const isRTL = ["fa", "ps"].includes(i18n.language);

  return (
    <footer
      className="
        relative
       
       bg-gradient-to-r
    from-sky-200
    via-teal-200
    via-cyan-100
    to-blue-200
    bg-[length:300%_300%]
    animate-waterFlow
      "
    >
      {/* ================= BG EFFECT ================= */}
      <div
        className="
          absolute
          top-0
          right-0
          w-72
          h-72
          bg-blue-100
          rounded-full
          blur-3xl
          opacity-30
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          w-72
          h-72
          bg-cyan-100
          rounded-full
          blur-3xl
          opacity-30
        "
      />

      {/* ================= MAIN ================= */}
      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-4
          py-14
          grid
          gap-10
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {/* ================= LOGO & ABOUT ================= */}
        <div>
          {/* LOGO */}
          <div className="flex flex-col items-center text-center mb-4">
            {/* IMAGE */}
            <img
              src={logo}
              alt="AabPal Logo"
              className="
      w-16
      h-16
      object-contain
      rounded-2xl
      shadow-md
      bg-white
      p-1
      mb-3
    "
            />

            {/* TEXT */}
            <div>
              <h2 className="text-2xl font-extrabold text-blue-700">AabPal</h2>

              <p className="text-xs text-gray-500 mt-1">
                Smart Water Management Platform
              </p>
            </div>

            {/* ABOUT */}
            <p className="text-gray-600 leading-7 text-sm text-justify mt-4">
              {t("footer_about") ||
                "Smart water management solutions for modern businesses."}
            </p>
          </div>
        </div>

        {/* ================= QUICK LINKS ================= */}
        <div>
          <h3 className="font-bold text-gray-800 mb-5 text-lg">
            {t("quick_links") || "Quick Links"}
          </h3>

          <ul className="space-y-3 text-gray-600">
            <li>
              <Link
                to="/"
                className="
                  hover:text-blue-600
                  transition
                  hover:translate-x-1
                  inline-block
                "
              >
                {t("home")}
              </Link>
            </li>

            <li>
              <Link
                to="/our-services"
                className="
                  hover:text-blue-600
                  transition
                  hover:translate-x-1
                  inline-block
                "
              >
                {t("services")}
              </Link>
            </li>

            <li>
              <Link
                to="/our-projects"
                className="
                  hover:text-blue-600
                  transition
                  hover:translate-x-1
                  inline-block
                "
              >
                {t("projects")}
              </Link>
            </li>

            <li>
              <Link
                to="/blogs"
                className="
                  hover:text-blue-600
                  transition
                  hover:translate-x-1
                  inline-block
                "
              >
                {t("blogs")}
              </Link>
            </li>
          </ul>
        </div>

        {/* ================= COMPANY ================= */}
        <div>
          <h3 className="font-bold text-gray-800 mb-5 text-lg">
            {t("company") || "Company"}
          </h3>

          <ul className="space-y-3 text-gray-600">
            <li>
              <Link
                to="/about"
                className="
                  hover:text-blue-600
                  transition
                  hover:translate-x-1
                  inline-block
                "
              >
                {t("about")}
              </Link>
            </li>

            <li>
              <Link
                to="/contact-us"
                className="
                  hover:text-blue-600
                  transition
                  hover:translate-x-1
                  inline-block
                "
              >
                {t("contact")}
              </Link>
            </li>

            <li>
              <Link
                to="/privacy-policy"
                className="
                  hover:text-blue-600
                  transition
                  hover:translate-x-1
                  inline-block
                "
              >
                {t("privacy_policy")}
              </Link>
            </li>

            <li>
              <Link
                to="/terms-and-conditions"
                className="
                  hover:text-blue-600
                  transition
                  hover:translate-x-1
                  inline-block
                "
              >
                {t("terms")}
              </Link>
            </li>
          </ul>
        </div>

        {/* ================= SOCIAL ================= */}
        <div>
          <h3 className="font-bold text-gray-800 mb-5 text-lg">
            {t("follow_us") || "Follow Us"}
          </h3>

          <p className="text-gray-500 text-sm mb-5 leading-6">
            Stay connected with us through our social platforms.
          </p>

          <div className={`flex gap-3 ${isRTL ? "justify-start" : ""}`}>
            {/* FACEBOOK */}
            <a
              href="#"
              className="
                w-11
                h-11
                rounded-xl
                bg-white
                shadow-md
                hover:bg-blue-600
                hover:text-white
                transition-all
                duration-300
                flex
                items-center
                justify-center
                text-gray-700
              "
            >
              <FiFacebook size={18} />
            </a>

            {/* TWITTER */}
            <a
              href="#"
              className="
                w-11
                h-11
                rounded-xl
                bg-white
                shadow-md
                hover:bg-sky-500
                hover:text-white
                transition-all
                duration-300
                flex
                items-center
                justify-center
                text-gray-700
              "
            >
              <FiTwitter size={18} />
            </a>

            {/* INSTAGRAM */}
            <a
              href="#"
              className="
                w-11
                h-11
                rounded-xl
                bg-white
                shadow-md
                hover:bg-pink-500
                hover:text-white
                transition-all
                duration-300
                flex
                items-center
                justify-center
                text-gray-700
              "
            >
              <FiInstagram size={18} />
            </a>

            {/* LINKEDIN */}
            <a
              href="#"
              className="
                w-11
                h-11
                rounded-xl
                bg-white
                shadow-md
                hover:bg-blue-700
                hover:text-white
                transition-all
                duration-300
                flex
                items-center
                justify-center
                text-gray-700
              "
            >
              <FiLinkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div
        className="
          relative
          z-10
          border-t
          border-cyan-300
          text-center
          py-5
          text-sm
          text-gray-700
              bg-gradient-to-r
               from-sky-200
    via-teal-200
    via-cyan-100
    to-blue-200
    bg-[length:300%_300%]
    animate-waterFlow
      
          backdrop-blur-md
        "
      >
        © {new Date().getFullYear()} AabPal - <a>Developer</a>{" "}
        {t("all_rights_reserved") || "All rights reserved."}
      </div>
    </footer>
  );
}
