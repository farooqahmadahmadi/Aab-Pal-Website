import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../../../services/api";

import InstallPwaModal from "../../../components/PWA/InstallPwaModal";
import loginBg from "../../../assets/images/login-bg.jpg";

import { FaTimes, FaEye, FaEyeSlash, FaUserLock } from "react-icons/fa";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ===== STATE =====
  const [form, setForm] = useState({
    user_email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");

  const [blockTime, setBlockTime] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [showSignupInfo, setShowSignupInfo] = useState(false);

  // ===== INPUT =====
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (blockTime > 0) return;

    try {
      const res = await API.post("/users/login", form);

      const user = res.data.user;

      if (!user) {
        setToastType("error");
        setToast("Invalid login response");
        return;
      }

      // SAVE AUTH
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      setToastType("success");
      setToast(t("login_success"));

      // ===== ONLY ADMIN ALLOWED =====
      const role = String(user.user_role || "").toLowerCase().trim();

      if (role !== "admin") {
        setToastType("error");
        setToast("Only Admin access allowed");
        return;
      }

      // ===== CLEAR SECURITY STATE =====
      setAttempts(0);
      setBlockTime(0);

      // ===== REDIRECT FIX =====
     navigate("/admin/dashboard", { replace: true });

    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts === 3) setBlockTime(30);
      if (newAttempts === 5) setBlockTime(60);

      setToastType("error");
      setToast(err.response?.data?.message || "Login failed");
    }
  };

  // ===== BLOCK TIMER =====
  useEffect(() => {
    if (blockTime <= 0) return;

    const timer = setInterval(() => {
      setBlockTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [blockTime]);

  const progress = blockTime > 0 ? (blockTime / 60) * 100 : 0;

  // ================= FORGOT =================
  const handleForgot = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/forgot-password", {
        user_email: forgotEmail,
      });

      setToastType("success");
      setToast(res.data.message);
      setShowForgot(false);
    } catch (err) {
      setToastType("error");
      setToast(err.response?.data?.message || "Error");
    }
  };

  // ================= UI (UNCHANGED) =================
  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 w-full max-w-md p-4">
        <div className="bg-white/10 backdrop-blur-md border rounded-xl p-6 shadow-xl text-white">

          <h2 className="text-2xl font-bold text-center mb-5">
            {t("welcome_login")}
          </h2>

          {blockTime > 0 && (
            <div className="w-full bg-gray-600 h-2 rounded mb-3">
              <div
                className="bg-red-500 h-2 rounded transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {toast && (
            <p
              className={`text-center mb-3 ${
                toastType === "error" ? "text-red-300" : "text-green-300"
              }`}
            >
              {toast}
            </p>
          )}

          <InstallPwaModal />

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <div className="relative">
              <input
                type="email"
                name="user_email"
                value={form.user_email}
                onChange={handleChange}
                placeholder=" "
                disabled={blockTime > 0}
                className="peer w-full p-3 bg-white/20 border rounded-lg"
              />
              <label className="absolute left-3 top-2 text-gray-300 text-sm">
                {t("email")}
              </label>
              <FaUserLock className="absolute right-3 top-3 text-gray-300" />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder=" "
                disabled={blockTime > 0}
                className="w-full p-3 bg-white/20 border rounded-lg"
              />

              <label className="absolute left-3 top-2 text-gray-300 text-sm">
                {t("password")}
              </label>

              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={blockTime > 0}
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold"
            >
              {t("login")}
            </button>
          </form>

          {/* LINKS */}
          <div className="mt-4 text-center text-sm space-y-2">

            <p onClick={() => setShowForgot(true)} className="cursor-pointer hover:underline">
              {t("forgot_password")}
            </p>

            <p onClick={() => setShowSignupInfo(true)} className="cursor-pointer hover:underline">
              {t("signup")}
            </p>

            <p className="text-gray-400 mt-5 text-xs">
              © {new Date().getFullYear()} Nexora-Code
            </p>
          </div>
        </div>
      </div>

      {/* MODALS unchanged */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl w-full max-w-sm relative">
            <h3 className="text-center font-bold mb-3">
              {t("forgot_password")}
            </h3>

            <form onSubmit={handleForgot} className="space-y-3">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border p-3 rounded"
                placeholder={t("enter_email")}
                required
              />

              <button className="w-full bg-green-500 text-white py-2 rounded">
                {t("send_reset")}
              </button>
            </form>

            <FaTimes
              onClick={() => setShowForgot(false)}
              className="absolute top-3 right-3 cursor-pointer text-red-500"
            />
          </div>
        </div>
      )}

      {showSignupInfo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <p>{t("contact_admin_signup")}</p>
            <button
              onClick={() => setShowSignupInfo(false)}
              className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}