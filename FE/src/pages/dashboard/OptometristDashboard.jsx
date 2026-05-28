import { useEffect, useState } from "react";
import { dashboardApi } from "../../api/dashboard.api";
import { Page, Card, Notice, StatusBadge } from "../../components/ui/AppUI";

export default function OptometristDashboard() {
  const [data, setData] = useState({
    waitingMeasurement: 0,
    todayMeasurements: 0,
    measurementHistory: 0,
  });

  const [notice, setNotice] = useState(
    "Đang tải dữ liệu dashboard khúc xạ..."
  );

  useEffect(() => {
    Promise.allSettled([
      dashboardApi.optometristWaitingMeasurement?.(),
      dashboardApi.optometristTodayMeasurements?.(),
      dashboardApi.optometristMeasurementHistory?.(),
    ])
      .then((results) => {
        setData({
          waitingMeasurement:
            results?.[0]?.value?.data?.data?.length ??
            results?.[0]?.value?.data?.length ??
            0,

          todayMeasurements:
            results?.[1]?.value?.data?.data?.length ??
            results?.[1]?.value?.data?.length ??
            0,

          measurementHistory:
            results?.[2]?.value?.data?.data?.length ??
            results?.[2]?.value?.data?.length ??
            0,
        });

        setNotice("");
      })
      .catch(() => {
        setNotice(
          "Không tải được dữ liệu dashboard khúc xạ."
        );
      });
  }, []);

  return (
    <Page
      title="Optometrist Dashboard"
      sub="Theo dõi hàng chờ đo mắt, dữ liệu measurement và lịch sử khúc xạ."
      actions={
        <StatusBadge>
          OPTOMETRIST
        </StatusBadge>
      }
    >
      <Notice type={notice.includes("Không") ? "error" : "info"}>
        {notice}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">
            Chờ đo mắt
          </span>

          <strong className="metric">
            {data.waitingMeasurement}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Đo hôm nay
          </span>

          <strong className="metric">
            {data.todayMeasurements}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Lịch sử measurement
          </span>

          <strong className="metric">
            {data.measurementHistory}
          </strong>
        </Card>
      </div>

      <Card title="Measurement Workflow">
        <div className="grid two">
          <div className="notice ok">
            Refraction module đã hoạt động.
          </div>

          <div className="notice ok">
            Biometric module đã kết nối.
          </div>

          <div className="notice ok">
            Binocular Vision đã sẵn sàng.
          </div>

          <div className="notice ok">
            Measurement History đang hoạt động.
          </div>

          <div className="notice">
            Tiếp tục đồng bộ Device Sync &
            realtime measurement queue.
          </div>
        </div>
      </Card>
    </Page>
  );
}