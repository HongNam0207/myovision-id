import MainLayout from "../layouts/MainLayout";

export default function RiskAssessment() {
  return (
    <MainLayout>
      <section className="mb-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
              Phân tầng nguy cơ
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Đánh giá nguy cơ cận thị
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Mô phỏng MPRAS / PreMO, tính tổng điểm nguy cơ và gợi ý hướng điều trị.
            </p>
          </div>

          <div className="rounded-2xl bg-red-50 px-5 py-4 text-center">
            <b className="block text-3xl font-black text-red-700">18/27</b>
            <span className="text-xs font-black text-red-700">Nguy cơ cao</span>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_390px]">
        <article className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-950">
                Bảng chấm điểm yếu tố nguy cơ
              </h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Dữ liệu mẫu được lấy từ hồ sơ Nguyễn Minh Anh.
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
              MPRAS
            </span>
          </div>

          <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="field-label">
              Mô hình đánh giá
              <select className="field" defaultValue="MPRAS">
                <option>MPRAS - Nguy cơ tiến triển cận thị</option>
                <option>PreMO - Nguy cơ khởi phát cận thị</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Tuổi hiện tại", "10 tuổi", "2đ"],
              ["Tuổi khởi phát cận", "8 tuổi", "2đ"],
              ["Tăng độ cận/năm", "0.75D/năm", "1đ"],
              ["Tăng AL/năm", "0.22mm/năm", "2đ"],
              ["Độ cận hiện tại", "-3.50D", "1đ"],
              ["Bố mẹ cận thị", "2 người", "2đ"],
              ["Outdoor time", "1 giờ/ngày", "1đ"],
              ["Near work", "5 giờ/ngày", "2đ"],
              ["Accommodation lag", "+1.00D", "1đ"],
              ["Near esophoria", "4PD", "1đ"],
              ["Peripheral hyperopia", "+0.50D", "1đ"],
              ["AL/CR warning", "Vượt ngưỡng", "2đ"],
            ].map(([label, value, score]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-900">{label}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{value}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-[#2563EB]">
                    {score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="grid content-start gap-5">
          <section className="rounded-[22px] border border-blue-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
    Diễn giải dễ hiểu
  </p>

  <h3 className="mt-2 text-lg font-black text-slate-950">
    Vì sao bệnh nhi được xếp nguy cơ cao?
  </h3>

  <div className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-700">
    <p>
      Bệnh nhi có nhiều yếu tố làm cận thị dễ tiến triển nhanh: phát hiện cận
      sớm, độ cận tăng nhanh, trục nhãn cầu tăng và có yếu tố gia đình.
    </p>

    <p>
      Chỉ số quan trọng nhất cần theo dõi là <b>Axial Length</b> — chiều dài
      trục nhãn cầu. Nếu chỉ số này tăng nhanh, nguy cơ cận thị nặng trong
      tương lai sẽ cao hơn.
    </p>

    <p>
      Mục tiêu điều trị không phải làm hết cận ngay, mà là làm chậm tốc độ tăng
      cận và giảm nguy cơ biến chứng khi trưởng thành.
    </p>
  </div>

  <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm font-bold leading-6 text-blue-800">
    Khuyến nghị dễ hiểu: cần can thiệp tích cực, tái khám đều, theo dõi AL/SER
    và chọn phương pháp phù hợp với khả năng tuân thủ của gia đình.
  </div>
</section>
          <section className="rounded-[22px] border border-red-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
              Kết quả nguy cơ
            </p>

            <div className="mt-4 rounded-2xl bg-red-50 p-5 text-center">
              <b className="block text-5xl font-black text-red-700">18/27</b>
              <span className="mt-3 inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700">
                Nguy cơ cao
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-black text-slate-900">
                Gợi ý điều trị
              </h4>
              <p className="mt-2 rounded-2xl bg-blue-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                Can thiệp tích cực: Ortho-K kết hợp Atropine nồng độ thấp.
                Tái khám 3 tháng/lần và theo dõi AL sát.
              </p>
            </div>

            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-black leading-6 text-red-700">
              CẢNH BÁO: AL/CR vượt ngưỡng, nguy cơ tiến triển cao.
            </p>
          </section>
<section className="rounded-[22px] border border-blue-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
    Diễn giải dễ hiểu
  </p>

  <h3 className="mt-2 text-lg font-black text-slate-950">
    Vì sao bệnh nhi được xếp nguy cơ cao?
  </h3>

  <div className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-700">
    <p>
      Bệnh nhi có nhiều yếu tố làm cận thị dễ tiến triển nhanh: phát hiện cận
      sớm, độ cận tăng nhanh, trục nhãn cầu tăng và có yếu tố gia đình.
    </p>

    <p>
      Chỉ số quan trọng nhất cần theo dõi là <b>Axial Length</b> — chiều dài
      trục nhãn cầu. Nếu chỉ số này tăng nhanh, nguy cơ cận thị nặng trong
      tương lai sẽ cao hơn.
    </p>

    <p>
      Mục tiêu điều trị không phải làm hết cận ngay, mà là làm chậm tốc độ tăng
      cận và giảm nguy cơ biến chứng khi trưởng thành.
    </p>
  </div>

  <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm font-bold leading-6 text-blue-800">
    Khuyến nghị dễ hiểu: cần can thiệp tích cực, tái khám đều, theo dõi AL/SER
    và chọn phương pháp phù hợp với khả năng tuân thủ của gia đình.
  </div>
</section>
          <section className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
            <h3 className="text-sm font-black text-slate-950">
              Bản đồ phân tầng nguy cơ
            </h3>

            <div className="mt-5">
              <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[22%] bg-emerald-400 float-left" />
                <div className="h-full w-[26%] bg-amber-400 float-left" />
                <div className="h-full w-[52%] bg-red-500 float-left" />
              </div>

              <div className="mt-3 grid grid-cols-3 text-[11px] font-black">
                <span className="text-emerald-700">0-5: Thấp</span>
                <span className="text-center text-amber-700">6-12: TB</span>
                <span className="text-right text-red-700">13-27: Cao</span>
              </div>

              <p className="mt-4 rounded-2xl bg-red-50 p-3 text-xs font-semibold leading-5 text-red-800">
                Điểm hiện tại nằm trong vùng đỏ: cần kiểm soát cận thị tích cực.
              </p>
            </div>
          </section>
        </aside>
      </section>
    </MainLayout>
  );
}