import express from "express";
import axios from "axios";
import Transaction from "../models/Transaction";
import Book from "../models/Book";
import BookMetadata from "../models/BookMetadata";
import User from "../models/User";
import { protect } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";

const router = express.Router();

const getAvailableBooks = async () => {
  const allBooks = await Book.find({ availableCopies: { $gt: 0 } });
  return allBooks.map((b) => `${b.title} by ${b.author} [${b.genre}]`);
};

const callGroq = async (systemPrompt: string, userMessage: string) => {
  const response = await axios.post(
    process.env.GROQ_API_URL!,
    {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 512,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.choices[0].message.content as string;
};

// POST /chat
router.post("/", protect, async (req: AuthRequest, res) => {
  try {
    const { studentId, message } = req.body;
    if (!studentId || !message) {
      return res.status(400).json({ success: false, error: "studentId and message required" });
    }

    const availableBooks = await getAvailableBooks();

    // ── ADMIN GENERAL MODE ──────────────────────────────────────
    if (studentId === "ADMIN") {
      const systemPrompt = `You are SmartLib AI, a university library assistant.
Available books in library: ${availableBooks.slice(0, 20).join(" | ")}

Rules:
- Answer general questions about books, reading, or library management
- If asked for recommendations, suggest from the available books list
- Do NOT address anyone by name — this is a general query with no user context
- Suggest a Learning Path of 3 books in logical order when recommending
- Explain WHY each book is recommended
- Be friendly and concise
- Max 250 words`;

      const reply = await callGroq(systemPrompt, message);
      return res.json({ success: true, data: { reply, studentName: null } });
    }

    // ── STUDENT PERSONALIZED MODE ───────────────────────────────
    const student = await User.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    const studentTxns = await Transaction.find({ studentId }).sort({ issueDate: -1 }).limit(5);
    const readHistory = studentTxns.map((t) => `${t.bookTitle} (${t.genre})`);

    const readBookIds = studentTxns.map((t) => t.bookId);
    const metadatas = await BookMetadata.find({ bookId: { $in: readBookIds } });
    const themes = [...new Set(metadatas.flatMap((m) => m.themes))].slice(0, 8);

    const systemPrompt = `You are SmartLib AI, a university library assistant.
Student: ${student.name} (${student.department || "General"})
Recently read: ${readHistory.join(", ") || "nothing yet"}
Interests inferred from reading: ${themes.join(", ") || "not determined yet"}
Available books: ${availableBooks.slice(0, 20).join(" | ")}

Rules:
- Only recommend books from the available list above
- Suggest a Learning Path of 3 books in logical order
- Explain WHY each book fits this specific student's background
- Address the student by their first name naturally
- Be friendly and concise
- Max 250 words`;

    const reply = await callGroq(systemPrompt, message);
    res.json({ success: true, data: { reply, studentName: student.name } });

  } catch (error: any) {
    console.error("Chat error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;