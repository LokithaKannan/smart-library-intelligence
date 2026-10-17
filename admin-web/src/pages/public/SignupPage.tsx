import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { Library, Mail, Lock, User, Briefcase, Eye, EyeOff, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";

const ROLES = [
  { value: "student", label: "Student" },
  { value: "admin", label: "Admin / Librarian" },
];

const DEPARTMENTS = [
  "Computer Science", "Data Science", "Electronics",
  "Mechanical", "Civil", "Electrical", "Other",
];

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", department: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSignup = async () => {
    setError("");
    if (!form.name.trim()) { setError("Full name is required"); return; }
    if (!form.email.trim()) { setError("Email is required"); return; }
    if (!form.password || form.password.length < 4) { setError("Password must be at least 4 characters"); return; }
    setLoading(true);
    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px 11px 38px",
    borderRadius: "8px", border: "1px solid #1a2235",
    background: "#080B12", color: "#fff",
    fontSize: "14px", outline: "none",
  };

  const labelStyle = { fontSize: "12px", color: "#9AA5BE", display: "block" as const, marginBottom: "6px", fontWeight: 500 };

  return (
    <div style={{ minHeight: "100vh",  display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px 40px" }}>
        <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(64,224,208,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(64,224,208,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

        <div style={{
          background: "#0D1117", borderRadius: "16px", padding: "36px 32px",
          width: "100%", maxWidth: "600px",
          border: "1px solid #1a2235",
          boxShadow: "0 0 60px rgba(64,224,208,0.05)",
          position: "relative",
        }}>
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, #40E0D0, transparent)" }} />

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{
              width: "50px", height: "50px", borderRadius: "14px",
              background: "linear-gradient(135deg, #40E0D0, #0EA5E9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px",
              boxShadow: "0 0 24px rgba(64,224,208,0.3)",
            }}>
              <Library size={22} color="#000" strokeWidth={2.5} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>Create Account</h1>
            <p style={{ fontSize: "13px", color: "#6B7A99", marginTop: "4px" }}>Sign up to get started</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#40E0D0" }} />
                <input value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="Enter your full name" style={inputStyle} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#40E0D0" }} />
                <input value={form.email} onChange={(e) => set("email", e.target.value)}
                  type="email" placeholder="Enter your email" style={inputStyle} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#40E0D0" }} />
                <input value={form.password} onChange={(e) => set("password", e.target.value)}
                  type={showPass ? "text" : "password"} placeholder="Min 4 characters" style={inputStyle} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6B7A99", display: "flex" }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p style={{ fontSize: "11px", color: "#4B5675", marginTop: "4px" }}>Password must be at least 4 characters</p>
            </div>

            {/* Role */}
            <div>
              <label style={labelStyle}>Role</label>
              <div style={{ position: "relative" }}>
                <Briefcase size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#40E0D0" }} />
                <select value={form.role} onChange={(e) => set("role", e.target.value)}
                  style={{ ...inputStyle, appearance: "none" as const }}>
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>

            {/* Department */}
            {form.role === "student" && (
              <div>
                <label style={labelStyle}>Department</label>
                <div style={{ position: "relative" }}>
                  <Briefcase size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#40E0D0" }} />
                  <select value={form.department} onChange={(e) => set("department", e.target.value)}
                    style={{ ...inputStyle, appearance: "none" as const }}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            )}

            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "10px 12px", fontSize: "12.5px", color: "#F87171" }}>
                ⚠ {error}
              </div>
            )}

            <button onClick={handleSignup} disabled={loading} style={{
              padding: "12px", borderRadius: "8px", border: "none",
              background: loading ? "#1a2235" : "linear-gradient(135deg, #40E0D0, #0EA5E9)",
              color: loading ? "#6B7A99" : "#000", fontSize: "14px", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: loading ? "none" : "0 0 20px rgba(64,224,208,0.25)",
              marginTop: "4px",
            }}>
              {loading ? "Creating Account..." : <><span>Sign Up</span><ArrowRight size={16} /></>}
            </button>

            <div style={{ textAlign: "center", fontSize: "13px", color: "#6B7A99" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#40E0D0", textDecoration: "none", fontWeight: 600 }}>
                Login to Existing Account
              </Link>
            </div>

            <div style={{ textAlign: "center" }}>
              <Link to="/" style={{ fontSize: "12px", color: "#4B5675", textDecoration: "none" }}>← Back to Home</Link>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(64,224,208,0.3), transparent)" }} />
        </div>
      </div>

      <footer style={{ borderTop: "1px solid #1a2235", padding: "16px 40px", textAlign: "center" }}>
        <p style={{ color: "#4B5675", fontSize: "12px" }}>A smart solution for intelligent library management.</p>
        <p style={{ color: "#4B5675", fontSize: "12px", marginTop: "4px" }}>Contact: <span style={{ color: "#40E0D0" }}>support@smartlib.edu</span></p>
        <p style={{ color: "#2E3D55", fontSize: "11px", marginTop: "4px" }}>© 2025 All Rights Reserved</p>
      </footer>
    </div>
  );
}