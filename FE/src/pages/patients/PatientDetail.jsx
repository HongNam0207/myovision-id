import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { patientApi } from "../../api/patients.api";
import {
  Page,
  Card,
  Notice,
  StatusBadge,
  Table,
} from "../../components/ui/AppUI";

export default function PatientDetail() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("Đang tải hồ sơ bệnh nhi...");

  async function loadPatient() {
    try {
      const res = await patientApi.getById(patientId);
      const data = res.data?.data || res.data;
      setPatient(data);
      setNotice("");
    } catch (error) {
      console.error(error);
      setPatient(null);
      setNotice("Không tìm thấy hồ sơ bệnh nhi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  if (loading) {
    return (
      <Page
        title="Hồ sơ bệnh nhi"
        sub={`Đang tải dữ liệu bệnh nhi #${patientId}.`}
      >
        <Notice>{notice}</Notice>
      </Page>
    );
  }

  if (!patient) {
    return (
      <Page
        title="Hồ sơ bệnh nhi"
        sub={`Không tìm thấy dữ liệu bệnh nhi #${patientId}.`}
      >
        <Notice type="error">{notice}</Notice>
      </Page>
    );
  }

  const infoRows = [
    {
      label: "Họ tên",
      value: patient.fullName || "-",
    },
    {
      label: "Mã bệnh viện",
      value: patient.hospitalPatientCode || "-",
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
      title={patient.fullName || "Hồ sơ bệnh nhi"}
      sub={`Hồ sơ chi tiết bệnh nhi - ${patient.patientCode || "-"}.`}
      actions={
        <StatusBadge>
          {patient.status || "ACTIVE"}
        </StatusBadge>
      }
    >
      <div className="grid cards">
        <Card>
          <span className="metricLabel">Mã bệnh nhi</span>
          <strong className="metric">{patient.patientCode || "-"}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Giới tính</span>
          <strong className="metric">{patient.gender || "-"}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Ngày sinh</span>
          <strong className="metric">{patient.dateOfBirth || "-"}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Trạng thái</span>
          <strong className="metric">{patient.status || "ACTIVE"}</strong>
        </Card>
      </div>

      <Card title="Thông tin hành chính">
        <Table
          rows={infoRows}
          columns={columns}
          empty="Chưa có thông tin hành chính."
        />
      </Card>
    </Page>
  );
}