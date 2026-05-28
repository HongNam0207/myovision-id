import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { visitApi } from "../api/visits.api";

const statusColors = {
  CREATED: "#e2e8f0",
  WAITING_INTAKE: "#fef3c7",
  IN_INTAKE: "#dbeafe",
  WAITING_MEASUREMENT: "#ede9fe",
  IN_MEASUREMENT: "#cffafe",
  WAITING_DOCTOR: "#ffedd5",
  IN_DIAGNOSIS: "#dcfce7",
  WAITING_APPROVAL: "#fee2e2",
  COMPLETED: "#bbf7d0",
  CANCELLED: "#fecaca",
};

export default function VisitQueue() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    visitApi.getAll()
      .then((res) => {
        const data = res.data?.data?.items || res.data?.data || [];
        setVisits(data);
      })
      .catch(() => setVisits([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 36, fontWeight: "bold", margin: 0 }}>
        Visit Queue
      </h1>

      <p style={{ marginTop: 8, color: "#64748b" }}>
        Clinical workflow queue for intake, measurement and diagnosis.
      </p>

      <div style={{ marginTop: 24, display: "grid", gap: 14 }}>
        {loading && <div style={emptyStyle}>Loading visits...</div>}

        {!loading && visits.length === 0 && (
          <div style={emptyStyle}>No visit data found.</div>
        )}

        {visits.map((visit) => {
          const id = visit.visitId || visit.id;

          return (
            <div
              key={id}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 18,
                padding: 18,
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 1fr auto",
                gap: 16,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold", fontSize: 18 }}>
                  {visit.visitCode || `VISIT-${id}`}
                </div>
                <div style={{ marginTop: 6, color: "#64748b" }}>
                  {visit.patientName || visit.patient?.fullName || "Unknown patient"}
                </div>
              </div>

              <div>
                <div style={{ color: "#64748b", fontSize: 13 }}>Visit Type</div>
                <div style={{ fontWeight: 600 }}>{visit.visitType || "-"}</div>
              </div>

              <div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: statusColors[visit.status] || "#e2e8f0",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {visit.status || "UNKNOWN"}
                </span>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Link style={actionStyle} to={`/visits/${id}`}>
                  Detail
                </Link>
                <Link style={actionStyle} to={`/visits/${id}/intake`}>
                  Intake
                </Link>
                <Link style={actionStyle} to={`/visits/${id}/refraction`}>
                  Measurement
                </Link>
                <Link style={actionStyle} to={`/visits/${id}/diagnosis`}>
                  Diagnosis
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const emptyStyle = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 32,
  color: "#64748b",
};

const actionStyle = {
  background: "#dbeafe",
  color: "#1d4ed8",
  padding: "8px 10px",
  borderRadius: 10,
  fontWeight: 600,
  fontSize: 13,
};
