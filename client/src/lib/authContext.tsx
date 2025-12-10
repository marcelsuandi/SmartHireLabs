import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, UserRole } from "@shared/schema";
import { demoUsers } from "./mockData";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { fullName: string; email: string; password: string; phone: string }) => Promise<void>;
  logout: () => void;
  demoLogin: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("smarthire_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const resp = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!resp.ok) {
      const data = await resp.json().catch(() => ({ message: "Login failed" }));
      throw new Error(data.message || "Login failed");
    }
    const { user: safeUser } = await resp.json();
    setUser(safeUser);
    localStorage.setItem("smarthire_user", JSON.stringify(safeUser));
  };

  const register = async (data: { fullName: string; email: string; password: string; phone: string }): Promise<void> => {
    const resp = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!resp.ok) {
      const body = await resp.json().catch(() => ({ message: "Registration failed" }));
      throw new Error(body.message || "Registration failed");
    }
    const { user: safeUser } = await resp.json();
    setUser(safeUser);
    localStorage.setItem("smarthire_user", JSON.stringify(safeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smarthire_user");
  };

  const demoLogin = (role: UserRole) => {
    const demoUser = demoUsers.find(u => u.role === role);
    if (demoUser) {
      const userWithoutPassword = { ...demoUser, password: "" };
      setUser(userWithoutPassword);
      localStorage.setItem("smarthire_user", JSON.stringify(userWithoutPassword));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
