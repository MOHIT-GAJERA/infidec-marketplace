import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const str = (k: string, max = 200) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");
  const data = {
    inquiry: str("inquiry"),
    name: str("name"),
    email: str("email"),
    country: str("country", 6),
    phone: str("phone", 20),
    message: str("message", 3000),
  };

  if (!data.inquiry || data.name.length < 2 || !EMAIL_RE.test(data.email) || data.phone.replace(/\D/g, "").length < 6) {
    return NextResponse.json({ ok: false, error: "Please fill in all required fields correctly." }, { status: 422 });
  }

  // TODO: forward to your email/CRM provider (e.g. Resend, SendGrid, HubSpot).
  console.info("[contact] new inquiry", { inquiry: data.inquiry, email: data.email });

  return NextResponse.json({ ok: true });
}
