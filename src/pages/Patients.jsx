import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getStoredUser } from "../services/authService";
import {
  addPatient,
  deletePatient,
  listenPatients,
  updatePatient,
} from "../services/patientService";

const defaultForm = {
  fullName: "",
  age: "",
  gender: "Nam",
  status: "Đang theo dõi",
};

const statusOptions = ["Đang theo dõi", "Đang điều trị", "Tái khám", "Hoàn tất"];

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState(defaultForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const user = getStoredUser();

  useEffect(() => {
    const unsubscribe = listenPatients(
      (data) => {
        setPatients(data);
        setError("");
      },
      (err) => {
        setError(err.message || "Không thể tải dữ liệu bệnh nhi từ Firebase.");
      }
    );

    return () => unsubscribe();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.fullName.trim()) {
      setMessage("");
      setError("Vui lòng nhập tên bệnh nhi.");
      return;
    }

    try {
      await addPatient(
        {
          ...formData,
          age: Number(formData.age) || 0,
        },
        user
      );

      setFormData(defaultForm);
      setError("");
      setMessage("Đã thêm bệnh nhi thành công.");
    } catch (err) {
      setMessage("");
      setError(err.message || "Không thể thêm bệnh nhi.");
    }
  }

  async function handleStatusChange(patient, status) {
    try {
      await updatePatient(patient.id, { status });
      setMessage("Đã cập nhật trạng thái bệnh nhi.");
    } catch (err) {
      setError(err.message || "Không thể cập nhật trạng thái.");
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa bệnh nhi này?");

    if (!confirmDelete) return;

    try {
      await deletePatient(id);
      setMessage("Đã xóa bệnh nhi.");
    } catch (err) {
      setError(err.message || "Không thể xóa bệnh nhi.");
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">
            QUẢN LÝ BỆNH NHI
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Danh sách bệnh nhi
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Dữ liệu được đồng bộ realtime bằng Firebase Firestore.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-5"
        >
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Tên bệnh nhi"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 md:col-span-2"
          />

          <input
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Tuổi"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>

          <button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
            Thêm bệnh nhi
          </button>
        </form>

        {message && (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Tên bệnh nhi</th>
                <th className="px-5 py-4">Tuổi</th>
                <th className="px-5 py-4">Giới tính</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Người tạo</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-5 py-4 font-bold text-slate-800">
                    {patient.fullName}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{patient.age}</td>
                  <td className="px-5 py-4 text-slate-600">{patient.gender}</td>
                  <td className="px-5 py-4">
                    <select
                      value={patient.status || "Đang theo dõi"}
                      onChange={(event) => handleStatusChange(patient, event.target.value)}
                      className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 outline-none"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                    {patient.createdBy || "-"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}

              {patients.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-500">
                    Chưa có bệnh nhi nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
