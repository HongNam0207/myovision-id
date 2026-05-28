import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { visitApi } from "../api/visits.api";

export default function VisitDetail() {
  const { visitId } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    visitApi.getById(visitId)
      .then((res) => setVisit(res.data?.data || res.data || null))
      .catch(() => setVisit(null))
      .finally(() => setLoading(false));
  }, [visitId]);

  if (loading) return <div style={boxStyle}>Loading visit detail...</div>;

  if (!visit) {
    return (
      <div style={boxStyle}>
        <h1>Visit not found</h1>
        <Link to="/visits" style={buttonStyle}>Back to queue</Link>
      </div>
    );
  }

  const patient = visit.patient || {};
  const intake = visit.clinicalIntake || visit.intake || {};
  const risk = visit.riskAssessment || visit.risk || {};
  const diagnosis = visit.diagnosis || visit.doctorDiagnosis || {};
  const treatment = visit.treatmentPlan || visit.treatment || {};

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: "bold", margin: 0 }}>
            {visit.visitCode || `Visit #${visitId}`}
          </h1>
          <p style={{ color: "#64748b", marginTop: 8 }}>
            Full clinical record overview.
          </p>
        </div>

        <Link to="/visits" style={buttonStyle}>Back to queue</Link>
      </div>

      <div style={gridStyle}>
        <Section title="Visit Info">
          <Row label="Status" value={visit.status} />
          <Row label="Visit Type" value={visit.visitType} />
          <Row label="Chief Complaint" value={visit.chiefComplaint} />
          <Row label="Visit Date" value={visit.visitDate} />
        </Section>

        <Section title="Patient">
          <Row label="Code" value={patient.patientCode || visit.patientCode} />
          <Row label="Full Name" value={patient.fullName || visit.patientName} />
          <Row label="Gender" value={patient.gender || visit.gender} />
          <Row label="Date of Birth" value={patient.dateOfBirth || visit.dateOfBirth} />
        </Section>

        <Section title="Clinical Intake">
          <Row label="Height" value={intake.heightCm} />
          <Row label="Weight" value={intake.weightKg} />
          <Row label="Outdoor Hours" value={intake.outdoorHoursPerDay} />
          <Row label="Screen Time" value={intake.screenTimeHoursPerDay} />
        </Section>

        <Section title="Doctor Core">
          <Row label="Risk Level" value={risk.riskLevel} />
          <Row label="Risk Score" value={risk.totalScore} />
          <Row label="Diagnosis" value={diagnosis.diagnosisName} />
          <Row label="Treatment" value={treatment.planName} />
        </Section>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 12 }}>Workflow Actions</h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link style={buttonStyle} to={`/visits/${visitId}/intake`}>Clinical Intake</Link>
          <Link style={buttonStyle} to={`/visits/${visitId}/refraction`}>Refraction</Link>
          <Link style={buttonStyle} to={`/visits/${visitId}/biometric`}>Biometric</Link>
          <Link style={buttonStyle} to={`/visits/${visitId}/binocular-vision`}>Binocular Vision</Link>
          <Link style={buttonStyle} to={`/visits/${visitId}/risk`}>Risk Assessment</Link>
          <Link style={buttonStyle} to={`/visits/${visitId}/diagnosis`}>Diagnosis</Link>
          <Link style={buttonStyle} to={`/visits/${visitId}/treatment`}>Treatment Plan</Link>
          <Link style={buttonStyle} to={`/visits/${visitId}/reports`}>Reports</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={sectionStyle}>
      <h2 style={{ marginTop: 0, fontSize: 20 }}>{title}</h2>
      <div style={{ display: "grid", gap: 10 }}>{children}</div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
      <span style={{ color: "#64748b" }}>{label}</span>
      <strong style={{ textAlign: "right" }}>{value ?? "-"}</strong>
    </div>
  );
}

const gridStyle = {
  marginTop: 24,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 18,
};

const sectionStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 20,
  background: "white",
};

const boxStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 24,
  background: "white",
};

const buttonStyle = {
  display: "inline-block",
  background: "#2563eb",
  color: "white",
  padding: "10px 14px",
  borderRadius: 10,
  fontWeight: 700,
};
