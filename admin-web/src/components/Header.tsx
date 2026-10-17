import { useAuth } from "../services/auth";
import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();
  const now = new Date();
  const timeStr = now.toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      marginBottom: "28px", paddingBottom: "22px",
      borderBottom: "1px solid #1a2235",
    }}>
      <div>
        <h1 style={{
          fontSize: "22px", fontWeight: 800, color: "#fff",
          letterSpacing: "-0.5px", lineHeight: 1.2,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: "#6B7A99", fontSize: "13px", marginTop: "4px" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ textAlign: "right", marginRight: "4px" }}>
          <div style={{ fontSize: "11px", color: "#6B7A99" }}>{timeStr}</div>
          <div style={{ fontSize: "12px", color: "#40E0D0", fontWeight: 600 }}>
            Welcome, {user?.name.split(" ")[0]}!
          </div>
        </div>

        <button style={{
          width: "34px", height: "34px", borderRadius: "8px",
          background: "#0D1117", border: "1px solid #1a2235",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <Search size={14} color="#6B7A99" />
        </button>

        <button style={{
          width: "34px", height: "34px", borderRadius: "8px",
          background: "#0D1117", border: "1px solid #1a2235",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative" as const,
        }}>
          <Bell size={14} color="#6B7A99" />
          <div style={{
            position: "absolute", top: "7px", right: "7px",
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#40E0D0", border: "2px solid #060810",
          }} />
        </button>

        <div style={{
          width: "34px", height: "34px", borderRadius: "50%",
          background: "linear-gradient(135deg, #40E0D0, #0EA5E9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", fontWeight: 800, color: "#000",
          boxShadow: "0 0 12px rgba(64,224,208,0.3)",
          cursor: "pointer",
        }}>
          {user?.name.charAt(0)}
        </div>
      </div>
    </div>
  );
}