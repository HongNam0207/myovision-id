import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPatientDetailApi } from "../api/patients.api";

import {
  Page,
  Card,
  Notice,
  StatusBadge,
  Table,
} from "../components/ui/AppUI";

export default function PatientDetail() {
  const { patientId } = useParams();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(
    "Đang tải hồ sơ bệnh nhi..."
  );

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  async function loadPatient() {
    try {
      const res = await getPatientDetailApi(patientId);

      const data = res.data?.data || res.data || res;

      setPatient(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setPatient(null);
      setMessage("Không tìm thấy hồ sơ bệnh nhi.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Page
        title="Patient Detail"
        sub={`Đang tải hồ sơ bệnh nhi #${patientId}.`}
      >
        <Notice>{message}</Notice>
      </Page>
    );
  }

  if (!patient) {
    return (
      <Page
        title="Patient Detail"
        sub={`Không tìm thấy hồ sơ bệnh nhi #${patientId}.`}
      >
        <Notice type="error">{message}</Notice>
      </Page>
    );
  }

  const basicInfo = [
    {
      label: "Họ tên",
      value: patient.fullName || "-",
    },
    {
      label: "Giới tính",
      value: patient.gender || "-",
    },
    {
      label: "Ngày sinh",
      value: patient.dateOfBirth || "-",
    },
    {
      label: "Địa chỉ",
      value: patient.address || "-",
    },
    {
      label: "Trường học",
      value: patient.schoolName || "-",
    },
    {
      label: "Lớp",
      value: patient.grade || "-",
    },
  ];

  const recordInfo = [
    {
      label: "Trạng thái",
      value: patient.status || "-",
    },
    {
      label: "Clinic ID",
      value: patient.clinicId || "-",
    },
    {
      label: "Created At",
      value: patient.createdAt || "-",
    },
    {
      label: "Updated At",
      value: patient.updatedAt || "-",
    },
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
      title={patient.fullName || "Patient Detail"}
      sub={`Patient code: ${patient.patientCode || "-"}`}
      actions={
        <>
          <Link className="btn ghost" to="/patients">
            Quay lại Patients
          </Link>

          <StatusBadge>
            {patient.status || "ACTIVE"}
          </StatusBadge>
        </>
      }
    >
      <Notice>{message}</Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">
            Mã bệnh nhi
          </span>

          <strong className="metric">
            {patient.patientCode || "-"}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Giới tính
          </span>

          <strong className="metric">
            {patient.gender || "-"}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Ngày sinh
          </span>

          <strong className="metric">
            {patient.dateOfBirth || "-"}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Trạng thái
          </span>

          <strong className="metric">
            {patient.status || "ACTIVE"}
          </strong>
        </Card>
      </div>

      <div className="grid two">
        <Card title="Thông tin cơ bản">
          <Table
            rows={basicInfo}
            columns={columns}
            empty="Chưa có dữ liệu."
          />
        </Card>

        <Card title="Thông tin hồ sơ">
          <Table
            rows={recordInfo}
            columns={columns}
            empty="Chưa có dữ liệu."
          />
        </Card>
      </div>
    </Page>
  );
}