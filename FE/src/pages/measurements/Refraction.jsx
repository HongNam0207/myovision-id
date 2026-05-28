import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { measurementApi } from "../../api/measurement.api";
import {
  Page,
  Card,
  Field,
  Button,
  Notice,
  Table,
  StatusBadge,
} from "../../components/ui/AppUI";

export default function Refraction() {
  const { visitId } = useParams();

  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("Đang tải dữ liệu khúc xạ...");

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
      setMessage("");
    } catch (error) {
      console.error(error);
      setItems([]);
      setMessage("Không tải được dữ liệu khúc xạ.");
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
      setMessage("Lưu thất bại. Vui lòng kiểm tra axis 0-180 hoặc dữ liệu nhập.");
    }
  }

  const columns = [
    {
      key: "eyeSide",
      label: "Mắt",
      render: (row) => (
        <StatusBadge>
          {row.eyeSide || "-"}
        </StatusBadge>
      ),
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
      render: (row) => <b>{row.ser ?? "-"}</b>,
    },
  ];

  return (
    <Page
      title="Refraction"
      sub={`Nhập dữ liệu khúc xạ mắt phải/trái cho lượt khám #${visitId}.`}
      actions={
        <StatusBadge>
          OPTOMETRIST
        </StatusBadge>
      }
    >
      <Notice
        type={
          message.includes("thất bại") || message.includes("Không")
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
              onChange={(v) => updateField("eyeSide", v)}
              options={["OD", "OS"]}
            />

            <Field
              label="Loại đo"
              value={form.measurementType}
              onChange={(v) => updateField("measurementType", v)}
              options={[
                "AUTO_REFRACTION",
                "CYCLOPLEGIC",
                "RETINOSCOPY",
                "SUBJECTIVE",
              ]}
            />

            <Field
              label="SPH"
              value={form.sph}
              onChange={(v) => updateField("sph", v)}
            />

            <Field
              label="CYL"
              value={form.cyl}
              onChange={(v) => updateField("cyl", v)}
            />

            <Field
              label="Axis 0-180"
              value={form.axisDegree}
              onChange={(v) => updateField("axisDegree", v)}
            />

            <Field
              label="VA"
              value={form.va}
              onChange={(v) => updateField("va", v)}
            />

            <Field
              label="BCVA"
              value={form.bcva}
              onChange={(v) => updateField("bcva", v)}
            />

            <Field
              label="Ghi chú"
              value={form.note}
              onChange={(v) => updateField("note", v)}
            />
          </div>

          <div className="actions" style={{ marginTop: 20 }}>
            <Button type="submit">
              Lưu Refraction
            </Button>

            <Button
              variant="ghost"
              onClick={() =>
                setForm({
                  eyeSide: "OD",
                  measurementType: "AUTO_REFRACTION",
                  sph: "",
                  cyl: "",
                  axisDegree: "",
                  va: "",
                  bcva: "",
                  note: "",
                })
              }
            >
              Làm mới form
            </Button>
          </div>
        </Card>
      </form>

      <Card title="Dữ liệu khúc xạ đã nhập">
        <Table
          rows={items}
          columns={columns}
          empty="Chưa có dữ liệu khúc xạ."
        />
      </Card>
    </Page>
  );
}