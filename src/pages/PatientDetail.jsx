import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";

export default function PatientDetail() {
  return (
    <MainLayout>
      <section className="mb-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
          Hồ sơ bệnh nhi
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          Nguyễn Minh Anh
        </h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          BN001 · 10 tuổi · Phụ huynh: Nguyễn Thị Lan · 09xx xxx xxx
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <article className="card p-5">
          <h3 className="text-base font-black text-slate-950">Thông tin hành chính</h3>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
            <p><b>Mã bệnh nhân:</b> BN001</p>
            <p><b>Ngày sinh:</b> 19/05/2016</p>
            <p><b>Giới tính:</b> Nữ</p>
            <p><b>Địa chỉ:</b> Hà Nội</p>
            <p><b>Bác sĩ phụ trách:</b> BS. Trần Minh Quân</p>
          </div>
        </article>

        <article className="card p-5">
          <h3 className="text-base font-black text-slate-950">Tình trạng hiện tại</h3>
          <div className="mt-4 grid gap-3">
            <div className="rounded-xl bg-red-50 p-4">
              <p className="text-xs font-black text-red-700">Mức nguy cơ</p>
              <h4 className="mt-1 text-2xl font-black text-red-700">Nguy cơ cao</h4>
            </div>
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs font-black text-blue-700">Phác đồ</p>
              <h4 className="mt-1 text-lg font-black text-[#2563EB]">Ortho-K + Atropine 0.01%</h4>
            </div>
          </div>
        </article>

        <article className="card p-5">
          <h3 className="text-base font-black text-slate-950">Chỉ số chính</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black text-slate-500">SER OD</p>
              <h4 className="text-xl font-black text-slate-950">-3.25D</h4>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black text-slate-500">SER OS</p>
              <h4 className="text-xl font-black text-slate-950">-3.50D</h4>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black text-slate-500">AL OD</p>
              <h4 className="text-xl font-black text-slate-950">24.24</h4>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black text-slate-500">AL OS</p>
              <h4 className="text-xl font-black text-slate-950">24.31</h4>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-5 card p-5">
        <h3 className="text-base font-black text-slate-950">Luồng xử lý hồ sơ</h3>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <Link to="/clinical-exam">
            <button className="w-full rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-black text-white">
              Khám lâm sàng
            </button>
          </Link>

          <Link to="/risk-assessment">
            <button className="w-full rounded-xl bg-blue-50 px-4 py-3 text-sm font-black text-[#2563EB]">
              Đánh giá nguy cơ
            </button>
          </Link>

          <Link to="/treatment">
            <button className="w-full rounded-xl bg-blue-50 px-4 py-3 text-sm font-black text-[#2563EB]">
              Điều trị
            </button>
          </Link>

          <Link to="/analytics">
            <button className="w-full rounded-xl bg-blue-50 px-4 py-3 text-sm font-black text-[#2563EB]">
              Xem tiến triển
            </button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}