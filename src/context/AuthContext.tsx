"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "admin" | "marketing" | "support";

type AuthState = { role: Role; setRole: (r: Role) => void };

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("admin");
  return <AuthContext.Provider value={{ role, setRole }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
