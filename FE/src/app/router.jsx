import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Unauthorized from "../pages/Unauthorized";
import AppLayout from "../layouts/AppLayout";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import PatientList from "../pages/PatientList";
import PatientDetail from "../pages/PatientDetail";
import VisitQueue from "../pages/VisitQueue";
import VisitDetail from "../pages/VisitDetail";
import ClinicalIntake from "../pages/ClinicalIntake";
import Refraction from "../pages/Refraction";
import Biometric from "../pages/Biometric";
import BinocularVision from "../pages/BinocularVision";
import RiskAssessment from "../pages/RiskAssessment";
import Diagnosis from "../pages/Diagnosis";
import TreatmentPlan from "../pages/TreatmentPlan";
import ParentChildren from "../pages/ParentChildren";
import AppointmentList from "../pages/AppointmentList";
import NotificationCenter from "../pages/NotificationCenter";
import MedicalReport from "../pages/MedicalReport";
import UserManagementPage from "../pages/admin/UserManagementPage";
import RoleManagementPage from "../pages/admin/RoleManagementPage";
import ClinicManagementPage from "../pages/admin/ClinicManagementPage";
import ProtectedRoute from "../auth/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <AdminDashboard /> },
          { path: "/patients", element: <PatientList /> },
          { path: "/patients/:patientId", element: <PatientDetail /> },
          { path: "/visits", element: <VisitQueue /> },
          { path: "/visits/:visitId", element: <VisitDetail /> },
          { path: "/visits/:visitId/intake", element: <ClinicalIntake /> },
          { path: "/visits/:visitId/refraction", element: <Refraction /> },
          { path: "/visits/:visitId/biometric", element: <Biometric /> },
          { path: "/visits/:visitId/binocular-vision", element: <BinocularVision /> },
          { path: "/visits/:visitId/risk", element: <RiskAssessment /> },
          { path: "/visits/:visitId/diagnosis", element: <Diagnosis /> },
          { path: "/visits/:visitId/treatment", element: <TreatmentPlan /> },
          { path: "/visits/:visitId/reports", element: <MedicalReport /> },
          { path: "/parent-portal", element: <ParentChildren /> },
          { path: "/appointments", element: <AppointmentList /> },
          { path: "/notifications", element: <NotificationCenter /> },
          { path: "/admin/users", element: <UserManagementPage /> },
          { path: "/admin/roles", element: <RoleManagementPage /> },
          { path: "/admin/clinics", element: <ClinicManagementPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
