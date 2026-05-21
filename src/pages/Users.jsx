import MainLayout from "../layouts/MainLayout";

const users = [
  ["U001", "BS. Trần Minh Quân", "Bác sĩ", "doctor@dongdo.vn", "Đang hoạt động"],
  ["U002", "Nguyễn Thu Hà", "Lễ tân", "reception@dongdo.vn", "Đang hoạt động"],
  ["U003", "Phạm Minh Đức", "Kỹ thuật viên", "ktv@dongdo.vn", "Đang hoạt động"],
  ["U004", "Admin Đông Đô", "Admin", "admin@dongdo.vn", "Đang hoạt động"],
];

export default function Users() {
  return (
    <MainLayout>
      <section className="mb-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
          Phân quyền hệ thống
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          Quản lý tài khoản
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Quản lý người dùng, vai trò và quyền truy cập trong hệ thống MYOVISION ID.
        </p>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-200 p-5 flex justify-between items-center">
          <div>
            <h3 className="text-base font-black text-slate-950">Danh sách người dùng</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Admin / Lễ tân / KTV / Bác sĩ
            </p>
          </div>

          <button className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-black text-white">
            + Thêm tài khoản
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Mã</th>
                <th className="px-5 py-3">Tên người dùng</th>
                <th className="px-5 py-3">Vai trò</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {users.map((u) => (
                <tr key={u[0]} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-black text-slate-800">{u[0]}</td>
                  <td className="px-5 py-4 font-black text-slate-900">{u[1]}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
                      {u[2]}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{u[3]}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      {u[4]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600">
                      Sửa quyền
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </MainLayout>
  );
}