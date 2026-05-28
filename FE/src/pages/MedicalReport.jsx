import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  generateVisitReportApi,
  getVisitReportsApi,
  updateReportVisibilityApi,
} from "../api/reports.api";

import {
  Page,
  Card,
  Button,
  Notice,
  StatusBadge,
} from "../components/ui/AppUI";

export default function MedicalReport() {
  const { visitId } = useParams();

  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("Đang tải danh sách báo cáo...");

  useEffect(() => {
    loadReports();
  }, [visitId]);

  async function loadReports() {
    try {
      const res = await getVisitReportsApi(visitId);
      const raw = res.data?.data || res.data || res;

      if (Array.isArray(raw)) {
        setReports(raw);
      } else if (Array.isArray(raw.items)) {
        setReports(raw.items);
      } else {
        setReports([]);
      }

      setMessage("");
    } catch (error) {
      console.error(error);
      setReports([]);
      setMessage("Không tải được dữ liệu báo cáo.");
    }
  }

  async function generateReport() {
    setMessage("");

    try {
      await generateVisitReportApi(visitId);
      setMessage("Đã tạo báo cáo khám.");
      await loadReports();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Tạo báo cáo thất bại.");
    }
  }

  async function toggleVisibility(report) {
    const id = report.reportId || report.id;
    const next = !report.isVisibleToParent;

    try {
      await updateReportVisibilityApi(id, next);
      setMessage("Đã cập nhật trạng thái hiển thị báo cáo.");
      await loadReports();
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Cập nhật hiển thị báo cáo thất bại."
      );
    }
  }

  return (
    <Page
      title="Medical Reports"
      sub={`Quản lý báo cáo khám và quyền hiển thị cho phụ huynh của lượt khám #${visitId}.`}
      actions={
        <>
          <Link className="btn ghost" to={`/visits/${visitId}`}>
            Quay lại Visit
          </Link>

          <Button onClick={generateReport}>
            Tạo báo cáo
          </Button>
        </>
      }
    >
      <Notice
        type={
          message.includes("Không") || message.includes("thất bại")
            ? "error"
            : message.includes("Đã")
            ? "ok"
            : "info"
        }
      >
        {message}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">Tổng báo cáo</span>
          <strong className="metric">{reports.length}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Hiển thị phụ huynh</span>
          <strong className="metric">
            {reports.filter((x) => x.isVisibleToParent).length}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">Đang ẩn</span>
          <strong className="metric">
            {reports.filter((x) => !x.isVisibleToParent).length}
          </strong>
        </Card>
      </div>

      {!reports.length ? (
        <Card>
          <div className="empty">Chưa có báo cáo cho lượt khám này.</div>
        </Card>
      ) : (
        reports.map((report) => {
          const id = report.reportId || report.id;

          return (
            <Card key={id} title={report.reportTitle || "Visit Summary"}>
              <div className="pageHead" style={{ marginBottom: 14 }}>
                <div>
                  <p>
                    Type: <b>{report.reportType || "-"}</b>
                  </p>

                  <p>
                    Generated: <b>{report.generatedAt || "-"}</b>
                  </p>
                </div>

                <div className="actions">
                  <StatusBadge>
                    {report.isVisibleToParent ? "Visible" : "Hidden"}
                  </StatusBadge>

                  <Button
                    variant="ghost"
                    onClick={() => toggleVisibility(report)}
                  >
                    Đổi hiển thị
                  </Button>

                  {report.pdfUrl && (
                    <a
                      href={report.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn"
                    >
                      Mở PDF
                    </a>
                  )}
                </div>
              </div>

              <div
                className="notice"
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.7,
                  fontWeight: 500,
                }}
              >
                {report.reportContent || "Chưa có nội dung preview."}
              </div>
            </Card>
          );
        })
      )}
    </Page>
  );
}