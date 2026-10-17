import * as fs from "fs";
import * as path from "path";

const DB_PATH = path.join(__dirname, "../localdb");

// Read a JSON file and return its contents
const readTable = (tableName: string): any[] => {
  const filePath = path.join(DB_PATH, `${tableName}.json`);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
};

// Write array back to JSON file
const writeTable = (tableName: string, data: any[]): void => {
  const filePath = path.join(DB_PATH, `${tableName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Map DynamoDB table env names to local file names
const getFileName = (tableName: string): string => {
  if (tableName.includes("books") && !tableName.includes("metadata")) return "books";
  if (tableName.includes("students")) return "students";
  if (tableName.includes("transactions")) return "transactions";
  if (tableName.includes("metadata")) return "metadata";
  return tableName;
};

// ── CRUD Operations ───────────────────────────────────────

export const localPutItem = (tableName: string, item: any): void => {
  const fileName = getFileName(tableName);
  const table = readTable(fileName);
  const primaryKey = getPrimaryKey(fileName);
  const index = table.findIndex((row) => row[primaryKey] === item[primaryKey]);
  if (index >= 0) {
    table[index] = item; // update if exists
  } else {
    table.push(item); // insert if new
  }
  writeTable(fileName, table);
};

export const localGetItem = (tableName: string, key: any): any | null => {
  const fileName = getFileName(tableName);
  const table = readTable(fileName);
  const primaryKey = getPrimaryKey(fileName);
  const keyValue = key[primaryKey];
  return table.find((row) => row[primaryKey] === keyValue) || null;
};

export const localUpdateItem = (tableName: string, key: any, updates: any): any => {
  const fileName = getFileName(tableName);
  const table = readTable(fileName);
  const primaryKey = getPrimaryKey(fileName);
  const index = table.findIndex((row) => row[primaryKey] === key[primaryKey]);
  if (index < 0) throw new Error("Item not found");
  table[index] = { ...table[index], ...updates };
  writeTable(fileName, table);
  return table[index];
};

export const localScanTable = (tableName: string): any[] => {
  const fileName = getFileName(tableName);
  return readTable(fileName);
};

// Helper to know which field is the primary key
const getPrimaryKey = (fileName: string): string => {
  const keys: Record<string, string> = {
    books: "bookId",
    students: "studentId",
    transactions: "transactionId",
    metadata: "bookId",
  };
  return keys[fileName] || "id";
};