import { NextResponse } from "next/server";
import { startSession, verifyPassword } from "@/lib/auth";
import { publicUser, users } from "@/lib/db";

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const password = typeof b.password === "string" ? b.password : "";
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Enter your email and password." }, { status: 422 });
  }

  const user = await users.findByEmail(email);
  // Same message for unknown email and wrong password to avoid account enumeration.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
  }

  await startSession(user.id, user.firstName, b.remember === true);
  return NextResponse.json({ ok: true, user: publicUser(user) });
}
