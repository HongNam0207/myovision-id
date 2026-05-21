import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

const allTabs = [
  { label: "ADMIN", path: "/admin-dashboard", roles: ["admin"] },
  { label: "DASHBOARD", path: "/doctor-dashboard", roles: ["doctor"] },
  { label: "BỆNH NHI", path: "/patients", roles: ["admin", "doctor", "reception"] },
  { label: "HỒ SƠ", path: "/patient-detail", roles: ["admin", "doctor", "reception"] },
  { label: "KHÁM LÂM SÀNG", path: "/clinical-exam", roles: ["admin", "doctor", "technician"] },
  { label: "ĐÁNH GIÁ NGUY CƠ", path: "/risk-assessment", roles: ["admin", "doctor"] },
  { label: "ĐIỀU TRỊ", path: "/treatment", roles: ["admin", "doctor"] },
  { label: "TÁI KHÁM", path: "/follow-up", roles: ["admin", "doctor", "technician"] },
  { label: "TIẾN TRIỂN", path: "/analytics", roles: ["admin", "doctor"] },
  { label: "BÁO CÁO", path: "/reports", roles: ["admin", "doctor"] },
  { label: "TÀI KHOẢN", path: "/users", roles: ["admin"] },
];

const roleNames = {
  admin: "Admin",
  doctor: "Bác sĩ",
  reception: "Lễ tân",
  technician: "Kỹ thuật viên",
};

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("myovision_user") || "null");
  const role = user?.role || "doctor";
  const tabs = allTabs.filter((tab) => tab.roles.includes(role));

  async function logout() {
    await logoutUser();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-3 py-3 sm:flex-row sm:items-center sm:px-4 lg:px-6">
          <Link
            to={user?.dashboard || "/doctor-dashboard"}
            className="flex items-center gap-3 no-underline"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#2563EB] text-white shadow-lg shadow-blue-600/25">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <div>
              <h1 className="text-sm font-black tracking-wide text-slate-950">
                MYOVISION ID
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Module Quản lý Tiến triển Cận thị
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{user?.name || "Demo User"}</span>
              <span className="text-slate-300">|</span>
              <span>{roleNames[role]}</span>
            </div>

            <button className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-black text-[#2563EB]">
              VI / EN
            </button>

            <button
              onClick={logout}
              className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-black text-red-600"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        <nav className="app-scrollbar mx-auto flex max-w-7xl snap-x gap-2 overflow-x-auto px-3 pb-3 sm:px-4 lg:px-6">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                isActive
                  ? "shrink-0 snap-start rounded-xl bg-[#2563EB] px-3 py-2 text-[11px] font-black uppercase tracking-wide text-white shadow-sm no-underline sm:px-4 sm:text-xs"
                  : "shrink-0 snap-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-wide text-slate-500 no-underline sm:px-4 sm:text-xs"
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
        {children}
      </main>
    </div>
  );
}