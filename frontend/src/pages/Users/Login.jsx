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
                case "Pm": navigate("/pm/dashboard"); break;
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
            setToast(""); // clear message when block time ends
            return;
        }
        const timer = setInterval(() => {
            setBlockTime(prev => prev - 1);
        }, 1000);
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
        <div
            className=" min-h-screen flex items-center justify-center w-svw p-4 bg-cover"
            style={{ backgroundImage: `url(${loginBg})` }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-40 "></div>

            <div className="bg-white bg-opacity-10 border border-gray-500 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md relative">
                <h2 className="text-2xl font-bold mb-8 text-center text-white">Welcome! Let's Login</h2>

                {blockTime > 0 && (
                    <div className="w-full bg-gray-500  rounded-full h-2 mb-4 overflow-hidden">
                        <div
                            className={`h-2 rounded-full transition-all duration-1000 ease-linear ${progressColor}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

                {toast && (
                    <p className={`mb-2 text-center font-semibold ${toastType === "error" ? "text-yellow-400" : "text-green-600"}`}>
                        {toast}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="email"
                            name="user_email"
                            placeholder="Email"
                            value={form.user_email}
                            onChange={handleChange}
                            className=" w-full p-3 border opacity-70 rounded-lg focus:ring-2 focus:ring-green-400"
                            required
                            disabled={blockTime > 0}
                        />

                        <div className="absolute top-1 right-1 p-3  text-gray-600">
                            <FaUserLock />
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-3 border opacity-70 rounded-lg focus:ring-2 focus:ring-green-400"
                            required
                            disabled={blockTime > 0}
                        />
                        <div onClick={() => setShowPassword(!showPassword)} className="absolute top-1 right-1 p-3 cursor-pointer text-gray-600">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>


                    <button
                        type="submit"
                        className={`w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition ${blockTime > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={blockTime > 0}
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-white   cursor-pointer hover:underline" onClick={() => setShowForgot(true)}>
                    Forgot Password?
                </p>


                {showForgot && (
                    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative animate-fadeIn">
                            <h3 className="text-xl font-bold mb-4 text-center">Forgot Password</h3>
                            {forgotMessage && <p className="mb-4 text-center text-green-500">{forgotMessage}</p>}
                            <form onSubmit={handleForgotSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Send Reset Link
                                </button>
                            </form>
                            <div
                                className="absolute top-3 right-3 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full"
                                onClick={() => { setShowForgot(false); setForgotMessage(""); }}
                            >
                                <FaTimes />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}