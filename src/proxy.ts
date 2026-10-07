import { NextResponse, type NextRequest } from "next/server";

/**
 * Guests visiting account-only pages are sent to the login dialog (/?auth=login) and brought back afterwards.
 * This is a fast presence check; every API route still verifies the signed session.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has("bow_session")) return NextResponse.next();
  const url = request.nextUrl.clone();
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = "/";
  url.search = `?auth=login&next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/cart", "/checkout", "/account/:path*", "/order-success"],
};
