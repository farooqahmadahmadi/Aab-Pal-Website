import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import loginBg from "../../assets/images/login-bg.jpg";

import { FaTimes, FaEye, FaEyeSlash, FaUserLock } from "react-icons/fa";

export default function Login() {
    const [form, setForm] = useState({ user_email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [blockTime, setBlockTime] = useState(0);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [toast, setToast] = useState("");
    const [toastType, setToastType] = useState("success");

    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMessage, setForgotMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
            setToast("Login successful!");

            switch (user.user_role) {
                case "Admin": navigate("/admin/dashboard"); break;
                case "HR": navigate("/hr/dashboard"); break;
                case "Financial": navigate("/financial/dashboard"); break;
                case "PM": navigate("/pm/dashboard"); break;
                case "Employee": navigate("/employee/dashboard"); break;
                case "Client": navigate("/client/dashboard"); break;
                default: navigate("/login");
            }
        } catch (err) {
            const attempts = (err.response?.data?.failed_attempts || failedAttempts) + 1;
            setFailedAttempts(attempts);

            if (attempts === 3) setBlockTime(30);
            else if (attempts === 5) setBlockTime(60);
            else if (attempts >= 6) {
                setToastType("error");
                setToast("User is inactive. Contact admin.");
                return;
            }

            setToastType("error");
            setToast(err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        if (blockTime <= 0) {
            setToast("");
            return;
        }
        const timer = setInterval(() => setBlockTime(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [blockTime]);

    const progress = blockTime > 0 ? (blockTime / (failedAttempts >= 5 ? 60 : 30)) * 100 : 0;
    const progressColor = blockTime <= 8 ? "bg-green-400" : blockTime <= 20 ? "bg-yellow-400" : "bg-red-500";

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/users/forgot-password", { user_email: forgotEmail });
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
        <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-cover bg-center animate-bgGradient"
            style={{    backgroundImage: `url(${loginBg})`, backgroundSize: "200% 100%", backgroundBlendMode: "overlay"}}
        >
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn rounded-2xl">
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4"></div>


            <div className="bg-white/10 backdrop-blur-md border border-gray-400 rounded-xl shadow-2xl p-8 w-full max-w-md animate-scaleIn transition-transform transform  hover:scale-105 duration-500 ">
                <h2 className="text-2xl font-bold mb-8 text-center text-white animate-fadeIn">
                    Welcome! Let's Login
                </h2>

                {blockTime > 0 && (
                    <div className="w-full bg-gray-500 rounded-full h-2 mb-4 overflow-hidden">
                        <div
                            className={`h-2 rounded-full transition-all duration-1000 ease-linear ${progressColor}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

                {toast && (
                    <p className={`mb-2 text-center font-semibold ${toastType === "error" ? "text-yellow-400" : "text-green-400"}`}>
                        {toast}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Email */}
                    <div className="relative">
                        <input
                            type="email"
                            name="user_email"
                            value={form.user_email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="peer w-full p-3 border rounded-lg bg-white/20 placeholder-transparent focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white"
                            required
                            disabled={blockTime > 0}
                        />
                        <label className="absolute left-3 top-1 text-gray-300 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-200">
                            Email
                        </label>
                        <div className="absolute right-3 top-4 text-gray-400">
                            <FaUserLock />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="peer w-full p-3 border rounded-lg bg-white/20 placeholder-transparent focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white"
                            required
                            disabled={blockTime > 0}
                        />
                        <label className="absolute left-3 top-1 text-gray-300 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-200">
                            Password
                        </label>
                        <div
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-4 cursor-pointer text-gray-400"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>


                    <button
                        type="submit"
                        className={`w-full bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl font-semibold shadow-lg transform transition-all duration-300
    hover:scale-105 
    hover:from-blue-500 hover:to-green-500 
    hover:shadow-2xl hover:shadow-blue-500/50
    hover:brightness-110
  `}
                        disabled={blockTime > 0}
                    >
                        Login
                    </button>
                </form>

                <p
                    className="mt-4 text-center text-white cursor-pointer hover:underline"
                    onClick={() => setShowForgot(true)}
                >
                    Forgot Password?
                </p>

                {showForgot && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn rounded-2xl">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative animate-scaleIn">
                            <h3 className="text-xl font-bold mb-4 text-center">Forgot Password</h3>
                            {forgotMessage && <p className="mb-4 text-center text-green-500">{forgotMessage}</p>}
                            
                            <form onSubmit={handleForgotSubmit} className="space-y-6">
                                <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="peer w-full p-3.5 border rounded-lg bg-white/20 placeholder-transparent focus:ring-2 focus:ring-green-400 focus:border-green-400 "
                                    required
                                />
                                <label className="absolute left-3 top-1 text-gray-300 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-600 peer-focus:t-0">
                            Email
                        </label>
                        <div className="absolute right-3 top-4 text-gray-400">
                            <FaUserLock />
                        </div>
                        </div>
                                <button
                                    type="submit"
                                    className={`w-full bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl font-semibold shadow-lg transform transition-all duration-300
    hover:scale-105 
    hover:from-blue-600 hover:to-green-500 
    hover:shadow-2xl hover:shadow-blue-500/50
    hover:brightness-110
  `}
                                >
                                    Send Reset Link
                                </button>
                            </form>
                            <div
                                className="absolute top-3 right-3 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full cursor-pointer"
                                onClick={() => { setShowForgot(false); setForgotMessage(""); }}
                            >
                                <FaTimes />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>  
    );
}