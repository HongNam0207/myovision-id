import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { intakeApi } from "../api/intake.api";

const initialForm = {
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
  nearWorkHoursPerDay: "",
  outdoorHoursPerDay: "",
  screenTimeHoursPerDay: "",
  readingDistanceCm: "",
  allergyHistory: "",
  systemicDiseaseHistory: "",
  eyeDiseaseHistory: "",
};

export default function ClinicalIntake() {
  const { visitId } = useParams();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    intakeApi.getByVisitId(visitId)
      .then((res) => {
        const data = res.data?.data || res.data;
        if (data) setForm({ ...initialForm, ...data });
      })
      .catch(() => {});
  }, [visitId]);

  function setValue(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const payload = {
      ...form,
      heightCm: toNumber(form.heightCm),
      weightKg: toNumber(form.weightKg),
      ageMyopiaDetected: toNumber(form.ageMyopiaDetected),
      nearWorkHoursPerDay: toNumber(form.nearWorkHoursPerDay),
      outdoorHoursPerDay: toNumber(form.outdoorHoursPerDay),
      screenTimeHoursPerDay: toNumber(form.screenTimeHoursPerDay),
      readingDistanceCm: toNumber(form.readingDistanceCm),
    };

    try {
      await intakeApi.create(visitId, payload);
      setMessage("Saved clinical intake successfully.");
    } catch {
      setMessage("Save failed. Check API or workflow status.");
    }
  }

  return (
    <div>
      <h1 style={titleStyle}>Clinical Intake</h1>
      <p style={descStyle}>Nurse intake information for visit #{visitId}.</p>

      {message && <div style={alertStyle}>{message}</div>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <Field label="Height (cm)" value={form.heightCm} onChange={(v) => setValue("heightCm", v)} />
        <Field label="Weight (kg)" value={form.weightKg} onChange={(v) => setValue("weightKg", v)} />
        <Field label="Blood Pressure" value={form.bloodPressure} onChange={(v) => setValue("bloodPressure", v)} />
        <Field label="Reason For Visit" value={form.reasonForVisit} onChange={(v) => setValue("reasonForVisit", v)} />
        <Field label="Age Myopia Detected" value={form.ageMyopiaDetected} onChange={(v) => setValue("ageMyopiaDetected", v)} />
        <Field label="Current Glasses Power" value={form.currentGlassesPower} onChange={(v) => setValue("currentGlassesPower", v)} />
        <Field label="Previous Treatment" value={form.previousTreatment} onChange={(v) => setValue("previousTreatment", v)} />
        <Field label="Near Work Hours/Day" value={form.nearWorkHoursPerDay} onChange={(v) => setValue("nearWorkHoursPerDay", v)} />
        <Field label="Outdoor Hours/Day" value={form.outdoorHoursPerDay} onChange={(v) => setValue("outdoorHoursPerDay", v)} />
        <Field label="Screen Time Hours/Day" value={form.screenTimeHoursPerDay} onChange={(v) => setValue("screenTimeHoursPerDay", v)} />
        <Field label="Reading Distance (cm)" value={form.readingDistanceCm} onChange={(v) => setValue("readingDistanceCm", v)} />
        <Field label="Allergy History" value={form.allergyHistory} onChange={(v) => setValue("allergyHistory", v)} />
        <Field label="Systemic Disease History" value={form.systemicDiseaseHistory} onChange={(v) => setValue("systemicDiseaseHistory", v)} />
        <Field label="Eye Disease History" value={form.eyeDiseaseHistory} onChange={(v) => setValue("eyeDiseaseHistory", v)} />

        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Check label="Father Has Myopia" checked={form.fatherHasMyopia} onChange={(v) => setValue("fatherHasMyopia", v)} />
          <Check label="Mother Has Myopia" checked={form.motherHasMyopia} onChange={(v) => setValue("motherHasMyopia", v)} />
          <Check label="Sibling Has Myopia" checked={form.siblingHasMyopia} onChange={(v) => setValue("siblingHasMyopia", v)} />
        </div>

        <button style={buttonStyle}>Save Intake</button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontWeight: 700 }}>{label}</span>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value);
}

const titleStyle = { fontSize: 36, fontWeight: "bold", margin: 0 };
const descStyle = { marginTop: 8, color: "#64748b" };
const formStyle = {
  marginTop: 24,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
};
const inputStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  padding: "10px 12px",
};
const buttonStyle = {
  gridColumn: "1 / -1",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 12,
  padding: "12px 18px",
  fontWeight: 700,
};
const alertStyle = {
  marginTop: 16,
  padding: 14,
  borderRadius: 12,
  background: "#eff6ff",
  color: "#1d4ed8",
  fontWeight: 700,
};
