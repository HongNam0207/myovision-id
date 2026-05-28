import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="login">
      <div className="card" style={{ maxWidth: 520, textAlign: "center" }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 950,
            color: "var(--danger)",
            lineHeight: 1,
          }}
        >
          403
        </div>

        <h1 style={{ color: "var(--brand-dark)", marginBottom: 8 }}>
          Không có quyền truy cập
        </h1>

        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Tài khoản của bạn không có quyền truy cập màn hình này.
        </p>

        <Link to="/dashboard" className="btn" style={{ marginTop: 22 }}>
          Về Dashboard
        </Link>
      </div>
    </div>
  );
}