import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { getDashboard, getStudentHistory } from "../services/api";
import StatCard from "../components/StatCard";
import Header from "../components/Header";
import { useAuth } from "../services/auth";
import {
  BookOpen, Users, BookMarked, AlertTriangle,
  ArrowLeftRight, RotateCcw, Bot,
} from "lucide-react";
import { Link } from "react-router-dom";

const COLORS = ["#40E0D0", "#0EA5E9", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981"];

const tooltipStyle = {
  contentStyle: {
    background: "#0D1117", border: "1px solid #1a2235",
    borderRadius: "8px", color: "#fff", fontSize: "12px",
  },
};

const chartCard = {
  background: "#0D1117", borderRadius: "12px",
  padding: "20px", border: "1px solid #1a2235",
};

// ─── STUDENT DASHBOARD ───────────────────────────────────────
function StudentDashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.studentId) {
      getStudentHistory(user.studentId)
        .then((res) => setHistory(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <div style={{ color: "#40E0D0", fontSize: "14px" }}>Loading your dashboard...</div>
    </div>
  );

  const stats = history?.stats || { totalIssued: 0, currentlyIssued: 0, totalReturned: 0, overdueCount: 0 };
  const activeBooks = history?.activeBooks || [];
  const pastBooks = history?.pastBooks || [];

  return (
    <div>
      <Header title="My Dashboard" subtitle="Your personal library overview" />

      {/* Personal stat cards */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
        <StatCard title="Currently Reading" value={stats.currentlyIssued} icon={BookOpen} color="#40E0D0" />
        <StatCard title="Total Issued" value={stats.totalIssued} icon={BookMarked} color="#0EA5E9" />
        <StatCard title="Books Returned" value={stats.totalReturned} icon={RotateCcw} color="#8B5CF6" />
        <StatCard title="Overdue" value={stats.overdueCount} icon={AlertTriangle} color="#EF4444" subtitle={stats.overdueCount > 0 ? "Fine: ₹2/day" : "All clear!"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        {/* Currently issued */}
        <div style={chartCard}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "7px" }}>
  <BookOpen size={14} color="#40E0D0" strokeWidth={2} /> Currently Reading
</div>
          {activeBooks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "#4B5675", fontSize: "13px" }}>
              No books issued yet.<br />
              <Link to="/dashboard/browse" style={{ color: "#40E0D0", textDecoration: "none", fontWeight: 600, marginTop: "8px", display: "inline-block" }}>
                Browse Books →
              </Link>
            </div>
          ) : activeBooks.map((t: any) => {
            const overdue = new Date(t.dueDate) < new Date();
            return (
              <div key={t._id} style={{
                padding: "12px 14px", borderRadius: "8px", marginBottom: "8px",
                background: overdue ? "rgba(239,68,68,0.06)" : "rgba(64,224,208,0.05)",
                border: `1px solid ${overdue ? "rgba(239,68,68,0.2)" : "rgba(64,224,208,0.15)"}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#fff" }}>{t.bookTitle}</div>
                  <div style={{ fontSize: "11px", color: "#4B5675", marginTop: "2px" }}>{t.bookId}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: overdue ? "#EF4444" : "#40E0D0", fontWeight: 600 }}>
                    {overdue ? "⚠ OVERDUE" : "Due:"}
                  </div>
                  <div style={{ fontSize: "11px", color: overdue ? "#EF4444" : "#6B7A99" }}>
                    {new Date(t.dueDate).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reading history + AI shortcut */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* AI Assistant shortcut */}
          <div style={{
            ...chartCard,
            background: "linear-gradient(135deg, rgba(64,224,208,0.1), rgba(14,165,233,0.06))",
            border: "1px solid rgba(64,224,208,0.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #40E0D0, #0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={18} color="#000" />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>AI Book Assistant</div>
                <div style={{ fontSize: "12px", color: "#6B7A99" }}>Get personalized recommendations</div>
              </div>
            </div>
            <Link to="/dashboard/chat" style={{
              display: "block", padding: "10px", borderRadius: "8px", textAlign: "center",
              background: "linear-gradient(135deg, #40E0D0, #0EA5E9)",
              color: "#000", textDecoration: "none", fontSize: "13px", fontWeight: 700,
            }}>
              Chat with AI →
            </Link>
          </div>

          {/* Past books */}
          <div style={chartCard}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "14px", display: "flex", alignItems: "center", gap: "7px" }}>
  <RotateCcw size={14} color="#8B5CF6" strokeWidth={2} /> Recent Reading History
</div>
            {pastBooks.length === 0 ? (
              <div style={{ color: "#4B5675", fontSize: "13px", textAlign: "center", padding: "20px" }}>
                No reading history yet
              </div>
            ) : pastBooks.slice(0, 4).map((t: any) => (
              <div key={t._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #1a2235" }}>
                <div style={{ fontSize: "12.5px", color: "#9AA5BE", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.bookTitle}</div>
                <div style={{ fontSize: "11px", color: "#4B5675", flexShrink: 0, marginLeft: "8px" }}>
                  {t.returnDate ? new Date(t.returnDate).toLocaleDateString("en-IN") : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overdue warning banner */}
      {stats.overdueCount > 0 && (
        <div style={{
          marginTop: "14px", padding: "14px 20px", borderRadius: "10px",
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <AlertTriangle size={18} color="#EF4444" />
          <div>
            <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#F87171" }}>
              You have {stats.overdueCount} overdue book{stats.overdueCount > 1 ? "s" : ""}!
            </div>
            <div style={{ fontSize: "12px", color: "#6B7A99", marginTop: "2px" }}>
              Fine of ₹2/day is being charged. Please return them as soon as possible.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0D1117", border: "1px solid #1a2235",
        borderRadius: "8px", padding: "8px 12px",
        fontSize: "12px", color: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}>
        <div style={{ color: payload[0].payload.fill || "#40E0D0", fontWeight: 600 }}>
          {payload[0].name}
        </div>
        <div style={{ color: "#9AA5BE", marginTop: "2px" }}>
          Count: <strong style={{ color: "#fff" }}>{payload[0].value}</strong>
        </div>
      </div>
    );
  }
  return null;
};

// ─── ADMIN DASHBOARD ─────────────────────────────────────────
function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data.data))
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <div style={{ color: "#40E0D0", fontSize: "14px" }}>Loading dashboard...</div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <div style={{ color: "#EF4444", fontSize: "14px" }}>{error}</div>
    </div>
  );

  return (
    <div>
      <Header title="Dashboard" subtitle="Real-time library usage overview" />

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
        <StatCard title="Total Books" value={data.stats.totalBooks} icon={BookOpen} color="#40E0D0" />
        <StatCard title="Total Students" value={data.stats.totalStudents} icon={Users} color="#0EA5E9" />
        <StatCard title="Active Issues" value={data.stats.activeIssues} icon={BookMarked} color="#8B5CF6" />
        <StatCard title="Overdue Books" value={data.stats.overdueBooks} icon={AlertTriangle} color="#EF4444" subtitle="Need attention" />
        <StatCard title="Transactions" value={data.stats.totalTransactions} icon={ArrowLeftRight} color="#F59E0B" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <div style={chartCard}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "16px" }}>Daily Activity (Last 7 Days)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.dailyActivity}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#4B5675" }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4B5675" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="#40E0D0" radius={[4, 4, 0, 0]} name="Issues" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={chartCard}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "16px" }}>Genre Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.genreDistribution} dataKey="count" nameKey="genre"
                cx="50%" cy="50%" outerRadius={75} innerRadius={35}>
                {data.genreDistribution.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
            {data.genreDistribution.map((g: any, i: number) => (
              <div key={g.genre} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: COLORS[i % COLORS.length] }} />
                <span style={{ fontSize: "11px", color: "#6B7A99" }}>{g.genre} ({g.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div style={chartCard}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "16px" }}>Monthly Trend (Last 6 Months)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.monthlyTrend}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4B5675" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4B5675" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="count" stroke="#40E0D0" strokeWidth={2} dot={{ fill: "#40E0D0", r: 3 }} name="Issues" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={chartCard}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "16px" }}>Top 5 Most Issued Books</div>
          {data.topBooks.length === 0 ? (
            <div style={{ textAlign: "center", color: "#4B5675", fontSize: "13px", marginTop: "40px" }}>No transaction data yet</div>
          ) : data.topBooks.map((book: any, i: number) => (
            <div key={book.bookId} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "6px", flexShrink: 0, background: `${COLORS[i]}20`, border: `1px solid ${COLORS[i]}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: COLORS[i] }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, fontSize: "12.5px", color: "#C4CDD8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</div>
              <div style={{ fontSize: "11px", color: "#40E0D0", fontWeight: 600, flexShrink: 0 }}>{book.count}×</div>
            </div>
          ))}

          <div style={{ marginTop: "16px", padding: "14px", background: "linear-gradient(135deg, rgba(64,224,208,0.08), rgba(14,165,233,0.05))", border: "1px solid rgba(64,224,208,0.2)", borderRadius: "10px" }}>
            <div style={{ fontSize: "11px", color: "#4B5675", marginBottom: "4px" }}>📈 Next Month Forecast</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#40E0D0", letterSpacing: "-1px" }}>
              {data.forecast.nextMonthPrediction}
              <span style={{ fontSize: "13px", fontWeight: 400, color: "#4B5675", marginLeft: "6px" }}>issues predicted</span>
            </div>
            <div style={{ fontSize: "11px", color: "#2E3D55", marginTop: "4px" }}>{data.forecast.method}</div>
          </div>
        </div>
      </div>

      {data.recentTransactions?.length > 0 && (
        <div style={{ ...chartCard, marginTop: "14px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "16px" }}>Recent Transactions</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a2235" }}>
                {["Student", "Book", "Status", "Date"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "11px", color: "#4B5675", fontWeight: 600, letterSpacing: "0.05em" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.map((t: any, i: number) => {
                const overdue = t.status === "issued" && new Date(t.dueDate) < new Date();
                const status = overdue ? "overdue" : t.status;
                const statusColors: Record<string, string> = { issued: "#0EA5E9", returned: "#40E0D0", overdue: "#EF4444" };
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #1a223550" }}>
                    <td style={{ padding: "9px 12px", fontSize: "13px", color: "#E2E8F0" }}>{t.studentName}</td>
                    <td style={{ padding: "9px 12px", fontSize: "12px", color: "#9AA5BE" }}>{t.bookTitle}</td>
                    <td style={{ padding: "9px 12px" }}>
                      <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "6px", fontWeight: 600, background: `${statusColors[status]}15`, color: statusColors[status], border: `1px solid ${statusColors[status]}30` }}>
                        {status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: "11px", color: "#4B5675" }}>{new Date(t.issueDate).toLocaleDateString("en-IN")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminDashboard /> : <StudentDashboard />;
}