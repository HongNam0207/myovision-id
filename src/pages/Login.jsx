import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail } from "../services/authService";

const demoAccounts = [
  { label: "Admin", email: "admin@myovision.com", password: "12345678" },
  { label: "Bác sĩ", email: "doctor@myovision.com", password: "12345678" },
  { label: "Lễ tân", email: "reception@myovision.com", password: "12345678" },
  { label: "Kỹ thuật viên", email: "technician@myovision.com", password: "12345678" },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@myovision.com");
  const [password, setPassword] = useState("12345678");
  const [loadingLabel, setLoadingLabel] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(loginEmail = email, loginPassword = password, label = "") {
    try {
      setError("");
      setLoadingLabel(label || "form");

      const user = await loginWithEmail(loginEmail, loginPassword);

      navigate(user.dashboard, { replace: true });
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.");
    } finally {
      setLoadingLabel("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleLogin();
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900">
      <main className="mx-auto grid min-h-screen max-w-7xl items-center px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-[1fr_430px] lg:items-center">
          <div className="rounded-3xl border border-blue-100 bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">
              MYOVISION ID
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900">
              Hệ thống quản lý kiểm soát cận thị
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Đăng nhập bằng Firebase Authentication, đọc vai trò từ Firestore
              và đồng bộ dữ liệu bệnh nhi realtime theo từng người dùng.
            </p>

            <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div className="rounded-2xl bg-blue-50 p-4 font-semibold text-blue-700">
                Firestore realtime
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-700">
                Role-based access
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
          >
            <h2 className="text-2xl font-black text-slate-900">
              Đăng nhập
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Có thể nhập tài khoản hoặc bấm nhanh tài khoản demo bên dưới.
            </p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                  Mật khẩu
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </label>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={Boolean(loadingLabel)}
              className="mt-5 w-full rounded-2xl bg-blue-600 px-4 py-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loadingLabel === "form" ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleLogin(account.email, account.password, account.label)}
                  disabled={Boolean(loadingLabel)}
                  className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-black text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {loadingLabel === account.label
                    ? "Đang đăng nhập..."
                    : account.label}
                </button>
              ))}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
