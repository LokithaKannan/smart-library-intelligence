import { useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../services/auth";
import { User, Shield, Bell, Database } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "system", label: "Data & System", icon: Database },
];

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #1a2235", background: "#080B12",
    color: "#fff", fontSize: "14px", outline: "none",
  };

  return (
    <div>
      <Header title="Settings" subtitle="Manage your account and preferences" />

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "16px" }}>
        {/* Tab sidebar */}
        <div style={{ background: "#0D1117", borderRadius: "12px", padding: "10px", border: "1px solid #1a2235", height: "fit-content" }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: "8px",
                background: activeTab === tab.id ? "rgba(64,224,208,0.08)" : "transparent",
                border: activeTab === tab.id ? "1px solid rgba(64,224,208,0.2)" : "1px solid transparent",
                color: activeTab === tab.id ? "#40E0D0" : "#6B7A99",
                fontSize: "13px", fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                marginBottom: "2px", textAlign: "left" as const,
              }}>
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: "#0D1117", borderRadius: "12px", padding: "24px", border: "1px solid #1a2235" }}>
          {activeTab === "profile" && (
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>Profile Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {[
                  { label: "Full Name", value: user?.name },
                  { label: "Email Address", value: user?.email },
                  { label: "Role", value: user?.role },
                  { label: "Department", value: user?.department || "N/A" },
                ].map((item) => (
                  <div key={item.label}>
                    <label style={{ fontSize: "12px", color: "#6B7A99", display: "block", marginBottom: "6px" }}>{item.label}</label>
                    <input value={item.value || ""} readOnly style={{ ...inputStyle, color: "#9AA5BE" }} />
                  </div>
                ))}
              </div>
              {user?.role === "student" && (
                <div style={{ marginTop: "14px" }}>
                  <label style={{ fontSize: "12px", color: "#6B7A99", display: "block", marginBottom: "6px" }}>Student ID</label>
                  <input value={(user as any)?.studentId || "—"} readOnly style={{ ...inputStyle, color: "#40E0D0", width: "50%" }} />
                </div>
              )}
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>Security Settings</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "400px" }}>
                {["Current Password", "New Password", "Confirm Password"].map((label) => (
                  <div key={label}>
                    <label style={{ fontSize: "12px", color: "#6B7A99", display: "block", marginBottom: "6px" }}>{label}</label>
                    <input type="password" placeholder="••••••••" style={inputStyle} />
                  </div>
                ))}
                <button style={{ padding: "11px", borderRadius: "8px", background: "linear-gradient(135deg, #40E0D0, #0EA5E9)", color: "#000", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13px", marginTop: "4px" }}>
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>Notification Preferences</h3>
              {[
                { label: "Overdue book alerts", desc: "Get notified when books are overdue" },
                { label: "New book additions", desc: "Notify when new books are added" },
                { label: "Transaction updates", desc: "Notify on issue and return events" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1a2235" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#E2E8F0", fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: "12px", color: "#4B5675", marginTop: "2px" }}>{item.desc}</div>
                  </div>
                  <div style={{ width: "40px", height: "22px", borderRadius: "11px", background: i === 0 ? "#40E0D0" : "#1a2235", cursor: "pointer", position: "relative" as const }}>
                    <div style={{ position: "absolute" as const, top: "3px", left: i === 0 ? "20px" : "3px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "system" && (
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>System Information</h3>
              {[
                { label: "Backend API", value: "http://localhost:5000", color: "#40E0D0" },
                { label: "Database", value: "MongoDB (localhost:27017)", color: "#40E0D0" },
                { label: "AI Model", value: "LLaMA 3.3 70B (Groq)", color: "#40E0D0" },
                { label: "Forecast Method", value: "3-Month Moving Average", color: "#40E0D0" },
                { label: "Version", value: "1.0.0 — Development", color: "#6B7A99" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1a2235" }}>
                  <span style={{ fontSize: "13px", color: "#6B7A99" }}>{item.label}</span>
                  <span style={{ fontSize: "13px", color: item.color, fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}