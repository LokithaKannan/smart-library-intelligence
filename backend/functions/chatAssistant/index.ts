import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { localGetItem, localScanTable } from "../../shared/localdb";
import { successResponse, errorResponse } from "../../shared/response";

const callGroqAI = async (systemPrompt: string, userMessage: string) => {
  try {
    const response = await axios.post(
      process.env.GROQ_API_URL!,
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 512,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (err: any) {
    // Print exact Groq error message
    console.error("Groq API error:", JSON.stringify(err.response?.data, null, 2));
    throw new Error(err.response?.data?.error?.message || "Groq API failed");
  }
};

export const handler = async (event: any) => {
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { studentId, message } = body;

    if (!studentId || !message) return errorResponse("studentId and message are required", 400);

    const student = localGetItem(process.env.STUDENTS_TABLE!, { studentId });
    if (!student) return errorResponse("Student not found", 404);

    // Keep history short — last 3 books only
    const allTransactions = localScanTable(process.env.TRANSACTIONS_TABLE!);
    const studentHistory = allTransactions
      .filter((t: any) => t.studentId === studentId)
      .slice(-3)
      .map((t: any) => `${t.bookTitle} (${t.genre})`);

    // Keep available books as titles only — no ids or authors
    const allBooks = localScanTable(process.env.BOOKS_TABLE!);
    const availableBooks = allBooks
      .filter((b: any) => b.availableCopies > 0)
      .map((b: any) => `${b.title} by ${b.author} [${b.genre}]`);

    // Keep knowledge graph as themes only
    const allMetadata = localScanTable(process.env.BOOK_METADATA_TABLE!);
    const readBookIds = allTransactions
      .filter((t: any) => t.studentId === studentId)
      .map((t: any) => t.bookId);
    const themes = allMetadata
      .filter((m: any) => readBookIds.includes(m.bookId))
      .flatMap((m: any) => m.themes);
    const uniqueThemes = [...new Set(themes)].slice(0, 8);

    // Short focused prompt
    const systemPrompt = `You are a university library assistant.
Student: ${student.name} (${student.department})
Recently read: ${studentHistory.join(", ") || "nothing yet"}
Interests based on reading: ${uniqueThemes.join(", ") || "unknown"}
Available books: ${availableBooks.join(" | ")}
Task: Recommend a learning path of 3 books from the available list above. Be friendly and concise.`;

    const aiResponse = await callGroqAI(systemPrompt, message);

    return successResponse({
      reply: aiResponse,
      studentName: student.name,
    });
  } catch (error: any) {
    console.error("chatAssistant error:", error.message);
    return errorResponse(error.message || "Internal server error");
  }
};
