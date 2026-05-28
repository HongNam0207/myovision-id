import { useEffect, useMemo, useState } from "react";
import { userApi } from "../../api/users.api";
import {
  Page,
  Card,
  Table,
  Notice,
  StatusBadge,
  Field,
  Button,
} from "../../components/ui/AppUI";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [notice, setNotice] = useState("Đang tải danh sách người dùng...");

  useEffect(() => {
    userApi
      .getAll()
      .then((res) => {
        const data = res.data?.data?.items || res.data?.data || [];
        setUsers(data);
        setNotice("");
      })
      .catch(() => {
        setUsers([]);
        setNotice("Không tải được dữ liệu người dùng.");
      });
  }, []);

  const filteredUsers = useMemo(() => {
    const q = keyword.toLowerCase();

    return users.filter(
      (u) =>
        (u.username || "").toLowerCase().includes(q) ||
        (u.fullName || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
    );
  }, [users, keyword]);

  const columns = [
    {
      key: "username",
      label: "Tài khoản",
      render: (row) => (
        <div>
          <b>{row.username || "-"}</b>
          <div className="hint">{row.email || "-"}</div>
        </div>
      ),
    },
    {
      key: "fullName",
      label: "Người dùng",
      render: (row) => (
        <div>
          <div>{row.fullName || "-"}</div>
          <div className="hint">{row.phone || "-"}</div>
        </div>
      ),
    },
    {
      key: "gender",
      label: "Giới tính",
      render: (row) => row.gender || "-",
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (row) => (
        <StatusBadge>
          {(row.status || "ACTIVE").toUpperCase()}
        </StatusBadge>
      ),
    },
  ];

  return (
    <Page
      title="Quản lý người dùng"
      sub="Quản lý tài khoản bác sĩ, điều dưỡng, khúc xạ, phụ huynh và quản trị viên."
      actions={
        <Button>
          + Tạo người dùng
        </Button>
      }
    >
      <Notice type={notice.includes("Không") ? "error" : "info"}>
        {notice}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">Tổng người dùng</span>
          <strong className="metric">{users.length}</strong>
        </Card>

        <Card>
          <span className="metricLabel">Đang hoạt động</span>
          <strong className="metric">
            {
              users.filter(
                (u) => (u.status || "").toUpperCase() === "ACTIVE"
              ).length
            }
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">Ngừng hoạt động</span>
          <strong className="metric">
            {
              users.filter(
                (u) => (u.status || "").toUpperCase() !== "ACTIVE"
              ).length
            }
          </strong>
        </Card>
      </div>

      <Card title="Danh sách người dùng">
        <div className="form inline" style={{ marginBottom: 16 }}>
          <Field
            label="Tìm kiếm"
            value={keyword}
            onChange={setKeyword}
          />

          <div className="actions">
            <Button variant="ghost">
              Làm mới
            </Button>
          </div>
        </div>

        <Table
          rows={filteredUsers}
          columns={columns}
          empty="Chưa có dữ liệu người dùng."
        />
      </Card>
    </Page>
  );
}