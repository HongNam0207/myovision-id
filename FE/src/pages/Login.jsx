import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usernameOrEmail: "admin",
    password: "123456",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await authApi.login(form);

      const data = res.data?.data || res.data;

      const token =
        data.accessToken ||
        data.token ||
        data.access_token;

      const user = data.user || data;

      if (token) {
        localStorage.setItem("access_token", token);
      }

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate("/dashboard");
    } catch {
      setError(
        "Đăng nhập thất bại. Vui lòng kiểm tra backend hoặc tài khoản."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <div
        style={{
          width: "100%",
          maxWidth: 1180,
          display: "grid",
          gridTemplateColumns: "1.1fr .9fr",
          gap: 28,
          alignItems: "center",
        }}
      >
        <section
          className="card"
          style={{
            padding: 42,
            minHeight: 620,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg,#005da8 0%,#00457f 55%,#003764 100%)",
            color: "white",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.12,
              background:
                "radial-gradient(circle at top right,white 0,transparent 35%)",
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "inline-flex",
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,.12)",
                border: "1px solid rgba(255,255,255,.18)",
                marginBottom: 24,
                fontWeight: 800,
                letterSpacing: ".04em",
              }}
            >
              MYOVISION ID
            </div>

            <h1
              style={{
                fontSize: 56,
                lineHeight: 1.05,
                margin: 0,
                fontWeight: 950,
                letterSpacing: "-0.04em",
              }}
            >
              Hệ thống quản lý
              <br />
              cận thị học đường
            </h1>

            <p
              style={{
                marginTop: 24,
                maxWidth: 560,
                fontSize: 18,
                lineHeight: 1.8,
                color: "#d9f1ff",
              }}
            >
              Nền tảng hỗ trợ điều dưỡng, khúc xạ,
              bác sĩ nhãn khoa và phụ huynh theo
              dõi tiến triển cận thị, workflow khám
              mắt và phác đồ điều trị.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(180px,1fr))",
                gap: 14,
                marginTop: 34,
              }}
            >
              <Feature
                title="Clinical Workflow"
                desc="Quản lý toàn bộ quy trình khám."
              />

              <Feature
                title="Progress Tracking"
                desc="Theo dõi AL/SER và nguy cơ."
              />

              <Feature
                title="Parent Portal"
                desc="Phụ huynh theo dõi tiến triển."
              />
            </div>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="card"
          style={{
            padding: 40,
            borderTop: "6px solid var(--brand)",
          }}
        >
          <div
            style={{
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 950,
                color: "var(--brand-dark)",
                letterSpacing: "-0.03em",
              }}
            >
              Đăng nhập
            </div>

            <p
              style={{
                marginTop: 10,
                color: "var(--muted)",
                lineHeight: 1.7,
              }}
            >
              Khoa Mắt Đông Đô · MYOVISION ID
            </p>
          </div>

          <label className="field">
            <span>Username / Email</span>

            <input
              value={form.usernameOrEmail}
              onChange={(e) =>
                setForm({
                  ...form,
                  usernameOrEmail:
                    e.target.value,
                })
              }
            />
          </label>

          <label
            className="field"
            style={{ marginTop: 18 }}
          >
            <span>Password</span>

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />
          </label>

          {error && (
            <div
              className="notice error"
              style={{ marginTop: 18 }}
            >
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="btn"
            style={{
              width: "100%",
              marginTop: 26,
              height: 52,
              fontSize: 16,
            }}
          >
            {loading
              ? "Đang đăng nhập..."
              : "Đăng nhập hệ thống"}
          </button>

          <div
            style={{
              marginTop: 26,
              paddingTop: 20,
              borderTop:
                "1px solid var(--line)",
              display: "grid",
              gap: 10,
              color: "var(--muted)",
              fontSize: 14,
            }}
          >
            <div>
              Demo Admin: admin / 123456
            </div>

            <div>
              Demo Doctor: doctor01 / 123456
            </div>

            <div>
              Demo Nurse: nurse01 / 123456
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div
      style={{
        borderRadius: 22,
        padding: 20,
        background: "rgba(255,255,255,.10)",
        border: "1px solid rgba(255,255,255,.14)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          fontWeight: 900,
          fontSize: 15,
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#d9f1ff",
          lineHeight: 1.7,
          fontSize: 14,
        }}
      >
        {desc}
      </div>
    </div>
  );
}