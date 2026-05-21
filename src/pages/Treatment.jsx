import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { treatmentOptions } from "../data/treatmentOptions";

export default function Treatment() {
  const [saveStatus, setSaveStatus] = useState("Chưa lưu");

  function saveTreatment() {
    localStorage.setItem(
      "myovision_treatment_BN001",
      JSON.stringify({
        patientId: "BN001",
        savedAt: new Date().toISOString(),
        protocol: "Ortho-K + Atropine 0.01%",
        goal: "Giảm tốc độ tăng AL xuống dưới 0.20 mm/năm",
      })
    );

    setSaveStatus("Đã lưu phác đồ");
  }

  function resetTreatment() {
    localStorage.removeItem("myovision_treatment_BN001");
    setSaveStatus("Đã đặt lại");
  }

  return (
    <MainLayout>
      <section className="mb-5 rounded-2xl border border-blue-100 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
              Phác đồ điều trị
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Quản lý phác đồ kiểm soát cận thị
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Ghi nhận phương pháp điều trị, theo dõi tuân thủ, tác dụng phụ và
              kế hoạch tái khám.
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50 px-5 py-4 text-center">
            <b className="block text-lg text-[#2563EB]">Phối hợp điều trị</b>
            <span className="text-xs font-black text-blue-700">
              Ortho-K + Atropine
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 2xl:grid-cols-[1fr_460px]">
        <div className="grid gap-5">
          <section className="card p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-black text-slate-950">
                  1. Trạng thái phác đồ hiện tại
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Chọn một hoặc nhiều phương pháp điều trị.
                </p>
              </div>

              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
                ĐANG ÁP DỤNG
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="field-label">
                Ngày bắt đầu
                <input className="field" type="date" defaultValue="2026-05-19" />
              </label>

              <label className="field-label">
                Bác sĩ chỉ định
                <input className="field" defaultValue="BS. Trần Minh Quân" />
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Ortho-K",
                "Atropine",
                "Kính kiểm soát cận thị",
                "Áp tròng mềm đa tròng",
              ].map((item, index) => (
                <label
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700"
                >
                  <input type="checkbox" defaultChecked={index < 2} />
                  {item}
                </label>
              ))}
            </div>
          </section>

          <section className="card p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-black text-slate-950">
                  2. Module Ortho-K
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Thông số kính Ortho-K đang sử dụng.
                </p>
              </div>

              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
                ORTHO-K
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="field-label">
                Hãng kính
                <input className="field" defaultValue="Menicon" />
              </label>

              <label className="field-label">
                BC
                <input className="field" defaultValue="8.20" />
              </label>

              <label className="field-label">
                DIA
                <input className="field" defaultValue="10.60" />
              </label>

              <label className="field-label">
                OZD
                <input className="field" defaultValue="6.0" />
              </label>

              <label className="field-label">
                Thiết kế
                <input className="field" defaultValue="Toric" />
              </label>

              <label className="field-label">
                Ngày giao kính
                <input className="field" type="date" defaultValue="2026-05-20" />
              </label>
            </div>
          </section>

          <section className="card p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-black text-slate-950">
                  3. Module Atropine
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Theo dõi nồng độ, tần suất và dung nạp thuốc.
                </p>
              </div>

              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
                ATROPINE
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="field-label">
                Nồng độ
                <select className="field" defaultValue="0.01%">
                  <option>0.01%</option>
                  <option>0.025%</option>
                  <option>0.05%</option>
                </select>
              </label>

              <label className="field-label">
                Tần suất
                <input className="field" defaultValue="1 giọt/tối" />
              </label>

              <label className="field-label">
                Đánh giá dung nạp
                <input className="field" defaultValue="Dung nạp tốt" />
              </label>

              <label className="field-label xl:col-span-3">
                Tác dụng phụ
                <textarea
                  className="field min-h-[84px] py-2"
                  defaultValue="Chưa ghi nhận sợ sáng, mờ nhìn gần hoặc kích ứng."
                />
              </label>
            </div>
          </section>

          <section className="card p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-black text-slate-950">
                  4. Tuân thủ & kế hoạch theo dõi
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Đánh giá mức độ dùng kính/thuốc.
                </p>
              </div>

              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
                SAFETY
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="field-label">
                Mức độ tuân thủ
                <input
                  className="field"
                  defaultValue="6 đêm/tuần, nhỏ thuốc đều"
                />
              </label>

              <label className="field-label">
                Hướng xử trí
                <select className="field">
                  <option>Tiếp tục duy trì</option>
                  <option>Đổi nồng độ</option>
                  <option>Tạm ngưng</option>
                </select>
              </label>

              <label className="field-label md:col-span-2">
                Ghi chú chỉ định
                <textarea
                  className="field min-h-[96px] py-2"
                  defaultValue="Bệnh nhi nguy cơ cao, tăng AL nhanh. Ưu tiên phối hợp Ortho-K và Atropine nồng độ thấp."
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveTreatment}
                className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-600/20"
              >
                Lưu phác đồ
              </button>

              <button
                type="button"
                onClick={resetTreatment}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-600"
              >
                Đặt lại
              </button>
            </div>
          </section>
        </div>

        <aside className="grid content-start gap-5">
          <section className="card p-4 sm:p-5">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
                Giải thích cho phụ huynh
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-950">
                So sánh các phương pháp kiểm soát cận thị
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Bảng này giúp bác sĩ giải thích dễ hiểu cho phụ huynh về ưu
                điểm, hạn chế và mức độ phù hợp của từng phương pháp.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {treatmentOptions.map((item) => (
                <article
                  key={item.name}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="text-base font-black text-slate-950">
                        {item.name}
                      </h4>

                      <p className="mt-1 text-xs font-bold text-[#2563EB]">
                        {item.type}
                      </p>
                    </div>

                    <span className="w-fit shrink-0 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-black text-blue-700">
                      {item.effect}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                    {item.parentText}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs font-black uppercase text-emerald-600">
                        Ưu điểm
                      </p>

                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        {item.pros.map((pro) => (
                          <li key={pro}>• {pro}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs font-black uppercase text-red-600">
                        Cần lưu ý
                      </p>

                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        {item.cons.map((con) => (
                          <li key={con}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-white p-3 text-sm">
                    <b>Phù hợp khi: </b>
                    <span className="text-slate-600">{item.suitableFor}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
              Tóm tắt điều trị
            </p>

            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <h4 className="font-black text-slate-900">Phân loại</h4>
                <p>Phối hợp điều trị</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <h4 className="font-black text-slate-900">Phương pháp</h4>
                <p>Ortho-K + Atropine 0.01%</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <h4 className="font-black text-slate-900">Mục tiêu</h4>
                <p>Giảm tốc độ tăng AL xuống dưới 0.20 mm/năm.</p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4">
                <h4 className="font-black text-emerald-700">Dự báo hiệu quả</h4>
                <p className="font-semibold text-emerald-700">
                  Kiểm soát tiến triển khoảng 60–75%.
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs italic leading-5 text-slate-500">
              Trạng thái: {saveStatus}. Tính toán chỉ mang tính tham khảo, quyết
              định phụ thuộc vào bác sĩ.
            </p>
          </section>
        </aside>
      </section>
    </MainLayout>
  );
}