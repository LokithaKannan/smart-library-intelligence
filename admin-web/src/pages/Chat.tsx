import { useEffect, useState, useRef } from "react";
import { chatWithAI, getAllStudents } from "../services/api";
import Header from "../components/Header";
import { Send, Bot, Users } from "lucide-react";
import { useAuth } from "../services/auth";

interface Message { role: "user" | "assistant"; content: string; }

export default function Chat() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your Smart Library Assistant. I can help you find books and create personalized learning paths. What would you like to explore today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // For admin: load students list to recommend for
  useEffect(() => {
    if (user?.role === "admin") {
      getAllStudents()
        .then((res) => {
          const list = res.data.data.students;
          setStudents(list);
        })
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Determine which studentId to use for AI context
  // Admin: uses selected student's context (optional), or sends as admin
  // Student: uses their own studentId
  const chatStudentId = user?.role === "student"
    ? user.studentId
    : selectedStudent?.studentId || null;

const send = async () => {
  if (!input.trim() || loading) return;
  if (user?.role === "student" && !chatStudentId) return;

  const msg = input.trim();
  setInput("");
  setMessages((p) => [...p, { role: "user", content: msg }]);
  setLoading(true);

  try {
    // In general mode (admin, no student selected), use a neutral admin ID
    const idToUse = user?.role === "student"
      ? user.studentId
      : selectedStudent?.studentId || "ADMIN";

    if (!idToUse) {
      setMessages((p) => [...p, { role: "assistant", content: "No student context available." }]);
      setLoading(false);
      return;
    }
    const res = await chatWithAI(idToUse, msg);
    setMessages((p) => [...p, { role: "assistant", content: res.data.data.reply }]);
  } catch {
    setMessages((p) => [...p, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
  } finally { setLoading(false); }
};

  return (
    <div>
      <Header title="AI Library Assistant" subtitle="Powered by Groq LLaMA — personalized book recommendations" />

      <div style={{ display: "grid", gridTemplateColumns: user?.role === "admin" ? "220px 1fr" : "1fr", gap: "14px" }}>

        {/* Admin: student context selector (optional) */}
        {user?.role === "admin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ background: "#0D1117", borderRadius: "12px", padding: "14px", border: "1px solid #1a2235" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#2E3D55", marginBottom: "10px", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "6px" }}>
                <Users size={11} /> GET RECOMMENDATIONS FOR
              </div>
              <div style={{ fontSize: "11px", color: "#4B5675", marginBottom: "10px" }}>
                Select a student to get AI recommendations based on their reading history
              </div>

              {/* No student selected option */}
              <div onClick={() => setSelectedStudent(null)}
                style={{
                  padding: "8px 10px", borderRadius: "8px", cursor: "pointer", marginBottom: "4px",
                  background: !selectedStudent ? "rgba(64,224,208,0.08)" : "transparent",
                  color: !selectedStudent ? "#40E0D0" : "#6B7A99",
                  fontSize: "12px", fontWeight: !selectedStudent ? 600 : 400,
                  border: !selectedStudent ? "1px solid rgba(64,224,208,0.2)" : "1px solid transparent",
                }}>
                General / No Context
              </div>

              {students.map((s) => (
                <div key={s.studentId} onClick={() => {
                  setSelectedStudent(s);
                  setMessages([{ role: "assistant", content: `I'll now recommend books based on ${s.name}'s reading history and interests. What would you like to know?` }]);
                }}
                  style={{
                    padding: "8px 10px", borderRadius: "8px", cursor: "pointer", marginBottom: "3px",
                    background: selectedStudent?.studentId === s.studentId ? "rgba(64,224,208,0.08)" : "transparent",
                    color: selectedStudent?.studentId === s.studentId ? "#40E0D0" : "#6B7A99",
                    fontSize: "12.5px",
                    border: selectedStudent?.studentId === s.studentId ? "1px solid rgba(64,224,208,0.2)" : "1px solid transparent",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: selectedStudent?.studentId === s.studentId ? "linear-gradient(135deg, #40E0D0, #0EA5E9)" : "#1a2235", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: selectedStudent?.studentId === s.studentId ? "#000" : "#4B5675", flexShrink: 0 }}>
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: "12px" }}>{s.name}</div>
                    <div style={{ fontSize: "10px", color: "#2E3D55" }}>{s.studentId}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat window */}
        <div style={{ background: "#0D1117", borderRadius: "12px", border: "1px solid #1a2235", display: "flex", flexDirection: "column", height: "580px" }}>
          {/* Header */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #1a2235", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #40E0D0, #0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={16} color="#000" />
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>SmartLib AI</div>
                <div style={{ fontSize: "11px", color: "#40E0D0", display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#40E0D0" }} /> Online
                </div>
              </div>
            </div>
            {/* Show context label for admin */}
            {user?.role === "admin" && (
              <div style={{ fontSize: "11px", color: "#4B5675", background: "#080B12", padding: "4px 10px", borderRadius: "6px", border: "1px solid #1a2235" }}>
                {selectedStudent ? `Context: ${selectedStudent.name}` : "General mode"}
              </div>
            )}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "78%", padding: "10px 14px", borderRadius: "12px",
                  background: msg.role === "user" ? "linear-gradient(135deg, #40E0D0, #0EA5E9)" : "#111827",
                  color: msg.role === "user" ? "#000" : "#E2E8F0",
                  fontSize: "13.5px", lineHeight: 1.6,
                  border: msg.role === "assistant" ? "1px solid #1a2235" : "none",
                  borderBottomRightRadius: msg.role === "user" ? "3px" : "12px",
                  borderBottomLeftRadius: msg.role === "assistant" ? "3px" : "12px",
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "10px 14px", borderRadius: "12px", background: "#111827", border: "1px solid #1a2235", fontSize: "13px", color: "#40E0D0" }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "14px 16px", borderTop: "1px solid #1a2235", display: "flex", gap: "8px" }}>
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask for book recommendations or a learning path..."
              style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #1a2235", background: "#080B12", color: "#fff", fontSize: "13px", outline: "none" }} />
            <button onClick={send} disabled={loading}
              style={{ padding: "10px 16px", borderRadius: "8px", background: loading ? "#1a2235" : "linear-gradient(135deg, #40E0D0, #0EA5E9)", color: loading ? "#4B5675" : "#000", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "13px" }}>
              <Send size={14} /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}