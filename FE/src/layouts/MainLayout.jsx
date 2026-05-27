import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRound,
  CalendarDays,
  ClipboardList,
  Activity,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import BrandLogo from "../components/common/BrandLogo";

const menuByRole = {
  ADMIN: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Người dùng", path: "/admin/users", icon: Users },
    { label: "Role & quyền", path: "/admin/roles", icon: Settings },
    { label: "Phòng khám", path: "/admin/clinics", icon: ClipboardList },
  ],
  OPHTHALMOLOGIST: [
    { label: "Dashboard", path: "/doctor/dashboard", icon: LayoutDashboard },
    { label: "Hàng chờ khám", path: "/doctor/visits", icon: ClipboardList },
    { label: "Bệnh nhi", path: "/patients", icon: UserRound },
    { label: "Báo cáo", path: "/reports", icon: FileText },
  ],
  OPTOMETRIST: [
    { label: "Dashboard", path: "/optometrist/dashboard", icon: LayoutDashboard },
    { label: "Chờ đo mắt", path: "/optometrist/queue", icon: Activity },
    { label: "Lịch sử đo", path: "/measurements/history", icon: ClipboardList },
  ],
  NURSE: [
    { label: "Dashboard", path: "/nurse/dashboard", icon: LayoutDashboard },
    { label: "Bệnh nhi", path: "/patients", icon: UserRound },
    { label: "Lượt khám", path: "/visits", icon: ClipboardList },
    { label: "Lịch hẹn", path: "/appointments", icon: CalendarDays },
  ],
  PARENT: [
    { label: "Dashboard", path: "/parent/dashboard", icon: LayoutDashboard },
    { label: "Con của tôi", path: "/parent/children", icon: UserRound },
    { label: "Lịch hẹn", path: "/parent/appointments", icon: CalendarDays },
    { label: "Báo cáo", path: "/parent/reports", icon: FileText },
  ],
};

export default function MainLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const role =
    user.role ||
    user.roleCode ||
    user.roles?.[0] ||
    user.roles?.[0]?.roleCode ||
    "ADMIN";

  const menus = menuByRole[role] || menuByRole.ADMIN;

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="dd-shell">
      <aside className="dd-sidebar">
        <Link to="/" className="dd-sidebar-brand">
          <BrandLogo />
        </Link>

        <div className="dd-sidebar-section-title">Điều hướng</div>

        <nav className="dd-sidebar-nav">
          {menus.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `dd-nav-item ${isActive ? "dd-nav-item-active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="dd-sidebar-footer">
          <div className="dd-role-card">
            <div className="dd-role-avatar">
              {(user.fullName || user.full_name || "U").charAt(0)}
            </div>

            <div>
              <div className="dd-role-name">
                {user.fullName || user.full_name || user.username || "User"}
              </div>
              <div className="dd-role-code">{role}</div>
            </div>
          </div>

          <button onClick={logout} className="dd-logout-btn">
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="dd-main">
        <header className="dd-topbar">
          <div>
            <div className="dd-topbar-title">Khoa Mắt - Bệnh viện Đông Đô</div>
            <div className="dd-topbar-subtitle">
              Hệ thống quản lý cận thị MYOVISION ID
            </div>
          </div>

          <div className="dd-badge dd-badge-blue">{role}</div>
        </header>

        <section className="dd-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
