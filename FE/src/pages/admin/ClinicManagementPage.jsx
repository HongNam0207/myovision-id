import { useEffect, useState } from "react";
import { clinicApi } from "../../api/clinics.api";
import { Page, Card, Table, StatusBadge, Notice } from "../../components/ui/AppUI";

export default function ClinicManagementPage() {
  const [clinics, setClinics] = useState([]);
  const [notice, setNotice] = useState("Đang tải danh sách phòng khám...");

  useEffect(() => {
    clinicApi
      .getAll()
      .then((res) => {
        const data = res.data?.data?.items || res.data?.data || [];
        setClinics(data);
        setNotice("");
      })
      .catch(() => {
        setClinics([]);
        setNotice("Không tải được dữ liệu phòng khám.");
      });
  }, []);

  const columns = [
    {
      key: "clinicName",
      label: "Tên phòng khám",
      render: (row) => (
        <div>
          <b>{row.clinicName || "-"}</b>
          <div className="hint">{row.clinicCode || "-"}</div>
        </div>
      ),
    },
    {
      key: "address",
      label: "Địa chỉ",
      render: (row) => row.address || "-",
    },
    {
      key: "contact",
      label: "Liên hệ",
      render: (row) => (
        <div>
          <div>{row.phone || "-"}</div>
          <div className="hint">{row.email || "-"}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (row) => (
        <StatusBadge>{row.isActive === false ? "Ngừng hoạt động" : "Đang hoạt động"}</StatusBadge>
      ),
    },
  ];

  return (
    <Page
      title="Quản lý phòng khám"
      sub="Quản lý phòng khám, chi nhánh và thông tin liên hệ trong hệ thống MYOVISION ID."
    >
      <Notice type={notice.includes("Không") ? "error" : "info"}>{notice}</Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">Tổng số phòng khám</span>
          <strong className="metric">{clinics.length}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Đang hoạt động</span>
          <strong className="metric">
            {clinics.filter((x) => x.isActive !== false).length}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">Ngừng hoạt động</span>
          <strong className="metric">
            {clinics.filter((x) => x.isActive === false).length}
          </strong>
        </Card>
      </div>

      <Card title="Danh sách phòng khám">
        <Table
          rows={clinics}
          columns={columns}
          empty="Chưa có dữ liệu phòng khám."
        />
      </Card>
    </Page>
  );
}