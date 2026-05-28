import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPatientDetailApi } from "../api/patients.api";

export default function PatientDetail() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  async function loadPatient() {
    try {
      const res = await getPatientDetailApi(patientId);
      const data = res.data ?? res;
      setPatient(data);
    } catch (error) {
      console.error(error);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-100 p-6">Loading...</div>;
  }

  if (!patient) {
    return <div className="min-h-screen bg-slate-100 p-6">Patient not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <Link to="/patients" className="text-blue-600">
          Back to patients
        </Link>
        <h1 className="mt-3 text-3xl font-bold">{patient.fullName}</h1>
        <p className="text-slate-500">Patient code: {patient.patientCode}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 text-lg font-semibold">Basic information</h2>
          <p><b>Full name:</b> {patient.fullName}</p>
          <p><b>Gender:</b> {patient.gender}</p>
          <p><b>Date of birth:</b> {patient.dateOfBirth}</p>
          <p><b>Address:</b> {patient.address}</p>
          <p><b>School:</b> {patient.schoolName}</p>
          <p><b>Grade:</b> {patient.grade}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 text-lg font-semibold">Record status</h2>
          <p><b>Status:</b> {patient.status}</p>
          <p><b>Clinic ID:</b> {patient.clinicId}</p>
          <p><b>Created At:</b> {patient.createdAt}</p>
          <p><b>Updated At:</b> {patient.updatedAt}</p>
        </div>
      </div>
    </div>
  );
}
