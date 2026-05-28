import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { visitApi } from "../api/visits.api";

import {
  Page,
  Card,
  Field,
  Button,
  Notice,
  StatusBadge,
  Table,
} from "../components/ui/AppUI";

export default function VisitQueue() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("Đang tải hàng chờ lượt khám...");

  useEffect(() => {
    visitApi
      .getAll()
      .then((res) => {
        const data = res.data?.data?.items || res.data?.data || [];
        setVisits(data);
        setMessage("");
      })
      .catch(() => {
        setVisits([]);
        setMessage("Không tải được dữ liệu lượt khám.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredVisits = useMemo(() => {
    const q = keyword.toLowerCase();

    return visits.filter(
      (visit) =>
        (visit.visitCode || "").toLowerCase().includes(q) ||
        (visit.patientName || visit.patient?.fullName || "")
          .toLowerCase()
          .includes(q) ||
        (visit.status || "").toLowerCase().includes(q)
    );
  }, [visits, keyword]);

  const columns = [
    {
      key: "visitCode",
      label: "Mã lượt khám",
      render: (row) => (
        <div>
          <b>{row.visitCode || `VISIT-${row.visitId || row.id}`}</b>
          <div className="hint">
            {row.patientName || row.patient?.fullName || "Unknown patient"}
          </div>
        </div>
      ),
    },
    {
      key: "visitType",
      label: "Loại khám",
      render: (row) => row.visitType || "-",
    },
    {
      key: "visitDate",
      label: "Ngày khám",
      render: (row) => row.visitDate || "-",
    },
    {
      key: "status",
      label: "Workflow",
      render: (row) => <StatusBadge>{row.status || "UNKNOWN"}</StatusBadge>,
    },
    {
      key: "actions",
      label: "Thao tác",
      render: (row) => {
        const id = row.visitId || row.id;

        return (
          <div className="actions">
            <Link className="btn ghost" to={`/visits/${id}`}>
              Detail
            </Link>

            <Link className="btn ghost" to={`/visits/${id}/intake`}>
              Intake
            </Link>

            <Link className="btn ghost" to={`/visits/${id}/refraction`}>
              Measurement
            </Link>

            <Link className="btn ghost" to={`/visits/${id}/diagnosis`}>
              Diagnosis
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <Page
      title="Visit Queue"
      sub="Theo dõi workflow lâm sàng: tiếp nhận, đo mắt, chẩn đoán và hoàn tất lượt khám."
      actions={<Button>+ Tạo lượt khám</Button>}
    >
      <Notice type={message.includes("Không") ? "error" : "info"}>
        {message}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">Tổng lượt khám</span>
          <strong className="metric">{visits.length}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Đang xử lý</span>
          <strong className="metric">
            {
              visits.filter(
                (x) => x.status !== "COMPLETED" && x.status !== "CANCELLED"
              ).length
            }
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">Hoàn tất</span>
          <strong className="metric">
            {visits.filter((x) => x.status === "COMPLETED").length}
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
            <Button variant="ghost" onClick={() => setKeyword("")}>
              Làm mới
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Danh sách workflow">
        {loading ? (
          <Notice>Đang tải dữ liệu lượt khám...</Notice>
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