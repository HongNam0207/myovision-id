import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { measurementApi } from "../api/measurement.api";

import {
  Page,
  Card,
  Field,
  Button,
  Notice,
  Table,
  StatusBadge,
} from "../components/ui/AppUI";

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
  const [message, setMessage] = useState("Đang tải dữ liệu khúc xạ...");

  useEffect(() => {
    loadData();
  }, [visitId]);

  function loadData() {
    measurementApi
      .getRefractions(visitId)
      .then((res) => {
        setRows(res.data?.data?.items || res.data?.data || []);
        setMessage("");
      })
      .catch(() => {
        setRows([]);
        setMessage("Không tải được dữ liệu khúc xạ.");
      });
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

    if (
      payload.axisDegree !== null &&
      (payload.axisDegree < 0 || payload.axisDegree > 180)
    ) {
      setMessage("Axis phải nằm trong khoảng 0 đến 180.");
      return;
    }

    try {
      await measurementApi.createRefraction(visitId, payload);

      setForm(emptyRow);
      setMessage("Đã lưu dữ liệu khúc xạ.");
      loadData();
    } catch {
      setMessage("Lưu thất bại. Vui lòng kiểm tra API hoặc dữ liệu nhập.");
    }
  }

  const ser = calculateSer(form.sph, form.cyl);

  const columns = [
    {
      key: "eyeSide",
      label: "Mắt",
      render: (row) => <StatusBadge>{row.eyeSide || "-"}</StatusBadge>,
    },
    {
      key: "measurementType",
      label: "Loại đo",
      render: (row) => row.measurementType || "-",
    },
    {
      key: "sph",
      label: "SPH",
      render: (row) => row.sph ?? "-",
    },
    {
      key: "cyl",
      label: "CYL",
      render: (row) => row.cyl ?? "-",
    },
    {
      key: "axisDegree",
      label: "Axis",
      render: (row) => row.axisDegree ?? "-",
    },
    {
      key: "va",
      label: "VA",
      render: (row) => row.va || "-",
    },
    {
      key: "bcva",
      label: "BCVA",
      render: (row) => row.bcva || "-",
    },
    {
      key: "ser",
      label: "SER",
      render: (row) => <b>{row.ser ?? calculateSer(row.sph, row.cyl)}</b>,
    },
  ];

  return (
    <Page
      title="Refraction"
      sub={`Nhập dữ liệu khúc xạ OD/OS cho lượt khám #${visitId}.`}
      actions={<StatusBadge>OPTOMETRIST</StatusBadge>}
    >
      <Notice
        type={
          message.includes("Không") || message.includes("thất bại") || message.includes("Axis")
            ? "error"
            : message.includes("Đã")
            ? "ok"
            : "info"
        }
      >
        {message}
      </Notice>

      <form onSubmit={handleSubmit}>
        <Card title="Thêm dữ liệu khúc xạ">
          <div className="form">
            <Field
              label="Mắt"
              value={form.eyeSide}
              onChange={(v) => setValue("eyeSide", v)}
              options={["OD", "OS"]}
            />

            <Field
              label="Loại đo"
              value={form.measurementType}
              onChange={(v) => setValue("measurementType", v)}
              options={[
                "AUTO_REFRACTION",
                "SUBJECTIVE",
                "CYCLOPLEGIC",
                "RETINOSCOPY",
              ]}
            />

            <Field
              label="SPH"
              value={form.sph}
              onChange={(v) => setValue("sph", v)}
            />

            <Field
              label="CYL"
              value={form.cyl}
              onChange={(v) => setValue("cyl", v)}
            />

            <Field
              label="Axis Degree"
              value={form.axisDegree}
              onChange={(v) => setValue("axisDegree", v)}
            />

            <Field
              label="VA"
              value={form.va}
              onChange={(v) => setValue("va", v)}
            />

            <Field
              label="BCVA"
              value={form.bcva}
              onChange={(v) => setValue("bcva", v)}
            />

            <Field
              label="Ghi chú"
              value={form.note}
              onChange={(v) => setValue("note", v)}
            />
          </div>

          <div className="notice" style={{ marginTop: 18 }}>
            SER Preview: <b>{ser}</b>
          </div>

          <div className="actions" style={{ marginTop: 20 }}>
            <Button type="submit">Lưu Refraction</Button>

            <Button variant="ghost" onClick={() => setForm(emptyRow)}>
              Làm mới form
            </Button>
          </div>
        </Card>
      </form>

      <Card title="Dữ liệu khúc xạ đã nhập">
        <Table
          rows={rows}
          columns={columns}
          empty="Chưa có dữ liệu khúc xạ."
        />
      </Card>
    </Page>
  );
}

function calculateSer(sph, cyl) {
  const s = Number(sph);
  const c = Number(cyl);

  if (Number.isNaN(s) && Number.isNaN(c)) return "-";

  return (
    (Number.isNaN(s) ? 0 : s) +
    (Number.isNaN(c) ? 0 : c) / 2
  ).toFixed(2);
}

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value);
}