import { useEffect, useState } from "react";
import { roleApi } from "../../api/roles.api";

export default function RoleManagementPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    roleApi.getAll()
      .then((res) => setRoles(res.data?.data?.items || res.data?.data || []))
      .catch(() => setRoles([]));

    roleApi.getPermissions()
      .then((res) => setPermissions(res.data?.data?.items || res.data?.data || []))
      .catch(() => setPermissions([]));
  }, []);

  return (
    <div className="grid gap-6 p-6 lg:grid-cols-2">
      <section>
        <h1 className="text-2xl font-bold">Role Management</h1>
        <div className="mt-4 rounded-xl border bg-white p-4">
          {roles.map((r) => (
            <div key={r.roleId || r.id} className="border-b py-3 last:border-0">
              <div className="font-semibold">{r.roleCode}</div>
              <div className="text-sm text-gray-500">{r.roleName}</div>
            </div>
          ))}
          {!roles.length && <p className="text-gray-500">Chua có role.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Permissions</h2>
        <div className="mt-4 rounded-xl border bg-white p-4">
          {permissions.map((p) => (
            <div key={p.permissionId || p.id} className="border-b py-3 last:border-0">
              <div className="font-semibold">{p.permissionCode}</div>
              <div className="text-sm text-gray-500">{p.permissionName}</div>
            </div>
          ))}
          {!permissions.length && <p className="text-gray-500">Chua có permission.</p>}
        </div>
      </section>
    </div>
  );
}
