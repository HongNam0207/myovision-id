import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./auth/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import NurseDashboard from "./pages/NurseDashboard";
import OptometristDashboard from "./pages/OptometristDashboard";
import ParentDashboard from "./pages/ParentDashboard";

import PatientList from "./pages/PatientList";
import PatientDetail from "./pages/PatientDetail";
import VisitQueue from "./pages/VisitQueue";
import VisitDetail from "./pages/VisitDetail";
import ClinicalIntake from "./pages/ClinicalIntake";
import Refraction from "./pages/Refraction";
import Biometric from "./pages/Biometric";
import BinocularVision from "./pages/BinocularVision";
import RiskAssessment from "./pages/RiskAssessment";
import Diagnosis from "./pages/Diagnosis";
import TreatmentPlan from "./pages/TreatmentPlan";
import AppointmentList from "./pages/AppointmentList";
import ParentChildren from "./pages/ParentChildren";
import NotificationCenter from "./pages/NotificationCenter";
import MedicalReport from "./pages/MedicalReport";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/doctor" element={<ProtectedRoute roles={["OPHTHALMOLOGIST"]}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/nurse" element={<ProtectedRoute roles={["NURSE"]}><NurseDashboard /></ProtectedRoute>} />
      <Route path="/optometrist" element={<ProtectedRoute roles={["OPTOMETRIST"]}><OptometristDashboard /></ProtectedRoute>} />
      <Route path="/parent" element={<ProtectedRoute roles={["PARENT"]}><ParentDashboard /></ProtectedRoute>} />

      <Route path="/patients" element={<ProtectedRoute roles={["ADMIN", "NURSE", "OPHTHALMOLOGIST", "OPTOMETRIST"]}><PatientList /></ProtectedRoute>} />
      <Route path="/patients/:patientId" element={<ProtectedRoute roles={["ADMIN", "NURSE", "OPHTHALMOLOGIST", "OPTOMETRIST"]}><PatientDetail /></ProtectedRoute>} />

      <Route path="/visits" element={<ProtectedRoute roles={["ADMIN", "NURSE", "OPHTHALMOLOGIST", "OPTOMETRIST"]}><VisitQueue /></ProtectedRoute>} />
      <Route path="/visits/:visitId" element={<ProtectedRoute roles={["ADMIN", "NURSE", "OPHTHALMOLOGIST", "OPTOMETRIST"]}><VisitDetail /></ProtectedRoute>} />
      <Route path="/visits/:visitId/intake" element={<ProtectedRoute roles={["ADMIN", "NURSE", "OPHTHALMOLOGIST"]}><ClinicalIntake /></ProtectedRoute>} />
      <Route path="/visits/:visitId/refraction" element={<ProtectedRoute roles={["OPTOMETRIST", "OPHTHALMOLOGIST"]}><Refraction /></ProtectedRoute>} />
      <Route path="/visits/:visitId/biometric" element={<ProtectedRoute roles={["OPTOMETRIST", "OPHTHALMOLOGIST"]}><Biometric /></ProtectedRoute>} />
      <Route path="/visits/:visitId/binocular-vision" element={<ProtectedRoute roles={["OPTOMETRIST", "OPHTHALMOLOGIST"]}><BinocularVision /></ProtectedRoute>} />
      <Route path="/visits/:visitId/risk" element={<ProtectedRoute roles={["OPHTHALMOLOGIST"]}><RiskAssessment /></ProtectedRoute>} />
      <Route path="/visits/:visitId/diagnosis" element={<ProtectedRoute roles={["OPHTHALMOLOGIST"]}><Diagnosis /></ProtectedRoute>} />
      <Route path="/visits/:visitId/treatment-plan" element={<ProtectedRoute roles={["OPHTHALMOLOGIST"]}><TreatmentPlan /></ProtectedRoute>} />
      <Route path="/visits/:visitId/reports" element={<ProtectedRoute roles={["ADMIN", "OPHTHALMOLOGIST", "PARENT"]}><MedicalReport /></ProtectedRoute>} />

      <Route path="/appointments" element={<ProtectedRoute roles={["ADMIN", "NURSE", "OPHTHALMOLOGIST", "PARENT"]}><AppointmentList /></ProtectedRoute>} />
      <Route path="/parent/children" element={<ProtectedRoute roles={["PARENT"]}><ParentChildren /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute roles={["ADMIN", "PARENT"]}><NotificationCenter /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
