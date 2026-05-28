import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { visitApi } from "../../api/visits.api";

export default function VisitDetail() {
  const { visitId } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadVisit() {
    try {
      const res = await visitApi.getById(visitId);
      const data = res.data?.data || res.data;
      setVisit(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisit();
  }, [visitId]);

  if (loading) {
    return <div className="dd-card">Ðang t?i lu?t khám...</div>;
  }

  if (!visit) {
    return <div className="dd-card">Không tìm th?y lu?t khám.</div>;
  }

  return (
    <div>
      <h1 className="dd-page-title">{visit.visitCode}</h1>
      <p className="dd-page-subtitle">
        Chi ti?t lu?t khám và tr?ng thái workflow
      </p>

      <div className="dd-stat-grid" style={{ marginBottom: 24 }}>
        <div className="dd-stat-card">
          <div className="dd-stat-label">Tr?ng thái</div>
          <div style={{ marginTop: 14 }}>
            <span className="dd-badge dd-badge-blue">
              {visit.status}
            </span>
          </div>
        </div>

        <div className="dd-stat-card">
          <div className="dd-stat-label">Lo?i khám</div>
          <div className="dd-stat-value" style={{ fontSize: 22 }}>
            {visit.visitType || "-"}
          </div>
        </div>

        <div className="dd-stat-card">
          <div className="dd-stat-label">Ngày khám</div>
          <div className="dd-stat-value" style={{ fontSize: 18 }}>
            {visit.visitDate || "-"}
          </div>
        </div>

        <div className="dd-stat-card">
          <div className="dd-stat-label">Bác si ph? trách</div>
          <div className="dd-stat-value" style={{ fontSize: 18 }}>
            {visit.assignedDoctorName || "-"}
          </div>
        </div>
      </div>

      <div className="dd-card">
        <h2 style={{ marginTop: 0, color: "var(--dd-primary-dark)" }}>
          Thông tin lu?t khám
        </h2>

        <table className="dd-table">
          <tbody>
            <tr>
              <th>Mã lu?t khám</th>
              <td>{visit.visitCode}</td>
            </tr>
            <tr>
              <th>B?nh nhi</th>
              <td>{visit.patientName || visit.patient?.fullName || "-"}</td>
            </tr>
            <tr>
              <th>Lý do khám</th>
              <td>{visit.chiefComplaint || "-"}</td>
            </tr>
            <tr>
              <th>Clinic</th>
              <td>{visit.clinicName || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
