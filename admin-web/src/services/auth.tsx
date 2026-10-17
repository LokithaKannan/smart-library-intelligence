import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { login as apiLogin, signup as apiSignup } from "./api";

interface User {
  id: string;
  studentId?: string;
  name: string;
  email: string;
  role: "admin" | "student" | "librarian";
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: string;
  department?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("sl_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    const { token, user: userData } = res.data.data;
    localStorage.setItem("sl_token", token);
    localStorage.setItem("sl_user", JSON.stringify(userData));
    setUser(userData);
  };

  const signup = async (data: SignupData) => {
    const res = await apiSignup(data);
    const { token, user: userData } = res.data.data;
    localStorage.setItem("sl_token", token);
    localStorage.setItem("sl_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("sl_token");
    localStorage.removeItem("sl_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};