import { useEffect, useState } from "react";
import { roleApi } from "../../api/roles.api";
import {
  Page,
  Card,
  Table,
  Notice,
  StatusBadge,
} from "../../components/ui/AppUI";

export default function RoleManagementPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [notice, setNotice] = useState("Đang tải role và permission...");

  useEffect(() => {
    Promise.all([
      roleApi.getAll(),
      roleApi.getPermissions(),
    ])
      .then(([rolesRes, permissionsRes]) => {
        setRoles(rolesRes.data?.data?.items || rolesRes.data?.data || []);
        setPermissions(
          permissionsRes.data?.data?.items ||
          permissionsRes.data?.data ||
          []
        );
        setNotice("");
      })
      .catch(() => {
        setRoles([]);
        setPermissions([]);
        setNotice("Không tải được dữ liệu phân quyền.");
      });
  }, []);

  const roleColumns = [
    {
      key: "roleCode",
      label: "Role Code",
      render: (row) => (
        <div>
          <b>{row.roleCode || "-"}</b>
          <div className="hint">{row.roleName || "-"}</div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Mô tả",
      render: (row) => row.description || "Không có mô tả",
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (row) => (
        <StatusBadge>
          {row.isActive === false ? "Inactive" : "Active"}
        </StatusBadge>
      ),
    },
  ];

  const permissionColumns = [
    {
      key: "permissionCode",
      label: "Permission Code",
      render: (row) => (
        <div>
          <b>{row.permissionCode || "-"}</b>
          <div className="hint">{row.permissionName || "-"}</div>
        </div>
      ),
    },
    {
      key: "moduleName",
      label: "Module",
      render: (row) => row.moduleName || "-",
    },
    {
      key: "description",
      label: "Mô tả",
      render: (row) => row.description || "-",
    },
  ];

  return (
    <Page
      title="Role & Permission Management"
      sub="Quản lý role, permission và phân quyền hệ thống MYOVISION ID."
    >
      <Notice type={notice.includes("Không") ? "error" : "info"}>
        {notice}
      </Notice>

      <div className="grid two">
        <Card title="Danh sách Role">
          <div className="grid cards" style={{ marginBottom: 16 }}>
            <Card>
              <span className="metricLabel">Tổng Role</span>
              <strong className="metric">{roles.length}</strong>
            </Card>

            <Card>
              <span className="metricLabel">Permissions</span>
              <strong className="metric">{permissions.length}</strong>
            </Card>
          </div>

          <Table
            rows={roles}
            columns={roleColumns}
            empty="Chưa có dữ liệu role."
          />
        </Card>

        <Card title="Danh sách Permission">
          <Table
            rows={permissions}
            columns={permissionColumns}
            empty="Chưa có dữ liệu permission."
          />
        </Card>
      </div>
    </Page>
  );
}