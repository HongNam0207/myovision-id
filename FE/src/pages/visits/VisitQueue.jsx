import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { visitApi } from "../../api/visits.api";

import {
  Page,
  Card,
  Field,
  Button,
  Table,
  Notice,
  StatusBadge,
} from "../../components/ui/AppUI";

export default function VisitQueue() {
  const navigate = useNavigate();

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");

  const [notice, setNotice] = useState(
    "Đang tải danh sách lượt khám..."
  );

  async function loadVisits() {
    try {
      const res = await visitApi.getAll();

      const data = res.data?.data || res.data;

      setVisits(data.items || data || []);
      setNotice("");
    } catch (error) {
      console.error(error);

      setVisits([]);
      setNotice("Không tải được dữ liệu lượt khám.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisits();
  }, []);

  const filteredVisits = useMemo(() => {
    const q = keyword.toLowerCase();

    return visits.filter(
      (v) =>
        (v.visitCode || "")
          .toLowerCase()
          .includes(q) ||

        (
          v.patientName ||
          v.fullName ||
          v.patient?.fullName ||
          ""
        )
          .toLowerCase()
          .includes(q)
    );
  }, [visits, keyword]);

  function renderStatus(status) {
    return (
      <StatusBadge>
        {status || "CREATED"}
      </StatusBadge>
    );
  }

  const columns = [
    {
      key: "visitCode",
      label: "Mã lượt khám",
      render: (row) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: "var(--brand-soft)",
              display: "grid",
              placeItems: "center",
              color: "var(--brand-dark)",
            }}
          >
            <ClipboardList size={18} />
          </div>

          <div>
            <b>{row.visitCode || "-"}</b>

            <div className="hint">
              {row.visitType || "-"}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "patient",
      label: "Bệnh nhi",
      render: (row) =>
        row.patientName ||
        row.fullName ||
        row.patient?.fullName ||
        "-",
    },

    {
      key: "visitDate",
      label: "Ngày khám",
      render: (row) => row.visitDate || "-",
    },

    {
      key: "status",
      label: "Workflow",
      render: (row) => renderStatus(row.status),
    },

    {
      key: "chiefComplaint",
      label: "Lý do khám",
      render: (row) =>
        row.chiefComplaint || "-",
    },

    {
      key: "action",
      label: "Chi tiết",
      render: (row) => (
        <Button
          variant="ghost"
          onClick={() =>
            navigate(`/visits/${row.visitId}`)
          }
        >
          Xem Visit
        </Button>
      ),
    },
  ];

  return (
    <Page
      title="Hàng chờ lượt khám"
      sub="Theo dõi workflow khám mắt và trạng thái xử lý bệnh nhi."
      actions={
        <Button>
          + Tạo lượt khám
        </Button>
      }
    >
      <Notice
        type={
          notice.includes("Không")
            ? "error"
            : "info"
        }
      >
        {notice}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">
            Tổng lượt khám
          </span>

          <strong className="metric">
            {visits.length}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Đang chờ xử lý
          </span>

          <strong className="metric">
            {
              visits.filter(
                (x) =>
                  x.status !== "COMPLETED" &&
                  x.status !== "CANCELLED"
              ).length
            }
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Hoàn tất
          </span>

          <strong className="metric">
            {
              visits.filter(
                (x) =>
                  x.status === "COMPLETED"
              ).length
            }
          </strong>
        </Card>
      </div>

      <Card title="Tìm kiếm lượt khám">
        <div className="form inline">
          <Field
            label="Tìm kiếm"
            value={keyword}
            onChange={setKeyword}
          />

          <div className="actions">
            <Button
              variant="ghost"
              onClick={() => setKeyword("")}
            >
              Làm mới
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Danh sách workflow">
        {loading ? (
          <Notice>
            Đang tải dữ liệu lượt khám...
          </Notice>
        ) : (
          <Table
            rows={filteredVisits}
            columns={columns}
            empty="Chưa có dữ liệu lượt khám."
          />
        )}
      </Card>
    </Page>
  );
}