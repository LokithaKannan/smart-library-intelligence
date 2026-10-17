import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";
import { Library, Search, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDashboard = () => {
    if (user) navigate("/dashboard");
    else navigate("/login");
  };

  const linkStyle = {
    color: "#e1e1e1",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    padding: "6px 14px",
    borderRadius: "100px",
    transition: "all 0.2s",
    cursor: "pointer",
    background: "transparent",
    border: "none",
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "rgba(6,8,16,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #0b101c",
      padding: "0 40px",
      height: "70px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg, #40E0D0, #0EA5E9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 16px rgba(64,224,208,0.3)",
        }}>
          <Library size={18} color="#000" strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: "18px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
          SmartLib
        </span>
      </Link>

      {/* Center nav links */}
      <div style={{
        display: "flex", alignItems: "center", gap: "2px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid #262d3e",
        borderRadius: "100px",
        padding: "6px 8px",
      }}>
        <Link to="/"
          style={linkStyle}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#e1e1e1"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          Home
        </Link>

        {(["features", "how-it-works", "about"] as const).map((id) => {
          const labels: Record<string, string> = {
            "features": "Features",
            "how-it-works": "How It Works",
            "about": "About",
          };
          return (
            <button key={id}
              onClick={() => scrollToSection(id)}
              style={linkStyle as any}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#e1e1e1"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {labels[id]}
            </button>
          );
        })}

        <button
          onClick={handleDashboard}
          style={linkStyle as any}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#40E0D0"; (e.currentTarget as HTMLElement).style.background = "rgba(64,224,208,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#e1e1e1"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          Dashboard
        </button>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button style={{
          width: "36px", height: "36px", borderRadius: "8px",
          background: "rgba(255,255,255,0.05)", border: "1px solid #1a2235",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <Search size={15} color="#9AA5BE" />
        </button>

        {user ? (
          <>
            <button onClick={() => navigate("/dashboard")} style={{
              padding: "8px 16px", borderRadius: "8px",
              background: "rgba(64,224,208,0.1)", border: "1px solid rgba(64,224,208,0.25)",
              color: "#40E0D0", fontSize: "13px", fontWeight: 600, cursor: "pointer",
            }}>
              Dashboard
            </button>
            <button onClick={handleLogout} style={{
              padding: "8px 14px", borderRadius: "8px",
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
              color: "#F87171", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
            }}>
              <LogOut size={13} /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{
            padding: "8px 22px", borderRadius: "8px",
            background: "linear-gradient(135deg, #40E0D0, #0EA5E9)",
            color: "#000", textDecoration: "none", fontSize: "13px", fontWeight: 700,
            boxShadow: "0 0 16px rgba(64,224,208,0.25)",
          }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}