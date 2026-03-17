import { useState } from "react";
import API from "../../services/api";

export default function Register() {
    const [form, setForm] = useState({
        user_name: "",
        user_email: "",
        password: "",
        user_role: "Employee",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/users/register", form);
            setMessage("✅ Registration successful: " + res.data.user_name);
        } catch (err) {
            setMessage("❌ " + err.response?.data?.message || err.message);
        }
    };

    return (

        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Register New User</h2>
            {message && <p className="mb-4">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="user_name"
                    placeholder="Name"
                    value={form.user_name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
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
                <select
                    name="user_role"
                    value={form.user_role}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="Admin">Admin</option>
                    <option value="HR">HR</option>
                    <option value="Financial">Financial</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Employee">Employee</option>
                    <option value="Client">Client</option>
                </select>
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                    Register
                </button>
            </form>
        </div>
    );
}
