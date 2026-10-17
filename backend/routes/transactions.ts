import express from "express";
import { v4 as uuidv4 } from "uuid";
import Transaction from "../models/Transaction";
import Book from "../models/Book";
import User from "../models/User";
import { protect } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";

const router = express.Router();

// POST /transactions/issue
router.post("/issue", protect, async (req: AuthRequest, res) => {
  try {
    const { studentId, bookId } = req.body;
    if (!studentId || !bookId) {
      return res.status(400).json({ success: false, error: "studentId and bookId required" });
    }

    const book = await Book.findOne({ bookId });
    if (!book) return res.status(404).json({ success: false, error: "Book not found" });
    if (book.availableCopies <= 0) return res.status(400).json({ success: false, error: "No copies available" });

    const student = await User.findOne({ studentId });
    if (!student) return res.status(404).json({ success: false, error: "Student not found" });
    if (student.issuedBooks.includes(bookId)) return res.status(400).json({ success: false, error: "Already issued this book" });
    if (student.issuedBooks.length >= 3) return res.status(400).json({ success: false, error: "Maximum 3 books allowed" });

    const transactionId = `TXN-${uuidv4()}`;
    const issueDate = new Date();
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const transaction = await Transaction.create({
      transactionId,
      studentId,
      studentName: student.name,
      bookId,
      bookTitle: book.title,
      genre: book.genre,
      issueDate,
      dueDate,
      status: "issued",
    });

    await Book.findOneAndUpdate({ bookId }, { $inc: { availableCopies: -1 } });
    await User.findOneAndUpdate({ studentId }, { $push: { issuedBooks: bookId } });

    res.json({
      success: true,
      data: {
        message: "Book issued successfully",
        transactionId,
        bookTitle: book.title,
        issueDate: issueDate.toISOString(),
        dueDate: dueDate.toISOString(),
        daysAllowed: 14,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /transactions/return
router.post("/return", protect, async (req: AuthRequest, res) => {
  try {
    const { studentId, bookId } = req.body;

    const transaction = await Transaction.findOne({ studentId, bookId, status: "issued" });
    if (!transaction) return res.status(404).json({ success: false, error: "No active transaction found" });

    const now = new Date();
    let fineAmount = 0;
    if (now > transaction.dueDate) {
      const daysLate = Math.ceil((now.getTime() - transaction.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      fineAmount = daysLate * 2;
    }

    await Transaction.findByIdAndUpdate(transaction._id, {
      status: "returned",
      returnDate: now,
      fineAmount,
    });

    await Book.findOneAndUpdate({ bookId }, { $inc: { availableCopies: 1 } });
    await User.findOneAndUpdate({ studentId }, { $pull: { issuedBooks: bookId } });

    res.json({
      success: true,
      data: {
        message: "Book returned successfully",
        transactionId: transaction.transactionId,
        bookTitle: transaction.bookTitle,
        returnDate: now.toISOString(),
        fineAmount,
        fineMessage: fineAmount > 0 ? `Fine: ₹${fineAmount}` : "No fine. Thank you!",
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /transactions — all transactions (admin)
router.get("/", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ issueDate: -1 });
    res.json({ success: true, data: { transactions } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /transactions/student/:studentId
router.get("/student/:studentId", protect, async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findOne({ studentId }).select("-password");
    if (!student) return res.status(404).json({ success: false, error: "Student not found" });

    const allTransactions = await Transaction.find({ studentId }).sort({ issueDate: -1 });
    const now = new Date();
    const activeBooks = allTransactions.filter((t) => t.status === "issued");
    const pastBooks = allTransactions.filter((t) => t.status === "returned");
    const overdueBooks = activeBooks.filter((t) => now > t.dueDate);

    res.json({
      success: true,
      data: {
        student: {
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          department: student.department,
        },
        activeBooks,
        pastBooks,
        overdueBooks,
        stats: {
          totalIssued: allTransactions.length,
          currentlyIssued: activeBooks.length,
          totalReturned: pastBooks.length,
          overdueCount: overdueBooks.length,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;