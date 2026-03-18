import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Users/Login";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}