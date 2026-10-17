import express from "express";
import Transaction from "../models/Transaction";
import { protect } from "../middleware/auth";

const router = express.Router();

// GET /forecast
router.get("/", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ issueDate: 1 });

    // Build monthly data for last 12 months
    const now = new Date();
    const monthlyData: Record<string, Record<string, number>> = {};
    const genres = new Set<string>();

    transactions.forEach((t) => {
      const month = t.issueDate.toISOString().substring(0, 7);
      if (!monthlyData[month]) monthlyData[month] = {};
      if (t.genre) {
        genres.add(t.genre);
        monthlyData[month][t.genre] = (monthlyData[month][t.genre] || 0) + 1;
      }
    });

    // Last 6 months
    const last6Months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      last6Months.push(key);
    }

    // Genre forecasts using moving average
    const genreForecasts = Array.from(genres).map((genre) => {
      const monthlyCounts = last6Months.map((m) => monthlyData[m]?.[genre] || 0);
      const last3 = monthlyCounts.slice(-3);
      const avg = last3.reduce((a, b) => a + b, 0) / 3;
      const predicted = Math.round(avg * 1.1);
      const current = monthlyCounts[monthlyCounts.length - 1];
      return {
        genre,
        monthlyCounts,
        current,
        predicted,
        trend: predicted > current ? "up" : "stable",
      };
    });

    // Overall monthly trend
    const overallMonthly = last6Months.map((month) => ({
      month,
      count: Object.values(monthlyData[month] || {}).reduce((a, b) => a + b, 0),
    }));

    // Overall forecast
    const recentOverall = overallMonthly.slice(-3).map((m) => m.count);
    const overallAvg = recentOverall.reduce((a, b) => a + b, 0) / 3;
    const overallForecast = Math.round(overallAvg * 1.1);

    res.json({
      success: true,
      data: {
        method: "3-Month Moving Average",
        explanation: "Forecast = average of last 3 months × 1.1 (10% growth factor)",
        overallForecast,
        overallMonthly,
        genreForecasts,
        months: last6Months,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;