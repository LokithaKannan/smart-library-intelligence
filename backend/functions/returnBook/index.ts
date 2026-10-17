import * as dotenv from "dotenv";
dotenv.config();

import { localGetItem, localUpdateItem, localScanTable } from "../../shared/localdb";
import { successResponse, errorResponse } from "../../shared/response";

export const handler = async (event: any) => {
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { studentId, bookId } = body;

    if (!studentId || !bookId) return errorResponse("studentId and bookId are required", 400);

    const allTransactions = localScanTable(process.env.TRANSACTIONS_TABLE!);
    const activeTransaction = allTransactions.find(
      (t: any) => t.studentId === studentId && t.bookId === bookId && t.status === "issued"
    );

    if (!activeTransaction) return errorResponse("No active transaction found", 404);

    const now = new Date();
    const dueDate = new Date(activeTransaction.dueDate);
    let fineAmount = 0;

    if (now > dueDate) {
      const daysLate = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      fineAmount = daysLate * 2;
    }

    const returnDate = now.toISOString();

    localUpdateItem(process.env.TRANSACTIONS_TABLE!, { transactionId: activeTransaction.transactionId }, {
      status: "returned",
      returnDate,
      fineAmount,
    });

    const book = localGetItem(process.env.BOOKS_TABLE!, { bookId });
    localUpdateItem(process.env.BOOKS_TABLE!, { bookId }, {
      availableCopies: book.availableCopies + 1,
    });

    const student = localGetItem(process.env.STUDENTS_TABLE!, { studentId });
    localUpdateItem(process.env.STUDENTS_TABLE!, { studentId }, {
      issuedBooks: (student.issuedBooks || []).filter((id: string) => id !== bookId),
    });

    return successResponse({
      message: "Book returned successfully",
      transactionId: activeTransaction.transactionId,
      bookTitle: activeTransaction.bookTitle,
      returnDate,
      fineAmount,
      fineMessage: fineAmount > 0 ? `Fine: Rs. ${fineAmount}` : "No fine. Thank you!",
    });
  } catch (error: any) {
    return errorResponse(error.message || "Internal server error");
  }
};