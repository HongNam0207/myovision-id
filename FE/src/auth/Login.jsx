import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { authApi } from "../api/auth.api";
import BrandLogo from "../components/common/BrandLogo";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await authApi.login({ usernameOrEmail: form.username, password: form.password });
      const data = res.data?.data || res.data;

      localStorage.setItem("access_token", data.accessToken || data.token);
      localStorage.setItem("user", JSON.stringify(data.user || data));

      const role = data.user?.role || data.role || data.roles?.[0];

      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "OPHTHALMOLOGIST") navigate("/doctor/dashboard");
      else if (role === "OPTOMETRIST") navigate("/optometrist/dashboard");
      else if (role === "NURSE") navigate("/nurse/dashboard");
      else if (role === "PARENT") navigate("/parent/dashboard");
      else navigate("/login");
    } catch {
      setError("Ðang nh?p th?t b?i. Vui lòng ki?m tra l?i tài kho?n ho?c m?t kh?u.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #E6F6FA 0, #F5FAFC 42%, #FFFFFF 100%)",
        display: "grid",
        gridTemplateColumns: "1.15fr 0.85fr",
      }}
    >
      <section
        style={{
          padding: 56,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <BrandLogo />

        <div style={{ maxWidth: 720 }}>
          <div className="dd-badge dd-badge-blue" style={{ marginBottom: 18 }}>
            H? th?ng qu?n lý c?n th? tr? em
          </div>

          <h1
            style={{
              fontSize: 54,
              lineHeight: 1.05,
              margin: 0,
              color: "var(--dd-primary-dark)",
              letterSpacing: -1.2,
            }}
          >
            MYOVISION ID
            <br />
            Qu?n lý khám m?t thông minh
          </h1>

          <p
            style={{
              marginTop: 22,
              color: "var(--dd-muted)",
              fontSize: 18,
              lineHeight: 1.7,
              maxWidth: 620,
            }}
          >
            Theo dõi h? so b?nh nhi, d? li?u khúc x?, sinh tr?c h?c, nguy co c?n th?,
            phác d? di?u tr? và ti?n tri?n AL/SER trên cùng m?t h? th?ng.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              marginTop: 34,
              maxWidth: 660,
            }}
          >
            {[
              ["5", "Role v?n hành"],
              ["AL/SER", "Theo dõi ti?n tri?n"],
              ["PDF", "Báo cáo ph? huynh"],
            ].map(([value, label]) => (
              <div className="dd-card" key={label}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "var(--dd-primary)",
                  }}
                >
                  {value}
                </div>
                <div style={{ color: "var(--dd-muted)", marginTop: 4 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: "var(--dd-muted)", fontSize: 13 }}>
          © MYOVISION ID - Khoa M?t B?nh vi?n Ðông Ðô
        </p>
      </section>

      <section
        style={{
          padding: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form
          onSubmit={handleLogin}
          className="dd-card"
          style={{
            width: "100%",
            maxWidth: 440,
            padding: 34,
            borderRadius: 28,
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              background: "var(--dd-primary-light)",
              color: "var(--dd-primary)",
              display: "grid",
              placeItems: "center",
              marginBottom: 20,
            }}
          >
            <ShieldCheck size={30} />
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 28,
              color: "var(--dd-primary-dark)",
            }}
          >
            Ðang nh?p
          </h2>

          <p style={{ color: "var(--dd-muted)", marginTop: 8, marginBottom: 26 }}>
            Vui lòng dang nh?p d? ti?p t?c s? d?ng h? th?ng.
          </p>

          {error && (
            <div
              style={{
                background: "#FEF2F2",
                color: "var(--dd-danger)",
                padding: 12,
                borderRadius: 12,
                marginBottom: 18,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <label style={{ fontWeight: 700 }}>Tài kho?n</label>
          <input
            className="dd-input"
            placeholder="Ví d?: admin"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={{ marginTop: 8, marginBottom: 18 }}
          />

          <label style={{ fontWeight: 700 }}>M?t kh?u</label>
          <div style={{ position: "relative", marginTop: 8, marginBottom: 22 }}>
            <input
              className="dd-input"
              type={showPassword ? "text" : "password"}
              placeholder="Nh?p m?t kh?u"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ paddingRight: 44 }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 10,
                top: 9,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "var(--dd-muted)",
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button className="dd-btn dd-btn-primary" style={{ width: "100%", padding: 13 }}>
            Ðang nh?p h? th?ng
          </button>

          <div
            style={{
              marginTop: 22,
              padding: 14,
              borderRadius: 14,
              background: "var(--dd-primary-light)",
              color: "var(--dd-primary-dark)",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Tài kho?n demo: admin / 123456, doctor01 / 123456, nurse01 / 123456.
          </div>
        </form>
      </section>
    </div>
  );
}
