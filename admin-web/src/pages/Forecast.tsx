import { useEffect, useState } from "react";
import { getForecast } from "../services/api";
import Header from "../components/Header";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

const tooltipStyle = {
  contentStyle: { background: "#0D1117", border: "1px solid #1a2235", borderRadius: "8px", color: "#fff", fontSize: "12px" },
};

export default function Forecast() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getForecast()
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "#40E0D0", padding: "40px", fontSize: "13px" }}>Loading forecast...</div>;
  if (!data) return <div style={{ color: "#EF4444", padding: "40px" }}>Failed to load</div>;

  const forecastData = [
    ...data.overallMonthly,
    { month: "Forecast", count: null, predicted: data.overallForecast },
  ];

  const chartCard = { background: "#0D1117", borderRadius: "12px", padding: "20px", border: "1px solid #1a2235" };

  return (
    <div>
      <Header title="Demand Forecast" subtitle="Moving average prediction for next month" />

      {/* Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(64,224,208,0.15), rgba(14,165,233,0.1))",
        border: "1px solid rgba(64,224,208,0.25)",
        borderRadius: "12px", padding: "20px 24px",
        marginBottom: "20px", display: "flex", alignItems: "center", gap: "20px",
      }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "rgba(64,224,208,0.15)", border: "1px solid rgba(64,224,208,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <TrendingUp size={24} color="#40E0D0" />
        </div>
        <div>
          <div style={{ fontSize: "12px", color: "#6B7A99", marginBottom: "4px" }}>Next Month Prediction</div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#40E0D0", letterSpacing: "-1.5px", lineHeight: 1 }}>
            {data.overallForecast}
            <span style={{ fontSize: "15px", fontWeight: 400, color: "#6B7A99", marginLeft: "8px" }}>book issues</span>
          </div>
          <div style={{ fontSize: "12px", color: "#4B5675", marginTop: "6px" }}>
            Method: {data.method} · {data.explanation}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        {/* Monthly trend + forecast */}
        <div style={chartCard}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "16px" }}>Monthly Trend + Forecast</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2235" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4B5675" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4B5675" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#6B7A99" }} />
              <Line type="monotone" dataKey="count" stroke="#40E0D0" strokeWidth={2} dot={{ fill: "#40E0D0", r: 3 }} name="Actual" connectNulls={false} />
              <Line type="monotone" dataKey="predicted" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#F59E0B", r: 4 }} name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Genre demand */}
        <div style={chartCard}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "16px" }}>Genre Demand Forecast</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.genreForecasts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2235" />
              <XAxis dataKey="genre" tick={{ fontSize: 9, fill: "#4B5675" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4B5675" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#6B7A99" }} />
              <Bar dataKey="current" fill="#40E0D0" radius={[3, 3, 0, 0]} name="Current" />
              <Bar dataKey="predicted" fill="#0EA5E9" radius={[3, 3, 0, 0]} name="Predicted" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Procurement table */}
      <div style={chartCard}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "16px" }}>📋 Procurement Recommendations</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1a2235" }}>
              {["Genre", "Current Demand", "Predicted", "Action"].map((h) => (
                <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: "11px", color: "#4B5675", fontWeight: 600, letterSpacing: "0.05em" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...data.genreForecasts].sort((a: any, b: any) => b.predicted - a.predicted).map((g: any, i: number) => (
              <tr key={g.genre} style={{ borderBottom: "1px solid #1a223550", background: i % 2 === 0 ? "transparent" : "rgba(8,11,18,0.4)" }}>
                <td style={{ padding: "10px 14px", fontSize: "13px", color: "#E2E8F0", fontWeight: 500 }}>{g.genre}</td>
                <td style={{ padding: "10px 14px", fontSize: "13px", color: "#9AA5BE" }}>{g.current}</td>
                <td style={{ padding: "10px 14px", fontSize: "13px", color: "#40E0D0", fontWeight: 600 }}>{g.predicted}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                    background: g.predicted > g.current ? "rgba(14,165,233,0.12)" : "rgba(64,224,208,0.1)",
                    color: g.predicted > g.current ? "#0EA5E9" : "#40E0D0",
                    border: `1px solid ${g.predicted > g.current ? "rgba(14,165,233,0.25)" : "rgba(64,224,208,0.2)"}`,
                  }}>
                    {g.predicted > g.current ? `+${g.predicted - g.current} needed` : "Sufficient"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}