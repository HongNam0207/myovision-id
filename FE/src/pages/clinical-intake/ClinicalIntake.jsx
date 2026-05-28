import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { intakeApi } from "../../api/intake.api";
import {
  Page,
  Card,
  Field,
  TextArea,
  Button,
  Notice,
  StatusBadge,
} from "../../components/ui/AppUI";

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
      setMessage("Chưa có dữ liệu tiếp nhận cho lượt khám này.");
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
        setMessage("Đã cập nhật thông tin tiếp nhận.");
      } else {
        const res = await intakeApi.create(visitId, form);
        const data = res.data?.data || res.data;
        setIntakeId(data.intakeId);
        setMessage("Đã tạo thông tin tiếp nhận.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Lưu thất bại. Vui lòng kiểm tra API hoặc dữ liệu nhập.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Page
        title="Clinical Intake"
        sub={`Đang tải dữ liệu tiếp nhận cho lượt khám #${visitId}.`}
      >
        <Notice>Đang tải clinical intake...</Notice>
      </Page>
    );
  }

  return (
    <Page
      title="Clinical Intake"
      sub={`Nhập thông tin tiếp nhận ban đầu cho lượt khám #${visitId}.`}
      actions={
        <StatusBadge>
          {intakeId ? "Đã có intake" : "Chưa có intake"}
        </StatusBadge>
      }
    >
      <Notice
        type={
          message.includes("thất bại")
            ? "error"
            : message.includes("Đã")
            ? "ok"
            : "info"
        }
      >
        {message}
      </Notice>

      <form onSubmit={handleSubmit}>
        <Card title="Chỉ số cơ bản">
          <div className="form">
            <Field
              label="Chiều cao (cm)"
              value={form.heightCm}
              onChange={(v) => updateField("heightCm", v)}
            />

            <Field
              label="Cân nặng (kg)"
              value={form.weightKg}
              onChange={(v) => updateField("weightKg", v)}
            />

            <Field
              label="Huyết áp"
              value={form.bloodPressure}
              onChange={(v) => updateField("bloodPressure", v)}
            />

            <Field
              label="Tuổi phát hiện cận thị"
              value={form.ageMyopiaDetected}
              onChange={(v) => updateField("ageMyopiaDetected", v)}
            />
          </div>
        </Card>

        <Card title="Bệnh sử và lý do khám">
          <div className="form">
            <Field
              label="Lý do khám"
              value={form.reasonForVisit}
              onChange={(v) => updateField("reasonForVisit", v)}
            />

            <Field
              label="Độ kính hiện tại"
              value={form.currentGlassesPower}
              onChange={(v) => updateField("currentGlassesPower", v)}
            />

            <Field
              label="Điều trị trước đây"
              value={form.previousTreatment}
              onChange={(v) => updateField("previousTreatment", v)}
            />

            <Field
              label="Dị ứng"
              value={form.allergyHistory}
              onChange={(v) => updateField("allergyHistory", v)}
            />
          </div>
        </Card>

        <Card title="Tiền sử gia đình">
          <div className="actions" style={{ marginBottom: 16 }}>
            <Check
              label="Bố cận thị"
              checked={form.fatherHasMyopia}
              onChange={(v) => updateField("fatherHasMyopia", v)}
            />

            <Check
              label="Mẹ cận thị"
              checked={form.motherHasMyopia}
              onChange={(v) => updateField("motherHasMyopia", v)}
            />

            <Check
              label="Anh/chị/em cận thị"
              checked={form.siblingHasMyopia}
              onChange={(v) => updateField("siblingHasMyopia", v)}
            />
          </div>

          <TextArea
            label="Ghi chú tiền sử gia đình"
            value={form.familyHistoryNote}
            onChange={(v) => updateField("familyHistoryNote", v)}
          />
        </Card>

        <Card title="Thói quen sinh hoạt">
          <div className="form">
            <Field
              label="Giờ nhìn gần/ngày"
              value={form.nearWorkHoursPerDay}
              onChange={(v) => updateField("nearWorkHoursPerDay", v)}
            />

            <Field
              label="Giờ ngoài trời/ngày"
              value={form.outdoorHoursPerDay}
              onChange={(v) => updateField("outdoorHoursPerDay", v)}
            />

            <Field
              label="Giờ màn hình/ngày"
              value={form.screenTimeHoursPerDay}
              onChange={(v) => updateField("screenTimeHoursPerDay", v)}
            />

            <Field
              label="Khoảng cách đọc (cm)"
              value={form.readingDistanceCm}
              onChange={(v) => updateField("readingDistanceCm", v)}
            />
          </div>
        </Card>

        <Card title="Bệnh sử khác">
          <div className="form">
            <TextArea
              label="Bệnh toàn thân"
              value={form.systemicDiseaseHistory}
              onChange={(v) => updateField("systemicDiseaseHistory", v)}
            />

            <TextArea
              label="Bệnh mắt"
              value={form.eyeDiseaseHistory}
              onChange={(v) => updateField("eyeDiseaseHistory", v)}
            />
          </div>

          <div className="actions" style={{ marginTop: 20 }}>
            <Button type="submit" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu Clinical Intake"}
            </Button>
          </div>
        </Card>
      </form>
    </Page>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label
      className="pill"
      style={{
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}