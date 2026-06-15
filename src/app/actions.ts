"use server";

import { prisma } from "@/lib/prisma";

export type ContactState = {
  ok: boolean;
  error?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // Honeypot — real users never fill this hidden field.
  const company = String(formData.get("company") ?? "").trim();

  if (company) {
    return { ok: true, message: "Thanks! Your message has been sent." };
  }
  if (name.length < 2) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (message.length < 10) {
    return { ok: false, error: "Your message should be at least 10 characters." };
  }

  try {
    await prisma.contactMessage.create({
      data: { name, email, message: message.slice(0, 5000) },
    });
    return { ok: true, message: "Thanks! Your message has been sent." };
  } catch (err) {
    console.error("Failed to store contact message", err);
    return {
      ok: false,
      error: "Something went wrong on our end. Please try again later.",
    };
  }
}
