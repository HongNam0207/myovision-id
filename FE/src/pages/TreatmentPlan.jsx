import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createTreatmentPlanApi } from "../api/treatment.api";

import {
  Page,
  Card,
  Field,
  TextArea,
  Button,
  Notice,
  StatusBadge,
} from "../components/ui/AppUI";

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

  function resetForm() {
    setForm({
      planName: "",
      treatmentGoal: "",
      startDate: "",
      endDate: "",
      complianceTarget: "",
      followUpIntervalDays: "",
      doctorInstruction: "",
    });
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
      setMessage("Đã lưu phác đồ điều trị.");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Lưu phác đồ thất bại.");
    }
  }

  return (
    <Page
      title="Treatment Plan"
      sub={`Bác sĩ lập phác đồ điều trị cho lượt khám #${visitId}.`}
      actions={
        <>
          <Link className="btn ghost" to={`/visits/${visitId}`}>
            Quay lại Visit
          </Link>

          <StatusBadge>ACTIVE</StatusBadge>
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
        <Card title="Thông tin phác đồ">
          <div className="form">
            <Field
              label="Tên phác đồ"
              value={form.planName}
              onChange={(v) => updateField("planName", v)}
            />

            <Field
              label="Mục tiêu điều trị"
              value={form.treatmentGoal}
              onChange={(v) => updateField("treatmentGoal", v)}
            />

            <Field
              label="Ngày bắt đầu"
              type="date"
              value={form.startDate}
              onChange={(v) => updateField("startDate", v)}
            />

            <Field
              label="Ngày kết thúc"
              type="date"
              value={form.endDate}
              onChange={(v) => updateField("endDate", v)}
            />

            <Field
              label="Mục tiêu tuân thủ"
              value={form.complianceTarget}
              onChange={(v) => updateField("complianceTarget", v)}
            />

            <Field
              label="Khoảng cách tái khám (ngày)"
              value={form.followUpIntervalDays}
              onChange={(v) => updateField("followUpIntervalDays", v)}
            />
          </div>
        </Card>

        <Card title="Hướng dẫn của bác sĩ">
          <TextArea
            label="Doctor instruction"
            value={form.doctorInstruction}
            onChange={(v) => updateField("doctorInstruction", v)}
          />

          <div className="actions" style={{ marginTop: 20 }}>
            <Button type="submit">
              Lưu Treatment Plan
            </Button>

            <Button variant="ghost" onClick={resetForm}>
              Làm mới form
            </Button>
          </div>
        </Card>
      </form>
    </Page>
  );
}