import express from "express";
import Transaction from "../models/Transaction";
import Book from "../models/Book";
import User from "../models/User";
import { protect } from "../middleware/auth";

const router = express.Router();

// GET /dashboard
router.get("/", protect, async (req, res) => {
  try {
    const now = new Date();

    const [books, students, transactions] = await Promise.all([
      Book.find(),
      User.find({ role: "student" }),
      Transaction.find().sort({ issueDate: -1 }),
    ]);

    const activeIssues = transactions.filter((t) => t.status === "issued").length;
    const overdueBooks = transactions.filter(
      (t) => t.status === "issued" && now > t.dueDate
    ).length;

    // Genre distribution
    const genreCount: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.genre) genreCount[t.genre] = (genreCount[t.genre] || 0) + 1;
    });
    const genreDistribution = Object.entries(genreCount).map(([genre, count]) => ({ genre, count }));

    // Daily activity last 7 days
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = transactions.filter(
        (t) => t.issueDate.toISOString().split("T")[0] === dateStr
      ).length;
      dailyActivity.push({ date: dateStr, count });
    }

    // Monthly trend last 6 months
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const count = transactions.filter(
        (t) => t.issueDate.toISOString().substring(0, 7) === monthStr
      ).length;
      monthlyTrend.push({ month: monthStr, count });
    }

    // Top books
    const bookCount: Record<string, { title: string; count: number }> = {};
    transactions.forEach((t) => {
      if (!bookCount[t.bookId]) bookCount[t.bookId] = { title: t.bookTitle, count: 0 };
      bookCount[t.bookId].count++;
    });
    const topBooks = Object.entries(bookCount)
      .map(([bookId, data]) => ({ bookId, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Moving average forecast (last 3 months average × 1.1)
    const recentCounts = monthlyTrend.slice(-3).map((m) => m.count);
    const avg = recentCounts.reduce((a, b) => a + b, 0) / recentCounts.length;
    const forecastNextMonth = Math.round(avg * 1.1);

    // Recent transactions
    const recentTransactions = transactions.slice(0, 10);

    res.json({
      success: true,
      data: {
        stats: {
          totalBooks: books.length,
          totalStudents: students.length,
          totalTransactions: transactions.length,
          activeIssues,
          overdueBooks,
        },
        genreDistribution,
        dailyActivity,
        topBooks,
        monthlyTrend,
        recentTransactions,
        forecast: {
          nextMonthPrediction: forecastNextMonth,
          method: "3-Month Moving Average",
          basis: `Avg of last 3 months (${recentCounts.join(", ")}) × 1.1 growth factor`,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;