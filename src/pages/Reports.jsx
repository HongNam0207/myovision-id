import MainLayout from "../layouts/MainLayout";

export default function Reports() {
  return (
    <MainLayout>
      <section className="mb-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
          Báo cáo chuyên môn
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          Báo cáo tổng kết bệnh nhi
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Tổng hợp dữ liệu khám, nguy cơ, phác đồ điều trị và khuyến nghị cho phụ huynh.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <article className="card p-6">
          <div className="border-b border-slate-200 pb-5">
            <h3 className="text-xl font-black text-slate-950">
              MYOVISION ID - Báo cáo kiểm soát cận thị
            </h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Khoa Mắt - Bệnh viện Đông Đô
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <h4 className="font-black text-slate-900">Thông tin bệnh nhi</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Nguyễn Minh Anh<br />
                10 tuổi · Nữ<br />
                Mã BN: BN001
              </p>
            </div>

            <div className="rounded-2xl bg-red-50 p-4">
              <h4 className="font-black text-red-700">Mức nguy cơ</h4>
              <p className="mt-2 text-2xl font-black text-red-700">
                Nguy cơ cao
              </p>
              <p className="text-sm font-semibold text-red-700">
                Điểm nguy cơ: 18/27
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <h4 className="font-black text-slate-900">Khúc xạ hiện tại</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                OD: -3.00 / -0.50 x 180<br />
                OS: -3.25 / -0.50 x 175<br />
                SER: -3.25D / -3.50D
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <h4 className="font-black text-slate-900">Sinh trắc học</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                AL OD: 24.24 mm<br />
                AL OS: 24.31 mm<br />
                Tăng AL: +0.15 mm/năm
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h4 className="font-black text-[#2563EB]">Phác đồ đang áp dụng</h4>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
              Ortho-K phối hợp Atropine 0.01%. Mục tiêu là giảm tốc độ tăng chiều dài
              trục nhãn cầu xuống dưới 0.20 mm/năm và kiểm soát tiến triển độ cận.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <h4 className="font-black text-emerald-700">Khuyến nghị cho phụ huynh</h4>
            <ul className="mt-2 list-disc pl-5 text-sm font-semibold leading-7 text-slate-700">
              <li>Duy trì điều trị theo phác đồ bác sĩ chỉ định.</li>
              <li>Tăng thời gian hoạt động ngoài trời tối thiểu 2 giờ/ngày.</li>
              <li>Giảm thời gian nhìn gần liên tục, nghỉ mắt mỗi 20 phút.</li>
              <li>Tái khám sau 3 tháng để đánh giá AL và SER.</li>
            </ul>
          </div>
        </article>

        <aside className="grid content-start gap-5">
          <section className="card p-5">
            <h3 className="text-base font-black text-slate-950">
              Hành động báo cáo
            </h3>

            <div className="mt-4 grid gap-3">
              <button className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-black text-white">
                Xuất PDF
              </button>
              <button className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600">
                In báo cáo
              </button>
              <button className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600">
                Gửi cho phụ huynh
              </button>
            </div>
          </section>

          <section className="card p-5">
            <h3 className="text-base font-black text-slate-950">
              Trạng thái
            </h3>

            <div className="mt-4 rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm font-black text-emerald-700">
                Báo cáo đã sẵn sàng
              </p>
              <p className="mt-1 text-xs font-semibold text-emerald-700">
                Có thể xuất PDF demo.
              </p>
            </div>
          </section>
        </aside>
      </section>
    </MainLayout>
  );
}