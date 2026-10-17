import { useEffect, useState } from "react";
import { getBooks } from "../services/api";
import Header from "../components/Header";
import { Search, BookOpen } from "lucide-react";

export default function BrowseBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (s: string, g: string, setL: (v: boolean) => void) => {
    setL(true);
    getBooks(s || undefined, g || undefined)
      .then((res) => setBooks(res.data.data.books))
      .catch(console.error)
      .finally(() => setL(false));
  };

  useEffect(() => { load("", "", setLoading); }, []);

  const fetchBooks = () => load(search, genre, setLoading);

  const genres = ["", "Technology", "Data Science", "Fiction", "Non-Fiction", "Self-Help", "Business", "Psychology"];
  const avColor = (a: number, t: number) => a === 0 ? "#EF4444" : a / t < 0.5 ? "#F59E0B" : "#40E0D0";

  return (
    <div>
      <Header title="Browse Books" subtitle="Search and explore the library catalog" />

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#4B5675" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchBooks()}
            placeholder="Search title or author..."
            style={{ padding: "10px 14px 10px 32px", borderRadius: "8px", border: "1px solid #1a2235", background: "#080B12", color: "#fff", fontSize: "13px", outline: "none", width: "240px" }} />
        </div>
        <select value={genre} onChange={(e) => { setGenre(e.target.value); load(search, e.target.value, setLoading); }}
          style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #1a2235", background: "#080B12", color: "#fff", fontSize: "13px", outline: "none" }}>
          {genres.map((g) => <option key={g} value={g}>{g || "All Genres"}</option>)}
        </select>
        <button onClick={fetchBooks}
          style={{ padding: "10px 18px", borderRadius: "8px", background: "#40E0D0", color: "#000", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px" }}>
          Search
        </button>
        <span style={{ color: "#4B5675", fontSize: "12px" }}>{books.length} books found</span>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#40E0D0", padding: "60px", fontSize: "13px" }}>Loading books...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "12px" }}>
          {books.map((book) => (
            <div key={book.bookId} style={{
              background: "#0D1117", borderRadius: "12px", padding: "18px",
              border: "1px solid #1a2235", position: "relative", overflow: "hidden",
              transition: "border-color 0.2s, transform 0.2s", cursor: "default",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(64,224,208,0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#1a2235"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: "60px", height: "60px", background: "radial-gradient(circle at top right, rgba(64,224,208,0.08), transparent 70%)", pointerEvents: "none" }} />
              
              <div style={{ fontWeight: 600, color: "#fff", fontSize: "13.5px", marginBottom: "4px", lineHeight: 1.3 }}>{book.title}</div>
              <div style={{ color: "#6B7A99", fontSize: "12px", marginBottom: "10px" }}>{book.author}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: "rgba(64,224,208,0.08)", color: "#40E0D0", fontSize: "10px", padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(64,224,208,0.2)", fontWeight: 500 }}>{book.genre}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: avColor(book.availableCopies, book.totalCopies) }} />
                  <span style={{ fontSize: "11px", color: avColor(book.availableCopies, book.totalCopies), fontWeight: 600 }}>{book.availableCopies}/{book.totalCopies}</span>
                </div>
              </div>
              <div style={{ fontSize: "10px", color: "#2E3D55", marginTop: "8px", fontFamily: "monospace" }}>ID: {book.bookId}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}