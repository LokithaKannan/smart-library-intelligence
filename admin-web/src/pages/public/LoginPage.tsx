import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { Library, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Navbar from "../../components/Navbar";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) { setError("Email is required"); return; }
    if (!password.trim()) { setError("Password is required"); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px 11px 38px",
    borderRadius: "8px", border: "1px solid #1a2235",
    background: "#080B12", color: "#fff",
    fontSize: "14px", outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 20px 40px" }}>
        {/* Grid bg */}
        <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(64,224,208,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(64,224,208,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

        <div style={{
          background: "#0D1117", borderRadius: "16px", padding: "36px 32px",
          width: "100%", maxWidth: "500px",
          border: "1px solid #1a2235",
          boxShadow: "0 0 60px rgba(64,224,208,0.05)",
          position: "relative",
        }}>
          {/* Top accent line */}
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, #40E0D0, transparent)" }} />

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{
              width: "50px", height: "50px", borderRadius: "14px",
              background: "linear-gradient(135deg, #40E0D0, #0EA5E9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
              boxShadow: "0 0 24px rgba(64,224,208,0.3)",
            }}>
              <Library size={22} color="#000" strokeWidth={2.5} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>Welcome Back</h1>
            <p style={{ fontSize: "13px", color: "#6B7A99", marginTop: "4px" }}>Login to access your dashboard</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: "12px", color: "#9AA5BE", display: "block", marginBottom: "6px", fontWeight: 500 }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#40E0D0" }} />
                <input value={email} onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter your email" style={inputStyle} type="email" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: "12px", color: "#9AA5BE", display: "block", marginBottom: "6px", fontWeight: 500 }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#40E0D0" }} />
                <input value={password} onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  type={showPass ? "text" : "password"} placeholder="Enter your password" style={inputStyle} />
                <button onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#6B7A99",
                  display: "flex",
                }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div style={{ textAlign: "right", marginTop: "6px" }}>
                <span style={{ fontSize: "12px", color: "#40E0D0", cursor: "pointer" }}>Forgot Password?</span>
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "10px 12px", fontSize: "12.5px", color: "#F87171" }}>
                ⚠ {error}
              </div>
            )}

            <button onClick={handleLogin} disabled={loading} style={{
              padding: "12px", borderRadius: "8px", border: "none",
              background: loading ? "#1a2235" : "linear-gradient(135deg, #40E0D0, #0EA5E9)",
              color: loading ? "#6B7A99" : "#000", fontSize: "14px", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: loading ? "none" : "0 0 20px rgba(64,224,208,0.25)",
              marginTop: "4px",
            }}>
              {loading ? "Signing in..." : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>

            <div style={{ textAlign: "center", fontSize: "13px", color: "#6B7A99" }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "#40E0D0", textDecoration: "none", fontWeight: 600 }}>
                Create New Account
              </Link>
            </div>

            <div style={{ textAlign: "center" }}>
              <Link to="/" style={{ fontSize: "12px", color: "#4B5675", textDecoration: "none" }}>
                ← Back to Home
              </Link>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(64,224,208,0.3), transparent)" }} />
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1a2235", padding: "16px 40px", textAlign: "center" }}>
        <p style={{ color: "#4B5675", fontSize: "12px" }}>A smart solution for intelligent library management.</p>
        <p style={{ color: "#4B5675", fontSize: "12px", marginTop: "4px" }}>Contact: <span style={{ color: "#40E0D0" }}>support@smartlib.edu</span></p>
        <p style={{ color: "#2E3D55", fontSize: "11px", marginTop: "4px" }}>© 2025 All Rights Reserved</p>
      </footer>
    </div>
  );
}