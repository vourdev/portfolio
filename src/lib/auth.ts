import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  return process.env.ADMIN_SECRET || "dev-insecure-secret-change-me";
}

function sign(value: string) {
  const mac = crypto.createHmac("sha256", secret()).update(value).digest("hex");
  return `${value}.${mac}`;
}

function verify(token: string | undefined): boolean {
  if (!token) return false;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return false;
  const value = token.slice(0, idx);
  if (sign(value) !== token) return false;
  const issued = Number(value);
  return Number.isFinite(issued) && Date.now() - issued < MAX_AGE * 1000;
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verify(store.get(COOKIE)?.value);
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login");
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, sign(String(Date.now())), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  return expected.length > 0 && password === expected;
}
