import { useEffect, useState } from "react";
import { dashboardApi } from "../../api/dashboard.api";
import { Page, Card, Notice, StatusBadge } from "../../components/ui/AppUI";

export default function ParentDashboard() {
  const [data, setData] = useState({
    childrenSummary: 0,
    upcomingAppointments: 0,
    latestRiskAlerts: 0,
    treatmentReminders: 0,
  });

  const [notice, setNotice] = useState(
    "Đang tải dữ liệu dashboard phụ huynh..."
  );

  useEffect(() => {
    Promise.allSettled([
      dashboardApi.parentChildrenSummary?.(),
      dashboardApi.parentUpcomingAppointments?.(),
      dashboardApi.parentLatestRiskAlerts?.(),
      dashboardApi.parentTreatmentReminders?.(),
    ])
      .then((results) => {
        setData({
          childrenSummary:
            results?.[0]?.value?.data?.data?.length ??
            results?.[0]?.value?.data?.length ??
            0,

          upcomingAppointments:
            results?.[1]?.value?.data?.data?.length ??
            results?.[1]?.value?.data?.length ??
            0,

          latestRiskAlerts:
            results?.[2]?.value?.data?.data?.length ??
            results?.[2]?.value?.data?.length ??
            0,

          treatmentReminders:
            results?.[3]?.value?.data?.data?.length ??
            results?.[3]?.value?.data?.length ??
            0,
        });

        setNotice("");
      })
      .catch(() => {
        setNotice(
          "Không tải được dữ liệu dashboard phụ huynh."
        );
      });
  }, []);

  return (
    <Page
      title="Parent Dashboard"
      sub="Theo dõi tiến triển cận thị, lịch hẹn và phác đồ điều trị của trẻ."
      actions={
        <StatusBadge>
          PARENT
        </StatusBadge>
      }
    >
      <Notice type={notice.includes("Không") ? "error" : "info"}>
        {notice}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">
            Hồ sơ trẻ em
          </span>

          <strong className="metric">
            {data.childrenSummary}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Lịch hẹn sắp tới
          </span>

          <strong className="metric">
            {data.upcomingAppointments}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Cảnh báo nguy cơ
          </span>

          <strong className="metric">
            {data.latestRiskAlerts}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Nhắc điều trị
          </span>

          <strong className="metric">
            {data.treatmentReminders}
          </strong>
        </Card>
      </div>

      <Card title="Theo dõi điều trị">
        <div className="grid two">
          <div className="notice ok">
            Child Profile đã hoạt động.
          </div>

          <div className="notice ok">
            Visit History đã kết nối.
          </div>

          <div className="notice ok">
            Progress Chart đang hoạt động.
          </div>

          <div className="notice ok">
            Treatment Plan đã hiển thị.
          </div>

          <div className="notice ok">
            Notification Center đã sẵn sàng.
          </div>

          <div className="notice">
            Tiếp tục đồng bộ Report PDF &
            realtime notifications.
          </div>
        </div>
      </Card>
    </Page>
  );
}