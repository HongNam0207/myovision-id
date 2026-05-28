import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { intakeApi } from "../../api/intake.api";

export default function ClinicalIntake() {
  const { visitId } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const [intakeId, setIntakeId] = useState(null);
  const [message, setMessage] = useState("");

  async function loadIntake() {
    try {
      const res = await intakeApi.getByVisitId(visitId);
      const data = res.data?.data || res.data;

      if (data) {
        setIntakeId(data.intakeId);
        setForm({
          heightCm: data.heightCm || "",
          weightKg: data.weightKg || "",
          bloodPressure: data.bloodPressure || "",
          reasonForVisit: data.reasonForVisit || "",
          ageMyopiaDetected: data.ageMyopiaDetected || "",
          currentGlassesPower: data.currentGlassesPower || "",
          previousTreatment: data.previousTreatment || "",
          fatherHasMyopia: Boolean(data.fatherHasMyopia),
          motherHasMyopia: Boolean(data.motherHasMyopia),
          siblingHasMyopia: Boolean(data.siblingHasMyopia),
          familyHistoryNote: data.familyHistoryNote || "",
          nearWorkHoursPerDay: data.nearWorkHoursPerDay || "",
          outdoorHoursPerDay: data.outdoorHoursPerDay || "",
          screenTimeHoursPerDay: data.screenTimeHoursPerDay || "",
          readingDistanceCm: data.readingDistanceCm || "",
          allergyHistory: data.allergyHistory || "",
          systemicDiseaseHistory: data.systemicDiseaseHistory || "",
          eyeDiseaseHistory: data.eyeDiseaseHistory || "",
        });
      }
    } catch {
      console.log("Chua có intake cho visit này.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIntake();
  }, [visitId]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (intakeId) {
        await intakeApi.update(intakeId, form);
        setMessage("Ðã c?p nh?t clinical intake.");
      } else {
        const res = await intakeApi.create(visitId, form);
        const data = res.data?.data || res.data;
        setIntakeId(data.intakeId);
        setMessage("Ðã t?o clinical intake.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Luu th?t b?i. Ki?m tra l?i API ho?c d? li?u nh?p.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="dd-card">Ðang t?i clinical intake...</div>;
  }

  return (
    <div>
      <h1 className="dd-page-title">Clinical Intake</h1>
      <p className="dd-page-subtitle">
        Nh?p thông tin ti?p nh?n ban d?u cho lu?t khám #{visitId}
      </p>

      {message && (
        <div className="dd-card" style={{ marginBottom: 18, color: "var(--dd-primary-dark)", fontWeight: 800 }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="dd-card">
        <h2 style={{ marginTop: 0, color: "var(--dd-primary-dark)" }}>
          Ch? s? co b?n
        </h2>

        <div className="dd-form-grid">
          <Field label="Chi?u cao cm" value={form.heightCm} onChange={(v) => updateField("heightCm", v)} />
          <Field label="Cân n?ng kg" value={form.weightKg} onChange={(v) => updateField("weightKg", v)} />
          <Field label="Huy?t áp" value={form.bloodPressure} onChange={(v) => updateField("bloodPressure", v)} />
          <Field label="Tu?i phát hi?n c?n" value={form.ageMyopiaDetected} onChange={(v) => updateField("ageMyopiaDetected", v)} />
        </div>

        <h2 style={{ color: "var(--dd-primary-dark)" }}>
          B?nh s? & lý do khám
        </h2>

        <div className="dd-form-grid">
          <Field label="Lý do khám" value={form.reasonForVisit} onChange={(v) => updateField("reasonForVisit", v)} />
          <Field label="Ð? kính hi?n t?i" value={form.currentGlassesPower} onChange={(v) => updateField("currentGlassesPower", v)} />
          <Field label="Ði?u tr? tru?c dây" value={form.previousTreatment} onChange={(v) => updateField("previousTreatment", v)} />
          <Field label="D? ?ng" value={form.allergyHistory} onChange={(v) => updateField("allergyHistory", v)} />
        </div>

        <h2 style={{ color: "var(--dd-primary-dark)" }}>
          Ti?n s? gia dình
        </h2>

        <div style={{ display: "flex", gap: 18, marginBottom: 18 }}>
          <Check label="B? c?n th?" checked={form.fatherHasMyopia} onChange={(v) => updateField("fatherHasMyopia", v)} />
          <Check label="M? c?n th?" checked={form.motherHasMyopia} onChange={(v) => updateField("motherHasMyopia", v)} />
          <Check label="Anh/ch?/em c?n th?" checked={form.siblingHasMyopia} onChange={(v) => updateField("siblingHasMyopia", v)} />
        </div>

        <Field label="Ghi chú ti?n s? gia dình" value={form.familyHistoryNote} onChange={(v) => updateField("familyHistoryNote", v)} />

        <h2 style={{ color: "var(--dd-primary-dark)" }}>
          Thói quen sinh ho?t
        </h2>

        <div className="dd-form-grid">
          <Field label="Gi? nhìn g?n/ngày" value={form.nearWorkHoursPerDay} onChange={(v) => updateField("nearWorkHoursPerDay", v)} />
          <Field label="Gi? ngoài tr?i/ngày" value={form.outdoorHoursPerDay} onChange={(v) => updateField("outdoorHoursPerDay", v)} />
          <Field label="Gi? màn hình/ngày" value={form.screenTimeHoursPerDay} onChange={(v) => updateField("screenTimeHoursPerDay", v)} />
          <Field label="Kho?ng cách d?c cm" value={form.readingDistanceCm} onChange={(v) => updateField("readingDistanceCm", v)} />
        </div>

        <h2 style={{ color: "var(--dd-primary-dark)" }}>
          B?nh s? khác
        </h2>

        <div className="dd-form-grid">
          <Field label="B?nh toàn thân" value={form.systemicDiseaseHistory} onChange={(v) => updateField("systemicDiseaseHistory", v)} />
          <Field label="B?nh m?t" value={form.eyeDiseaseHistory} onChange={(v) => updateField("eyeDiseaseHistory", v)} />
        </div>

        <button className="dd-btn dd-btn-primary" disabled={saving} style={{ marginTop: 22 }}>
          {saving ? "Ðang luu..." : "Luu Clinical Intake"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>{label}</div>
      <input
        className="dd-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
