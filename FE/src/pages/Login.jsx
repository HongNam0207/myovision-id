import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, meApi } from "../api/auth.api";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({ username, password });
      const data = res.data ?? res;

      const token = data.accessToken || data.token || data.access_token;
      if (!token) throw new Error("Không nh?n du?c access token");

      localStorage.setItem("access_token", token);

      const meRes = await meApi();
      const me = meRes.data ?? meRes;
      localStorage.setItem("user", JSON.stringify(me));

      const role = me.role || me.roleCode || me.roles?.[0];

      if (role === "ADMIN") navigate("/admin");
      else if (role === "OPHTHALMOLOGIST") navigate("/doctor");
      else if (role === "OPTOMETRIST") navigate("/optometrist");
      else if (role === "NURSE") navigate("/nurse");
      else if (role === "PARENT") navigate("/parent");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Ðang nh?p th?t b?i");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-slate-900">MYOVISION ID</h1>
        <p className="mt-1 text-sm text-slate-500">Ðang nh?p h? th?ng</p>

        <div className="mt-6">
          <label className="text-sm font-medium">Tài kho?n</label>
          <input
            className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">M?t kh?u</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Ðang dang nh?p..." : "Ðang nh?p"}
        </button>
      </form>
    </div>
  );
}
