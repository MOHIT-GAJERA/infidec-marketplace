import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { publicUser } from "@/lib/db";

export async function GET() {
  const user = await currentUser();
  return NextResponse.json(
    { user: user ? publicUser(user) : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
