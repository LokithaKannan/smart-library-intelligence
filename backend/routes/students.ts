import express from "express";
import User from "../models/User";
import Transaction from "../models/Transaction";
import { protect, adminOnly } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";

const router = express.Router();

// GET /students — all students (admin)
router.get("/", protect, adminOnly, async (req: AuthRequest, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: { students, total: students.length } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /students/:studentId
router.get("/:studentId", protect, async (req, res) => {
  try {
    const student = await User.findOne({ studentId: req.params.studentId }).select("-password");
    if (!student) return res.status(404).json({ success: false, error: "Student not found" });
    res.json({ success: true, data: student });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;