import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db";

// Routes
import authRoutes from "./routes/auth";
import bookRoutes from "./routes/books";
import transactionRoutes from "./routes/transactions";
import studentRoutes from "./routes/students";
import dashboardRoutes from "./routes/dashboard";
import chatRoutes from "./routes/chat";
import forecastRoutes from "./routes/forecast";

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/transactions", transactionRoutes);
app.use("/students", studentRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/chat", chatRoutes);
app.use("/forecast", forecastRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "SmartLib API running with MongoDB" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║     SmartLib API — MongoDB Edition       ║
║     Running on http://localhost:${PORT}    ║
╠══════════════════════════════════════════╣
║  POST   /auth/signup                     ║
║  POST   /auth/login                      ║
║  GET    /auth/me                         ║
║  GET    /books                           ║
║  POST   /books                           ║
║  POST   /transactions/issue              ║
║  POST   /transactions/return             ║
║  GET    /transactions                    ║
║  GET    /students                        ║
║  GET    /dashboard                       ║
║  POST   /chat                            ║
║  GET    /forecast                        ║
╚══════════════════════════════════════════╝
  `);
});