import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Search } from "lucide-react";
import { visitApi } from "../../api/visits.api";

export default function VisitQueue() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadVisits() {
    try {
      const res = await visitApi.getAll();
      const data = res.data?.data || res.data;
      setVisits(data.items || data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisits();
  }, []);

  function getStatusClass(status) {
    if (status === "COMPLETED") return "dd-badge-green";
    if (status === "CANCELLED") return "dd-badge-orange";
    return "dd-badge-blue";
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="dd-page-title">Hàng ch? lu?t khám</h1>
        <p className="dd-page-subtitle">
          Theo dõi tr?ng thái workflow khám m?t c?a b?nh nhi
        </p>
      </div>

      <div
        className="dd-card"
        style={{
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Search size={18} color="#6B8793" />
        <input className="dd-input" placeholder="Tìm theo mã lu?t khám ho?c b?nh nhi..." />
      </div>

      <div className="dd-card">
        {loading ? (
          <div>Ðang t?i lu?t khám...</div>
        ) : (
          <table className="dd-table">
            <thead>
              <tr>
                <th>Mã visit</th>
                <th>B?nh nhi</th>
                <th>Lo?i khám</th>
                <th>Ngày khám</th>
                <th>Tr?ng thái</th>
                <th>Lý do khám</th>
              </tr>
            </thead>

            <tbody>
              {visits.map((visit) => (
                <tr
                  key={visit.visitId}
                  onClick={() => navigate(`/visits/${visit.visitId}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          background: "var(--dd-primary-light)",
                          display: "grid",
                          placeItems: "center",
                          color: "var(--dd-primary-dark)",
                        }}
                      >
                        <ClipboardList size={18} />
                      </div>
                      <strong>{visit.visitCode}</strong>
                    </div>
                  </td>

                  <td>{visit.patientName || visit.fullName || visit.patient?.fullName || "-"}</td>
                  <td>{visit.visitType || "-"}</td>
                  <td>{visit.visitDate || "-"}</td>
                  <td>
                    <span className={`dd-badge ${getStatusClass(visit.status)}`}>
                      {visit.status}
                    </span>
                  </td>
                  <td>{visit.chiefComplaint || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
