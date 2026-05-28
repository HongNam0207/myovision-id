import { useEffect, useState } from "react";
import { dashboardApi } from "../../api/dashboard.api";
import { Page, Card, Notice, StatusBadge } from "../../components/ui/AppUI";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [notice, setNotice] = useState("Đang tải dữ liệu tổng quan hệ thống...");

  useEffect(() => {
    dashboardApi
      .adminOverview()
      .then((res) => {
        setOverview(res.data?.data || res.data || {});
        setNotice("");
      })
      .catch(() => {
        setOverview({
          totalPatients: 0,
          totalVisits: 0,
          highRiskPatients: 0,
          appointmentsToday: 0,
        });
        setNotice("Không tải được Dashboard API. Đang hiển thị dữ liệu mặc định.");
      });
  }, []);

  return (
    <Page
      title="Admin Dashboard"
      sub="Tổng quan vận hành hệ thống MYOVISION ID tại Khoa Mắt Đông Đô."
      actions={<StatusBadge>ADMIN</StatusBadge>}
    >
      <Notice type={notice.includes("Không") ? "error" : "info"}>
        {notice}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">Tổng bệnh nhi</span>
          <strong className="metric">{overview?.totalPatients ?? 0}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Tổng lượt khám</span>
          <strong className="metric">{overview?.totalVisits ?? 0}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Nguy cơ cao</span>
          <strong className="metric">{overview?.highRiskPatients ?? 0}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Lịch hẹn hôm nay</span>
          <strong className="metric">{overview?.appointmentsToday ?? 0}</strong>
        </Card>
      </div>

      <Card title="Trạng thái MVP">
        <div className="grid two">
          <div className="notice ok">Auth / JWT đã kết nối.</div>
          <div className="notice ok">FE router đang hoạt động.</div>
          <div className="notice ok">Dashboard API đã mounted.</div>
          <div className="notice ok">Patient, Visit, Intake, Measurement đã có màn hình.</div>
          <div className="notice ok">Admin module base screens đã sẵn sàng.</div>
          <div className="notice">Tiếp tục đồng bộ UI từng màn theo AppUI.</div>
        </div>
      </Card>
    </Page>
  );
}