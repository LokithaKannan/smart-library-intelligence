import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Book from "./models/Book";
import BookMetadata from "./models/BookMetadata";

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/smart-library");
  console.log("✅ Connected to MongoDB\n");

  await Book.deleteMany({});
  await BookMetadata.deleteMany({});
  console.log("🗑️  Cleared books and metadata\n");

  const books = [
    { bookId: "B001", title: "Clean Code", author: "Robert C. Martin", genre: "Technology", totalCopies: 3, availableCopies: 3, publishedYear: 2008 },
    { bookId: "B002", title: "The Pragmatic Programmer", author: "Andrew Hunt", genre: "Technology", totalCopies: 2, availableCopies: 2, publishedYear: 2019 },
    { bookId: "B003", title: "Design Patterns", author: "Gang of Four", genre: "Technology", totalCopies: 2, availableCopies: 2, publishedYear: 1994 },
    { bookId: "B004", title: "Clean Architecture", author: "Robert C. Martin", genre: "Technology", totalCopies: 2, availableCopies: 2, publishedYear: 2017 },
    { bookId: "B005", title: "Python Crash Course", author: "Eric Matthes", genre: "Technology", totalCopies: 4, availableCopies: 4, publishedYear: 2019 },
    { bookId: "B006", title: "Introduction to Machine Learning", author: "Andreas Muller", genre: "Data Science", totalCopies: 3, availableCopies: 3, publishedYear: 2016 },
    { bookId: "B007", title: "Deep Learning", author: "Ian Goodfellow", genre: "Data Science", totalCopies: 2, availableCopies: 2, publishedYear: 2016 },
    { bookId: "B008", title: "Data Science from Scratch", author: "Joel Grus", genre: "Data Science", totalCopies: 3, availableCopies: 3, publishedYear: 2019 },
    { bookId: "B009", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", totalCopies: 5, availableCopies: 5, publishedYear: 1925 },
    { bookId: "B010", title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", totalCopies: 4, availableCopies: 4, publishedYear: 1960 },
    { bookId: "B011", title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-Fiction", totalCopies: 3, availableCopies: 3, publishedYear: 2011 },
    { bookId: "B012", title: "Atomic Habits", author: "James Clear", genre: "Self-Help", totalCopies: 4, availableCopies: 4, publishedYear: 2018 },
    { bookId: "B013", title: "Refactoring", author: "Martin Fowler", genre: "Technology", totalCopies: 2, availableCopies: 2, publishedYear: 2018 },
    { bookId: "B014", title: "The Lean Startup", author: "Eric Ries", genre: "Business", totalCopies: 3, availableCopies: 3, publishedYear: 2011 },
    { bookId: "B015", title: "Thinking Fast and Slow", author: "Daniel Kahneman", genre: "Psychology", totalCopies: 2, availableCopies: 2, publishedYear: 2011 },
  ];

  console.log("📚 Seeding books...");
  for (const book of books) {
    await Book.create(book);
    console.log(`  ✓ ${book.bookId}: ${book.title}`);
  }

  const metadata = [
    { bookId: "B001", themes: ["software-design", "best-practices", "refactoring"], difficulty: "intermediate", prerequisites: ["B005"], leadsTo: ["B002", "B013", "B004"], tags: ["coding", "oop"] },
    { bookId: "B002", themes: ["programming-philosophy", "best-practices"], difficulty: "intermediate", prerequisites: [], leadsTo: ["B003", "B004"], tags: ["coding"] },
    { bookId: "B003", themes: ["design-patterns", "oop", "architecture"], difficulty: "advanced", prerequisites: ["B001", "B002"], leadsTo: ["B004"], tags: ["patterns"] },
    { bookId: "B004", themes: ["software-architecture", "clean-code"], difficulty: "advanced", prerequisites: ["B001", "B003"], leadsTo: [], tags: ["architecture"] },
    { bookId: "B005", themes: ["python", "programming-basics"], difficulty: "beginner", prerequisites: [], leadsTo: ["B001", "B006", "B008"], tags: ["python"] },
    { bookId: "B006", themes: ["machine-learning", "python", "data-science"], difficulty: "intermediate", prerequisites: ["B005"], leadsTo: ["B007", "B008"], tags: ["ml"] },
    { bookId: "B007", themes: ["deep-learning", "neural-networks", "ai"], difficulty: "advanced", prerequisites: ["B006"], leadsTo: [], tags: ["ai"] },
    { bookId: "B008", themes: ["data-science", "statistics", "python"], difficulty: "beginner", prerequisites: ["B005"], leadsTo: ["B006", "B007"], tags: ["data"] },
  ];

  console.log("\n🧠 Seeding knowledge graph metadata...");
  for (const m of metadata) {
    await BookMetadata.create(m);
    console.log(`  ✓ Metadata for ${m.bookId}`);
  }

  console.log("\n✅ Books seeded successfully!");
  console.log("📝 Users will sign up through the app.");
  console.log("   First user to sign up as 'admin' role gets admin access.");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => { console.error("❌ Seed error:", err); process.exit(1); });