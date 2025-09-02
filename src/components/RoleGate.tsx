"use client";
import { ReactNode } from "react";
import { Role, useAuth } from "@/context/AuthContext";

export default function RoleGate({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { role } = useAuth();
  if (!allow.includes(role)) return null;
  return <>{children}</>;
}
