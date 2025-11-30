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
    const foundUser = demoUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    const userWithoutPassword = { ...foundUser, password: "" };
    setUser(userWithoutPassword);
    localStorage.setItem("smarthire_user", JSON.stringify(userWithoutPassword));
  };

  const register = async (data: { fullName: string; email: string; password: string; phone: string }): Promise<void> => {
    const exists = demoUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    
    if (exists) {
      throw new Error("Email already registered");
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
      role: "candidate"
    };

    demoUsers.push(newUser);
    const userWithoutPassword = { ...newUser, password: "" };
    setUser(userWithoutPassword);
    localStorage.setItem("smarthire_user", JSON.stringify(userWithoutPassword));
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
