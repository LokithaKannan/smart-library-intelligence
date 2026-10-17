import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

export default function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  return (
    <div style={{
      background: "#0D1117",
      borderRadius: "12px",
      padding: "18px 20px",
      flex: 1,
      minWidth: "150px",
      border: `1px solid ${color}30`,
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Corner glow */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "100px", height: "100px",
        background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
        pointerEvents: "none",
      }} />
      {/* Bottom left glow */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: "60px", height: "60px",
        background: `radial-gradient(circle at bottom left, ${color}10, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <div>
          <div style={{ fontSize: "11.5px", color: "#6B7A99", fontWeight: 500, letterSpacing: "0.03em" }}>
            {title}
          </div>
          <div style={{
            fontSize: "28px", fontWeight: 800, color: "#fff",
            marginTop: "8px", letterSpacing: "-1px", lineHeight: 1,
          }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: "11px", color: "#2E3D55", marginTop: "5px" }}>
              {subtitle}
            </div>
          )}
        </div>
        <div style={{
          width: "38px", height: "38px",
          background: `${color}15`,
          border: `1px solid ${color}30`,
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={18} color={color} strokeWidth={2} />
        </div>
      </div>

      {/* Bottom accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "2px",
        background: `linear-gradient(90deg, ${color}60, transparent)`,
      }} />
    </div>
  );
}