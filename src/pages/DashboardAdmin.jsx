import MainLayout from "../layouts/MainLayout";

const stats = [
  ["Tổng bệnh nhi", "128", "bg-blue-50 text-[#2563EB]"],
  ["Tổng lượt khám", "342", "bg-emerald-50 text-emerald-700"],
  ["Nguy cơ cao", "24", "bg-red-50 text-red-700"],
  ["Tài khoản hệ thống", "12", "bg-amber-50 text-amber-700"],
];

export default function DashboardAdmin() {
  return (
    <MainLayout>
      <section className="mb-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
          Dashboard Admin
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          Tổng quan vận hành Khoa Mắt
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Theo dõi hoạt động khám cận thị, bệnh nhi nguy cơ cao, hiệu suất điều trị và tài khoản hệ thống.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, color]) => (
          <article key={label} className="card p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              {label}
            </p>
            <div className="mt-3 flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-950">{value}</h3>
              <span className={`rounded-xl px-3 py-2 text-xs font-black ${color}`}>
                LIVE
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-3">
        <article className="card p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-950">
                Hoạt động khoa hôm nay
              </h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Mô phỏng dữ liệu vận hành realtime.
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
              HIS SUMMARY
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Bệnh nhân mới", "18"],
              ["Bệnh nhân tái khám", "26"],
              ["Hồ sơ chờ bác sĩ duyệt", "7"],
              ["Báo cáo đã xuất", "14"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  {label}
                </p>
                <h4 className="mt-2 text-2xl font-black text-slate-950">
                  {value}
                </h4>
              </div>
            ))}
          </div>
        </article>

        <article className="card p-5">
          <h3 className="text-base font-black text-slate-950">
            Cảnh báo chuyên môn
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Các nhóm bệnh nhi cần chú ý.
          </p>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl bg-red-50 p-4">
              <p className="text-sm font-black text-red-700">24 bệnh nhi nguy cơ cao</p>
              <p className="mt-1 text-xs font-semibold text-red-700">
                Cần theo dõi sát AL và SER.
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-sm font-black text-amber-700">8 hồ sơ thiếu AL/K1/K2</p>
              <p className="mt-1 text-xs font-semibold text-amber-700">
                Cần bổ sung sinh trắc học.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-sm font-black text-[#2563EB]">12 lịch tái khám tuần này</p>
              <p className="mt-1 text-xs font-semibold text-blue-700">
                Có thể nhắc lịch phụ huynh.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-5 card overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <h3 className="text-base font-black text-slate-950">
            Hiệu suất theo vai trò
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Theo dõi hoạt động của lễ tân, KTV và bác sĩ.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Bộ phận</th>
                <th className="px-5 py-3">Vai trò</th>
                <th className="px-5 py-3">Số hồ sơ xử lý</th>
                <th className="px-5 py-3">Trạng thái</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {[
                ["Lễ tân", "Tiếp nhận bệnh nhi", "32", "Đang hoạt động"],
                ["Kỹ thuật viên", "Nhập dữ liệu đo mắt", "28", "Đang hoạt động"],
                ["Bác sĩ", "Khám và điều trị", "24", "Đang hoạt động"],
                ["Quản lý khoa", "Theo dõi chuyên môn", "12", "Đang hoạt động"],
              ].map((row) => (
                <tr key={row[0]} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-black text-slate-900">{row[0]}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{row[1]}</td>
                  <td className="px-5 py-4 font-black text-slate-900">{row[2]}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      {row[3]}
                    </span>
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