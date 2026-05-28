import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { visitApi } from "../../api/visits.api";

import {
  Page,
  Card,
  Notice,
  StatusBadge,
  Table,
} from "../../components/ui/AppUI";

export default function VisitDetail() {
  const { visitId } = useParams();

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(
    "Đang tải dữ liệu lượt khám..."
  );

  async function loadVisit() {
    try {
      const res = await visitApi.getById(visitId);

      const data = res.data?.data || res.data;

      setVisit(data);
      setNotice("");
    } catch (error) {
      console.error(error);
      setVisit(null);
      setNotice("Không tìm thấy dữ liệu lượt khám.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisit();
  }, [visitId]);

  if (loading) {
    return (
      <Page
        title="Visit Detail"
        sub={`Đang tải lượt khám #${visitId}.`}
      >
        <Notice>{notice}</Notice>
      </Page>
    );
  }

  if (!visit) {
    return (
      <Page
        title="Visit Detail"
        sub={`Không tìm thấy lượt khám #${visitId}.`}
      >
        <Notice type="error">{notice}</Notice>
      </Page>
    );
  }

  const infoRows = [
    {
      label: "Mã lượt khám",
      value: visit.visitCode || "-",
    },
    {
      label: "Bệnh nhi",
      value:
        visit.patientName ||
        visit.patient?.fullName ||
        "-",
    },
    {
      label: "Lý do khám",
      value: visit.chiefComplaint || "-",
    },
    {
      label: "Clinic",
      value: visit.clinicName || "-",
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
      title={visit.visitCode || "Visit Detail"}
      sub="Chi tiết lượt khám và trạng thái workflow."
      actions={
        <StatusBadge>
          {visit.status || "CREATED"}
        </StatusBadge>
      }
    >
      <Notice>{notice}</Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">
            Trạng thái
          </span>

          <strong className="metric">
            {visit.status || "-"}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Loại khám
          </span>

          <strong className="metric">
            {visit.visitType || "-"}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Ngày khám
          </span>

          <strong className="metric">
            {visit.visitDate || "-"}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Bác sĩ phụ trách
          </span>

          <strong
            className="metric"
            style={{ fontSize: 22 }}
          >
            {visit.assignedDoctorName || "-"}
          </strong>
        </Card>
      </div>

      <Card title="Thông tin lượt khám">
        <Table
          rows={infoRows}
          columns={columns}
          empty="Chưa có dữ liệu lượt khám."
        />
      </Card>
    </Page>
  );
}