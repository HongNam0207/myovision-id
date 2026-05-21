import { Navigate, useLocation } from "react-router-dom";

const roleAccess = {
  admin: [
    "/admin-dashboard",
    "/users",
    "/patients",
    "/patient-detail",
    "/clinical-exam",
    "/risk-assessment",
    "/treatment",
    "/analytics",
    "/follow-up",
    "/reports",
  ],
  doctor: [
    "/doctor-dashboard",
    "/patients",
    "/patient-detail",
    "/clinical-exam",
    "/risk-assessment",
    "/treatment",
    "/analytics",
    "/follow-up",
    "/reports",
  ],
  reception: ["/patients", "/patient-detail"],
  technician: ["/clinical-exam", "/follow-up"],
};

export default function RequireAuth({ children }) {
  const location = useLocation();
  const authenticated = localStorage.getItem("user_authenticated") === "true";
  const user = JSON.parse(localStorage.getItem("myovision_user") || "null");

  if (!authenticated || !user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  const allowedPaths = roleAccess[user.role] || [];
  const isAllowed = allowedPaths.some((path) => location.pathname.startsWith(path));

  if (!isAllowed) {
    return <Navigate to={user.dashboard || "/"} replace />;
  }

  return children;
}
