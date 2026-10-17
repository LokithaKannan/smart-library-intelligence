import Header from "../components/Header";
import { HelpCircle, Mail, BookMarked, Bot, BarChart2, ArrowLeftRight } from "lucide-react";

const faqs = [
  { icon: ArrowLeftRight, q: "How do I issue a book?", a: "Go to Issue/Return page, select 'Issue Book', enter Student ID and Book ID, then click Issue." },
  { icon: BookMarked, q: "Maximum books a student can issue?", a: "Each student can issue a maximum of 3 books at a time." },
  { icon: HelpCircle, q: "How many days can a student keep a book?", a: "Books can be kept for 14 days. After that, a fine of ₹2 per day applies." },
  { icon: Bot, q: "How does the AI Assistant work?", a: "The AI uses the student's reading history and Knowledge Graph metadata to suggest personalized learning paths." },
  { icon: BarChart2, q: "What is the Demand Forecast based on?", a: "3-month moving average of transactions × 1.1 growth factor. A legitimate statistical forecasting method." },
  { icon: HelpCircle, q: "How are Book/Student IDs formatted?", a: "Book IDs: B001–B015+. Student IDs: S001, S002... auto-assigned on signup." },
];

export default function Help() {
  return (
    <div>
      <Header title="Help & Support" subtitle="Frequently asked questions and system guide" />

      <div style={{ maxWidth: "720px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Quick Start */}
        <div style={{ background: "linear-gradient(135deg, rgba(64,224,208,0.08), rgba(14,165,233,0.05))", borderRadius: "12px", padding: "20px 24px", border: "1px solid rgba(64,224,208,0.2)", marginBottom: "6px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#40E0D0", marginBottom: "10px" }}>Quick Start Guide</div>
          <div style={{ fontSize: "13px", color: "#9AA5BE", lineHeight: "1.9" }}>
            1. Sign up as Admin or Student at the signup page<br />
            2. Admin: View Dashboard → Issue books → Track students<br />
            3. Student: Browse books → View your issued books → Chat with AI<br />
            4. Use Issue/Return page to process book transactions<br />
            5. Check Forecast page for demand predictions
          </div>
        </div>

        {/* FAQs */}
        {faqs.map((faq, i) => (
          <div key={i} style={{ background: "#0D1117", borderRadius: "10px", padding: "16px 20px", border: "1px solid #1a2235" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(64,224,208,0.08)", border: "1px solid rgba(64,224,208,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                <faq.icon size={14} color="#40E0D0" />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "#fff", fontSize: "13.5px", marginBottom: "5px" }}>{faq.q}</div>
                <div style={{ color: "#6B7A99", fontSize: "13px", lineHeight: "1.6" }}>{faq.a}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Contact */}
        <div style={{ background: "#0D1117", borderRadius: "10px", padding: "16px 20px", border: "1px solid #1a2235", marginTop: "6px", display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(64,224,208,0.08)", border: "1px solid rgba(64,224,208,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Mail size={14} color="#40E0D0" />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "#fff", fontSize: "13.5px", marginBottom: "3px" }}>Contact Support</div>
            <div style={{ color: "#6B7A99", fontSize: "13px" }}>
              For technical issues: <span style={{ color: "#40E0D0" }}>support@smartlib.edu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}