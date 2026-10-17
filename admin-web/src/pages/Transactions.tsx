import { useEffect, useState } from "react";
import { getAllTransactions } from "../services/api";
import Header from "../components/Header";
import { RefreshCw } from "lucide-react";

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const load = (setL: (v: boolean) => void) => {
    getAllTransactions()
      .then((res) => setTransactions(res.data.data.transactions))
      .catch(console.error)
      .finally(() => setL(false));
  };

  useEffect(() => { load(setLoading); }, []);

  const refresh = () => { setRefreshing(true); load(setRefreshing); };

  const now = new Date();
  const getStatus = (t: any) => t.status === "issued" && new Date(t.dueDate) < now ? "overdue" : t.status;

  const filtered = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "overdue") return t.status === "issued" && new Date(t.dueDate) < now;
    return t.status === filter;
  });

  const tabCount = (f: string) => {
    if (f === "all") return transactions.length;
    if (f === "overdue") return transactions.filter((t) => t.status === "issued" && new Date(t.dueDate) < now).length;
    return transactions.filter((t) => t.status === f).length;
  };

  const statusStyle: Record<string, { bg: string; color: string }> = {
    issued: { bg: "rgba(14,165,233,0.12)", color: "#0EA5E9" },
    returned: { bg: "rgba(64,224,208,0.12)", color: "#40E0D0" },
    overdue: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
  };

  return (
    <div>
      <Header title="Transactions" subtitle="All book issue and return records" />

      <div style={{ display: "flex", gap: "6px", marginBottom: "18px", alignItems: "center", flexWrap: "wrap" }}>
        {["all", "issued", "returned", "overdue"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "7px 16px", borderRadius: "8px", cursor: "pointer",
              fontSize: "12.5px",
              background: filter === f ? "#40E0D0" : "#0D1117",
              color: filter === f ? "#000" : "#8892A4",
              border: filter === f ? "none" : "1px solid #1a2235",
              fontWeight: filter === f ? 700 : 500,
            }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({tabCount(f)})
          </button>
        ))}
        <button onClick={refresh}
          style={{ marginLeft: "auto", padding: "7px 14px", borderRadius: "8px", background: "#0D1117", border: "1px solid #1a2235", color: "#6B7A99", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
          <RefreshCw size={13} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
          Refresh
        </button>
      </div>

      <div style={{ background: "#0D1117", borderRadius: "12px", border: "1px solid #1a2235", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1a2235" }}>
              {["Student", "Book", "Issue Date", "Due Date", "Status", "Fine"].map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#4B5675", letterSpacing: "0.05em" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#4B5675" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#4B5675" }}>No transactions found</td></tr>
            ) : filtered.map((t, i) => {
              const status = getStatus(t);
              const s = statusStyle[status] || statusStyle.issued;
              return (
                <tr key={t._id || i} style={{ borderBottom: "1px solid #1a223550", background: i % 2 === 0 ? "transparent" : "rgba(8,11,18,0.4)" }}>
                  <td style={{ padding: "11px 16px", fontSize: "13px", fontWeight: 500, color: "#E2E8F0" }}>{t.studentName}</td>
                  <td style={{ padding: "11px 16px", fontSize: "12.5px", color: "#9AA5BE", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.bookTitle}</td>
                  <td style={{ padding: "11px 16px", fontSize: "12px", color: "#4B5675" }}>{new Date(t.issueDate).toLocaleDateString("en-IN")}</td>
                  <td style={{ padding: "11px 16px", fontSize: "12px", color: status === "overdue" ? "#EF4444" : "#4B5675" }}>{new Date(t.dueDate).toLocaleDateString("en-IN")}</td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ padding: "3px 9px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.color}30` }}>
                      {status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px", fontSize: "12.5px", fontWeight: 600, color: t.fineAmount > 0 ? "#EF4444" : "#4B5675" }}>
                    {t.fineAmount > 0 ? `₹${t.fineAmount}` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}