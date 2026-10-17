import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  BookOpen, Search, Brain, BarChart2, BookMarked, Zap,
  ChevronLeft, ChevronRight,Users,
  ArrowRight, Library,
} from "lucide-react";

// Reusable glow curve SVG
const GlowCurve = ({ flip = false }: { flip?: boolean }) => (
  <div style={{ position: "relative", width: "100%", height: "120px", overflow: "hidden" }}>
    <div style={{
      position: "absolute", bottom: -50, left: "50%",
      transform: `translateX(-50%) ${flip ? "scaleY(-1)" : ""}`,
      width: "100%",
    }}>
      <svg viewBox="0 0 1200 200" style={{ width: "100%", height: "auto" }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${flip}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#40E0D0", stopOpacity: 0 }} />
            <stop offset="25%" style={{ stopColor: "#40E0D0", stopOpacity: 0.6 }} />
            <stop offset="50%" style={{ stopColor: "#40E0D0", stopOpacity: 1 }} />
            <stop offset="75%" style={{ stopColor: "#40E0D0", stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: "#40E0D0", stopOpacity: 0 }} />
          </linearGradient>
          <filter id={`glow-${flip}`}>
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M0,150 Q300,50 600,80 T1200,150" fill="none"
          stroke={`url(#grad-${flip})`} strokeWidth="2.5"
          filter={`url(#glow-${flip})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, filter: "blur(12px)" }}>
        <svg viewBox="0 0 1200 200" style={{ width: "100%", height: "auto" }} preserveAspectRatio="none">
          <path d="M0,150 Q300,50 600,80 T1200,150" fill="none"
            stroke="#40E0D0" strokeWidth="5" opacity="0.3" />
        </svg>
      </div>
    </div>
  </div>
);

const features = [
  { icon: BookOpen, title: "Smart Book Catalog", desc: "Search, filter and browse 15+ books across genres with real-time availability." },
  { icon: Search, title: "Intelligent Search", desc: "Find books by title, author or genre instantly with smart filtering." },
  { icon: Brain, title: "AI Learning Paths", desc: "Get personalized book recommendations using our Groq LLaMA AI assistant." },
  { icon: BarChart2, title: "Demand Forecasting", desc: "3-month moving average forecast predicts next month's borrowing trends." },
  { icon: BookMarked, title: "Issue & Return", desc: "Seamless book issue and return with automatic fine calculation." },
  { icon: Zap, title: "Real-Time Analytics", desc: "Live dashboard showing transactions, overdue books, and genre distribution." },
];

const howItWorks = [
  { step: "01", title: "Sign Up / Login", desc: "Create your account as admin or student. Your data is stored securely in MongoDB." },
  { step: "02", title: "Browse the Catalog", desc: "Search across 15+ books filtered by genre, author, or title with live availability." },
  { step: "03", title: "Issue or Return Books", desc: "Admins process book issues and returns. Fines auto-calculated for overdue books." },
  { step: "04", title: "Get AI Recommendations", desc: "Chat with our AI assistant to get a personalized learning path based on your history." },
  { step: "05", title: "View Analytics", desc: "See dashboard stats, genre trends, and moving average demand forecast." },
];

const benefits = [
  { title: "Eliminates Manual Record Keeping", desc: "Automate book tracking, student records, and transaction history in one place." },
  { title: "Reduces Book Shortages", desc: "Forecast demand ahead of time to ensure popular books are always available." },
  { title: "Personalized Learning", desc: "AI-powered recommendations help students discover books that match their learning goals." },
  { title: "Zero Billing Errors", desc: "Automatic fine calculation ensures accurate overdue charges every time." },
  { title: "Real-Time Visibility", desc: "Admins see live data on issues, returns, overdue books, and student activity." },
];

const whoUses = [
  "Library Administrators",
  "University Students",
  "Department Librarians",
  "Academic Researchers",
  "College Faculty",
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => setCurrentSlide((p) => (p + 1) % benefits.length);
  const prev = () => setCurrentSlide((p) => (p - 1 + benefits.length) % benefits.length);

  return (
    <div style={{ minHeight: "100vh", background: "#060810", color: "#fff", overflowX: "hidden" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        paddingTop: "50px", paddingBottom: "20px",
        textAlign: "center", position: "relative",
        padding: "120px 40px 40px",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(64,224,208,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(64,224,208,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px", pointerEvents: "none",
        }} />
        {/* Glow orbs */}
        <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(64,224,208,0.05), transparent 70%)", top: "-100px", left: "-200px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.05), transparent 70%)", bottom: "0", right: "-100px", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{
            fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900,
            lineHeight: 1.1, letterSpacing: "-2px", marginBottom: "24px",
            color: "#fff",
          }}>
            Intelligent Library<br />
            <span style={{ color: "#40E0D0" }}>Management System</span>
          </h1>

          {/* Tagline pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 24px", borderRadius: "100px", marginBottom: "24px",
            background: "rgba(64,224,208,0.08)",
            border: "1px solid rgba(64,224,208,0.3)",
            boxShadow: "0 0 30px rgba(64,224,208,0.15)",
          }}>
            <span style={{ fontSize: "14px", color: "#40E0D0", fontWeight: 500 }}>
              Fast · Accurate · AI-Powered
            </span>
          </div>

          <p style={{
            fontSize: "17px", color: "#9AA5BE", lineHeight: 1.7,
            maxWidth: "600px", margin: "0 auto 36px",
          }}>
            SmartLib automates book management, tracks student borrowing history,
            forecasts demand, and provides personalized AI recommendations — all in one place.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/signup" style={{
              padding: "13px 28px", borderRadius: "10px",
              background: "linear-gradient(135deg, #40E0D0, #0EA5E9)",
              color: "#000", textDecoration: "none", fontSize: "15px", fontWeight: 700,
              boxShadow: "0 0 24px rgba(64,224,208,0.3)",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" style={{
              padding: "13px 28px", borderRadius: "10px",
              background: "rgba(64,224,208,0.08)", border: "1px solid rgba(64,224,208,0.2)",
              color: "#40E0D0", textDecoration: "none", fontSize: "15px", fontWeight: 600,
            }}>
              Login
            </Link>
            <Link to="/dashboard" style={{
              padding: "13px 28px", borderRadius: "10px",
              background: "rgba(64,224,208,0.08)", border: "1px solid rgba(64,224,208,0.2)",
              color: "#40E0D0", textDecoration: "none", fontSize: "15px", fontWeight: 600,
            }}>
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      <GlowCurve />

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "20px 150px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "12px" }}>
              Key Features
            </h2>
            <p style={{ color: "#6B7A99", fontSize: "15px" }}>
              Everything you need to manage a modern university library
            </p>
          </div>

          {/* Top 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}>
            {features.slice(0, 3).map((f, i) => (
              <FeatureCard key={i} {...f} flip={i === 1} />
            ))}
          </div>
          {/* Bottom 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {features.slice(3).map((f, i) => (
              <FeatureCard key={i} {...f} flip={i === 1} />
            ))}
          </div>
        </div>
      </section>

      <GlowCurve flip />

      {/* ── BENEFITS SLIDER ── */}
      <section style={{ padding: "80px 60px", background: "linear-gradient(180deg, #060810, #0a1020)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "48px" }}>
            Why Use SmartLib?
          </h2>

          <div style={{ position: "relative" }}>
            {/* Decorative squares */}
            <div style={{ position: "absolute", top: "20px", right: "-20px", width: "32px", height: "32px", background: "rgba(64,224,208,0.2)", borderRadius: "6px", transform: "rotate(20deg)" }} />
            <div style={{ position: "absolute", bottom: "40px", left: "-20px", width: "48px", height: "40px", background: "rgba(64,224,208,0.15)", borderRadius: "6px", transform: "rotate(12deg)" }} />

            <div style={{ overflow: "hidden", borderRadius: "16px" }}>
              <div style={{ display: "flex", transition: "transform 0.5s ease", transform: `translateX(-${currentSlide * 100}%)` }}>
                {benefits.map((b, i) => (
                  <div key={i} style={{ minWidth: "100%", padding: "0 4px" }}>
                    <div style={{
                      background: "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      padding: "48px 40px",
                      height: "220px",
                      display: "flex", flexDirection: "column", justifyContent: "center",
                    }}>
                      <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#40E0D0", marginBottom: "16px" }}>
                        {b.title}
                      </h3>
                      <p style={{ fontSize: "15px", color: "#9AA5BE", lineHeight: 1.7 }}>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows */}
            <button onClick={prev} style={{
              position: "absolute", left: "-48px", top: "50%", transform: "translateY(-50%)",
              width: "40px", height: "40px", borderRadius: "50%",
              background: "rgba(64,224,208,0.1)", border: "1px solid rgba(64,224,208,0.3)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChevronLeft size={18} color="#40E0D0" />
            </button>
            <button onClick={next} style={{
              position: "absolute", right: "-48px", top: "50%", transform: "translateY(-50%)",
              width: "40px", height: "40px", borderRadius: "50%",
              background: "rgba(64,224,208,0.1)", border: "1px solid rgba(64,224,208,0.3)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChevronRight size={18} color="#40E0D0" />
            </button>

            {/* Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
              {benefits.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} style={{
                  height: "8px", borderRadius: "4px", border: "none", cursor: "pointer",
                  width: currentSlide === i ? "28px" : "8px",
                  background: currentSlide === i ? "#40E0D0" : "rgba(255,255,255,0.2)",
                  transition: "all 0.3s",
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <GlowCurve />

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "20px 60px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "60px", textAlign: "center" }}>
            How It Works
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {howItWorks.map((step, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "24px",
                flexDirection: i % 2 === 0 ? "row" : "row-reverse",
              }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%", flexShrink: 0,
                  background: "rgba(64,224,208,0.1)",
                  border: "1px solid rgba(64,224,208,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 24px rgba(64,224,208,0.2)",
                  fontSize: "16px", fontWeight: 800, color: "#40E0D0",
                }}>
                  {step.step}
                </div>
                <div style={{ flex: 1, textAlign: i % 2 === 0 ? "left" : "right", paddingTop: "8px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: "#fff" }}>
                    {step.title}
                  </h3>
                  <p style={{ color: "#6B7A99", fontSize: "14px", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GlowCurve flip />

      {/* ── WHO USES ── */}
      <section id="about" style={{ padding: "80px 60px", background: "linear-gradient(180deg, #060810, #0a1020)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "60px", textAlign: "center" }}>
            Who Uses SmartLib?
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
            {/* Left — icon illustration */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{
                width: "220px", height: "220px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(64,224,208,0.1), rgba(14,165,233,0.05))",
                border: "1px solid rgba(64,224,208,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 60px rgba(64,224,208,0.1)",
              }}>
                <Users size={80} color="#40E0D0" strokeWidth={1} />
              </div>
            </div>

            {/* Right — roles */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {whoUses.map((role, i) => (
                <div key={i} style={{
                  padding: "14px 20px", borderRadius: "10px", textAlign: "center",
                  background: i % 2 === 0
                    ? "linear-gradient(90deg, rgba(64,224,208,0.08), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(64,224,208,0.08))",
                  border: "1px solid rgba(64,224,208,0.2)",
                  fontSize: "14px", fontWeight: 600, color: "#E2E8F0",
                }}>
                  {i + 1}. {role}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid #1a2235", padding: "28px 60px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Library size={16} color="#40E0D0" />
          <span style={{ color: "#40E0D0", fontWeight: 700, fontSize: "14px" }}>SmartLib</span>
          <span style={{ color: "#4B5675", fontSize: "13px" }}>— Intelligent Library Management</span>
        </div>
        <div style={{ color: "#4B5675", fontSize: "12px" }}>
          © 2025 SmartLib. Built for academic excellence.
        </div>
        <div style={{ color: "#4B5675", fontSize: "12px" }}>
          Contact: <span style={{ color: "#40E0D0" }}>support@smartlib.edu</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, flip }: { icon: any; title: string; desc: string; flip?: boolean }) {
  return (
    <div style={{
      borderRadius: "16px", padding: "1px",
      background: flip
        ? "linear-gradient(180deg, rgba(64,224,208,0.4), rgba(0,0,0,0.8))"
        : "linear-gradient(0deg, rgba(64,224,208,0.4), rgba(0,0,0,0.8))",
      transition: "transform 0.2s",
      cursor: "default",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{
        borderRadius: "15px", padding: "24px",
        background: "rgba(6,8,16,0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.06)",
        height: "100%",
      }}>
        <div style={{
          width: "42px", height: "42px", borderRadius: "10px",
          background: "rgba(64,224,208,0.1)", border: "1px solid rgba(64,224,208,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
        }}>
          <Icon size={20} color="#40E0D0" strokeWidth={1.8} />
        </div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#40E0D0", marginBottom: "10px" }}>
          {title}
        </h3>
        <p style={{ fontSize: "13.5px", color: "#9AA5BE", lineHeight: 1.7 }}>{desc}</p>
      </div>
    </div>
  );
}