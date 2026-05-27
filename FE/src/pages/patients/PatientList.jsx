import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { patientApi } from "../../api/patients.api";

export default function PatientList() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPatients() {
    try {
      const res = await patientApi.getAll();

      const data = res.data?.data || res.data;

      setPatients(data.items || data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 className="dd-page-title">Danh sách bệnh nhi</h1>

          <p className="dd-page-subtitle">
            Quản lý hồ sơ bệnh nhi MYOVISION ID
          </p>
        </div>

        <button className="dd-btn dd-btn-primary">
          + Thêm bệnh nhi
        </button>
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

        <input
          className="dd-input"
          placeholder="Tìm theo tên hoặc mã bệnh nhân..."
        />
      </div>

      <div className="dd-card">
        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <table className="dd-table">
            <thead>
              <tr>
                <th>Mã BN</th>
                <th>Họ tên</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Trường học</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.patientId}
                  onClick={() => navigate(`/patients/${patient.patientId}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
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
                        <Users size={18} />
                      </div>

                      <strong>{patient.patientCode}</strong>
                    </div>
                  </td>

                  <td>{patient.fullName}</td>

                  <td>{patient.dateOfBirth}</td>

                  <td>{patient.gender}</td>

                  <td>{patient.schoolName}</td>

                  <td>
                    <span className="dd-badge dd-badge-green">
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
