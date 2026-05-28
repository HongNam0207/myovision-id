import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { measurementApi } from "../api/measurement.api";

const emptyRow = {
  eyeSide: "OD",
  measurementType: "AUTO_REFRACTION",
  sph: "",
  cyl: "",
  axisDegree: "",
  va: "",
  bcva: "",
  note: "",
};

export default function Refraction() {
  const { visitId } = useParams();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyRow);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, [visitId]);

  function loadData() {
    measurementApi.getRefractions(visitId)
      .then((res) => setRows(res.data?.data?.items || res.data?.data || []))
      .catch(() => setRows([]));
  }

  function setValue(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const payload = {
      ...form,
      sph: toNumber(form.sph),
      cyl: toNumber(form.cyl),
      axisDegree: form.axisDegree === "" ? null : Number(form.axisDegree),
    };

    if (payload.axisDegree !== null && (payload.axisDegree < 0 || payload.axisDegree > 180)) {
      setMessage("Axis must be between 0 and 180.");
      return;
    }

    try {
      await measurementApi.createRefraction(visitId, payload);
      setForm(emptyRow);
      setMessage("Saved refraction successfully.");
      loadData();
    } catch {
      setMessage("Save failed. Check API or validation.");
    }
  }

  const ser = calculateSer(form.sph, form.cyl);

  return (
    <div>
      <h1 style={titleStyle}>Refraction</h1>
      <p style={descStyle}>Input OD/OS refraction data for visit #{visitId}.</p>

      {message && <div style={alertStyle}>{message}</div>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>
          Eye Side
          <select value={form.eyeSide} onChange={(e) => setValue("eyeSide", e.target.value)} style={inputStyle}>
            <option value="OD">OD</option>
            <option value="OS">OS</option>
          </select>
        </label>

        <label style={labelStyle}>
          Measurement Type
          <select value={form.measurementType} onChange={(e) => setValue("measurementType", e.target.value)} style={inputStyle}>
            <option value="AUTO_REFRACTION">AUTO_REFRACTION</option>
            <option value="SUBJECTIVE">SUBJECTIVE</option>
            <option value="CYCLOPLEGIC">CYCLOPLEGIC</option>
            <option value="RETINOSCOPY">RETINOSCOPY</option>
          </select>
        </label>

        <Field label="SPH" value={form.sph} onChange={(v) => setValue("sph", v)} />
        <Field label="CYL" value={form.cyl} onChange={(v) => setValue("cyl", v)} />
        <Field label="Axis Degree" value={form.axisDegree} onChange={(v) => setValue("axisDegree", v)} />
        <Field label="VA" value={form.va} onChange={(v) => setValue("va", v)} />
        <Field label="BCVA" value={form.bcva} onChange={(v) => setValue("bcva", v)} />
        <Field label="Note" value={form.note} onChange={(v) => setValue("note", v)} />

        <div style={serStyle}>SER Preview: {ser}</div>

        <button style={buttonStyle}>Save Refraction</button>
      </form>

      <h2 style={{ marginTop: 32 }}>Existing Refractions</h2>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {rows.map((r) => (
          <div key={r.refractionId || r.id} style={rowStyle}>
            <strong>{r.eyeSide}</strong>
            <span>{r.measurementType}</span>
            <span>SPH: {r.sph ?? "-"}</span>
            <span>CYL: {r.cyl ?? "-"}</span>
            <span>Axis: {r.axisDegree ?? "-"}</span>
            <span>SER: {r.ser ?? calculateSer(r.sph, r.cyl)}</span>
          </div>
        ))}

        {!rows.length && <div style={emptyStyle}>No refraction data found.</div>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label style={labelStyle}>
      {label}
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </label>
  );
}

function calculateSer(sph, cyl) {
  const s = Number(sph);
  const c = Number(cyl);
  if (Number.isNaN(s) && Number.isNaN(c)) return "-";
  return ((Number.isNaN(s) ? 0 : s) + (Number.isNaN(c) ? 0 : c) / 2).toFixed(2);
}

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value);
}

const titleStyle = { fontSize: 36, fontWeight: "bold", margin: 0 };
const descStyle = { marginTop: 8, color: "#64748b" };
const formStyle = {
  marginTop: 24,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};
const labelStyle = { display: "grid", gap: 8, fontWeight: 700 };
const inputStyle = { border: "1px solid #cbd5e1", borderRadius: 10, padding: "10px 12px" };
const buttonStyle = {
  gridColumn: "1 / -1",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 12,
  padding: "12px 18px",
  fontWeight: 700,
};
const alertStyle = { marginTop: 16, padding: 14, borderRadius: 12, background: "#eff6ff", color: "#1d4ed8", fontWeight: 700 };
const serStyle = { padding: 14, borderRadius: 12, background: "#f8fafc", fontWeight: 800 };
const rowStyle = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 14,
  display: "flex",
  gap: 16,
  flexWrap: "wrap",
};
const emptyStyle = { background: "white", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20, color: "#64748b" };
