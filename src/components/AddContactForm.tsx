"use client";
import { useState } from "react";
import { normalizePhone, validateEmail, validatePhone } from "@/lib/validation";

export default function AddContactForm({ onAdd }: { onAdd: (c: { name?: string; phone?: string; email: string }) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const validEmail = validateEmail(email);
  const validPhone = validatePhone(phone);
  const valid = validEmail && validPhone;
  return (
    <div className="grid gap-2 sm:grid-cols-3">
  <input className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
  <input className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
      <div className="flex gap-2">
  <input className="flex-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
  <button disabled={!valid} onClick={()=>{onAdd({ name, phone: normalizePhone(phone), email: email.trim() }); setName(""); setPhone(""); setEmail("");}} className="rounded-md bg-[var(--ts-primary)] px-3 py-2 text-sm text-white disabled:opacity-50">Add</button>
      </div>
    </div>
  );
}
