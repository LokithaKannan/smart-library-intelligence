import { useState } from "react";
import { issueBook, returnBook } from "../services/api";
import Header from "../components/Header";
import { BookMarked, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";

export default function IssueReturn() {
  const [mode, setMode] = useState<"issue" | "return">("issue");
  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setResult(null); setError("");
    if (!studentId.trim() || !bookId.trim()) { setError("Both Student ID and Book ID are required"); return; }
    setLoading(true);
    try {
      const res = mode === "issue"
        ? await issueBook(studentId.trim(), bookId.trim())
        : await returnBook(studentId.trim(), bookId.trim());
      setResult(res.data.data);
      setStudentId(""); setBookId("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: "8px",
    border: "1px solid #1a2235", background: "#080B12",
    color: "#fff", fontSize: "14px", outline: "none",
  };

  return (
    <div>
      <Header title="Issue / Return" subtitle="Process book transactions" />

      <div style={{ maxWidth: "520px" }}>
        {/* Mode toggle */}
        <div style={{ display: "flex", background: "#080B12", borderRadius: "10px", padding: "3px", marginBottom: "24px", border: "1px solid #1a2235" }}>
          {(["issue", "return"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setResult(null); setError(""); }}
              style={{
                flex: 1, padding: "10px", border: "none", borderRadius: "8px",
                cursor: "pointer", fontSize: "13.5px", fontWeight: 600,
                background: mode === m
                  ? m === "issue"
                    ? "linear-gradient(135deg, rgba(64,224,208,0.2), rgba(14,165,233,0.15))"
                    : "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.1))"
                  : "transparent",
                color: mode === m ? (m === "issue" ? "#40E0D0" : "#F59E0B") : "#6B7A99",
                outline: mode === m ? `1px solid ${m === "issue" ? "rgba(64,224,208,0.3)" : "rgba(245,158,11,0.3)"}` : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                transition: "all 0.2s",
              }}>
              {m === "issue" ? <BookMarked size={14} /> : <RotateCcw size={14} />}
              {m === "issue" ? "Issue Book" : "Return Book"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: "#0D1117", borderRadius: "12px", padding: "24px", border: "1px solid #1a2235", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "#9AA5BE", display: "block", marginBottom: "6px", fontWeight: 500 }}>Student ID</label>
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. S001" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "#9AA5BE", display: "block", marginBottom: "6px", fontWeight: 500 }}>Book ID</label>
            <input value={bookId} onChange={(e) => setBookId(e.target.value)}
              placeholder="e.g. B005" style={inputStyle}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>

          {/* Reference */}
          <div style={{ background: "#080B12", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#4B5675", border: "1px solid #1a2235" }}>
            <span style={{ color: "#40E0D0", fontWeight: 600 }}>Quick Ref: </span>
            Students: S001–S005+ · Books: B001–B015+
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#F87171", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {result && (
            <div style={{ background: "rgba(64,224,208,0.06)", border: "1px solid rgba(64,224,208,0.2)", borderRadius: "8px", padding: "14px", fontSize: "13px", color: "#6EE7B7" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, marginBottom: "8px", color: "#40E0D0" }}>
                <CheckCircle size={16} /> {result.message}
              </div>
              {result.bookTitle && <div style={{ color: "#9AA5BE" }}>Book: <strong style={{ color: "#fff" }}>{result.bookTitle}</strong></div>}
              {result.dueDate && <div style={{ color: "#9AA5BE", marginTop: "4px" }}>Due Date: <strong style={{ color: "#40E0D0" }}>{new Date(result.dueDate).toLocaleDateString("en-IN")}</strong></div>}
              {result.fineMessage && <div style={{ color: result.fineAmount > 0 ? "#F87171" : "#40E0D0", marginTop: "4px" }}>{result.fineMessage}</div>}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            style={{
              padding: "12px", borderRadius: "8px", border: "none",
              background: loading ? "#1a2235"
                : mode === "issue"
                  ? "linear-gradient(135deg, #40E0D0, #0EA5E9)"
                  : "linear-gradient(135deg, #F59E0B, #EF4444)",
              color: loading ? "#6B7A99" : "#000",
              fontSize: "14px", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: loading ? "none" : "0 0 16px rgba(64,224,208,0.2)",
            }}>
            {loading ? "Processing..." : mode === "issue" ? "Issue Book" : "Return Book"}
          </button>
        </div>
      </div>
    </div>
  );
}