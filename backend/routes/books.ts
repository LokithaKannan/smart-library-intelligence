import express from "express";
import Book from "../models/Book";
import { protect, adminOnly } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";

const router = express.Router();

// GET /books — search and filter
router.get("/", async (req, res) => {
  try {
    const { search, genre, bookId } = req.query as any;
    if (bookId) {
      const book = await Book.findOne({ bookId });
      if (!book) return res.status(404).json({ success: false, error: "Book not found" });
      return res.json({ success: true, data: book });
    }
    const query: any = {};
    if (genre) query.genre = genre;
    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
    const books = await Book.find(query).sort({ title: 1 });
    res.json({ success: true, data: { books, total: books.length } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /books — add book (admin only)
router.post("/", protect, adminOnly, async (req: AuthRequest, res) => {
  try {
    const count = await Book.countDocuments();
    const bookId = `B${String(count + 1).padStart(3, "0")}`;
    const book = await Book.create({ ...req.body, bookId });
    res.status(201).json({ success: true, data: book });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /books/:bookId — update book (admin only)
router.put("/:bookId", protect, adminOnly, async (req: AuthRequest, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { bookId: req.params.bookId },
      req.body,
      { new: true }
    );
    if (!book) return res.status(404).json({ success: false, error: "Book not found" });
    res.json({ success: true, data: book });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /books/:bookId (admin only)
router.delete("/:bookId", protect, adminOnly, async (req: AuthRequest, res) => {
  try {
    const book = await Book.findOneAndDelete({ bookId: req.params.bookId });
    if (!book) return res.status(404).json({ success: false, error: "Book not found" });
    res.json({ success: true, data: { message: "Book deleted" } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;