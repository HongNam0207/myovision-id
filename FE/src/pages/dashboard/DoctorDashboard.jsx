import { useEffect, useState } from "react";
import { dashboardApi } from "../../api/dashboard.api";
import { Page, Card, Notice, StatusBadge } from "../../components/ui/AppUI";

export default function DoctorDashboard() {
  const [data, setData] = useState({
    todayVisits: 0,
    waitingDiagnosis: 0,
    highRiskPatients: 0,
    followUpNeeded: 0,
  });

  const [notice, setNotice] = useState(
    "Đang tải dữ liệu dashboard bác sĩ..."
  );

  useEffect(() => {
    Promise.allSettled([
      dashboardApi.doctorTodayVisits?.(),
      dashboardApi.doctorWaitingDiagnosis?.(),
      dashboardApi.doctorHighRiskPatients?.(),
      dashboardApi.doctorFollowUpNeeded?.(),
    ])
      .then((results) => {
        setData({
          todayVisits:
            results?.[0]?.value?.data?.data?.length ??
            results?.[0]?.value?.data?.length ??
            0,

          waitingDiagnosis:
            results?.[1]?.value?.data?.data?.length ??
            results?.[1]?.value?.data?.length ??
            0,

          highRiskPatients:
            results?.[2]?.value?.data?.data?.length ??
            results?.[2]?.value?.data?.length ??
            0,

          followUpNeeded:
            results?.[3]?.value?.data?.data?.length ??
            results?.[3]?.value?.data?.length ??
            0,
        });

        setNotice("");
      })
      .catch(() => {
        setNotice(
          "Không tải được dữ liệu dashboard bác sĩ."
        );
      });
  }, []);

  return (
    <Page
      title="Doctor Dashboard"
      sub="Theo dõi hàng chờ khám, bệnh nhân nguy cơ cao và tái khám."
      actions={
        <StatusBadge>
          OPHTHALMOLOGIST
        </StatusBadge>
      }
    >
      <Notice type={notice.includes("Không") ? "error" : "info"}>
        {notice}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">
            Lượt khám hôm nay
          </span>

          <strong className="metric">
            {data.todayVisits}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Chờ chẩn đoán
          </span>

          <strong className="metric">
            {data.waitingDiagnosis}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Nguy cơ cao
          </span>

          <strong className="metric">
            {data.highRiskPatients}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Cần tái khám
          </span>

          <strong className="metric">
            {data.followUpNeeded}
          </strong>
        </Card>
      </div>

      <Card title="Theo dõi chuyên môn">
        <div className="grid two">
          <div className="notice ok">
            Risk Assessment đã sẵn sàng.
          </div>

          <div className="notice ok">
            Diagnosis module đã kết nối.
          </div>

          <div className="notice ok">
            Treatment Plan đang hoạt động.
          </div>

          <div className="notice ok">
            Có thể xem full visit record.
          </div>

          <div className="notice">
            Tiếp tục đồng bộ Progress Chart &
            Follow-up.
          </div>
        </div>
      </Card>
    </Page>
  );
}