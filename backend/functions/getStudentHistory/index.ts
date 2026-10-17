import * as dotenv from "dotenv";
dotenv.config();

import { localGetItem, localScanTable } from "../../shared/localdb";
import { successResponse, errorResponse } from "../../shared/response";

export const handler = async (event: any) => {
  try {
    const { studentId } = event.pathParameters || {};
    if (!studentId) return errorResponse("studentId is required", 400);

    const student = localGetItem(process.env.STUDENTS_TABLE!, { studentId });
    if (!student) return errorResponse("Student not found", 404);

    const allTransactions = localScanTable(process.env.TRANSACTIONS_TABLE!);
    const studentTransactions = allTransactions
      .filter((t: any) => t.studentId === studentId)
      .sort((a: any, b: any) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    const now = new Date();
    const activeBooks = studentTransactions.filter((t: any) => t.status === "issued");
    const pastBooks = studentTransactions.filter((t: any) => t.status === "returned");
    const overdueBooks = activeBooks.filter((t: any) => new Date(t.dueDate) < now);

    return successResponse({
      student: {
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        department: student.department,
      },
      activeBooks,
      pastBooks,
      overdueBooks,
      stats: {
        totalIssued: studentTransactions.length,
        currentlyIssued: activeBooks.length,
        totalReturned: pastBooks.length,
        overdueCount: overdueBooks.length,
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || "Internal server error");
  }
};