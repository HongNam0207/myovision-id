import MainLayout from "../layouts/MainLayout";

const visits = [
  {
    date: "2025-05-19",
    age: "9.0",
    protocol: "Chưa can thiệp",
    adherence: "Tốt",
    ser: "-2.50 / -2.75",
    al: "24.05 / 24.12",
    iop: "15 / 15",
  },
  {
    date: "2025-11-19",
    age: "9.5",
    protocol: "Kính kiểm soát",
    adherence: "Trung bình",
    ser: "-3.00 / -3.25",
    al: "24.18 / 24.25",
    iop: "16 / 16",
  },
  {
    date: "2026-05-19",
    age: "10.0",
    protocol: "Ortho-K + Atropine",
    adherence: "Tốt",
    ser: "-3.25 / -3.50",
    al: "24.24 / 24.31",
    iop: "15 / 16",
  },
];

export default function FollowUp() {
  return (
    <MainLayout>
      <section className="mb-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
              Theo dõi tiến triển
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Theo dõi tái khám
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Ghi nhận từng lần tái khám, so sánh SER, Axial Length và nhãn áp theo OD/OS.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-blue-50 px-4 py-3">
              <b className="block text-lg text-[#2563EB]">3</b>
              <span className="text-[11px] font-bold text-blue-700">Lần khám</span>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <b className="block text-lg text-slate-800">-3.50D</b>
              <span className="text-[11px] font-bold text-slate-500">SER gần nhất</span>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <b className="block text-lg text-slate-800">24.31</b>
              <span className="text-[11px] font-bold text-slate-500">AL gần nhất</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-950">
              Khu vực nhập liệu tái khám
            </h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Nhập dữ liệu lần khám mới.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
            LẦN KHÁM MỚI
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="field-label">
            Ngày tái khám
            <input className="field" type="date" defaultValue="2026-05-21" />
          </label>

          <label className="field-label">
            Tuổi hiện tại
            <input className="field" defaultValue="10.0" />
          </label>

          <label className="field-label">
            Phác đồ đang áp dụng
            <select className="field">
              <option>Ortho-K + Atropine</option>
              <option>Atropine 0.01%</option>
              <option>Kính kiểm soát</option>
            </select>
          </label>

          <label className="field-label">
            Mức độ tuân thủ
            <select className="field">
              <option>Tốt</option>
              <option>Trung bình</option>
              <option>Kém</option>
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-3 text-sm font-black text-slate-800">OD - Mắt phải</h4>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="field-label">Sph<input className="field" defaultValue="-3.00" /></label>
              <label className="field-label">Cyl<input className="field" defaultValue="-0.50" /></label>
              <label className="field-label">Axis<input className="field" defaultValue="180" /></label>
              <label className="field-label">VA<input className="field" defaultValue="20/20" /></label>
              <label className="field-label">AL<input className="field" defaultValue="24.24" /></label>
              <label className="field-label">IOP<input className="field" defaultValue="15" /></label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-3 text-sm font-black text-slate-800">OS - Mắt trái</h4>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="field-label">Sph<input className="field" defaultValue="-3.25" /></label>
              <label className="field-label">Cyl<input className="field" defaultValue="-0.50" /></label>
              <label className="field-label">Axis<input className="field" defaultValue="175" /></label>
              <label className="field-label">VA<input className="field" defaultValue="20/20" /></label>
              <label className="field-label">AL<input className="field" defaultValue="24.31" /></label>
              <label className="field-label">IOP<input className="field" defaultValue="16" /></label>
            </div>
          </section>
        </div>

        <div className="mt-5 flex gap-3">
          <button className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-600/20">
            Lưu lịch sử khám
          </button>
          <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-600">
            Hủy sửa
          </button>
        </div>
      </section>

      <section className="mt-5 card overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <h3 className="text-base font-black text-slate-950">
            Bảng lịch sử theo dõi
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Danh sách các lần khám trước đó.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Ngày khám</th>
                <th className="px-4 py-3">Tuổi</th>
                <th className="px-4 py-3">Phác đồ</th>
                <th className="px-4 py-3">Tuân thủ</th>
                <th className="px-4 py-3">SER OD/OS</th>
                <th className="px-4 py-3">AL OD/OS</th>
                <th className="px-4 py-3">IOP OD/OS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {visits.map((visit) => (
                <tr key={visit.date} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-800">{visit.date}</td>
                  <td className="px-4 py-3 text-slate-600">{visit.age}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
                      {visit.protocol}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{visit.adherence}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{visit.ser}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{visit.al}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{visit.iop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </MainLayout>
  );
}