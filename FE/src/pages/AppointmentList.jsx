import { useEffect, useState } from "react";
import { getAppointmentsApi } from "../api/appointments.api";
import {
  Page,
  Card,
  Table,
  Notice,
  StatusBadge,
  Button,
} from "../components/ui/AppUI";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [notice, setNotice] = useState("Đang tải danh sách lịch hẹn...");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      const res = await getAppointmentsApi();
      const raw = res.data?.data || res.data || res;

      const data = Array.isArray(raw)
        ? raw
        : Array.isArray(raw.items)
        ? raw.items
        : [];

      setAppointments(data);
      setNotice("");
    } catch (error) {
      console.error(error);
      setAppointments([]);
      setNotice("Không tải được dữ liệu lịch hẹn.");
    }
  }

  const columns = [
    {
      key: "patient",
      label: "Bệnh nhi",
      render: (row) => row.patientName || row.patient?.fullName || "-",
    },
    {
      key: "doctor",
      label: "Bác sĩ",
      render: (row) => row.doctorName || row.doctor?.fullName || "-",
    },
    {
      key: "appointmentDatetime",
      label: "Thời gian hẹn",
      render: (row) => row.appointmentDatetime || "-",
    },
    {
      key: "appointmentType",
      label: "Loại hẹn",
      render: (row) => row.appointmentType || "-",
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (row) => <StatusBadge>{row.status || "BOOKED"}</StatusBadge>,
    },
  ];

  return (
    <Page
      title="Quản lý lịch hẹn"
      sub="Theo dõi lịch khám, lịch tái khám và trạng thái check-in bệnh nhi."
      actions={<Button>+ Tạo lịch hẹn</Button>}
    >
      <Notice type={notice.includes("Không") ? "error" : "info"}>
        {notice}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">Tổng lịch hẹn</span>
          <strong className="metric">{appointments.length}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Đã đặt lịch</span>
          <strong className="metric">
            {appointments.filter((x) => x.status === "BOOKED").length}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">Đã check-in</span>
          <strong className="metric">
            {appointments.filter((x) => x.status === "CHECKED_IN").length}
          </strong>
        </Card>
      </div>

      <Card title="Danh sách lịch hẹn">
        <Table
          rows={appointments}
          columns={columns}
          empty="Chưa có dữ liệu lịch hẹn."
        />
      </Card>
    </Page>
  );
}