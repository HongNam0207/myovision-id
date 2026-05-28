import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  calculateRiskAssessmentApi,
  getRiskAssessmentApi,
  getRiskFactorsApi,
} from "../api/risk.api";

import {
  Page,
  Card,
  Button,
  Notice,
  StatusBadge,
  Table,
} from "../components/ui/AppUI";

export default function RiskAssessment() {
  const { visitId } = useParams();

  const [risk, setRisk] = useState(null);
  const [factors, setFactors] = useState([]);
  const [message, setMessage] = useState("Đang tải đánh giá nguy cơ...");

  useEffect(() => {
    loadRisk();
  }, [visitId]);

  async function loadRisk() {
    try {
      const res = await getRiskAssessmentApi(visitId);
      const data = res.data?.data || res.data || res;

      setRisk(data);

      const riskId = data?.riskAssessmentId || data?.id;

      if (riskId) {
        const factorRes = await getRiskFactorsApi(riskId);
        const raw = factorRes.data?.data || factorRes.data || factorRes;

        if (Array.isArray(raw)) {
          setFactors(raw);
        } else if (Array.isArray(raw.items)) {
          setFactors(raw.items);
        } else {
          setFactors([]);
        }
      }

      setMessage("");
    } catch {
      setRisk(null);
      setFactors([]);
      setMessage("Chưa có đánh giá nguy cơ cho lượt khám này.");
    }
  }

  async function calculateRisk() {
    setMessage("");

    try {
      await calculateRiskAssessmentApi(visitId);
      setMessage("Đã tính toán đánh giá nguy cơ.");
      await loadRisk();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Tính nguy cơ thất bại.");
    }
  }

  const factorColumns = [
    {
      key: "factorName",
      label: "Yếu tố",
      render: (row) => row.factorName || row.factorCode || "-",
    },
    {
      key: "factorValue",
      label: "Giá trị",
      render: (row) => row.factorValue || "-",
    },
    {
      key: "score",
      label: "Điểm",
      render: (row) => row.score ?? "-",
    },
    {
      key: "impactLevel",
      label: "Ảnh hưởng",
      render: (row) => <StatusBadge>{row.impactLevel || "-"}</StatusBadge>,
    },
  ];

  return (
    <Page
      title="Risk Assessment"
      sub={`Đánh giá nguy cơ tiến triển cận thị cho lượt khám #${visitId}.`}
      actions={
        <>
          <Link className="btn ghost" to={`/visits/${visitId}`}>
            Quay lại Visit
          </Link>

          <Button onClick={calculateRisk}>
            Tính nguy cơ
          </Button>
        </>
      }
    >
      <Notice
        type={
          message.includes("thất bại")
            ? "error"
            : message.includes("Đã")
            ? "ok"
            : "info"
        }
      >
        {message}
      </Notice>

      {!risk ? (
        <Card>
          <div className="empty">
            Chưa có dữ liệu đánh giá nguy cơ.
          </div>
        </Card>
      ) : (
        <>
          <div className="grid cards">
            <Card>
              <span className="metricLabel">Tổng điểm</span>
              <strong className="metric">{risk.totalScore ?? "-"}</strong>
            </Card>

            <Card>
              <span className="metricLabel">Mức nguy cơ</span>
              <strong className="metric">{risk.riskLevel ?? "-"}</strong>
            </Card>

            <Card>
              <span className="metricLabel">Cảnh báo AL/CR</span>
              <strong className="metric">
                {risk.alCrWarning ? "Có" : "Không"}
              </strong>
            </Card>

            <Card>
              <span className="metricLabel">Cảnh báo tiến triển</span>
              <strong className="metric">
                {risk.progressionWarning ? "Có" : "Không"}
              </strong>
            </Card>
          </div>

          <Card title="Khuyến nghị">
            <div
              className="notice"
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.7,
                fontWeight: 500,
              }}
            >
              {risk.recommendation || "Chưa có khuyến nghị."}
            </div>
          </Card>

          <Card title="Yếu tố nguy cơ">
            <Table
              rows={factors}
              columns={factorColumns}
              empty="Chưa có dữ liệu yếu tố nguy cơ."
            />
          </Card>
        </>
      )}
    </Page>
  );
}