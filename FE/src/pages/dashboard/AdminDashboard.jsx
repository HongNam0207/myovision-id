import { useEffect, useState } from "react";
import { dashboardApi } from "../../api/dashboard.api";

function Card({ title, value }) {
  return (
    <div style={{ background: "white", borderRadius: 18, padding: 20, border: "1px solid #e2e8f0" }}>
      <div style={{ color: "#64748b", fontSize: 14 }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 32, fontWeight: "bold", color: "#0f172a" }}>
        {value}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    dashboardApi.adminOverview()
      .then((res) => setOverview(res.data?.data || res.data || {}))
      .catch(() => setOverview({
        totalPatients: 0,
        totalVisits: 0,
        highRiskPatients: 0,
        appointmentsToday: 0,
      }));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 36, fontWeight: "bold", color: "#0f172a", margin: 0 }}>
        Admin Dashboard
      </h1>

      <p style={{ marginTop: 8, color: "#64748b" }}>
        MYOVISION ID system overview.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginTop: 24 }}>
        <Card title="Total Patients" value={overview?.totalPatients ?? 0} />
        <Card title="Total Visits" value={overview?.totalVisits ?? 0} />
        <Card title="High Risk Patients" value={overview?.highRiskPatients ?? 0} />
        <Card title="Appointments Today" value={overview?.appointmentsToday ?? 0} />
      </div>

      <div style={{ marginTop: 28, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 18, padding: 20 }}>
        <div style={{ fontWeight: "bold", color: "#1e3a8a", marginBottom: 8 }}>
          MVP Status
        </div>

        <div style={{ color: "#1e40af", lineHeight: 1.7 }}>
          Auth / JWT is connected.<br />
          FE router is working.<br />
          Dashboard API is mounted.<br />
          Patient, Visit, Intake, Measurement pages are available.<br />
          Admin module base screens are available.
        </div>
      </div>
    </div>
  );
}
