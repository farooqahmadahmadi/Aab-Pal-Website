import { useState, useEffect } from "react";

import InstallPwaModal from "../../../components/PWA/InstallPwaModal";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../../../services/api";
import loginBg from "../../assets/images/login-bg.jpg";

import { FaTimes, FaEye, FaEyeSlash, FaUserLock } from "react-icons/fa";

export default function Login() {
  const { t } = useTranslation();

  const [form, setForm] = useState({ user_email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [blockTime, setBlockTime] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const [showSignupInfo, setShowSignupInfo] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ===== LOGIN =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (blockTime > 0) return;

    try {
      const res = await API.post("/users/login", form);
      const user = res.data.user;
      if (!user) return;

      setFailedAttempts(user.failed_attempts || 0);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      setToastType("success");
      setToast(t("login_success"));

      switch (user.user_role) {
        case "Admin":
          navigate("/admin/dashboard");
          break;
        case "HR":
          navigate("/hr/dashboard");
          break;
        case "Financial":
          navigate("/financial/dashboard");
          break;
        case "PM":
          navigate("/pm/dashboard");
          break;
        case "Employee":
          navigate("/employee/dashboard");
          break;
        case "Client":
          navigate("/client/dashboard");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      const attempts =
        (err.response?.data?.failed_attempts || failedAttempts) + 1;
      setFailedAttempts(attempts);

      if (attempts === 3) setBlockTime(30);
      else if (attempts === 5) setBlockTime(60);
      else if (attempts >= 6) {
        setToastType("error");
        setToast(t("user_inactive"));
        return;
      }

      setToastType("error");
      setToast(err.response?.data?.message || err.message);
    }
  };

  // ===== BLOCK TIMER =====
  useEffect(() => {
    if (blockTime <= 0) {
      setToast("");
      return;
    }
    const timer = setInterval(() => setBlockTime((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [blockTime]);

  const progress =
    blockTime > 0 ? (blockTime / (failedAttempts >= 5 ? 60 : 30)) * 100 : 0;

  const progressColor =
    blockTime <= 8
      ? "bg-green-400"
      : blockTime <= 20
        ? "bg-yellow-400"
        : "bg-red-500";

  // ===== FORGOT =====
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/forgot-password", {
        user_email: forgotEmail,
      });

      setForgotMessage(res.data.message);
      setToastType("success");
      setToast(res.data.message);
    } catch (err) {
      setForgotMessage(err.response?.data?.message || err.message);
      setToastType("error");
      setToast(err.response?.data?.message || err.message);
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center p-4 bg-cover bg-center animate-bgGradient"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "108% 100%",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-black/50 w-dvw min-h-screen"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md border border-gray-400 rounded-xl shadow-2xl p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-6">
            {t("welcome_login")}
          </h2>

          {/* BLOCK BAR */}
          {blockTime > 0 && (
            <div className="w-full bg-gray-500 rounded-full h-2 mb-4">
              <div
                className={`${progressColor} h-2 rounded-full transition-all`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* TOAST */}
          {toast && (
            <p
              className={`text-center mb-3 ${toastType === "error" ? "text-yellow-300" : "text-green-300"}`}
            >
              {toast}
            </p>
          )}

          <InstallPwaModal />

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div className="relative group">
              <input
                type="email"
                name="user_email"
                value={form.user_email}
                onChange={handleChange}
                required
                disabled={blockTime > 0}
                placeholder=" "
                className="peer w-full h-12 px-3 pt-4 pb-1 border border-gray-300 rounded-lg bg-white/20 text-white
    focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
              />

              <label
                className="
    absolute left-3 top-1/2 -translate-y-1/2
    text-gray-300 text-sm
    pointer-events-none
    transition-all duration-200

    peer-focus:top-2
    peer-focus:text-xs
    peer-focus:text-green-300

    peer-[&:not(:placeholder-shown)]:top-2
    peer-[&:not(:placeholder-shown)]:text-xs
    "
              >
                {t("email")}
              </label>

              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaUserLock />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={blockTime > 0}
                placeholder=" "
                className="peer w-full h-12 px-3 pt-4 pb-1 border border-gray-300 rounded-lg bg-white/20 text-white
    focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
              />

              <label
                className="
    absolute left-3 top-1/2 -translate-y-1/2
    text-gray-300 text-sm
    pointer-events-none
    transition-all duration-200

    peer-focus:top-2
    peer-focus:text-xs
    peer-focus:text-green-300

    peer-[&:not(:placeholder-shown)]:top-2
    peer-[&:not(:placeholder-shown)]:text-xs
    "
              >
                {t("password")}
              </label>

              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={blockTime > 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {t("login")}
            </button>
          </form>

          {/* LINKS */}
          <div className="mt-4 text-center space-y-2 text-sm text-white">
            <p
              className="cursor-pointer hover:underline"
              onClick={() => setShowForgot(true)}
            >
              {t("forgot_password")}
            </p>

            <p
              className="cursor-pointer hover:underline"
              onClick={() => setShowSignupInfo(true)}
            >
              {t("signup")}
            </p>

            <p className="text-center text-sm text-gray-400 mt-6">
              © {new Date().getFullYear()}
              {" - "}
              <a
                href="https://www.facebook.com/nexora.code.your.gate.way.to.digital.excellence"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-500 hover:text-blue-500 transition animate-pulse"
              >
                Nexora-Code
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* SIGNUP INFO */}
      {showSignupInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
            <p>{t("contact_admin_signup")}</p>
            <button
              onClick={() => setShowSignupInfo(false)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 animate-bounce"
            >
              {t("singup_ok")}
            </button>
          </div>
        </div>
      )}

      {/* FORGOT MODAL (unchanged logic) */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm relative">
            <h3 className="text-lg font-bold mb-4 text-center">
              {t("forgot_password")}
            </h3>

            {forgotMessage && (
              <p className="text-green-500 text-center mb-3">{forgotMessage}</p>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder={t("enter_email")}
                className="w-full p-3 border rounded-lg"
                required
              />

              <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600">
                {t("send_reset")}
              </button>
            </form>

            <div
              className="absolute top-3 right-3 cursor-pointer text-red-500"
              onClick={() => {
                setShowForgot(false);
                setForgotMessage("");
              }}
            >
              <FaTimes />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
