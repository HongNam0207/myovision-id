import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { patientApi } from "../api/patients.api";

import {
  Page,
  Card,
  Field,
  Button,
  Table,
  Notice,
  StatusBadge,
} from "../components/ui/AppUI";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("Đang tải danh sách bệnh nhi...");

  useEffect(() => {
    patientApi
      .getAll()
      .then((res) => {
        const data = res.data?.data?.items || res.data?.data || [];
        setPatients(data);
        setMessage("");
      })
      .catch(() => {
        setPatients([]);
        setMessage("Không tải được dữ liệu bệnh nhi.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPatients = useMemo(() => {
    const q = keyword.toLowerCase();

    return patients.filter(
      (patient) =>
        (patient.patientCode || "").toLowerCase().includes(q) ||
        (patient.fullName || "").toLowerCase().includes(q) ||
        (patient.clinicName || patient.clinic?.clinicName || "")
          .toLowerCase()
          .includes(q)
    );
  }, [patients, keyword]);

  const columns = [
    {
      key: "patientCode",
      label: "Mã bệnh nhi",
      render: (row) => (
        <div>
          <b>{row.patientCode || "-"}</b>
          <div className="hint">{row.hospitalPatientCode || "MYOVISION ID"}</div>
        </div>
      ),
    },
    {
      key: "fullName",
      label: "Họ tên",
      render: (row) => row.fullName || "-",
    },
    {
      key: "gender",
      label: "Giới tính",
      render: (row) => row.gender || "-",
    },
    {
      key: "clinic",
      label: "Clinic",
      render: (row) => row.clinicName || row.clinic?.clinicName || "-",
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (row) => <StatusBadge>{row.status || "ACTIVE"}</StatusBadge>,
    },
    {
      key: "action",
      label: "Chi tiết",
      render: (row) => (
        <Link className="btn ghost" to={`/patients/${row.patientId || row.id}`}>
          Xem hồ sơ
        </Link>
      ),
    },
  ];

  return (
    <Page
      title="Patient List"
      sub="Quản lý hồ sơ bệnh nhi và theo dõi dữ liệu lâm sàng."
      actions={<Button>Create Patient</Button>}
    >
      <Notice type={message.includes("Không") ? "error" : "info"}>
        {message}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">Tổng bệnh nhi</span>
          <strong className="metric">{patients.length}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Đang hoạt động</span>
          <strong className="metric">
            {patients.filter((x) => (x.status || "").toUpperCase() === "ACTIVE").length}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">Đang hiển thị</span>
          <strong className="metric">{filteredPatients.length}</strong>
        </Card>
      </div>

      <Card title="Tìm kiếm bệnh nhi">
        <div className="form inline">
          <Field label="Tìm kiếm" value={keyword} onChange={setKeyword} />

          <div className="actions">
            <Button variant="ghost" onClick={() => setKeyword("")}>
              Làm mới
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Danh sách hồ sơ">
        {loading ? (
          <Notice>Đang tải dữ liệu...</Notice>
        ) : (
          <Table
            rows={filteredPatients}
            columns={columns}
            empty="Chưa có dữ liệu bệnh nhi."
          />
        )}
      </Card>
    </Page>
  );
}