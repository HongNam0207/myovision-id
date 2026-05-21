import MainLayout from "../layouts/MainLayout";

const stats = [
  {
    title: "Tổng bệnh nhi",
    value: "128",
    color: "bg-blue-50 text-[#2563EB]",
  },
  {
    title: "Chờ khám",
    value: "12",
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "Nguy cơ cao",
    value: "24",
    color: "bg-red-50 text-red-700",
  },
  {
    title: "Tái khám hôm nay",
    value: "8",
    color: "bg-emerald-50 text-emerald-700",
  },
];

export default function DashboardDoctor() {
  return (
    <MainLayout>
      <section className="mb-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
              Dashboard bác sĩ
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Tổng quan quản lý cận thị
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Theo dõi bệnh nhi chờ khám, hồ sơ nguy cơ cao,
              lịch tái khám và tiến triển điều trị.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-center">
              <b className="block text-lg text-[#2563EB]">92%</b>
              <span className="text-[11px] font-bold text-blue-700">
                Hoàn tất hồ sơ
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <b className="block text-lg text-slate-800">18</b>
              <span className="text-[11px] font-bold text-slate-500">
                Nguy cơ cao
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  {item.title}
                </p>

                <h3 className="mt-3 text-3xl font-black text-slate-950">
                  {item.value}
                </h3>
              </div>

              <div className={`rounded-xl px-3 py-2 text-xs font-black ${item.color}`}>
                ACTIVE
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)] xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-950">
                Bệnh nhân nguy cơ cao
              </h3>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Danh sách cần theo dõi sát
              </p>
            </div>

            <button className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-black text-white">
              Xem tất cả
            </button>
          </div>

          <div className="space-y-3">
            {[
              ["Nguyễn Minh Anh", "10 tuổi", "High Risk"],
              ["Trần Gia Hân", "9 tuổi", "Progression"],
              ["Lê Quốc Bảo", "11 tuổi", "AL Increase"],
            ].map((patient) => (
              <div
                key={patient[0]}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
              >
                <div>
                  <h4 className="font-black text-slate-900">
                    {patient[0]}
                  </h4>

                  <p className="text-sm text-slate-500">
                    {patient[1]}
                  </p>
                </div>

                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                  {patient[2]}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
          <h3 className="text-base font-black text-slate-950">
            Lịch tái khám hôm nay
          </h3>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            Danh sách hẹn khám
          </p>

          <div className="mt-4 space-y-3">
            {[
              ["08:30", "Nguyễn Minh Anh"],
              ["09:00", "Trần Gia Hân"],
              ["10:15", "Lê Quốc Bảo"],
              ["14:00", "Phạm Gia Linh"],
            ].map((item) => (
              <div
                key={item[0]}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
              >
                <div>
                  <p className="font-black text-slate-900">
                    {item[1]}
                  </p>
                </div>

                <span className="text-sm font-bold text-[#2563EB]">
                  {item[0]}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </MainLayout>
  );
}