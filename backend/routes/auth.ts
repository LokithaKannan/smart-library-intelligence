import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();

const generateToken = (user: any): string =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" } as jwt.SignOptions
  );

// POST /auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Name, email and password required" });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    // Generate studentId for students
    let studentId;
    if (role === "student" || !role) {
      const count = await User.countDocuments({ role: "student" });
      studentId = `S${String(count + 1).padStart(3, "0")}`;
    }

    const user = await User.create({
      name, email, password,
      role: role || "student",
      department,
      studentId,
      issuedBooks: [],
    });

    const token = generateToken(user);
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          studentId: user.studentId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }
    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }
    const token = generateToken(user);
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          studentId: user.studentId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /auth/me
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, error: "No token" });
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, data: user });
  } catch {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
});

export default router;