import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { intakeApi } from "../api/intake.api";

import {
  Page,
  Card,
  Field,
  TextArea,
  Button,
  Notice,
  StatusBadge,
} from "../components/ui/AppUI";

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
  const [message, setMessage] = useState("Đang tải dữ liệu tiếp nhận...");

  useEffect(() => {
    intakeApi
      .getByVisitId(visitId)
      .then((res) => {
        const data = res.data?.data || res.data;

        if (data) {
          setForm({ ...initialForm, ...data });
          setMessage("");
        } else {
          setMessage("Chưa có dữ liệu tiếp nhận cho lượt khám này.");
        }
      })
      .catch(() => {
        setMessage("Chưa có dữ liệu tiếp nhận cho lượt khám này.");
      });
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
      setMessage("Đã lưu thông tin tiếp nhận.");
    } catch {
      setMessage("Lưu thất bại. Vui lòng kiểm tra API hoặc trạng thái workflow.");
    }
  }

  return (
    <Page
      title="Clinical Intake"
      sub={`Điều dưỡng nhập thông tin tiếp nhận cho lượt khám #${visitId}.`}
      actions={<StatusBadge>NURSE</StatusBadge>}
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
              onChange={(v) => setValue("heightCm", v)}
            />

            <Field
              label="Cân nặng (kg)"
              value={form.weightKg}
              onChange={(v) => setValue("weightKg", v)}
            />

            <Field
              label="Huyết áp"
              value={form.bloodPressure}
              onChange={(v) => setValue("bloodPressure", v)}
            />

            <Field
              label="Tuổi phát hiện cận thị"
              value={form.ageMyopiaDetected}
              onChange={(v) => setValue("ageMyopiaDetected", v)}
            />
          </div>
        </Card>

        <Card title="Bệnh sử và lý do khám">
          <div className="form">
            <Field
              label="Lý do khám"
              value={form.reasonForVisit}
              onChange={(v) => setValue("reasonForVisit", v)}
            />

            <Field
              label="Độ kính hiện tại"
              value={form.currentGlassesPower}
              onChange={(v) => setValue("currentGlassesPower", v)}
            />

            <Field
              label="Điều trị trước đây"
              value={form.previousTreatment}
              onChange={(v) => setValue("previousTreatment", v)}
            />

            <Field
              label="Dị ứng"
              value={form.allergyHistory}
              onChange={(v) => setValue("allergyHistory", v)}
            />
          </div>
        </Card>

        <Card title="Tiền sử gia đình">
          <div className="actions" style={{ marginBottom: 16 }}>
            <Check
              label="Bố cận thị"
              checked={form.fatherHasMyopia}
              onChange={(v) => setValue("fatherHasMyopia", v)}
            />

            <Check
              label="Mẹ cận thị"
              checked={form.motherHasMyopia}
              onChange={(v) => setValue("motherHasMyopia", v)}
            />

            <Check
              label="Anh/chị/em cận thị"
              checked={form.siblingHasMyopia}
              onChange={(v) => setValue("siblingHasMyopia", v)}
            />
          </div>
        </Card>

        <Card title="Thói quen sinh hoạt">
          <div className="form">
            <Field
              label="Giờ nhìn gần/ngày"
              value={form.nearWorkHoursPerDay}
              onChange={(v) => setValue("nearWorkHoursPerDay", v)}
            />

            <Field
              label="Giờ ngoài trời/ngày"
              value={form.outdoorHoursPerDay}
              onChange={(v) => setValue("outdoorHoursPerDay", v)}
            />

            <Field
              label="Giờ màn hình/ngày"
              value={form.screenTimeHoursPerDay}
              onChange={(v) => setValue("screenTimeHoursPerDay", v)}
            />

            <Field
              label="Khoảng cách đọc (cm)"
              value={form.readingDistanceCm}
              onChange={(v) => setValue("readingDistanceCm", v)}
            />
          </div>
        </Card>

        <Card title="Bệnh sử khác">
          <div className="form">
            <TextArea
              label="Bệnh toàn thân"
              value={form.systemicDiseaseHistory}
              onChange={(v) => setValue("systemicDiseaseHistory", v)}
            />

            <TextArea
              label="Bệnh mắt"
              value={form.eyeDiseaseHistory}
              onChange={(v) => setValue("eyeDiseaseHistory", v)}
            />
          </div>

          <div className="actions" style={{ marginTop: 20 }}>
            <Button type="submit">Lưu Intake</Button>

            <Button
              variant="ghost"
              onClick={() => setForm(initialForm)}
            >
              Làm mới form
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
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value);
}