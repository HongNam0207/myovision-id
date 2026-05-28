import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createDiagnosisApi,
  getDiagnosisApi,
  updateDiagnosisApi,
} from "../api/diagnosis.api";

import {
  Page,
  Card,
  Field,
  TextArea,
  Button,
  Notice,
  StatusBadge,
} from "../components/ui/AppUI";

export default function Diagnosis() {
  const { visitId } = useParams();

  const [diagnosisId, setDiagnosisId] = useState(null);
  const [message, setMessage] = useState("Đang tải dữ liệu chẩn đoán...");

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
      const data = res.data?.data || res.data || res;

      if (data) {
        setDiagnosisId(data.diagnosisId || data.id || null);
        setForm((prev) => ({ ...prev, ...data }));
        setMessage("");
      } else {
        setMessage("Chưa có dữ liệu chẩn đoán cho lượt khám này.");
      }
    } catch {
      setMessage("Chưa có dữ liệu chẩn đoán cho lượt khám này.");
    }
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm({
      diagnosisCode: "",
      diagnosisName: "",
      clinicalConclusion: "",
      myopiaType: "",
      severityLevel: "",
      progressionStatus: "",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      if (diagnosisId) {
        await updateDiagnosisApi(diagnosisId, form);
        setMessage("Đã cập nhật chẩn đoán.");
      } else {
        await createDiagnosisApi(visitId, form);
        setMessage("Đã tạo chẩn đoán.");
      }

      await loadDiagnosis();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Lưu chẩn đoán thất bại.");
    }
  }

  return (
    <Page
      title="Diagnosis"
      sub={`Bác sĩ nhập chẩn đoán và kết luận chuyên môn cho lượt khám #${visitId}.`}
      actions={
        <>
          <Link className="btn ghost" to={`/visits/${visitId}`}>
            Quay lại Visit
          </Link>

          <StatusBadge>
            {diagnosisId ? "Đã có chẩn đoán" : "Chưa có chẩn đoán"}
          </StatusBadge>
        </>
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
        <Card title="Thông tin chẩn đoán">
          <div className="form">
            <Field
              label="Mã chẩn đoán"
              value={form.diagnosisCode}
              onChange={(v) => updateField("diagnosisCode", v)}
            />

            <Field
              label="Tên chẩn đoán"
              value={form.diagnosisName}
              onChange={(v) => updateField("diagnosisName", v)}
            />

            <Field
              label="Loại cận thị"
              value={form.myopiaType}
              onChange={(v) => updateField("myopiaType", v)}
            />

            <Field
              label="Mức độ nặng"
              value={form.severityLevel}
              onChange={(v) => updateField("severityLevel", v)}
              options={["", "LOW", "MEDIUM", "HIGH"]}
            />

            <Field
              label="Tình trạng tiến triển"
              value={form.progressionStatus}
              onChange={(v) => updateField("progressionStatus", v)}
              options={["", "STABLE", "PROGRESSING", "FAST_PROGRESSING"]}
            />
          </div>
        </Card>

        <Card title="Kết luận chuyên môn">
          <TextArea
            label="Clinical conclusion"
            value={form.clinicalConclusion}
            onChange={(v) => updateField("clinicalConclusion", v)}
          />

          <div className="actions" style={{ marginTop: 20 }}>
            <Button type="submit">Lưu Diagnosis</Button>

            <Button variant="ghost" onClick={resetForm}>
              Làm mới form
            </Button>
          </div>
        </Card>
      </form>
    </Page>
  );
}