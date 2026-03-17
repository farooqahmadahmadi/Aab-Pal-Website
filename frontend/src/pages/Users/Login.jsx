import { useState } from "react";
import API from "../../services/api";

export default function Login() {
    const [form, setForm] = useState({
        user_email: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/users/login", form);
            localStorage.setItem("token", res.data.token);
            setMessage("✅ Login successful: " + res.data.user.user_name);
        } catch (err) {
            setMessage("❌ " + err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Login to System</h2>
            {message && <p className="mb-4">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    name="user_email"
                    placeholder="Email"
                    value={form.user_email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
                    Login
                </button>
            </form>
        </div>
    );
}
