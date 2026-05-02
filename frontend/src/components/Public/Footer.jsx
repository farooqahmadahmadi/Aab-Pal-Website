import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t, i18n } = useTranslation();

  const isRTL = ["fa", "ps"].includes(i18n.language);

  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 grid gap-8 md:grid-cols-4 text-sm">
        {/* ================= LOGO & ABOUT ================= */}
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-2">AabPal</h2>
          <p className="text-gray-600 leading-relaxed">
            {t("footer_about") ||
              "Smart water management solutions for modern businesses."}
          </p>
        </div>

        {/* ================= QUICK LINKS ================= */}
        <div>
          <h3 className="font-semibold mb-3">
            {t("quick_links") || "Quick Links"}
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-blue-600">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-blue-600">
                {t("services")}
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-blue-600">
                {t("projects")}
              </Link>
            </li>
            <li>
              <Link to="/blogs" className="hover:text-blue-600">
                {t("blogs")}
              </Link>
            </li>
          </ul>
        </div>

        {/* ================= COMPANY ================= */}
        <div>
          <h3 className="font-semibold mb-3">{t("company") || "Company"}</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/about" className="hover:text-blue-600">
                {t("about")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-600">
                {t("contact")}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-blue-600">
                {t("privacy_policy")}
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-blue-600">
                {t("terms")}
              </Link>
            </li>
          </ul>
        </div>

        {/* ================= SOCIAL ================= */}
        <div>
          <h3 className="font-semibold mb-3">
            {t("follow_us") || "Follow Us"}
          </h3>

          <div className={`flex gap-3 ${isRTL ? "justify-start" : ""}`}>
            <a href="#" className="p-2 bg-gray-100 rounded hover:bg-blue-100">
              <FiFacebook />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded hover:bg-blue-100">
              <FiTwitter />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded hover:bg-blue-100">
              <FiInstagram />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded hover:bg-blue-100">
              <FiLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="border-t text-center py-3 text-xs text-gray-500">
        © {new Date().getFullYear()} AabPal.{" "}
        {t("all_rights_reserved") || "All rights reserved."}
      </div>
    </footer>
  );
}
