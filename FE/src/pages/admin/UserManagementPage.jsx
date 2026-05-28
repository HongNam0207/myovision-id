import { useEffect, useState } from "react";
import { userApi } from "../../api/users.api";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userApi.getAll()
      .then((res) => setUsers(res.data?.data?.items || res.data?.data || []))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <p className="mt-1 text-gray-500">Qu?n lý tài kho?n ngu?i dùng h? th?ng.</p>

      <div className="mt-6 overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Username</th>
              <th className="p-3">Full name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userId || u.id} className="border-t">
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.fullName}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!users.length && (
          <div className="p-6 text-center text-gray-500">Chua có d? li?u user.</div>
        )}
      </div>
    </div>
  );
}
