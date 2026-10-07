import "server-only";
import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { users } from "./db";

const scrypt = promisify(scryptCb) as (pw: string, salt: string, len: number) => Promise<Buffer>;

export const SESSION_COOKIE = "bow_session";
/** Non-sensitive, JS-readable cookie used only to show the user's first name in the header. */
export const NAME_COOKIE = "bow_uname";

const DEV_SECRET = "dev-only-insecure-secret-change-me";
const secret = () => {
  const s = process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === "production") {
    console.warn("[auth] AUTH_SECRET is not set – using an insecure development secret.");
  }
  return s || DEV_SECRET;
};

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hex] = stored.split(":");
  if (!salt || !hex) return false;
  const hash = await scrypt(password, salt, 64);
  const expected = Buffer.from(hex, "hex");
  return expected.length === hash.length && timingSafeEqual(expected, hash);
}

const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64url");

/** Signed session token: base64url(payload).base64url(hmac). */
export function signSession(userId: string, maxAgeSec: number) {
  const payload = b64url(JSON.stringify({ uid: userId, exp: Math.floor(Date.now() / 1000) + maxAgeSec }));
  const sig = b64url(createHmac("sha256", secret()).update(payload).digest());
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest();
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { uid: string; exp: number };
    return exp > Date.now() / 1000 ? uid : null;
  } catch {
    return null;
  }
}

export async function currentUser() {
  const store = await cookies();
  const uid = verifySession(store.get(SESSION_COOKIE)?.value);
  return uid ? users.findById(uid) : undefined;
}

export async function startSession(userId: string, firstName: string, remember: boolean) {
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  store.set(SESSION_COOKIE, signSession(userId, maxAge), { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge });
  store.set(NAME_COOKIE, encodeURIComponent(firstName), { httpOnly: false, sameSite: "lax", secure, path: "/", maxAge });
}

export async function endSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(NAME_COOKIE);
}
