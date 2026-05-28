import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createClinicalIntakeApi, getClinicalIntakeApi } from "../api/intake.api";

export default function ClinicalIntake() {
  const { visitId } = useParams();

  const [form, setForm] = useState({
    heightCm: "",
    weightKg: "",
    bloodPressure: "",
    reasonForVisit: "",
    ageMyopiaDetected: "",
    currentGlassesPower: "",
    previousTreatment: "",
    fatherHasMyopia: false,
    motherHasMyopia: false,
    siblingHasMyopia: false,
    familyHistoryNote: "",
    nearWorkHoursPerDay: "",
    outdoorHoursPerDay: "",
    screenTimeHoursPerDay: "",
    readingDistanceCm: "",
    allergyHistory: "",
    systemicDiseaseHistory: "",
    eyeDiseaseHistory: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadIntake();
  }, [visitId]);

  async function loadIntake() {
    try {
      const res = await getClinicalIntakeApi(visitId);
      const data = res.data ?? res;
      if (data) setForm((prev) => ({ ...prev, ...data }));
    } catch {
      // No intake yet
    }
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const payload = {
      ...form,
      heightCm: Number(form.heightCm) || null,
      weightKg: Number(form.weightKg) || null,
      ageMyopiaDetected: Number(form.ageMyopiaDetected) || null,
      nearWorkHoursPerDay: Number(form.nearWorkHoursPerDay) || null,
      outdoorHoursPerDay: Number(form.outdoorHoursPerDay) || null,
      screenTimeHoursPerDay: Number(form.screenTimeHoursPerDay) || null,
      readingDistanceCm: Number(form.readingDistanceCm) || null,
    };

    try {
      await createClinicalIntakeApi(visitId, payload);
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
        <h1 className="mt-3 text-3xl font-bold">Clinical Intake</h1>
        <p className="text-slate-500">Visit ID: {visitId}</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Height cm" value={form.heightCm} onChange={(v) => updateField("heightCm", v)} />
          <Input label="Weight kg" value={form.weightKg} onChange={(v) => updateField("weightKg", v)} />
          <Input label="Blood pressure" value={form.bloodPressure} onChange={(v) => updateField("bloodPressure", v)} />
          <Input label="Reason for visit" value={form.reasonForVisit} onChange={(v) => updateField("reasonForVisit", v)} />
          <Input label="Age myopia detected" value={form.ageMyopiaDetected} onChange={(v) => updateField("ageMyopiaDetected", v)} />
          <Input label="Current glasses power" value={form.currentGlassesPower} onChange={(v) => updateField("currentGlassesPower", v)} />
          <Input label="Previous treatment" value={form.previousTreatment} onChange={(v) => updateField("previousTreatment", v)} />
          <Input label="Near work hours/day" value={form.nearWorkHoursPerDay} onChange={(v) => updateField("nearWorkHoursPerDay", v)} />
          <Input label="Outdoor hours/day" value={form.outdoorHoursPerDay} onChange={(v) => updateField("outdoorHoursPerDay", v)} />
          <Input label="Screen time hours/day" value={form.screenTimeHoursPerDay} onChange={(v) => updateField("screenTimeHoursPerDay", v)} />
          <Input label="Reading distance cm" value={form.readingDistanceCm} onChange={(v) => updateField("readingDistanceCm", v)} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Checkbox label="Father has myopia" checked={form.fatherHasMyopia} onChange={(v) => updateField("fatherHasMyopia", v)} />
          <Checkbox label="Mother has myopia" checked={form.motherHasMyopia} onChange={(v) => updateField("motherHasMyopia", v)} />
          <Checkbox label="Sibling has myopia" checked={form.siblingHasMyopia} onChange={(v) => updateField("siblingHasMyopia", v)} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Textarea label="Family history note" value={form.familyHistoryNote} onChange={(v) => updateField("familyHistoryNote", v)} />
          <Textarea label="Allergy history" value={form.allergyHistory} onChange={(v) => updateField("allergyHistory", v)} />
          <Textarea label="Systemic disease history" value={form.systemicDiseaseHistory} onChange={(v) => updateField("systemicDiseaseHistory", v)} />
          <Textarea label="Eye disease history" value={form.eyeDiseaseHistory} onChange={(v) => updateField("eyeDiseaseHistory", v)} />
        </div>

        {message && <p className="mt-5 rounded-xl bg-slate-100 p-3">{message}</p>}

        <button className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">
          Save Intake
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
        className="mt-1 min-h-28 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      />
    </label>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border p-4">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}
