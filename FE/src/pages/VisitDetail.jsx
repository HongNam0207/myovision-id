import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { visitApi } from "../api/visits.api";

import {
  Page,
  Card,
  Notice,
  StatusBadge,
  Table,
} from "../components/ui/AppUI";

export default function VisitDetail() {
  const { visitId } = useParams();

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Đang tải chi tiết lượt khám...");

  useEffect(() => {
    visitApi
      .getById(visitId)
      .then((res) => {
        setVisit(res.data?.data || res.data || null);
        setMessage("");
      })
      .catch(() => {
        setVisit(null);
        setMessage("Không tìm thấy lượt khám.");
      })
      .finally(() => setLoading(false));
  }, [visitId]);

  if (loading) {
    return (
      <Page title="Visit Detail" sub={`Đang tải lượt khám #${visitId}.`}>
        <Notice>{message}</Notice>
      </Page>
    );
  }

  if (!visit) {
    return (
      <Page
        title="Visit not found"
        sub={`Không tìm thấy dữ liệu lượt khám #${visitId}.`}
        actions={
          <Link to="/visits" className="btn ghost">
            Quay lại hàng chờ
          </Link>
        }
      >
        <Notice type="error">{message}</Notice>
      </Page>
    );
  }

  const patient = visit.patient || {};
  const intake = visit.clinicalIntake || visit.intake || {};
  const risk = visit.riskAssessment || visit.risk || {};
  const diagnosis = visit.diagnosis || visit.doctorDiagnosis || {};
  const treatment = visit.treatmentPlan || visit.treatment || {};

  const visitInfoRows = [
    { label: "Trạng thái", value: visit.status || "-" },
    { label: "Loại khám", value: visit.visitType || "-" },
    { label: "Lý do khám", value: visit.chiefComplaint || "-" },
    { label: "Ngày khám", value: visit.visitDate || "-" },
  ];

  const patientRows = [
    { label: "Mã bệnh nhi", value: patient.patientCode || visit.patientCode || "-" },
    { label: "Họ tên", value: patient.fullName || visit.patientName || "-" },
    { label: "Giới tính", value: patient.gender || visit.gender || "-" },
    { label: "Ngày sinh", value: patient.dateOfBirth || visit.dateOfBirth || "-" },
  ];

  const intakeRows = [
    { label: "Chiều cao", value: intake.heightCm || "-" },
    { label: "Cân nặng", value: intake.weightKg || "-" },
    { label: "Giờ ngoài trời", value: intake.outdoorHoursPerDay || "-" },
    { label: "Thời gian màn hình", value: intake.screenTimeHoursPerDay || "-" },
  ];

  const doctorRows = [
    { label: "Risk Level", value: risk.riskLevel || "-" },
    { label: "Risk Score", value: risk.totalScore ?? "-" },
    { label: "Diagnosis", value: diagnosis.diagnosisName || "-" },
    { label: "Treatment", value: treatment.planName || "-" },
  ];

  const columns = [
    {
      key: "label",
      label: "Thông tin",
      render: (row) => <b>{row.label}</b>,
    },
    {
      key: "value",
      label: "Giá trị",
      render: (row) => row.value,
    },
  ];

  return (
    <Page
      title={visit.visitCode || `Visit #${visitId}`}
      sub="Tổng quan hồ sơ lâm sàng và workflow lượt khám."
      actions={
        <>
          <Link to="/visits" className="btn ghost">
            Quay lại hàng chờ
          </Link>

          <StatusBadge>{visit.status || "CREATED"}</StatusBadge>
        </>
      }
    >
      <Notice>{message}</Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">Trạng thái</span>
          <strong className="metric">{visit.status || "-"}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Loại khám</span>
          <strong className="metric">{visit.visitType || "-"}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Bệnh nhi</span>
          <strong className="metric" style={{ fontSize: 22 }}>
            {patient.fullName || visit.patientName || "-"}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">Risk Level</span>
          <strong className="metric">{risk.riskLevel || "-"}</strong>
        </Card>
      </div>

      <div className="grid two">
        <Card title="Visit Info">
          <Table rows={visitInfoRows} columns={columns} empty="Chưa có thông tin visit." />
        </Card>

        <Card title="Patient">
          <Table rows={patientRows} columns={columns} empty="Chưa có thông tin bệnh nhi." />
        </Card>

        <Card title="Clinical Intake">
          <Table rows={intakeRows} columns={columns} empty="Chưa có dữ liệu intake." />
        </Card>

        <Card title="Doctor Core">
          <Table rows={doctorRows} columns={columns} empty="Chưa có dữ liệu bác sĩ." />
        </Card>
      </div>

      <Card title="Workflow Actions">
        <div className="actions">
          <Link className="btn ghost" to={`/visits/${visitId}/intake`}>
            Clinical Intake
          </Link>

          <Link className="btn ghost" to={`/visits/${visitId}/refraction`}>
            Refraction
          </Link>

          <Link className="btn ghost" to={`/visits/${visitId}/biometric`}>
            Biometric
          </Link>

          <Link className="btn ghost" to={`/visits/${visitId}/binocular-vision`}>
            Binocular Vision
          </Link>

          <Link className="btn ghost" to={`/visits/${visitId}/risk`}>
            Risk Assessment
          </Link>

          <Link className="btn ghost" to={`/visits/${visitId}/diagnosis`}>
            Diagnosis
          </Link>

          <Link className="btn ghost" to={`/visits/${visitId}/treatment`}>
            Treatment Plan
          </Link>

          <Link className="btn ghost" to={`/visits/${visitId}/reports`}>
            Reports
          </Link>
        </div>
      </Card>
    </Page>
  );
}