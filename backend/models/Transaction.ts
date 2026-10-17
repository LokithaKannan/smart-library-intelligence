import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  bookId: { type: String, required: true },
  bookTitle: { type: String, required: true },
  genre: { type: String },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { type: String, enum: ["issued", "returned", "overdue"], default: "issued" },
  fineAmount: { type: Number, default: 0 },
});

// Auto-mark overdue
transactionSchema.virtual("isOverdue").get(function () {
  return this.status === "issued" && new Date() > this.dueDate;
});

export default mongoose.model("Transaction", transactionSchema);