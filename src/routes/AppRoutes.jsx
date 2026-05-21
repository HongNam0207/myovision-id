import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Analytics from "../pages/Analytics";
import ClinicalExam from "../pages/ClinicalExam";
import DashboardAdmin from "../pages/DashboardAdmin";
import DashboardDoctor from "../pages/DashboardDoctor";
import FollowUp from "../pages/FollowUp";
import Login from "../pages/Login";
import PatientDetail from "../pages/PatientDetail";
import Patients from "../pages/Patients";
import Reports from "../pages/Reports";
import RiskAssessment from "../pages/RiskAssessment";
import Treatment from "../pages/Treatment";
import Users from "../pages/Users";

const permissions = {
  "/admin-dashboard": ["admin"],
  "/doctor-dashboard": ["doctor"],
  "/patients": ["admin", "doctor", "reception"],
  "/patient-detail": ["admin", "doctor", "reception"],
  "/clinical-exam": ["admin", "doctor", "technician"],
  "/risk-assessment": ["admin", "doctor"],
  "/treatment": ["admin", "doctor"],
  "/follow-up": ["admin", "doctor", "technician"],
  "/analytics": ["admin", "doctor"],
  "/reports": ["admin", "doctor"],
  "/users": ["admin"],
};

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("myovision_user") || "null");
  } catch {
    return null;
  }
}

function ProtectedRoute({ path, children }) {
  const authenticated = localStorage.getItem("user_authenticated") === "true";
  const user = getUser();

  if (!authenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const allowedRoles = permissions[path] || [];

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.dashboard || "/"} replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        <Route path="/admin-dashboard" element={<ProtectedRoute path="/admin-dashboard"><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/doctor-dashboard" element={<ProtectedRoute path="/doctor-dashboard"><DashboardDoctor /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute path="/patients"><Patients /></ProtectedRoute>} />
        <Route path="/patient-detail" element={<ProtectedRoute path="/patient-detail"><PatientDetail /></ProtectedRoute>} />
        <Route path="/clinical-exam" element={<ProtectedRoute path="/clinical-exam"><ClinicalExam /></ProtectedRoute>} />
        <Route path="/risk-assessment" element={<ProtectedRoute path="/risk-assessment"><RiskAssessment /></ProtectedRoute>} />
        <Route path="/treatment" element={<ProtectedRoute path="/treatment"><Treatment /></ProtectedRoute>} />
        <Route path="/follow-up" element={<ProtectedRoute path="/follow-up"><FollowUp /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute path="/analytics"><Analytics /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute path="/reports"><Reports /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute path="/users"><Users /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
