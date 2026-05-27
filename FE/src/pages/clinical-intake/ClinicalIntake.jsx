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
      console.log("Chưa có intake cho visit này.");
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
        setMessage("Đã cập nhật clinical intake.");
      } else {
        const res = await intakeApi.create(visitId, form);
        const data = res.data?.data || res.data;
        setIntakeId(data.intakeId);
        setMessage("Đã tạo clinical intake.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Lưu thất bại. Kiểm tra lại API hoặc dữ liệu nhập.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="dd-card">Đang tải clinical intake...</div>;
  }

  return (
    <div>
      <h1 className="dd-page-title">Clinical Intake</h1>
      <p className="dd-page-subtitle">
        Nhập thông tin tiếp nhận ban đầu cho lượt khám #{visitId}
      </p>

      {message && (
        <div className="dd-card" style={{ marginBottom: 18, color: "var(--dd-primary-dark)", fontWeight: 800 }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="dd-card">
        <h2 style={{ marginTop: 0, color: "var(--dd-primary-dark)" }}>
          Chỉ số cơ bản
        </h2>

        <div className="dd-form-grid">
          <Field label="Chiều cao cm" value={form.heightCm} onChange={(v) => updateField("heightCm", v)} />
          <Field label="Cân nặng kg" value={form.weightKg} onChange={(v) => updateField("weightKg", v)} />
          <Field label="Huyết áp" value={form.bloodPressure} onChange={(v) => updateField("bloodPressure", v)} />
          <Field label="Tuổi phát hiện cận" value={form.ageMyopiaDetected} onChange={(v) => updateField("ageMyopiaDetected", v)} />
        </div>

        <h2 style={{ color: "var(--dd-primary-dark)" }}>
          Bệnh sử & lý do khám
        </h2>

        <div className="dd-form-grid">
          <Field label="Lý do khám" value={form.reasonForVisit} onChange={(v) => updateField("reasonForVisit", v)} />
          <Field label="Độ kính hiện tại" value={form.currentGlassesPower} onChange={(v) => updateField("currentGlassesPower", v)} />
          <Field label="Điều trị trước đây" value={form.previousTreatment} onChange={(v) => updateField("previousTreatment", v)} />
          <Field label="Dị ứng" value={form.allergyHistory} onChange={(v) => updateField("allergyHistory", v)} />
        </div>

        <h2 style={{ color: "var(--dd-primary-dark)" }}>
          Tiền sử gia đình
        </h2>

        <div style={{ display: "flex", gap: 18, marginBottom: 18 }}>
          <Check label="Bố cận thị" checked={form.fatherHasMyopia} onChange={(v) => updateField("fatherHasMyopia", v)} />
          <Check label="Mẹ cận thị" checked={form.motherHasMyopia} onChange={(v) => updateField("motherHasMyopia", v)} />
          <Check label="Anh/chị/em cận thị" checked={form.siblingHasMyopia} onChange={(v) => updateField("siblingHasMyopia", v)} />
        </div>

        <Field label="Ghi chú tiền sử gia đình" value={form.familyHistoryNote} onChange={(v) => updateField("familyHistoryNote", v)} />

        <h2 style={{ color: "var(--dd-primary-dark)" }}>
          Thói quen sinh hoạt
        </h2>

        <div className="dd-form-grid">
          <Field label="Giờ nhìn gần/ngày" value={form.nearWorkHoursPerDay} onChange={(v) => updateField("nearWorkHoursPerDay", v)} />
          <Field label="Giờ ngoài trời/ngày" value={form.outdoorHoursPerDay} onChange={(v) => updateField("outdoorHoursPerDay", v)} />
          <Field label="Giờ màn hình/ngày" value={form.screenTimeHoursPerDay} onChange={(v) => updateField("screenTimeHoursPerDay", v)} />
          <Field label="Khoảng cách đọc cm" value={form.readingDistanceCm} onChange={(v) => updateField("readingDistanceCm", v)} />
        </div>

        <h2 style={{ color: "var(--dd-primary-dark)" }}>
          Bệnh sử khác
        </h2>

        <div className="dd-form-grid">
          <Field label="Bệnh toàn thân" value={form.systemicDiseaseHistory} onChange={(v) => updateField("systemicDiseaseHistory", v)} />
          <Field label="Bệnh mắt" value={form.eyeDiseaseHistory} onChange={(v) => updateField("eyeDiseaseHistory", v)} />
        </div>

        <button className="dd-btn dd-btn-primary" disabled={saving} style={{ marginTop: 22 }}>
          {saving ? "Đang lưu..." : "Lưu Clinical Intake"}
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
