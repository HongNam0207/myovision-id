import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getVisitDetailApi } from "../api/visits.api";
import {
  cancelVisitApi,
  completeVisitApi,
  finishDiagnosisApi,
  finishIntakeApi,
  finishMeasurementApi,
  startDiagnosisApi,
  startIntakeApi,
  startMeasurementApi,
} from "../api/workflow.api";

export default function VisitDetail() {
  const { visitId } = useParams();
  const [visit, setVisit] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadVisit();
  }, [visitId]);

  async function loadVisit() {
    try {
      const res = await getVisitDetailApi(visitId);
      const data = res.data ?? res;
      setVisit(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function runAction(action) {
    setMessage("");

    try {
      await action(visitId);
      setMessage("Workflow updated successfully");
      await loadVisit();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Workflow action failed");
    }
  }

  if (!visit) {
    return <div className="min-h-screen bg-slate-100 p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <Link to="/visits" className="text-blue-600">Back to visits</Link>
        <h1 className="mt-3 text-3xl font-bold">{visit.visitCode}</h1>
        <p className="text-slate-500">{visit.status}</p>

        {message && <p className="mt-4 rounded-xl bg-white p-3 shadow">{message}</p>}

        <div className="mt-4 flex flex-wrap gap-3">
          <Link to={`/visits/${visitId}/intake`} className="rounded-xl bg-green-600 px-4 py-3 text-white">Intake</Link>
          <Link to={`/visits/${visitId}/refraction`} className="rounded-xl bg-blue-600 px-4 py-3 text-white">Refraction</Link>
          <Link to={`/visits/${visitId}/biometric`} className="rounded-xl bg-purple-600 px-4 py-3 text-white">Biometric</Link>
          <Link to={`/visits/${visitId}/binocular-vision`} className="rounded-xl bg-cyan-600 px-4 py-3 text-white">Binocular</Link>
          <Link to={`/visits/${visitId}/risk`} className="rounded-xl bg-yellow-600 px-4 py-3 text-white">Risk</Link>
          <Link to={`/visits/${visitId}/diagnosis`} className="rounded-xl bg-slate-900 px-4 py-3 text-white">Diagnosis</Link>
          <Link to={`/visits/${visitId}/treatment-plan`} className="rounded-xl bg-orange-600 px-4 py-3 text-white">Treatment Plan</Link>
          <Link to={`/visits/${visitId}/reports`} className="rounded-xl bg-red-600 px-4 py-3 text-white">Reports</Link>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 text-lg font-semibold">Workflow Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => runAction(startIntakeApi)} className="rounded-lg bg-slate-700 px-4 py-2 text-white">Start Intake</button>
            <button onClick={() => runAction(finishIntakeApi)} className="rounded-lg bg-green-600 px-4 py-2 text-white">Finish Intake</button>
            <button onClick={() => runAction(startMeasurementApi)} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Start Measurement</button>
            <button onClick={() => runAction(finishMeasurementApi)} className="rounded-lg bg-purple-600 px-4 py-2 text-white">Finish Measurement</button>
            <button onClick={() => runAction(startDiagnosisApi)} className="rounded-lg bg-slate-900 px-4 py-2 text-white">Start Diagnosis</button>
            <button onClick={() => runAction(finishDiagnosisApi)} className="rounded-lg bg-orange-600 px-4 py-2 text-white">Finish Diagnosis</button>
            <button onClick={() => runAction(completeVisitApi)} className="rounded-lg bg-emerald-600 px-4 py-2 text-white">Complete</button>
            <button onClick={() => runAction(cancelVisitApi)} className="rounded-lg bg-red-600 px-4 py-2 text-white">Cancel</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 text-lg font-semibold">Visit Information</h2>
          <p><b>Visit Type:</b> {visit.visitType}</p>
          <p><b>Status:</b> {visit.status}</p>
          <p><b>Complaint:</b> {visit.chiefComplaint}</p>
          <p><b>Date:</b> {visit.visitDate}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 text-lg font-semibold">Patient</h2>
          <p><b>Name:</b> {visit.patient?.fullName || visit.patientName}</p>
          <p><b>Gender:</b> {visit.patient?.gender}</p>
          <p><b>Date of birth:</b> {visit.patient?.dateOfBirth}</p>
        </div>
      </div>
    </div>
  );
}
