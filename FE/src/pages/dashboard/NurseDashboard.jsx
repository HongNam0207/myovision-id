import { useEffect, useState } from "react";
import { dashboardApi } from "../../api/dashboard.api";
import { Page, Card, Notice, StatusBadge } from "../../components/ui/AppUI";

export default function NurseDashboard() {
  const [data, setData] = useState({
    todayAppointments: 0,
    waitingIntake: 0,
    checkInList: 0,
    todayCreatedPatients: 0,
  });

  const [notice, setNotice] = useState(
    "Đang tải dữ liệu dashboard điều dưỡng..."
  );

  useEffect(() => {
    Promise.allSettled([
      dashboardApi.nurseTodayAppointments?.(),
      dashboardApi.nurseWaitingIntake?.(),
      dashboardApi.nurseCheckInList?.(),
      dashboardApi.nurseTodayCreatedPatients?.(),
    ])
      .then((results) => {
        setData({
          todayAppointments:
            results?.[0]?.value?.data?.data?.length ??
            results?.[0]?.value?.data?.length ??
            0,

          waitingIntake:
            results?.[1]?.value?.data?.data?.length ??
            results?.[1]?.value?.data?.length ??
            0,

          checkInList:
            results?.[2]?.value?.data?.data?.length ??
            results?.[2]?.value?.data?.length ??
            0,

          todayCreatedPatients:
            results?.[3]?.value?.data?.data?.length ??
            results?.[3]?.value?.data?.length ??
            0,
        });

        setNotice("");
      })
      .catch(() => {
        setNotice(
          "Không tải được dữ liệu dashboard điều dưỡng."
        );
      });
  }, []);

  return (
    <Page
      title="Nurse Dashboard"
      sub="Theo dõi tiếp nhận bệnh nhi, check-in và điều phối lượt khám."
      actions={
        <StatusBadge>
          NURSE
        </StatusBadge>
      }
    >
      <Notice type={notice.includes("Không") ? "error" : "info"}>
        {notice}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">
            Lịch hẹn hôm nay
          </span>

          <strong className="metric">
            {data.todayAppointments}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Chờ Intake
          </span>

          <strong className="metric">
            {data.waitingIntake}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Danh sách Check-in
          </span>

          <strong className="metric">
            {data.checkInList}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Hồ sơ tạo hôm nay
          </span>

          <strong className="metric">
            {data.todayCreatedPatients}
          </strong>
        </Card>
      </div>

      <Card title="Điều phối tiếp nhận">
        <div className="grid two">
          <div className="notice ok">
            Patient Management đã hoạt động.
          </div>

          <div className="notice ok">
            Visit Queue đã kết nối.
          </div>

          <div className="notice ok">
            Clinical Intake đang hoạt động.
          </div>

          <div className="notice ok">
            Appointment module đã sẵn sàng.
          </div>

          <div className="notice">
            Tiếp tục đồng bộ Reminder &
            Notification.
          </div>
        </div>
      </Card>
    </Page>
  );
}