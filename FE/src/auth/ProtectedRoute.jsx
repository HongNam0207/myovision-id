import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("access_token");
  const userRaw = localStorage.getItem("user");

  if (!token) return <Navigate to="/login" replace />;

  const user = userRaw ? JSON.parse(userRaw) : null;
  const role =
    user?.role ||
    user?.roleCode ||
    user?.roles?.[0]?.roleCode ||
    user?.roles?.[0];

  if (roles?.length && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}
