import * as dotenv from "dotenv";
dotenv.config();

import { localGetItem, localScanTable } from "../../shared/localdb";
import { successResponse, errorResponse } from "../../shared/response";

export const handler = async (event: any) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const { search, genre, bookId } = queryParams;

    if (bookId) {
      const book = localGetItem(process.env.BOOKS_TABLE!, { bookId });
      if (!book) return errorResponse("Book not found", 404);
      return successResponse(book);
    }

    let books = localScanTable(process.env.BOOKS_TABLE!);

    if (genre) books = books.filter((b: any) => b.genre.toLowerCase() === genre.toLowerCase());
    if (search) {
      const s = search.toLowerCase();
      books = books.filter((b: any) =>
        b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s)
      );
    }

    books.sort((a: any, b: any) => a.title.localeCompare(b.title));
    return successResponse({ books, total: books.length });
  } catch (error: any) {
    return errorResponse(error.message || "Internal server error");
  }
};