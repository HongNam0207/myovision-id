import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { patientApi } from "../api/patients.api";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientApi.getAll()
      .then((res) => {
        const data = res.data?.data?.items || res.data?.data || [];
        setPatients(data);
      })
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
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
          <h1
            style={{
              fontSize: 36,
              fontWeight: "bold",
              margin: 0,
              color: "#0f172a",
            }}
          >
            Patient List
          </h1>

          <p style={{ marginTop: 8, color: "#64748b" }}>
            Patient management and clinical tracking.
          </p>
        </div>

        <button
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: "12px 18px",
            fontWeight: 600,
          }}
        >
          Create Patient
        </button>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 18,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={thStyle}>Patient Code</th>
              <th style={thStyle}>Full Name</th>
              <th style={thStyle}>Gender</th>
              <th style={thStyle}>Clinic</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" style={emptyStyle}>
                  Loading patients...
                </td>
              </tr>
            )}

            {!loading && patients.length === 0 && (
              <tr>
                <td colSpan="6" style={emptyStyle}>
                  No patient data found.
                </td>
              </tr>
            )}

            {patients.map((patient) => (
              <tr key={patient.patientId || patient.id}>
                <td style={tdStyle}>{patient.patientCode}</td>
                <td style={tdStyle}>{patient.fullName}</td>
                <td style={tdStyle}>{patient.gender}</td>
                <td style={tdStyle}>
                  {patient.clinicName || patient.clinic?.clinicName || "-"}
                </td>
                <td style={tdStyle}>{patient.status}</td>

                <td style={tdStyle}>
                  <Link
                    to={`/patients/${patient.patientId || patient.id}`}
                    style={{
                      background: "#dbeafe",
                      color: "#1d4ed8",
                      padding: "8px 12px",
                      borderRadius: 10,
                      fontWeight: 600,
                    }}
                  >
                    View Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: 16,
  fontSize: 14,
  color: "#475569",
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle = {
  padding: 16,
  borderBottom: "1px solid #f1f5f9",
  color: "#0f172a",
};

const emptyStyle = {
  padding: 40,
  textAlign: "center",
  color: "#64748b",
};
