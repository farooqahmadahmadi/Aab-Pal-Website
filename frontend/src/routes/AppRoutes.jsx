import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UsersPage from "../pages/UsersPage";
import Login from "../pages/Users/Login";



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