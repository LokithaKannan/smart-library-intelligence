import { useEffect, useState } from "react";
import { getBooks, addBook, deleteBook } from "../services/api";
import Header from "../components/Header";
import { Search, Plus, Trash2, X } from "lucide-react";
import { useAuth } from "../services/auth";

export default function Books() {
  const { user } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newBook, setNewBook] = useState({ title: "", author: "", genre: "Technology", totalCopies: 1, publishedYear: new Date().getFullYear() });
  const [adding, setAdding] = useState(false);

  const genres = ["", "Technology", "Data Science", "Fiction", "Non-Fiction", "Self-Help", "Business", "Psychology"];

  const fetchBooks = (s = search, g = genre) => {
    setLoading(true);
    getBooks(s || undefined, g || undefined)
      .then((res) => setBooks(res.data.data.books))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBooks("", ""); }, []);

  const handleAdd = async () => {
    if (!newBook.title || !newBook.author) return;
    setAdding(true);
    try {
      await addBook({ ...newBook, availableCopies: newBook.totalCopies });
      setShowAdd(false);
      setNewBook({ title: "", author: "", genre: "Technology", totalCopies: 1, publishedYear: new Date().getFullYear() });
      fetchBooks("", "");
    } catch (e) { console.error(e); }
    finally { setAdding(false); }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Delete this book?")) return;
    try {
      await deleteBook(bookId);
      fetchBooks("", "");
    } catch (e) { console.error(e); }
  };

  const avColor = (a: number, t: number) => a === 0 ? "#EF4444" : a / t < 0.5 ? "#F59E0B" : "#40E0D0";

  const inputStyle = {
    padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #1a2235", background: "#080B12",
    color: "#fff", fontSize: "13px", outline: "none",
  };

  return (
    <div>
      <Header title="Books Catalog" subtitle="Manage and search library books" />

      {/* Filter bar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#4B5675" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchBooks()}
            placeholder="Search title or author..."
            style={{ ...inputStyle, paddingLeft: "32px", width: "240px" }} />
        </div>
        <select value={genre} onChange={(e) => { setGenre(e.target.value); fetchBooks(search, e.target.value); }}
          style={inputStyle}>
          {genres.map((g) => <option key={g} value={g}>{g || "All Genres"}</option>)}
        </select>
        <button onClick={() => fetchBooks()}
          style={{ padding: "10px 18px", borderRadius: "8px", background: "#40E0D0", color: "#000", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px" }}>
          Search
        </button>
        <span style={{ color: "#4B5675", fontSize: "12px" }}>{books.length} books</span>

        {user?.role === "admin" && (
          <button onClick={() => setShowAdd(true)}
            style={{ marginLeft: "auto", padding: "10px 18px", borderRadius: "8px", background: "rgba(64,224,208,0.1)", border: "1px solid rgba(64,224,208,0.25)", color: "#40E0D0", cursor: "pointer", fontWeight: 600, fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Plus size={14} /> Add Book
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#0D1117", borderRadius: "12px", border: "1px solid #1a2235", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1a2235" }}>
              {["ID", "Title", "Author", "Genre", "Available", "Year", ...(user?.role === "admin" ? ["Action"] : [])].map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#4B5675", letterSpacing: "0.05em" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#4B5675" }}>Loading books...</td></tr>
            ) : books.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#4B5675" }}>No books found</td></tr>
            ) : books.map((book, i) => (
              <tr key={book.bookId} style={{ borderBottom: "1px solid #1a223550", background: i % 2 === 0 ? "transparent" : "rgba(8,11,18,0.4)" }}>
                <td style={{ padding: "11px 16px", fontSize: "12px", color: "#4B5675", fontFamily: "monospace" }}>{book.bookId}</td>
                <td style={{ padding: "11px 16px", fontSize: "13px", fontWeight: 500, color: "#E2E8F0" }}>{book.title}</td>
                <td style={{ padding: "11px 16px", fontSize: "12px", color: "#9AA5BE" }}>{book.author}</td>
                <td style={{ padding: "11px 16px" }}>
                  <span style={{ padding: "3px 9px", borderRadius: "6px", fontSize: "11px", background: "rgba(64,224,208,0.08)", color: "#40E0D0", fontWeight: 500, border: "1px solid rgba(64,224,208,0.2)" }}>
                    {book.genre}
                  </span>
                </td>
                <td style={{ padding: "11px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: avColor(book.availableCopies, book.totalCopies), boxShadow: `0 0 6px ${avColor(book.availableCopies, book.totalCopies)}` }} />
                    <span style={{ fontSize: "12px", color: avColor(book.availableCopies, book.totalCopies), fontWeight: 600 }}>
                      {book.availableCopies}/{book.totalCopies}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "11px 16px", fontSize: "12px", color: "#4B5675" }}>{book.publishedYear}</td>
                {user?.role === "admin" && (
                  <td style={{ padding: "11px 16px" }}>
                    <button onClick={() => handleDelete(book.bookId)}
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171", borderRadius: "6px", padding: "5px 8px", cursor: "pointer", display: "flex" }}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Book Modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#0D1117", borderRadius: "14px", padding: "28px", width: "420px", border: "1px solid #1a2235", position: "relative" }}>
            <button onClick={() => setShowAdd(false)} style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", cursor: "pointer", color: "#6B7A99" }}>
              <X size={18} />
            </button>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>Add New Book</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Title *", field: "title", placeholder: "Book title" },
                { label: "Author *", field: "author", placeholder: "Author name" },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label style={{ fontSize: "12px", color: "#9AA5BE", display: "block", marginBottom: "5px" }}>{label}</label>
                  <input value={(newBook as any)[field]} onChange={(e) => setNewBook((p) => ({ ...p, [field]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ ...inputStyle, width: "100%" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: "12px", color: "#9AA5BE", display: "block", marginBottom: "5px" }}>Genre</label>
                <select value={newBook.genre} onChange={(e) => setNewBook((p) => ({ ...p, genre: e.target.value }))}
                  style={{ ...inputStyle, width: "100%" }}>
                  {genres.filter(Boolean).map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "#9AA5BE", display: "block", marginBottom: "5px" }}>Total Copies</label>
                  <input type="number" min={1} value={newBook.totalCopies}
                    onChange={(e) => setNewBook((p) => ({ ...p, totalCopies: +e.target.value }))}
                    style={{ ...inputStyle, width: "100%" }} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "#9AA5BE", display: "block", marginBottom: "5px" }}>Published Year</label>
                  <input type="number" value={newBook.publishedYear}
                    onChange={(e) => setNewBook((p) => ({ ...p, publishedYear: +e.target.value }))}
                    style={{ ...inputStyle, width: "100%" }} />
                </div>
              </div>
              <button onClick={handleAdd} disabled={adding}
                style={{ padding: "11px", borderRadius: "8px", background: "linear-gradient(135deg, #40E0D0, #0EA5E9)", color: "#000", border: "none", fontWeight: 700, cursor: adding ? "not-allowed" : "pointer", marginTop: "4px" }}>
                {adding ? "Adding..." : "Add Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}