import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { orders } from "@/lib/db";

export async function GET(_req: Request, ctx: RouteContext<"/api/orders/[id]">) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  const { id } = await ctx.params;
  const order = await orders.findForUser(id, user.id);
  if (!order) return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
  return NextResponse.json({ ok: true, order }, { headers: { "Cache-Control": "no-store" } });
}
