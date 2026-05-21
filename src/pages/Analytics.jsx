import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import MainLayout from "../layouts/MainLayout";

const progressionData = [
  { age: "9.0", alOD: 24.05, alOS: 24.12, serOD: -2.5, serOS: -2.75 },
  { age: "9.5", alOD: 24.18, alOS: 24.25, serOD: -3.0, serOS: -3.25 },
  { age: "10.0", alOD: 24.24, alOS: 24.31, serOD: -3.25, serOS: -3.5 },
];

export default function Analytics() {
  return (
    <MainLayout>
      <section className="mb-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
          Biểu đồ giải thích
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          Tiến triển cận thị của bệnh nhi
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Hiển thị sự thay đổi của trục nhãn cầu và độ cận theo thời gian để bác
          sĩ giải thích trực quan cho phụ huynh.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <article className="card p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Tốc độ tăng AL
          </p>
          <h3 className="mt-2 text-3xl font-black text-emerald-600">
            +0.19 mm/năm
          </h3>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Mục tiêu kiểm soát: dưới 0.20 mm/năm
          </p>
        </article>

        <article className="card p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Tăng độ cận
          </p>
          <h3 className="mt-2 text-3xl font-black text-amber-600">
            -0.50 D/năm
          </h3>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Cần tiếp tục theo dõi sát.
          </p>
        </article>

        <article className="card p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Đánh giá tổng quan
          </p>
          <h3 className="mt-2 text-3xl font-black text-red-600">
            Nguy cơ cao
          </h3>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Nên duy trì phác đồ kiểm soát tích cực.
          </p>
        </article>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <article className="card p-5">
          <h3 className="text-base font-black text-slate-950">
            Biểu đồ Axial Length
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            AL tăng càng nhanh thì nguy cơ cận thị nặng càng cao.
          </p>

          <div className="mt-4 h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis domain={[23.8, 24.6]} />
                <Tooltip />
                <ReferenceLine y={24.5} stroke="#ef4444" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="alOD" stroke="#2563EB" strokeWidth={3} name="AL mắt phải" />
                <Line type="monotone" dataKey="alOS" stroke="#0f766e" strokeWidth={3} name="AL mắt trái" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="card p-5">
          <h3 className="text-base font-black text-slate-950">
            Biểu đồ SER
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            SER càng âm nghĩa là độ cận càng tăng.
          </p>

          <div className="mt-4 h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis domain={[-4, -2]} />
                <Tooltip />
                <Line type="monotone" dataKey="serOD" stroke="#2563EB" strokeWidth={3} name="SER mắt phải" />
                <Line type="monotone" dataKey="serOS" stroke="#dc2626" strokeWidth={3} name="SER mắt trái" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h3 className="text-base font-black text-blue-900">
          Cách giải thích cho phụ huynh
        </h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-blue-800">
          Đường biểu đồ đi lên ở Axial Length cho thấy mắt trẻ đang dài ra.
          Khi mắt dài nhanh, độ cận thường tăng theo. Mục tiêu điều trị là làm
          đường biểu đồ tăng chậm lại, không phải làm hết cận ngay lập tức.
        </p>
      </section>
    </MainLayout>
  );
}