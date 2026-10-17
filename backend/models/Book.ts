import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true, default: 1 },
  isbn: { type: String },
  description: { type: String },
  publishedYear: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Book", bookSchema);