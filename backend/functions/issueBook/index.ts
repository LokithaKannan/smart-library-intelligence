import * as dotenv from "dotenv";
dotenv.config();

import { v4 as uuidv4 } from "uuid";
import { localGetItem, localPutItem, localUpdateItem, localScanTable } from "../../shared/localdb";
import { successResponse, errorResponse } from "../../shared/response";
import { Transaction } from "../../shared/types";

export const handler = async (event: any) => {
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { studentId, bookId } = body;

    if (!studentId || !bookId) return errorResponse("studentId and bookId are required", 400);

    const book = localGetItem(process.env.BOOKS_TABLE!, { bookId });
    if (!book) return errorResponse("Book not found", 404);
    if (book.availableCopies <= 0) return errorResponse("No copies available right now", 400);

    const student = localGetItem(process.env.STUDENTS_TABLE!, { studentId });
    if (!student) return errorResponse("Student not found", 404);
    if (student.issuedBooks?.includes(bookId)) return errorResponse("You have already issued this book", 400);
    if (student.issuedBooks?.length >= 3) return errorResponse("Maximum 3 books can be issued at a time", 400);

    const transactionId = `TXN-${uuidv4()}`;
    const issueDate = new Date().toISOString();
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    const transaction: Transaction = {
      transactionId,
      studentId,
      bookId,
      bookTitle: book.title,
      studentName: student.name,
      genre: book.genre,
      issueDate,
      dueDate,
      status: "issued",
    };

    localPutItem(process.env.TRANSACTIONS_TABLE!, transaction);
    localUpdateItem(process.env.BOOKS_TABLE!, { bookId }, { availableCopies: book.availableCopies - 1 });
    localUpdateItem(process.env.STUDENTS_TABLE!, { studentId }, {
      issuedBooks: [...(student.issuedBooks || []), bookId],
    });

    return successResponse({
      message: "Book issued successfully",
      transactionId,
      bookTitle: book.title,
      issueDate,
      dueDate,
      daysAllowed: 14,
    });
  } catch (error: any) {
    return errorResponse(error.message || "Internal server error");
  }
};