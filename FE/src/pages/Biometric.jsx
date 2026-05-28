import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createBiometricApi, getBiometricsApi } from "../api/measurement.api";

import {
  Page,
  Card,
  Field,
  Button,
  Notice,
  Table,
  StatusBadge,
} from "../components/ui/AppUI";

export default function Biometric() {
  const { visitId } = useParams();

  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("Đang tải dữ liệu sinh trắc học...");

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
      const raw = res.data?.data || res.data || res;

      if (Array.isArray(raw)) {
        setItems(raw);
      } else if (Array.isArray(raw.items)) {
        setItems(raw.items);
      } else {
        setItems([]);
      }

      setMessage("");
    } catch (error) {
      console.error(error);
      setItems([]);
      setMessage("Không tải được dữ liệu sinh trắc học.");
    }
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm({
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
      setMessage("Đã lưu dữ liệu sinh trắc học.");
      resetForm();
      await loadBiometrics();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Lưu dữ liệu thất bại.");
    }
  }

  const columns = [
    {
      key: "eyeSide",
      label: "Mắt",
      render: (row) => <StatusBadge>{row.eyeSide || "-"}</StatusBadge>,
    },
    {
      key: "axialLengthMm",
      label: "AL",
      render: (row) => row.axialLengthMm ?? "-",
    },
    {
      key: "k1",
      label: "K1",
      render: (row) => row.k1 ?? "-",
    },
    {
      key: "k2",
      label: "K2",
      render: (row) => row.k2 ?? "-",
    },
    {
      key: "iopMmhg",
      label: "IOP",
      render: (row) => row.iopMmhg ?? "-",
    },
    {
      key: "deviceName",
      label: "Thiết bị",
      render: (row) => row.deviceName || "-",
    },
  ];

  return (
    <Page
      title="Biometric"
      sub={`Nhập dữ liệu sinh trắc học mắt cho lượt khám #${visitId}.`}
      actions={
        <>
          <Link className="btn ghost" to={`/visits/${visitId}`}>
            Quay lại Visit
          </Link>

          <StatusBadge>OPTOMETRIST</StatusBadge>
        </>
      }
    >
      <Notice
        type={
          message.includes("Không") || message.includes("thất bại")
            ? "error"
            : message.includes("Đã")
            ? "ok"
            : "info"
        }
      >
        {message}
      </Notice>

      <form onSubmit={handleSubmit}>
        <Card title="Thêm dữ liệu sinh trắc học">
          <div className="form">
            <Field
              label="Mắt"
              value={form.eyeSide}
              onChange={(v) => updateField("eyeSide", v)}
              options={["OD", "OS"]}
            />

            <Field
              label="Axial Length (mm)"
              value={form.axialLengthMm}
              onChange={(v) => updateField("axialLengthMm", v)}
            />

            <Field
              label="K1"
              value={form.k1}
              onChange={(v) => updateField("k1", v)}
            />

            <Field
              label="K2"
              value={form.k2}
              onChange={(v) => updateField("k2", v)}
            />

            <Field
              label="Kmax"
              value={form.kmax}
              onChange={(v) => updateField("kmax", v)}
            />

            <Field
              label="Pachymetry (um)"
              value={form.pachymetryUm}
              onChange={(v) => updateField("pachymetryUm", v)}
            />

            <Field
              label="Pupil size (mm)"
              value={form.pupilSizeMm}
              onChange={(v) => updateField("pupilSizeMm", v)}
            />

            <Field
              label="TBUT (seconds)"
              value={form.tbutSeconds}
              onChange={(v) => updateField("tbutSeconds", v)}
            />

            <Field
              label="IOP (mmHg)"
              value={form.iopMmhg}
              onChange={(v) => updateField("iopMmhg", v)}
            />

            <Field
              label="Corneal radius (mm)"
              value={form.cornealRadiusMm}
              onChange={(v) => updateField("cornealRadiusMm", v)}
            />

            <Field
              label="AL/CR ratio"
              value={form.alCrRatio}
              onChange={(v) => updateField("alCrRatio", v)}
            />

            <Field
              label="Device name"
              value={form.deviceName}
              onChange={(v) => updateField("deviceName", v)}
            />
          </div>

          <div className="actions" style={{ marginTop: 20 }}>
            <Button type="submit">Lưu Biometric</Button>

            <Button variant="ghost" onClick={resetForm}>
              Làm mới form
            </Button>
          </div>
        </Card>
      </form>

      <Card title="Dữ liệu sinh trắc học đã nhập">
        <Table
          rows={items}
          columns={columns}
          empty="Chưa có dữ liệu sinh trắc học."
        />
      </Card>
    </Page>
  );
}