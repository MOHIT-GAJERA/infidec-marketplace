import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { hashPassword, startSession } from "@/lib/auth";
import { publicUser, users } from "@/lib/db";
import { countries, countryCodes, EMAIL_RE, passwordIssues, PHONE_RE } from "@/lib/validation";

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const s = (k: string, max = 100) => (typeof b[k] === "string" ? (b[k] as string).trim().slice(0, max) : "");

  const firstName = s("firstName", 50);
  const lastName = s("lastName", 50);
  const email = s("email", 120).toLowerCase();
  const countryCode = s("countryCode", 6);
  const phone = s("phone", 20).replace(/[\s-]/g, "");
  const company = s("company", 100);
  const country = s("country", 60);
  const password = typeof b.password === "string" ? b.password : "";

  const errors: Record<string, string> = {};
  if (firstName.length < 2) errors.firstName = "Enter your first name.";
  if (lastName.length < 1) errors.lastName = "Enter your last name.";
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  if (!countryCodes.some((c) => c.code === countryCode)) errors.countryCode = "Choose a country code.";
  if (!PHONE_RE.test(phone)) errors.phone = "Enter a valid phone number (6–15 digits).";
  if (country && !countries.includes(country)) errors.country = "Choose your country.";
  const pwIssues = passwordIssues(password);
  if (pwIssues.length) errors.password = `Password needs ${pwIssues.join(", ")}.`;
  if (b.acceptTerms !== true) errors.acceptTerms = "You must accept the terms to continue.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Please fix the highlighted fields.", errors }, { status: 422 });
  }

  const user = {
    id: randomUUID(),
    firstName,
    lastName,
    email,
    countryCode,
    phone,
    company: company || undefined,
    country,
    newsletter: b.newsletter === true,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  if (!(await users.create(user))) {
    return NextResponse.json(
      { ok: false, error: "An account with this email already exists.", errors: { email: "This email is already registered. Please log in." } },
      { status: 409 },
    );
  }

  await startSession(user.id, user.firstName, true);
  return NextResponse.json({ ok: true, user: publicUser(user) });
}
