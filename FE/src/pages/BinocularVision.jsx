import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createBinocularVisionApi,
  getBinocularVisionApi,
  updateBinocularVisionApi,
} from "../api/measurement.api";

import {
  Page,
  Card,
  Field,
  TextArea,
  Button,
  Notice,
  StatusBadge,
} from "../components/ui/AppUI";

export default function BinocularVision() {
  const { visitId } = useParams();

  const [binocularId, setBinocularId] = useState(null);
  const [message, setMessage] = useState("Đang tải dữ liệu thị giác hai mắt...");

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
      const raw = res.data?.data || res.data || res;

      if (raw) {
        setBinocularId(raw.binocularId || raw.id || null);
        setForm((prev) => ({ ...prev, ...raw }));
        setMessage("");
      }
    } catch {
      setBinocularId(null);
      setMessage("Chưa có dữ liệu thị giác hai mắt cho lượt khám này.");
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
        setMessage("Đã cập nhật dữ liệu thị giác hai mắt.");
      } else {
        await createBinocularVisionApi(visitId, payload);
        setMessage("Đã tạo dữ liệu thị giác hai mắt.");
      }

      await loadBinocular();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Lưu dữ liệu thất bại.");
    }
  }

  return (
    <Page
      title="Binocular Vision"
      sub={`Nhập dữ liệu thị giác hai mắt cho lượt khám #${visitId}.`}
      actions={
        <>
          <Link className="btn ghost" to={`/visits/${visitId}`}>
            Quay lại Visit
          </Link>

          <StatusBadge>
            {binocularId ? "Đã có dữ liệu" : "Chưa có dữ liệu"}
          </StatusBadge>
        </>
      }
    >
      <Notice
        type={
          message.includes("thất bại")
            ? "error"
            : message.includes("Đã")
            ? "ok"
            : "info"
        }
      >
        {message}
      </Notice>

      <form onSubmit={handleSubmit}>
        <Card title="Điều tiết và đáp ứng điều tiết">
          <div className="form">
            <Field
              label="AA OD"
              value={form.aaOd}
              onChange={(v) => updateField("aaOd", v)}
            />

            <Field
              label="AA OS"
              value={form.aaOs}
              onChange={(v) => updateField("aaOs", v)}
            />

            <Field
              label="MEM OD"
              value={form.memOd}
              onChange={(v) => updateField("memOd", v)}
            />

            <Field
              label="MEM OS"
              value={form.memOs}
              onChange={(v) => updateField("memOs", v)}
            />

            <Field
              label="Facility OD"
              value={form.facilityOd}
              onChange={(v) => updateField("facilityOd", v)}
            />

            <Field
              label="Facility OS"
              value={form.facilityOs}
              onChange={(v) => updateField("facilityOs", v)}
            />
          </div>
        </Card>

        <Card title="Cover Test và hội tụ">
          <div className="form">
            <Field
              label="Cover test distance"
              value={form.coverTestDistance}
              onChange={(v) => updateField("coverTestDistance", v)}
            />

            <Field
              label="Cover test near"
              value={form.coverTestNear}
              onChange={(v) => updateField("coverTestNear", v)}
            />

            <Field
              label="AC/A ratio"
              value={form.acARatio}
              onChange={(v) => updateField("acARatio", v)}
            />

            <Field
              label="NPC cm"
              value={form.npcCm}
              onChange={(v) => updateField("npcCm", v)}
            />
          </div>
        </Card>

        <Card title="Ghi chú chuyên môn">
          <TextArea
            label="Ghi chú"
            value={form.note}
            onChange={(v) => updateField("note", v)}
          />

          <div className="actions" style={{ marginTop: 20 }}>
            <Button type="submit">
              Lưu Binocular Vision
            </Button>

            <Button
              variant="ghost"
              onClick={() =>
                setForm({
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
                })
              }
            >
              Làm mới form
            </Button>
          </div>
        </Card>
      </form>
    </Page>
  );
}