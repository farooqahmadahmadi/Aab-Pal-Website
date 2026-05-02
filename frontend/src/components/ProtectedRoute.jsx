import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles, children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" replace />;

  const role = (user.user_role || "").toLowerCase();

  const allowed = allowedRoles.map(r => r.toLowerCase());

  if (!allowed.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}