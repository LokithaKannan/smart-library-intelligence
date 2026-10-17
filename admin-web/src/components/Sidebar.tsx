import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";
import {
  LayoutDashboard, BookOpen, ArrowLeftRight, Users, BarChart2,
  BookMarked, Bot, Settings, HelpCircle, Library, LogOut,
  Search, BookCopy, ChevronRight,
} from "lucide-react";

const adminLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/books", label: "Books Catalog", icon: BookOpen },
  { to: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/dashboard/students", label: "Students", icon: Users },
  { to: "/dashboard/forecast", label: "Reports & Analytics", icon: BarChart2 },
  { to: "/dashboard/issue", label: "Issue / Return", icon: BookMarked },
];

const studentLinks = [
  { to: "/dashboard", label: "My Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/browse", label: "Browse Books", icon: Search },
  { to: "/dashboard/mybooks", label: "My Books", icon: BookCopy },
  { to: "/dashboard/chat", label: "AI Assistant", icon: Bot },
];

const bottomLinks = [
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
  { to: "/dashboard/help", label: "Help & Support", icon: HelpCircle },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === "admin" ? adminLinks : studentLinks;

  return (
    <aside style={{
      width: "245px",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #090C14 0%, #0D1117 100%)",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0, top: 0,
      zIndex: 100,
      borderRight: "1px solid #1a2235",
    }}>
      {/* Logo */}
      <div style={{
        padding: "22px 18px 18px",
        borderBottom: "1px solid #1a2235",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "10px",
          background: "linear-gradient(135deg, #40E0D0, #0EA5E9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 16px rgba(64,224,208,0.3)", flexShrink: 0,
        }}>
          <Library size={19} color="#000" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
            SmartLib
          </div>
          <div style={{ fontSize: "10px", color: "#40E0D0", letterSpacing: "0.1em", fontWeight: 600 }}>
            {user?.role === "admin" ? "ADMIN PANEL" : "STUDENT PORTAL"}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1px" }}>
        <div style={{ fontSize: "10px", color: "#2E3D55", fontWeight: 700, padding: "6px 8px 8px", letterSpacing: "0.1em" }}>
          MAIN MENU
        </div>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/dashboard"}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 12px", borderRadius: "8px",
              color: isActive ? "#40E0D0" : "#6B7A99",
              textDecoration: "none", fontSize: "13px",
              fontWeight: isActive ? 600 : 400,
              background: isActive
                ? "linear-gradient(90deg, rgba(64,224,208,0.12), rgba(64,224,208,0.04))"
                : "transparent",
              border: isActive ? "1px solid rgba(64,224,208,0.2)" : "1px solid transparent",
              transition: "all 0.15s",
              position: "relative" as const,
            })}
          >
            {({ isActive }) => (
              <>
                <link.icon size={15} strokeWidth={isActive ? 2.5 : 1.8} />
                <span style={{ flex: 1 }}>{link.label}</span>
                {isActive && <ChevronRight size={12} strokeWidth={2.5} style={{ opacity: 0.6 }} />}
              </>
            )}
          </NavLink>
        ))}

        {user?.role === "admin" && (
          <>
            <div style={{ fontSize: "10px", color: "#2E3D55", fontWeight: 700, padding: "14px 8px 8px", letterSpacing: "0.1em" }}>
              AI FEATURES
            </div>
            <NavLink
              to="/dashboard/chat"
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 12px", borderRadius: "8px",
                color: isActive ? "#40E0D0" : "#6B7A99",
                textDecoration: "none", fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                background: isActive
                  ? "linear-gradient(90deg, rgba(64,224,208,0.12), rgba(64,224,208,0.04))"
                  : "transparent",
                border: isActive ? "1px solid rgba(64,224,208,0.2)" : "1px solid transparent",
                transition: "all 0.15s",
              })}
            >
              {({ isActive }) => (
                <>
                  <Bot size={15} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span style={{ flex: 1 }}>AI Assistant</span>
                  {isActive && <ChevronRight size={12} strokeWidth={2.5} style={{ opacity: 0.6 }} />}
                </>
              )}
            </NavLink>
          </>
        )}

        <div style={{ fontSize: "10px", color: "#2E3D55", fontWeight: 700, padding: "14px 8px 8px", letterSpacing: "0.1em" }}>
          SUPPORT
        </div>
        {bottomLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 12px", borderRadius: "8px",
              color: isActive ? "#40E0D0" : "#6B7A99",
              textDecoration: "none", fontSize: "13px",
              fontWeight: isActive ? 600 : 400,
              background: isActive
                ? "linear-gradient(90deg, rgba(64,224,208,0.12), rgba(64,224,208,0.04))"
                : "transparent",
              border: isActive ? "1px solid rgba(64,224,208,0.2)" : "1px solid transparent",
              transition: "all 0.15s",
            })}
          >
            {({ isActive }) => (
              <>
                <link.icon size={15} strokeWidth={isActive ? 2.5 : 1.8} />
                <span style={{ flex: 1 }}>{link.label}</span>
                {isActive && <ChevronRight size={12} strokeWidth={2.5} style={{ opacity: 0.6 }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div style={{ padding: "10px", borderTop: "1px solid #1a2235" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", borderRadius: "10px",
          background: "#080B12",
          border: "1px solid #1a2235",
        }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "linear-gradient(135deg, #40E0D0, #0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 800, color: "#000", flexShrink: 0,
            boxShadow: "0 0 10px rgba(64,224,208,0.25)",
          }}>
            {user?.name.charAt(0)}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.name}
            </div>
            <div style={{ fontSize: "10px", color: "#40E0D0", textTransform: "capitalize", fontWeight: 500 }}>
              {user?.role}
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            title="Logout"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#6B7A99", padding: "4px", display: "flex",
              borderRadius: "6px", transition: "all 0.15s",
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}