export interface Book {
  bookId: string;
  title: string;
  author: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  isbn?: string;
  description?: string;
  publishedYear?: number;
}

export interface Student {
  studentId: string;
  name: string;
  email: string;
  department?: string;
  issuedBooks: string[];
  createdAt: string;
}

export interface Transaction {
  transactionId: string;
  studentId: string;
  bookId: string;
  bookTitle: string;
  studentName: string;
  genre: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "issued" | "returned" | "overdue";
  fineAmount?: number;
}

export interface BookMetadata {
  bookId: string;
  themes: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites: string[];
  leadsTo: string[];
  tags: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}