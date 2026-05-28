import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createBiometricApi, getBiometricsApi } from "../api/measurement.api";

export default function Biometric() {
  const { visitId } = useParams();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    eyeSide: "OD",
    axialLengthMm: "",
    k1: "",
    k2: "",
    kmax: "",
    pachymetryUm: "",
    pupilSizeMm: "",
    tbutSeconds: "",
    iopMmhg: "",
    cornealRadiusMm: "",
    alCrRatio: "",
    deviceName: "",
    note: "",
  });

  useEffect(() => {
    loadBiometrics();
  }, [visitId]);

  async function loadBiometrics() {
    try {
      const res = await getBiometricsApi(visitId);
      const data = res.data ?? res;
      if (Array.isArray(data)) setItems(data);
      else if (Array.isArray(data.items)) setItems(data.items);
      else setItems([]);
    } catch (error) {
      console.error(error);
      setItems([]);
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
      axialLengthMm: Number(form.axialLengthMm) || null,
      k1: Number(form.k1) || null,
      k2: Number(form.k2) || null,
      kmax: Number(form.kmax) || null,
      pachymetryUm: Number(form.pachymetryUm) || null,
      pupilSizeMm: Number(form.pupilSizeMm) || null,
      tbutSeconds: Number(form.tbutSeconds) || null,
      iopMmhg: Number(form.iopMmhg) || null,
      cornealRadiusMm: Number(form.cornealRadiusMm) || null,
      alCrRatio: Number(form.alCrRatio) || null,
    };

    try {
      await createBiometricApi(visitId, payload);
      setMessage("Saved successfully");
      await loadBiometrics();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Save failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <Link to={`/visits/${visitId}`} className="text-blue-600">
          Back to visit
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Biometric</h1>
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

          <Input label="Axial Length mm" value={form.axialLengthMm} onChange={(v) => updateField("axialLengthMm", v)} />
          <Input label="K1" value={form.k1} onChange={(v) => updateField("k1", v)} />
          <Input label="K2" value={form.k2} onChange={(v) => updateField("k2", v)} />
          <Input label="Kmax" value={form.kmax} onChange={(v) => updateField("kmax", v)} />
          <Input label="Pachymetry um" value={form.pachymetryUm} onChange={(v) => updateField("pachymetryUm", v)} />
          <Input label="Pupil size mm" value={form.pupilSizeMm} onChange={(v) => updateField("pupilSizeMm", v)} />
          <Input label="TBUT seconds" value={form.tbutSeconds} onChange={(v) => updateField("tbutSeconds", v)} />
          <Input label="IOP mmHg" value={form.iopMmhg} onChange={(v) => updateField("iopMmhg", v)} />
          <Input label="Corneal radius mm" value={form.cornealRadiusMm} onChange={(v) => updateField("cornealRadiusMm", v)} />
          <Input label="AL/CR ratio" value={form.alCrRatio} onChange={(v) => updateField("alCrRatio", v)} />
          <Input label="Device name" value={form.deviceName} onChange={(v) => updateField("deviceName", v)} />
        </div>

        {message && <p className="mt-5 rounded-xl bg-slate-100 p-3">{message}</p>}

        <button className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">
          Save Biometric
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Eye</th>
              <th className="px-4 py-3 text-left">AL</th>
              <th className="px-4 py-3 text-left">K1</th>
              <th className="px-4 py-3 text-left">K2</th>
              <th className="px-4 py-3 text-left">IOP</th>
              <th className="px-4 py-3 text-left">Device</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center">No data</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.biometricId || item.id} className="border-t">
                  <td className="px-4 py-3">{item.eyeSide}</td>
                  <td className="px-4 py-3">{item.axialLengthMm}</td>
                  <td className="px-4 py-3">{item.k1}</td>
                  <td className="px-4 py-3">{item.k2}</td>
                  <td className="px-4 py-3">{item.iopMmhg}</td>
                  <td className="px-4 py-3">{item.deviceName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      />
    </label>
  );
}
