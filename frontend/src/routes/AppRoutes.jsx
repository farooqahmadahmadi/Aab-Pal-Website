import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import UsersPage from "../pages/UsersPage";


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/users" element={<UsersPage />} />
            </Routes>
        </BrowserRouter>
    );
}