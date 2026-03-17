import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async () => {
        try {

            const res = await loginUser({
                user_email: form.email,
                password: form.password
            });

            const { token, user } = res.data;

            // save token
            localStorage.setItem("token", token);
            localStorage.setItem("role", user.user_role);

            navigate("/dashboard");

        } catch (error) {
            alert("Login Failed");
        }
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-100">

            <div className="bg-white p-8 rounded-lg shadow-md w-96 h-80">

                <h2 className="text-2xl font-bold mb-8 text-center">
                    MIS Login
                </h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-4 rounded-lg"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-4 rounded-lg"
                    onChange={handleChange}
                />

                <a href="#" className="flex justify-end text-sm">Forget Password</a>

                <button
                    onClick={handleLogin}
                    className="w-full mt-7 bg-blue-600 text-white p-2 rounded"
                >
                    Login
                </button>

            </div>

        </div>
    );
}