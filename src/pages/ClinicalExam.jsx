import MainLayout from "../layouts/MainLayout";

export default function ClinicalExam() {
  return (
    <MainLayout>
      <section className="mb-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
              Tiếp nhận lâm sàng
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Khám lâm sàng cận thị trẻ em
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Chuẩn hóa dữ liệu khám mắt phục vụ đánh giá nguy cơ và theo dõi tiến triển cận thị.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-center">
              <b className="block text-lg text-[#2563EB]">85%</b>
              <span className="text-[11px] font-bold text-blue-700">
                Hoàn tất
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <b className="block text-lg text-slate-800">10</b>
              <span className="text-[11px] font-bold text-slate-500">
                Tuổi
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <b className="block text-lg text-slate-800">Draft</b>
              <span className="text-[11px] font-bold text-slate-500">
                Trạng thái
              </span>
            </div>
          </div>
        </div>
      </section>

      <form className="grid gap-5">

        {/* Hành chính */}

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-950">
                1. Đăng ký & Hành chính
              </h3>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Thông tin bệnh nhi và phụ huynh
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
              ADMIN
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="field-label">
              Họ tên trẻ
              <input className="field" defaultValue="Nguyễn Minh Anh" />
            </label>

            <label className="field-label">
              Ngày sinh
              <input className="field" type="date" />
            </label>

            <label className="field-label">
              Giới tính
              <select className="field">
                <option>Nữ</option>
                <option>Nam</option>
              </select>
            </label>

            <label className="field-label">
              SĐT phụ huynh
              <input className="field" defaultValue="09xx xxx xxx" />
            </label>
          </div>
        </section>

        {/* Bệnh sử */}

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-950">
                2. Bệnh sử (Anamnesis)
              </h3>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Tiền sử gia đình và hành vi thị giác
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
              HISTORY
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <label className="field-label">
              Tuổi phát hiện cận
              <input className="field" type="number" defaultValue="8" />
            </label>

            <label className="field-label">
              Độ kính đang đeo
              <input className="field" defaultValue="-2.50" />
            </label>

            <label className="field-label">
              Tiền sử điều trị
              <select className="field">
                <option>Atropine</option>
                <option>Ortho-K</option>
              </select>
            </label>

            <label className="field-label">
              Tiền sử gia đình
              <select className="field">
                <option>2 người</option>
                <option>1 người</option>
              </select>
            </label>

            <label className="field-label">
              Near work
              <input className="field" defaultValue="5 giờ/ngày" />
            </label>

            <label className="field-label">
              Outdoor time
              <input className="field" defaultValue="1 giờ/ngày" />
            </label>

          </div>
        </section>

        {/* Khúc xạ */}

        <section className="card overflow-hidden">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-950">
                  3. Khúc xạ (Refraction)
                </h3>

                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Nhập dữ liệu OD / OS
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
                REFRACTION
              </span>
            </div>
          </div>

          <div className="grid xl:grid-cols-2">

            {/* OD */}

            <div className="border-r border-slate-200 p-5">
              <h4 className="mb-4 text-sm font-black text-slate-800">
                OD - Mắt phải
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Loại đo</th>
                      <th>Sph</th>
                      <th>Cyl</th>
                      <th>Axis</th>
                      <th>VA</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {[
                      "Kính cũ",
                      "Soi bóng",
                      "Trước liệt ĐT",
                      "Sau liệt ĐT",
                    ].map((row) => (
                      <tr key={row}>
                        <th className="px-3 py-3 font-black text-slate-700">
                          {row}
                        </th>

                        <td>
                          <input className="table-input" defaultValue="-3.00" />
                        </td>

                        <td>
                          <input className="table-input" defaultValue="-0.50" />
                        </td>

                        <td>
                          <input className="table-input" defaultValue="180" />
                        </td>

                        <td>
                          <input className="table-input" defaultValue="20/20" />
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>

            {/* OS */}

            <div className="p-5">
              <h4 className="mb-4 text-sm font-black text-slate-800">
                OS - Mắt trái
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Loại đo</th>
                      <th>Sph</th>
                      <th>Cyl</th>
                      <th>Axis</th>
                      <th>VA</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {[
                      "Kính cũ",
                      "Soi bóng",
                      "Trước liệt ĐT",
                      "Sau liệt ĐT",
                    ].map((row) => (
                      <tr key={row}>
                        <th className="px-3 py-3 font-black text-slate-700">
                          {row}
                        </th>

                        <td>
                          <input className="table-input" defaultValue="-3.25" />
                        </td>

                        <td>
                          <input className="table-input" defaultValue="-0.50" />
                        </td>

                        <td>
                          <input className="table-input" defaultValue="175" />
                        </td>

                        <td>
                          <input className="table-input" defaultValue="20/20" />
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>

        {/* Sinh trắc học */}

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-950">
                4. Sinh trắc học
              </h3>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Axial Length và giác mạc
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2563EB]">
              BIOMETRY
            </span>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="mb-3 text-sm font-black text-slate-800">
                OD
              </h4>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="field-label">
                  Axial Length
                  <input className="field" defaultValue="24.24" />
                </label>

                <label className="field-label">
                  K1
                  <input className="field" defaultValue="42.50" />
                </label>

                <label className="field-label">
                  K2
                  <input className="field" defaultValue="43.20" />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="mb-3 text-sm font-black text-slate-800">
                OS
              </h4>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="field-label">
                  Axial Length
                  <input className="field" defaultValue="24.31" />
                </label>

                <label className="field-label">
                  K1
                  <input className="field" defaultValue="42.80" />
                </label>

                <label className="field-label">
                  K2
                  <input className="field" defaultValue="43.50" />
                </label>
              </div>
            </div>

          </div>
        </section>

        {/* Footer */}

        <footer className="sticky bottom-0 z-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Dữ liệu hiện ở trạng thái bản nháp trên trình duyệt.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600"
              >
                Xóa form
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#2563EB] px-5 py-2 text-sm font-black text-white shadow-lg shadow-blue-600/20"
              >
                Lưu khám lâm sàng
              </button>
            </div>
          </div>
        </footer>

      </form>
    </MainLayout>
  );
}