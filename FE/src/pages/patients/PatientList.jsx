import { useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { patientApi } from "../../api/patients.api";

import {
  Page,
  Card,
  Field,
  Button,
  Table,
  Notice,
  StatusBadge,
} from "../../components/ui/AppUI";

export default function PatientList() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [notice, setNotice] = useState(
    "Đang tải danh sách bệnh nhi..."
  );

  async function loadPatients() {
    try {
      const res = await patientApi.getAll();

      const data = res.data?.data || res.data;

      setPatients(data.items || data || []);
      setNotice("");
    } catch (error) {
      console.error(error);
      setPatients([]);
      setNotice("Không tải được dữ liệu bệnh nhi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const q = keyword.toLowerCase();

    return patients.filter(
      (p) =>
        (p.fullName || "").toLowerCase().includes(q) ||
        (p.patientCode || "").toLowerCase().includes(q)
    );
  }, [patients, keyword]);

  const columns = [
    {
      key: "patientCode",
      label: "Mã bệnh nhi",
      render: (row) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: "var(--brand-soft)",
              display: "grid",
              placeItems: "center",
              color: "var(--brand-dark)",
            }}
          >
            <Users size={18} />
          </div>

          <div>
            <b>{row.patientCode || "-"}</b>

            <div className="hint">
              {row.hospitalPatientCode || "MYOVISION ID"}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "fullName",
      label: "Họ tên",
      render: (row) => (
        <div>
          <div>{row.fullName || "-"}</div>

          <div className="hint">
            {row.gender || "-"}
          </div>
        </div>
      ),
    },

    {
      key: "dateOfBirth",
      label: "Ngày sinh",
      render: (row) => row.dateOfBirth || "-",
    },

    {
      key: "schoolName",
      label: "Trường học",
      render: (row) => row.schoolName || "-",
    },

    {
      key: "status",
      label: "Trạng thái",
      render: (row) => (
        <StatusBadge>
          {row.status || "ACTIVE"}
        </StatusBadge>
      ),
    },

    {
      key: "action",
      label: "Chi tiết",
      render: (row) => (
        <Button
          variant="ghost"
          onClick={() =>
            navigate(`/patients/${row.patientId}`)
          }
        >
          Xem hồ sơ
        </Button>
      ),
    },
  ];

  return (
    <Page
      title="Danh sách bệnh nhi"
      sub="Quản lý hồ sơ bệnh nhi MYOVISION ID."
      actions={
        <Button>
          + Thêm bệnh nhi
        </Button>
      }
    >
      <Notice
        type={
          notice.includes("Không")
            ? "error"
            : "info"
        }
      >
        {notice}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">
            Tổng bệnh nhi
          </span>

          <strong className="metric">
            {patients.length}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Đang hoạt động
          </span>

          <strong className="metric">
            {
              patients.filter(
                (x) =>
                  (x.status || "").toUpperCase() ===
                  "ACTIVE"
              ).length
            }
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Đang hiển thị
          </span>

          <strong className="metric">
            {filteredPatients.length}
          </strong>
        </Card>
      </div>

      <Card title="Tìm kiếm bệnh nhi">
        <div className="form inline">
          <Field
            label="Tìm kiếm"
            value={keyword}
            onChange={setKeyword}
          />

          <div className="actions">
            <Button
              variant="ghost"
              onClick={() => setKeyword("")}
            >
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