import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ usernameOrEmail: "admin", password: "123456" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await authApi.login(form);
      const data = res.data?.data || res.data;

      const token = data.accessToken || data.token || data.access_token;
      const user = data.user || data;

      if (token) localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch {
      setError("Dang nhap that bai. Kiem tra backend hoac tai khoan.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">MYOVISION ID</h1>
        <p className="mt-1 text-sm text-gray-500">Dang nhap he thong quan ly can thi</p>

        <label className="mt-6 block text-sm font-medium">Username / Email</label>
        <input
          className="mt-2 w-full rounded-lg border px-3 py-2"
          value={form.usernameOrEmail}
          onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
        />

        <label className="mt-4 block text-sm font-medium">Password</label>
        <input
          type="password"
          className="mt-2 w-full rounded-lg border px-3 py-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <button className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">
          Dang nhap
        </button>
      </form>
    </div>
  );
}
