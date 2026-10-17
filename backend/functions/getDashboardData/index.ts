import * as dotenv from "dotenv";
dotenv.config();

import { localScanTable } from "../../shared/localdb";
import { successResponse, errorResponse } from "../../shared/response";

export const handler = async (event: any) => {
  try {
    const books = localScanTable(process.env.BOOKS_TABLE!);
    const students = localScanTable(process.env.STUDENTS_TABLE!);
    const transactions = localScanTable(process.env.TRANSACTIONS_TABLE!);
    const now = new Date();

    const activeIssues = transactions.filter((t: any) => t.status === "issued").length;
    const overdueBooks = transactions.filter(
      (t: any) => t.status === "issued" && new Date(t.dueDate) < now
    ).length;

    // Genre distribution
    const genreCount: Record<string, number> = {};
    transactions.forEach((t: any) => {
      genreCount[t.genre] = (genreCount[t.genre] || 0) + 1;
    });
    const genreDistribution = Object.entries(genreCount).map(([genre, count]) => ({ genre, count }));

    // Daily activity last 7 days
    const dailyActivity: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyActivity[d.toISOString().split("T")[0]] = 0;
    }
    transactions.forEach((t: any) => {
      const dateStr = t.issueDate.split("T")[0];
      if (dailyActivity[dateStr] !== undefined) dailyActivity[dateStr]++;
    });
    const dailyActivityArray = Object.entries(dailyActivity).map(([date, count]) => ({ date, count }));

    // Top books
    const bookCount: Record<string, { title: string; count: number }> = {};
    transactions.forEach((t: any) => {
      if (!bookCount[t.bookId]) bookCount[t.bookId] = { title: t.bookTitle, count: 0 };
      bookCount[t.bookId].count++;
    });
    const topBooks = Object.entries(bookCount)
      .map(([bookId, data]) => ({ bookId, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Monthly trend last 6 months
    const monthlyTrend: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyTrend[key] = 0;
    }
    transactions.forEach((t: any) => {
      const key = t.issueDate.substring(0, 7);
      if (monthlyTrend[key] !== undefined) monthlyTrend[key]++;
    });
    const monthlyTrendArray = Object.entries(monthlyTrend).map(([month, count]) => ({ month, count }));

    const recentAvg = monthlyTrendArray.slice(-3).reduce((s, m) => s + m.count, 0) / 3;
    const forecastNextMonth = Math.round(recentAvg * 1.1);

    return successResponse({
      stats: {
        totalBooks: books.length,
        totalStudents: students.length,
        totalTransactions: transactions.length,
        activeIssues,
        overdueBooks,
      },
      genreDistribution,
      dailyActivity: dailyActivityArray,
      topBooks,
      monthlyTrend: monthlyTrendArray,
      forecast: {
        nextMonthPrediction: forecastNextMonth,
        basis: "Average of last 3 months + 10% growth factor",
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || "Internal server error");
  }
};