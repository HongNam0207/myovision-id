import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createDiagnosisApi, getDiagnosisApi, updateDiagnosisApi } from "../api/diagnosis.api";

export default function Diagnosis() {
  const { visitId } = useParams();
  const [diagnosisId, setDiagnosisId] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    diagnosisCode: "",
    diagnosisName: "",
    clinicalConclusion: "",
    myopiaType: "",
    severityLevel: "",
    progressionStatus: "",
  });

  useEffect(() => {
    loadDiagnosis();
  }, [visitId]);

  async function loadDiagnosis() {
    try {
      const res = await getDiagnosisApi(visitId);
      const data = res.data ?? res;

      if (data) {
        setDiagnosisId(data.diagnosisId || data.id || null);
        setForm((prev) => ({ ...prev, ...data }));
      }
    } catch {
      // No diagnosis yet
    }
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      if (diagnosisId) {
        await updateDiagnosisApi(diagnosisId, form);
      } else {
        await createDiagnosisApi(visitId, form);
      }

      setMessage("Saved successfully");
      await loadDiagnosis();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Save failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <Link to={`/visits/${visitId}`} className="text-blue-600">
          Back to visit
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Diagnosis</h1>
        <p className="text-slate-500">Visit ID: {visitId}</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Diagnosis code" value={form.diagnosisCode} onChange={(v) => updateField("diagnosisCode", v)} />
          <Input label="Diagnosis name" value={form.diagnosisName} onChange={(v) => updateField("diagnosisName", v)} />
          <Input label="Myopia type" value={form.myopiaType} onChange={(v) => updateField("myopiaType", v)} />
          <Input label="Severity level" value={form.severityLevel} onChange={(v) => updateField("severityLevel", v)} />
          <Input label="Progression status" value={form.progressionStatus} onChange={(v) => updateField("progressionStatus", v)} />
        </div>

        <div className="mt-4">
          <Textarea
            label="Clinical conclusion"
            value={form.clinicalConclusion}
            onChange={(v) => updateField("clinicalConclusion", v)}
          />
        </div>

        {message && <p className="mt-5 rounded-xl bg-slate-100 p-3">{message}</p>}

        <button className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">
          Save Diagnosis
        </button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 min-h-40 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      />
    </label>
  );
}
