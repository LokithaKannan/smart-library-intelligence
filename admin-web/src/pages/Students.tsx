import { useEffect, useState } from "react";
import { getAllStudents, getStudentHistory } from "../services/api";
import Header from "../components/Header";
import { User, BookOpen, RotateCcw, AlertTriangle } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [histLoading, setHistLoading] = useState(false);

  useEffect(() => {
    getAllStudents()
      .then((res) => setStudents(res.data.data.students))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fetchHistory = (student: any) => {
    setSelected(student);
    setHistLoading(true);
    getStudentHistory(student.studentId)
      .then((res) => setHistory(res.data.data))
      .catch(console.error)
      .finally(() => setHistLoading(false));
  };

  return (
    <div>
      <Header title="Students" subtitle="View student profiles and borrowing history" />
      <div style={{ display: "grid", gridTemplateColumns: "270px 1fr", gap: "14px" }}>

        {/* Student List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {loading ? (
            <div style={{ color: "#4B5675", fontSize: "13px", padding: "20px" }}>Loading students...</div>
          ) : students.length === 0 ? (
            <div style={{ color: "#4B5675", fontSize: "13px", padding: "20px" }}>No students registered yet</div>
          ) : students.map((s) => (
            <div key={s._id} onClick={() => fetchHistory(s)}
              style={{
                background: selected?._id === s._id ? "rgba(64,224,208,0.08)" : "#0D1117",
                border: selected?._id === s._id ? "1px solid rgba(64,224,208,0.3)" : "1px solid #1a2235",
                borderRadius: "10px", padding: "12px 14px",
                cursor: "pointer", transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                background: selected?._id === s._id ? "linear-gradient(135deg, #40E0D0, #0EA5E9)" : "#1a2235",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: 700,
                color: selected?._id === s._id ? "#000" : "#4B5675",
              }}>
                {s.name.charAt(0)}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: selected?._id === s._id ? "#40E0D0" : "#E2E8F0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.name}
                </div>
                <div style={{ fontSize: "11px", color: "#4B5675", marginTop: "1px" }}>
                  {s.studentId} · {s.department || "General"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Student Detail */}
        <div style={{ background: "#0D1117", borderRadius: "12px", padding: "20px", border: "1px solid #1a2235", minHeight: "400px" }}>
          {!selected && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "300px", gap: "12px" }}>
              <User size={40} color="#1a2235" strokeWidth={1} />
              <div style={{ color: "#4B5675", fontSize: "13px" }}>Select a student to view their profile</div>
            </div>
          )}
          {histLoading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
              <div style={{ color: "#40E0D0", fontSize: "13px" }}>Loading history...</div>
            </div>
          )}
          {history && !histLoading && (
            <div>
              {/* Student info */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #1a2235" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #40E0D0, #0EA5E9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", fontWeight: 800, color: "#000",
                }}>
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>{selected.name}</div>
                  <div style={{ fontSize: "12px", color: "#6B7A99" }}>{selected.email} · {selected.studentId}</div>
                  <div style={{ fontSize: "11px", color: "#40E0D0", marginTop: "2px" }}>{selected.department || "General"}</div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                {[
                  { label: "Total Issued", value: history.stats.totalIssued, icon: BookOpen, color: "#40E0D0" },
                  { label: "Reading Now", value: history.stats.currentlyIssued, icon: BookOpen, color: "#0EA5E9" },
                  { label: "Returned", value: history.stats.totalReturned, icon: RotateCcw, color: "#8B5CF6" },
                  { label: "Overdue", value: history.stats.overdueCount, icon: AlertTriangle, color: "#EF4444" },
                ].map((s) => (
                  <div key={s.label} style={{ flex: 1, minWidth: "100px", padding: "12px", borderRadius: "8px", background: `${s.color}10`, border: `1px solid ${s.color}25`, textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: s.color, letterSpacing: "-1px" }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "#4B5675", marginTop: "3px" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Active Books */}
              {history.activeBooks.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#40E0D0", letterSpacing: "0.08em", marginBottom: "8px" }}>CURRENTLY ISSUED</div>
                  {history.activeBooks.map((t: any) => (
                    <div key={t._id} style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(64,224,208,0.05)", border: "1px solid rgba(64,224,208,0.15)", marginBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: "13px", color: "#E2E8F0", fontWeight: 500 }}>{t.bookTitle}</div>
                      <div style={{ fontSize: "11px", color: new Date(t.dueDate) < new Date() ? "#EF4444" : "#40E0D0", fontWeight: 600 }}>
                        Due: {new Date(t.dueDate).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Past Books */}
              {history.pastBooks.length > 0 && (
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#4B5675", letterSpacing: "0.08em", marginBottom: "8px" }}>READING HISTORY</div>
                  {history.pastBooks.map((t: any) => (
                    <div key={t._id} style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(8,11,18,0.6)", border: "1px solid #1a2235", marginBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: "13px", color: "#9AA5BE" }}>{t.bookTitle}</div>
                      <div style={{ fontSize: "11px", color: "#4B5675" }}>
                        {t.returnDate ? new Date(t.returnDate).toLocaleDateString("en-IN") : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {history.activeBooks.length === 0 && history.pastBooks.length === 0 && (
                <div style={{ textAlign: "center", color: "#4B5675", fontSize: "13px", padding: "40px" }}>
                  No borrowing history yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}