import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createBinocularVisionApi,
  getBinocularVisionApi,
  updateBinocularVisionApi,
} from "../api/measurement.api";

export default function BinocularVision() {
  const { visitId } = useParams();
  const [binocularId, setBinocularId] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    aaOd: "",
    aaOs: "",
    memOd: "",
    memOs: "",
    facilityOd: "",
    facilityOs: "",
    coverTestDistance: "",
    coverTestNear: "",
    acARatio: "",
    npcCm: "",
    note: "",
  });

  useEffect(() => {
    loadBinocular();
  }, [visitId]);

  async function loadBinocular() {
    try {
      const res = await getBinocularVisionApi(visitId);
      const data = res.data ?? res;

      if (data) {
        setBinocularId(data.binocularId || data.id || null);
        setForm((prev) => ({ ...prev, ...data }));
      }
    } catch {
      setBinocularId(null);
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
      aaOd: Number(form.aaOd) || null,
      aaOs: Number(form.aaOs) || null,
      memOd: Number(form.memOd) || null,
      memOs: Number(form.memOs) || null,
      facilityOd: Number(form.facilityOd) || null,
      facilityOs: Number(form.facilityOs) || null,
      acARatio: Number(form.acARatio) || null,
      npcCm: Number(form.npcCm) || null,
    };

    try {
      if (binocularId) {
        await updateBinocularVisionApi(binocularId, payload);
      } else {
        await createBinocularVisionApi(visitId, payload);
      }

      setMessage("Saved successfully");
      await loadBinocular();
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
        <h1 className="mt-3 text-3xl font-bold">Binocular Vision</h1>
        <p className="text-slate-500">Visit ID: {visitId}</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="AA OD" value={form.aaOd} onChange={(v) => updateField("aaOd", v)} />
          <Input label="AA OS" value={form.aaOs} onChange={(v) => updateField("aaOs", v)} />
          <Input label="MEM OD" value={form.memOd} onChange={(v) => updateField("memOd", v)} />
          <Input label="MEM OS" value={form.memOs} onChange={(v) => updateField("memOs", v)} />
          <Input label="Facility OD" value={form.facilityOd} onChange={(v) => updateField("facilityOd", v)} />
          <Input label="Facility OS" value={form.facilityOs} onChange={(v) => updateField("facilityOs", v)} />
          <Input label="Cover test distance" value={form.coverTestDistance} onChange={(v) => updateField("coverTestDistance", v)} />
          <Input label="Cover test near" value={form.coverTestNear} onChange={(v) => updateField("coverTestNear", v)} />
          <Input label="AC/A ratio" value={form.acARatio} onChange={(v) => updateField("acARatio", v)} />
          <Input label="NPC cm" value={form.npcCm} onChange={(v) => updateField("npcCm", v)} />
        </div>

        <div className="mt-4">
          <Textarea label="Note" value={form.note} onChange={(v) => updateField("note", v)} />
        </div>

        {message && <p className="mt-5 rounded-xl bg-slate-100 p-3">{message}</p>}

        <button className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">
          Save Binocular Vision
        </button>
      </form>
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

function Textarea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 min-h-32 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      />
    </label>
  );
}
