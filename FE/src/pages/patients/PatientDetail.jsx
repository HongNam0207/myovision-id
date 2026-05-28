import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { patientApi } from "../../api/patients.api";

export default function PatientDetail() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadPatient() {
    try {
      const res = await patientApi.getById(patientId);
      const data = res.data?.data || res.data;
      setPatient(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  if (loading) {
    return <div className="dd-card">Ðang t?i h? so b?nh nhi...</div>;
  }

  if (!patient) {
    return <div className="dd-card">Không tìm th?y b?nh nhi.</div>;
  }

  return (
    <div>
      <h1 className="dd-page-title">{patient.fullName}</h1>
      <p className="dd-page-subtitle">
        H? so chi ti?t b?nh nhi - {patient.patientCode}
      </p>

      <div className="dd-stat-grid" style={{ marginBottom: 24 }}>
        <div className="dd-stat-card">
          <div className="dd-stat-label">Mã b?nh nhi</div>
          <div className="dd-stat-value">{patient.patientCode}</div>
        </div>

        <div className="dd-stat-card">
          <div className="dd-stat-label">Gi?i tính</div>
          <div className="dd-stat-value">{patient.gender || "-"}</div>
        </div>

        <div className="dd-stat-card">
          <div className="dd-stat-label">Ngày sinh</div>
          <div className="dd-stat-value" style={{ fontSize: 22 }}>
            {patient.dateOfBirth || "-"}
          </div>
        </div>

        <div className="dd-stat-card">
          <div className="dd-stat-label">Tr?ng thái</div>
          <div style={{ marginTop: 14 }}>
            <span className="dd-badge dd-badge-green">
              {patient.status || "ACTIVE"}
            </span>
          </div>
        </div>
      </div>

      <div className="dd-card">
        <h2 style={{ marginTop: 0, color: "var(--dd-primary-dark)" }}>
          Thông tin hành chính
        </h2>

        <table className="dd-table">
          <tbody>
            <tr>
              <th>H? tên</th>
              <td>{patient.fullName}</td>
            </tr>
            <tr>
              <th>Mã b?nh vi?n</th>
              <td>{patient.hospitalPatientCode || "-"}</td>
            </tr>
            <tr>
              <th>Ð?a ch?</th>
              <td>{patient.address || "-"}</td>
            </tr>
            <tr>
              <th>Tru?ng h?c</th>
              <td>{patient.schoolName || "-"}</td>
            </tr>
            <tr>
              <th>L?p</th>
              <td>{patient.grade || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
