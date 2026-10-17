import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("sl_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sl_token");
      localStorage.removeItem("sl_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export const signup = (data: { name: string; email: string; password: string; role: string; department?: string }) =>
  API.post("/auth/signup", data);

export const login = (email: string, password: string) =>
  API.post("/auth/login", { email, password });

export const getMe = () => API.get("/auth/me");

// Books
export const getBooks = (search?: string, genre?: string) =>
  API.get("/books", { params: { search, genre } });

export const addBook = (data: any) => API.post("/books", data);
export const updateBook = (bookId: string, data: any) => API.put(`/books/${bookId}`, data);
export const deleteBook = (bookId: string) => API.delete(`/books/${bookId}`);

// Transactions
export const issueBook = (studentId: string, bookId: string) =>
  API.post("/transactions/issue", { studentId, bookId });

export const returnBook = (studentId: string, bookId: string) =>
  API.post("/transactions/return", { studentId, bookId });

export const getAllTransactions = () => API.get("/transactions");

export const getStudentHistory = (studentId: string) =>
  API.get(`/transactions/student/${studentId}`);

// Students
export const getAllStudents = () => API.get("/students");
export const getStudent = (studentId: string) => API.get(`/students/${studentId}`);

// Dashboard
export const getDashboard = () => API.get("/dashboard");

// Forecast
export const getForecast = () => API.get("/forecast");

// Chat
export const chatWithAI = (studentId: string, message: string) =>
  API.post("/chat", { studentId, message });