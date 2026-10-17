import mongoose from "mongoose";

const bookMetadataSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  themes: [{ type: String }],
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  prerequisites: [{ type: String }],
  leadsTo: [{ type: String }],
  tags: [{ type: String }],
});

export default mongoose.model("BookMetadata", bookMetadataSchema);