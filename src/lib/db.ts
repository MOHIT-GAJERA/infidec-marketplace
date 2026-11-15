import "server-only";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import type * as AdminApp from "firebase-admin/app";
import type * as AdminFirestore from "firebase-admin/firestore";
import type { Firestore } from "firebase-admin/firestore";

/*
 * firebase-admin is loaded with Node's own require at runtime instead of a static import.
 * Firebase Hosting runs a plain `next build` (Turbopack), which rewrites static imports of
 * external packages to a hashed symlink pointing at this machine's node_modules – that symlink
 * is broken once deployed to Cloud Functions. The non-literal specifier keeps the bundler from
 * rewriting it; the package is installed normally in the function's node_modules.
 */
const nodeRequire = createRequire(join(process.cwd(), "package.json"));
const admin = (sub: "app" | "firestore") => nodeRequire(["firebase-admin", sub].join("/"));
const { applicationDefault, cert, getApps, initializeApp } = admin("app") as typeof AdminApp;
const { getFirestore } = admin("firestore") as typeof AdminFirestore;

/**
 * Accounts and orders live in Cloud Firestore (project "marketplace-infidec").
 *
 * - On Firebase (Cloud Functions) the runtime service account is picked up automatically.
 * - Locally, set FIREBASE_SERVICE_ACCOUNT_FILE (see .env.development.local) to the
 *   service-account JSON in /secret. That folder is gitignored and is never deployed.
 *
 * Firestore security rules deny all client access; only this server code (Admin SDK) reads/writes.
 */
let db: Firestore | undefined;
function firestore(): Firestore {
  if (db) return db;
  const keyFile = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
  const app =
    getApps()[0] ??
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || "marketplace-infidec",
      credential: keyFile && existsSync(keyFile) ? cert(keyFile) : applicationDefault(),
    });
  db = getFirestore(app);
  // Optional fields (company, gstin…) may be undefined; Firestore rejects those unless told to skip them.
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  company?: string;
  country: string;
  newsletter: boolean;
  passwordHash: string;
  createdAt: string;
};

export type OrderItem = {
  slug: string;
  name: string;
  license: "regular" | "extended";
  plan: string;
  planName?: string;
  licensePrice: number;
  planPrice: number;
  total: number;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: "INR";
  paymentMethod: string;
  status: "paid" | "pending";
  billing: {
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    gstin?: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
};

const USERS = "users";
/** users_by_email/{email} -> { userId }: guarantees one account per email address. */
const USERS_BY_EMAIL = "users_by_email";
const ORDERS = "orders";

export const users = {
  async findByEmail(email: string) {
    const fs = firestore();
    const idx = await fs.collection(USERS_BY_EMAIL).doc(email.toLowerCase()).get();
    if (!idx.exists) return undefined;
    const snap = await fs.collection(USERS).doc(idx.get("userId") as string).get();
    return snap.exists ? (snap.data() as User) : undefined;
  },
  async findById(id: string) {
    const snap = await firestore().collection(USERS).doc(id).get();
    return snap.exists ? (snap.data() as User) : undefined;
  },
  /** Returns false if the email is already registered. */
  async create(user: User) {
    const fs = firestore();
    const batch = fs.batch();
    // create() fails if the doc already exists, so the whole batch is rejected for a duplicate email.
    batch.create(fs.collection(USERS_BY_EMAIL).doc(user.email.toLowerCase()), { userId: user.id });
    batch.create(fs.collection(USERS).doc(user.id), user);
    try {
      await batch.commit();
      return true;
    } catch (err) {
      if ((err as { code?: number }).code === 6 /* ALREADY_EXISTS */) return false;
      throw err;
    }
  },
};

export const orders = {
  async listByUser(userId: string) {
    const snap = await firestore().collection(ORDERS).where("userId", "==", userId).get();
    // Sorted here rather than with orderBy() so no composite index is needed.
    return snap.docs.map((d) => d.data() as Order).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async findForUser(id: string, userId: string) {
    const snap = await firestore().collection(ORDERS).doc(id).get();
    const order = snap.exists ? (snap.data() as Order) : undefined;
    return order?.userId === userId ? order : undefined;
  },
  async create(order: Order) {
    await firestore().collection(ORDERS).doc(order.id).create(order);
  },
};

export const publicUser = (u: User) => ({
  id: u.id,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  countryCode: u.countryCode,
  phone: u.phone,
  company: u.company,
  country: u.country,
  createdAt: u.createdAt,
});

export type PublicUser = ReturnType<typeof publicUser>;
