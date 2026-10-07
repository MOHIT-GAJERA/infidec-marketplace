"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PENDING_KEY } from "./pending";
import type { Currency } from "@/lib/site";

export type Consent = "accepted" | "declined" | null;

export type CartItem = {
  /** slug + license + plan – adding the same combination twice is a no-op (digital licence). */
  id: string;
  slug: string;
  name: string;
  image?: string;
  license: "regular" | "extended";
  plan: string;
};

type Store = {
  ready: boolean;
  userName: string | null;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => "added" | "exists";
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  onLogin: (firstName: string) => void;
  logout: () => Promise<void>;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  consent: Consent;
  setConsent: (c: Exclude<Consent, null>) => void;
};

const Ctx = createContext<Store | null>(null);
const CART_KEY = "bow_cart";
const CURRENCY_KEY = "bow_currency";
const CONSENT_KEY = "bow_cookie_consent";

const getLS = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const setLS = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* storage unavailable */
  }
};

const readNameCookie = () => {
  const m = document.cookie.match(/(?:^|;\s*)bow_uname=([^;]+)/);
  return m ? decodeURIComponent(decodeURIComponent(m[1])) : null;
};

const safeLoad = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => i && typeof i.slug === "string") : [];
  } catch {
    return [];
  }
};

const safeSave = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable – cart stays in memory */
  }
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrencyState] = useState<Currency>("INR");
  const [consent, setConsentState] = useState<Consent>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate client-only state (cookie + localStorage) */
    setUserName(readNameCookie());
    setCart(safeLoad());
    if (getLS(CURRENCY_KEY) === "USD") setCurrencyState("USD");
    const c = getLS(CONSENT_KEY);
    if (c) {
      try {
        const v = (JSON.parse(c) as { value?: Consent }).value;
        if (v === "accepted" || v === "declined") setConsentState(v);
      } catch {
        /* ignore malformed */
      }
    }
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    const onStorage = (e: StorageEvent) => e.key === CART_KEY && setCart(safeLoad());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((fn: (prev: CartItem[]) => CartItem[]) => {
    setCart((prev) => {
      const next = fn(prev);
      safeSave(next);
      return next;
    });
  }, []);

  const addToCart = useCallback(
    (item: Omit<CartItem, "id">) => {
      const id = `${item.slug}|${item.license}|${item.plan}`;
      const exists = safeLoad().some((i) => i.id === id);
      if (!exists) update((prev) => [...prev.filter((i) => i.id !== id), { ...item, id }]);
      return exists ? "exists" : "added";
    },
    [update],
  );

  const removeFromCart = useCallback((id: string) => update((prev) => prev.filter((i) => i.id !== id)), [update]);
  const clearCart = useCallback(() => update(() => []), [update]);
  const onLogin = useCallback(
    (firstName: string) => {
      setUserName(firstName);
      // Add the item a guest picked before being asked to log in.
      try {
        const raw = sessionStorage.getItem(PENDING_KEY);
        sessionStorage.removeItem(PENDING_KEY);
        if (raw) {
          const item = JSON.parse(raw) as Omit<CartItem, "id">;
          if (item && typeof item.slug === "string") addToCart(item);
        }
      } catch {
        /* ignore */
      }
    },
    [addToCart],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setUserName(null);
    update(() => []);
  }, [update]);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    setLS(CURRENCY_KEY, c);
  }, []);

  const setConsent = useCallback((c: Exclude<Consent, null>) => {
    setConsentState(c);
    setLS(CONSENT_KEY, JSON.stringify({ value: c, at: new Date().toISOString() }));
    // Analytics / marketing scripts can listen for this and load only when accepted.
    window.dispatchEvent(new CustomEvent("bow:consent", { detail: c }));
  }, []);

  const value = useMemo(
    () => ({ ready, userName, cart, addToCart, removeFromCart, clearCart, onLogin, logout, currency, setCurrency, consent, setConsent }),
    [ready, userName, cart, addToCart, removeFromCart, clearCart, onLogin, logout, currency, setCurrency, consent, setConsent],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
