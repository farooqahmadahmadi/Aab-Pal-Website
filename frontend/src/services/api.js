import axios from "axios";

// 🔥 AUTO BASE URL (NO IP CHANGE NEEDED)
const getBaseURL = () => {
    const hostname = window.location.hostname;

    // localhost or PC
    if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "http://localhost:5000/api";
    }

    // mobile / LAN (same WiFi)
    return `http://${hostname}:5000/api`;
};

const API = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
});

// 🔐 TOKEN
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;