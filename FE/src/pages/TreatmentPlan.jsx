import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createTreatmentPlanApi } from "../api/treatment.api";

export default function TreatmentPlan() {
  const { visitId } = useParams();
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    planName: "",
    treatmentGoal: "",
    startDate: "",
    endDate: "",
    complianceTarget: "",
    followUpIntervalDays: "",
    doctorInstruction: "",
  });

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const payload = {
      ...form,
      followUpIntervalDays: Number(form.followUpIntervalDays) || null,
      status: "ACTIVE",
    };

    try {
      await createTreatmentPlanApi(visitId, payload);
      setMessage("Saved successfully");
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
        <h1 className="mt-3 text-3xl font-bold">Treatment Plan</h1>
        <p className="text-slate-500">Visit ID: {visitId}</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Plan name" value={form.planName} onChange={(v) => updateField("planName", v)} />
          <Input label="Treatment goal" value={form.treatmentGoal} onChange={(v) => updateField("treatmentGoal", v)} />
          <Input label="Start date" type="date" value={form.startDate} onChange={(v) => updateField("startDate", v)} />
          <Input label="End date" type="date" value={form.endDate} onChange={(v) => updateField("endDate", v)} />
          <Input label="Compliance target" value={form.complianceTarget} onChange={(v) => updateField("complianceTarget", v)} />
          <Input label="Follow-up interval days" value={form.followUpIntervalDays} onChange={(v) => updateField("followUpIntervalDays", v)} />
        </div>

        <div className="mt-4">
          <Textarea
            label="Doctor instruction"
            value={form.doctorInstruction}
            onChange={(v) => updateField("doctorInstruction", v)}
          />
        </div>

        {message && <p className="mt-5 rounded-xl bg-slate-100 p-3">{message}</p>}

        <button className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">
          Save Treatment Plan
        </button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
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
