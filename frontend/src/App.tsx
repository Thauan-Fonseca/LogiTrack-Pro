import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";
import ViagensPage from "./pages/ViagensPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RequireAuth from "./components/RequireAuth";
import ThemeToggle from "./components/ThemeToggle";
import LogoutButton from "./components/LogoutButton";
import { useTheme } from "./hooks/useTheme";
import "./App.css";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="11" width="4" height="9" />
        <rect x="10" y="6" width="4" height="14" />
        <rect x="16" y="3" width="4" height="17" />
      </svg>
    ),
  },
  {
    to: "/viagens",
    label: "Viagens",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
];

function NavItems() {
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </>
  );
}

function AppShell() {
  const { theme, alternar } = useTheme();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">LogiTrack Pro</div>
        <nav className="sidebar-nav">
          <NavItems />
        </nav>
        <div className="sidebar-footer">
          <ThemeToggle theme={theme} onToggle={alternar} />
          <LogoutButton />
        </div>
      </aside>

      <div className="app-main">
        <header className="mobile-topbar">
          <span className="brand">LogiTrack Pro</span>
          <div className="mobile-topbar-actions">
            <ThemeToggle theme={theme} onToggle={alternar} />
            <LogoutButton />
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>

        <nav className="bottom-nav">
          <NavItems />
        </nav>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/viagens" element={<ViagensPage />} />
      </Route>
    </Routes>
  );
}

export default App;
