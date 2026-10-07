import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Minimal JSON-file persistence so accounts and orders work without extra infrastructure.
 * Suitable for a single Node.js server (`next start`, VPS, Docker). For serverless hosting
 * (read-only file system) swap these helpers for a real database such as Postgres or MongoDB.
 */
const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), ".data");

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

// Serialise writes per file so concurrent requests don't clobber each other.
const locks = new Map<string, Promise<unknown>>();

async function readJson<T>(name: string): Promise<T[]> {
  try {
    return JSON.parse(await readFile(join(DATA_DIR, `${name}.json`), "utf8")) as T[];
  } catch {
    return [];
  }
}

async function update<T>(name: string, fn: (rows: T[]) => T[] | Promise<T[]>): Promise<void> {
  const prev = locks.get(name) ?? Promise.resolve();
  const next = prev.then(async () => {
    await mkdir(DATA_DIR, { recursive: true });
    const rows = await fn(await readJson<T>(name));
    const file = join(DATA_DIR, `${name}.json`);
    await writeFile(`${file}.tmp`, JSON.stringify(rows, null, 2));
    await rename(`${file}.tmp`, file);
  });
  locks.set(name, next.catch(() => undefined));
  return next;
}

export const users = {
  async findByEmail(email: string) {
    const all = await readJson<User>("users");
    return all.find((u) => u.email === email.toLowerCase());
  },
  async findById(id: string) {
    const all = await readJson<User>("users");
    return all.find((u) => u.id === id);
  },
  /** Returns false if the email is already registered. */
  async create(user: User) {
    let created = false;
    await update<User>("users", (rows) => {
      if (rows.some((u) => u.email === user.email)) return rows;
      created = true;
      return [...rows, user];
    });
    return created;
  },
};

export const orders = {
  async listByUser(userId: string) {
    const all = await readJson<Order>("orders");
    return all.filter((o) => o.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async findForUser(id: string, userId: string) {
    const all = await readJson<Order>("orders");
    return all.find((o) => o.id === id && o.userId === userId);
  },
  async create(order: Order) {
    await update<Order>("orders", (rows) => [...rows, order]);
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
