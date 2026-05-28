import { useEffect, useState } from "react";
import { getMyChildrenApi } from "../api/parentPortal.api";

import {
  Page,
  Card,
  Notice,
  StatusBadge,
  Button,
} from "../components/ui/AppUI";

export default function ParentChildren() {
  const [children, setChildren] = useState([]);
  const [message, setMessage] = useState(
    "Đang tải danh sách bệnh nhi..."
  );

  useEffect(() => {
    loadChildren();
  }, []);

  async function loadChildren() {
    try {
      const res = await getMyChildrenApi();

      const raw = res.data?.data || res.data || res;

      if (Array.isArray(raw)) {
        setChildren(raw);
      } else if (Array.isArray(raw.items)) {
        setChildren(raw.items);
      } else {
        setChildren([]);
      }

      setMessage("");
    } catch (error) {
      console.error(error);
      setChildren([]);
      setMessage("Không tải được dữ liệu bệnh nhi.");
    }
  }

  return (
    <Page
      title="My Children"
      sub="Phụ huynh theo dõi hồ sơ và tiến triển cận thị của trẻ."
      actions={<StatusBadge>PARENT</StatusBadge>}
    >
      <Notice
        type={
          message.includes("Không")
            ? "error"
            : "info"
        }
      >
        {message}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">
            Tổng bệnh nhi
          </span>

          <strong className="metric">
            {children.length}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Đang theo dõi
          </span>

          <strong className="metric">
            {
              children.filter(
                (x) =>
                  (x.status || "").toUpperCase() ===
                  "ACTIVE"
              ).length
            }
          </strong>
        </Card>
      </div>

      {!children.length ? (
        <Card>
          <div className="empty">
            Chưa có hồ sơ bệnh nhi.
          </div>
        </Card>
      ) : (
        <div className="grid cards">
          {children.map((child) => (
            <Card
              key={child.patientId || child.id}
              title={child.fullName}
            >
              <div className="grid" style={{ gap: 10 }}>
                <div>
                  <span className="metricLabel">
                    Mã bệnh nhi
                  </span>

                  <div>
                    {child.patientCode || "-"}
                  </div>
                </div>

                <div>
                  <span className="metricLabel">
                    Giới tính
                  </span>

                  <div>{child.gender || "-"}</div>
                </div>

                <div>
                  <span className="metricLabel">
                    Ngày sinh
                  </span>

                  <div>
                    {child.dateOfBirth || "-"}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <StatusBadge>
                    {child.status || "ACTIVE"}
                  </StatusBadge>

                  <Button variant="ghost">
                    Xem hồ sơ
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}