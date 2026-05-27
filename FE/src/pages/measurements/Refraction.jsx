import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { measurementApi } from "../../api/measurement.api";

export default function Refraction() {
  const { visitId } = useParams();

  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    eyeSide: "OD",
    measurementType: "AUTO_REFRACTION",
    sph: "",
    cyl: "",
    axisDegree: "",
    va: "",
    bcva: "",
    note: "",
  });

  async function loadData() {
    try {
      const res = await measurementApi.getRefractions(visitId);
      const data = res.data?.data || res.data;
      setItems(data.items || data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadData();
  }, [visitId]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      await measurementApi.createRefraction(visitId, form);
      setMessage("Đã lưu dữ liệu khúc xạ.");
      setForm({
        eyeSide: "OD",
        measurementType: "AUTO_REFRACTION",
        sph: "",
        cyl: "",
        axisDegree: "",
        va: "",
        bcva: "",
        note: "",
      });
      loadData();
    } catch (error) {
      console.error(error);
      setMessage("Lưu thất bại. Kiểm tra axis 0-180 hoặc dữ liệu nhập.");
    }
  }

  return (
    <div>
      <h1 className="dd-page-title">Refraction</h1>
      <p className="dd-page-subtitle">
        Nhập dữ liệu khúc xạ mắt phải/trái cho visit #{visitId}
      </p>

      {message && (
        <div className="dd-card" style={{ marginBottom: 18, fontWeight: 800 }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="dd-card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, color: "var(--dd-primary-dark)" }}>
          Thêm dữ liệu khúc xạ
        </h2>

        <div className="dd-form-grid">
          <label>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Mắt</div>
            <select className="dd-input" value={form.eyeSide} onChange={(e) => updateField("eyeSide", e.target.value)}>
              <option value="OD">OD - Mắt phải</option>
              <option value="OS">OS - Mắt trái</option>
            </select>
          </label>

          <label>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Loại đo</div>
            <select className="dd-input" value={form.measurementType} onChange={(e) => updateField("measurementType", e.target.value)}>
              <option value="AUTO_REFRACTION">Auto Refraction</option>
              <option value="CYCLOPLEGIC">Sau liệt điều tiết</option>
              <option value="RETINOSCOPY">Soi bóng đồng tử</option>
              <option value="SUBJECTIVE">Chủ quan</option>
            </select>
          </label>

          <Field label="SPH" value={form.sph} onChange={(v) => updateField("sph", v)} />
          <Field label="CYL" value={form.cyl} onChange={(v) => updateField("cyl", v)} />
          <Field label="Axis 0-180" value={form.axisDegree} onChange={(v) => updateField("axisDegree", v)} />
          <Field label="VA" value={form.va} onChange={(v) => updateField("va", v)} />
          <Field label="BCVA" value={form.bcva} onChange={(v) => updateField("bcva", v)} />
          <Field label="Ghi chú" value={form.note} onChange={(v) => updateField("note", v)} />
        </div>

        <button className="dd-btn dd-btn-primary">Lưu Refraction</button>
      </form>

      <div className="dd-card">
        <h2 style={{ marginTop: 0, color: "var(--dd-primary-dark)" }}>
          Dữ liệu đã nhập
        </h2>

        <table className="dd-table">
          <thead>
            <tr>
              <th>Mắt</th>
              <th>Loại đo</th>
              <th>SPH</th>
              <th>CYL</th>
              <th>Axis</th>
              <th>VA</th>
              <th>BCVA</th>
              <th>SER</th>
            </tr>
          </thead>

          <tbody>
            {items.map((x) => (
              <tr key={x.refractionId}>
                <td>{x.eyeSide}</td>
                <td>{x.measurementType}</td>
                <td>{x.sph}</td>
                <td>{x.cyl}</td>
                <td>{x.axisDegree}</td>
                <td>{x.va}</td>
                <td>{x.bcva}</td>
                <td><strong>{x.ser}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>{label}</div>
      <input className="dd-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
