import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../auth/Login";
import ProtectedRoute from "../auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

import AdminDashboard from "../pages/dashboard/AdminDashboard";
import DoctorDashboard from "../pages/dashboard/DoctorDashboard";
import NurseDashboard from "../pages/dashboard/NurseDashboard";
import OptometristDashboard from "../pages/dashboard/OptometristDashboard";
import ParentDashboard from "../pages/dashboard/ParentDashboard";

import PatientList from "../pages/patients/PatientList";
import PatientDetail from "../pages/patients/PatientDetail";

import VisitQueue from "../pages/visits/VisitQueue";
import VisitDetail from "../pages/visits/VisitDetail";

import ClinicalIntake from "../pages/clinical-intake/ClinicalIntake";
import Refraction from "../pages/measurements/Refraction";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/nurse/dashboard" element={<NurseDashboard />} />
            <Route path="/optometrist/dashboard" element={<OptometristDashboard />} />
            <Route path="/parent/dashboard" element={<ParentDashboard />} />

            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/:patientId" element={<PatientDetail />} />

            <Route path="/visits" element={<VisitQueue />} />
            <Route path="/visits/:visitId" element={<VisitDetail />} />
            <Route path="/doctor/visits" element={<VisitQueue />} />
            <Route path="/optometrist/queue" element={<VisitQueue />} />

            <Route path="/visits/:visitId/intake" element={<ClinicalIntake />} />
            <Route path="/visits/:visitId/refraction" element={<Refraction />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
