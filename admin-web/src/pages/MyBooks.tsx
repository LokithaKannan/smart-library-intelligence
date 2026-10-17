import { useEffect, useState } from "react";
import { getStudentHistory } from "../services/api";
import { useAuth } from "../services/auth";
import Header from "../components/Header";
import { BookOpen, RotateCcw, AlertTriangle } from "lucide-react";

export default function MyBooks() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any>(null);

  useEffect(() => {
    if (user?.studentId) {
      getStudentHistory(user.studentId)
        .then((res) => setHistory(res.data.data))
        .catch(console.error);
    }
  }, [user]);

  if (!history) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#40E0D0", fontSize: "13px" }}>
      Loading your books...
    </div>
  );

  return (
    <div>
      <Header title="My Books" subtitle="Your currently issued and past books" />

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { label: "Currently Issued", value: history.stats.currentlyIssued, icon: BookOpen, color: "#40E0D0" },
          { label: "Total Read", value: history.stats.totalIssued, icon: RotateCcw, color: "#0EA5E9" },
          { label: "Overdue", value: history.stats.overdueCount, icon: AlertTriangle, color: "#EF4444" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#0D1117", borderRadius: "10px", padding: "16px 20px", border: `1px solid ${s.color}25`, flex: 1, minWidth: "150px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: "60px", height: "60px", background: `radial-gradient(circle at top right, ${s.color}12, transparent 70%)` }} />
            <div style={{ fontSize: "28px", fontWeight: 800, color: s.color, letterSpacing: "-1px" }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#6B7A99", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {history.activeBooks.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#40E0D0", letterSpacing: "0.08em", marginBottom: "10px" }}>CURRENTLY READING</div>
          {history.activeBooks.map((t: any) => {
            const overdue = new Date(t.dueDate) < new Date();
            return (
              <div key={t.transactionId || t._id} style={{ background: "#0D1117", borderRadius: "10px", padding: "14px 18px", border: `1px solid ${overdue ? "rgba(239,68,68,0.25)" : "rgba(64,224,208,0.15)"}`, marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: "13.5px" }}>{t.bookTitle}</div>
                  <div style={{ color: "#4B5675", fontSize: "11px", marginTop: "2px" }}>{t.bookId} · {t.genre}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", color: overdue ? "#EF4444" : "#40E0D0", fontWeight: 600 }}>
                    {overdue ? "⚠ OVERDUE" : "Due:"} {new Date(t.dueDate).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {history.pastBooks.length > 0 && (
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#4B5675", letterSpacing: "0.08em", marginBottom: "10px" }}>READING HISTORY</div>
          {history.pastBooks.map((t: any) => (
            <div key={t.transactionId || t._id} style={{ background: "#0D1117", borderRadius: "10px", padding: "14px 18px", border: "1px solid #1a2235", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#9AA5BE", fontWeight: 500, fontSize: "13px" }}>{t.bookTitle}</div>
                <div style={{ color: "#2E3D55", fontSize: "11px", marginTop: "2px" }}>{t.genre}</div>
              </div>
              <div style={{ fontSize: "12px", color: "#4B5675" }}>
                Returned: {t.returnDate ? new Date(t.returnDate).toLocaleDateString("en-IN") : "—"}
              </div>
            </div>
          ))}
        </div>
      )}

      {history.activeBooks.length === 0 && history.pastBooks.length === 0 && (
        <div style={{ textAlign: "center", color: "#4B5675", padding: "60px", fontSize: "13px" }}>
          No books issued yet. Visit Browse Books to find something to read!
        </div>
      )}
    </div>
  );
}