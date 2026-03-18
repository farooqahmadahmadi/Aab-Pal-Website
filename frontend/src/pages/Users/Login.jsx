import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function Login() {
    const [form, setForm] = useState({ user_email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/users/login", form);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // Role-based redirect
            switch (res.data.user.user_role) {
                case "Admin": navigate("/dashboard"); break;
                case "HR": navigate("/dashboard"); break;
                case "Financial": navigate("/reports/financial"); break;
                case "Pm": navigate("/projects"); break;
                case "Employee": navigate("/tasks"); break;
                case "Client": navigate("/dashboard"); break;
                default: navigate("/login");
            }
        } catch (err) {
            setMessage(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {message && <p className="mb-4 text-red-500">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="email" name="user_email" placeholder="Email" value={form.user_email} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" required />
                <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">Login</button>
            </form>
        </div>
    );
}
