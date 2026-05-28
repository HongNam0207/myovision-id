import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createRefractionApi, getRefractionsApi } from "../api/measurement.api";

export default function Refraction() {
  const { visitId } = useParams();
  const [refractions, setRefractions] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    eyeSide: "OD",
    measurementType: "AUTO",
    sph: "",
    cyl: "",
    axisDegree: "",
    va: "",
    bcva: "",
    note: "",
  });

  useEffect(() => {
    loadRefractions();
  }, [visitId]);

  async function loadRefractions() {
    try {
      const res = await getRefractionsApi(visitId);
      const data = res.data ?? res;

      if (Array.isArray(data)) setRefractions(data);
      else if (Array.isArray(data.items)) setRefractions(data.items);
      else setRefractions([]);
    } catch (error) {
      console.error(error);
      setRefractions([]);
    }
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const payload = {
      ...form,
      sph: Number(form.sph) || null,
      cyl: Number(form.cyl) || null,
      axisDegree: Number(form.axisDegree) || null,
    };

    try {
      await createRefractionApi(visitId, payload);
      setMessage("Saved successfully");
      setForm({
        eyeSide: "OD",
        measurementType: "AUTO",
        sph: "",
        cyl: "",
        axisDegree: "",
        va: "",
        bcva: "",
        note: "",
      });
      await loadRefractions();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Save failed");
    }
  }

  const ser =
    form.sph !== "" || form.cyl !== ""
      ? (Number(form.sph || 0) + Number(form.cyl || 0) / 2).toFixed(2)
      : "";

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <Link to={`/visits/${visitId}`} className="text-blue-600">
          Back to visit
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Refraction</h1>
        <p className="text-slate-500">Visit ID: {visitId}</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 rounded-2xl bg-white p-6 shadow">
        <div className="grid gap-4 md:grid-cols-3">
          <label>
            <span className="text-sm font-medium">Eye side</span>
            <select
              value={form.eyeSide}
              onChange={(e) => updateField("eyeSide", e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-3"
            >
              <option value="OD">OD</option>
              <option value="OS">OS</option>
            </select>
          </label>

          <Input label="Measurement type" value={form.measurementType} onChange={(v) => updateField("measurementType", v)} />
          <Input label="SPH" value={form.sph} onChange={(v) => updateField("sph", v)} />
          <Input label="CYL" value={form.cyl} onChange={(v) => updateField("cyl", v)} />
          <Input label="Axis degree" value={form.axisDegree} onChange={(v) => updateField("axisDegree", v)} />
          <Input label="VA" value={form.va} onChange={(v) => updateField("va", v)} />
          <Input label="BCVA" value={form.bcva} onChange={(v) => updateField("bcva", v)} />
          <Input label="SER preview" value={ser} onChange={() => {}} disabled />
          <Input label="Note" value={form.note} onChange={(v) => updateField("note", v)} />
        </div>

        {message && <p className="mt-5 rounded-xl bg-slate-100 p-3">{message}</p>}

        <button className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">
          Save Refraction
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Eye</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">SPH</th>
              <th className="px-4 py-3 text-left">CYL</th>
              <th className="px-4 py-3 text-left">Axis</th>
              <th className="px-4 py-3 text-left">SER</th>
            </tr>
          </thead>
          <tbody>
            {refractions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center">
                  No data
                </td>
              </tr>
            ) : (
              refractions.map((item) => (
                <tr key={item.refractionId || item.id} className="border-t">
                  <td className="px-4 py-3">{item.eyeSide}</td>
                  <td className="px-4 py-3">{item.measurementType}</td>
                  <td className="px-4 py-3">{item.sph}</td>
                  <td className="px-4 py-3">{item.cyl}</td>
                  <td className="px-4 py-3">{item.axisDegree}</td>
                  <td className="px-4 py-3">{item.ser}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, disabled }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        disabled={disabled}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 disabled:bg-slate-100"
      />
    </label>
  );
}
