import { Link, Outlet, useLocation } from "react-router-dom";

const menus = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/patients", label: "Patients" },
  { to: "/visits", label: "Visit Queue" },
  { to: "/appointments", label: "Appointments" },
  { to: "/notifications", label: "Notifications" },
  { to: "/parent-portal", label: "Parent Portal" },
];

const adminMenus = [
  { to: "/admin/users", label: "Users" },
  { to: "/admin/roles", label: "Roles" },
  { to: "/admin/clinics", label: "Clinics" },
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      <aside
        style={{
          width: 260,
          background: "#0f172a",
          color: "white",
          padding: 24,
          position: "fixed",
          inset: 0,
          right: "auto",
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 32 }}>
          MYOVISION ID
        </h1>

        <div style={{ marginBottom: 12, color: "#94a3b8", fontSize: 13 }}>
          MAIN MENU
        </div>

        <nav style={{ display: "grid", gap: 8 }}>
          {menus.map((item) => {
            const active = location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: active ? "#2563eb" : "transparent",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            marginTop: 32,
            marginBottom: 12,
            color: "#94a3b8",
            fontSize: 13,
          }}
        >
          ADMIN
        </div>

        <nav style={{ display: "grid", gap: 8 }}>
          {adminMenus.map((item) => {
            const active = location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: active ? "#2563eb" : "transparent",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main
        style={{
          flex: 1,
          marginLeft: 260,
          padding: 24,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: 24,
            minHeight: "calc(100vh - 48px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
