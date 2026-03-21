import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles, children }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user.user_role)) return <Navigate to="/login" />;

    return children;
}