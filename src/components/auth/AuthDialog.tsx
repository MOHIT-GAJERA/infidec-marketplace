"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BadgeCheck, Download, Headset, X } from "lucide-react";
import { Logo } from "../Logo";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";
import { safeNext } from "../forms/Field";

export type AuthMode = "login" | "register";
export type AuthReason = "buy" | "cart" | null;
type OpenOptions = { mode?: AuthMode; next?: string | null; reason?: AuthReason };

type Ctx = { openAuth: (opts?: OpenOptions) => void; closeAuth: () => void };
const AuthCtx = createContext<Ctx | null>(null);

export function useAuthDialog() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuthDialog must be used inside <AuthDialogProvider>");
  return ctx;
}

const perks = [
  { Icon: Download, text: "Instant downloads & lifetime updates" },
  { Icon: BadgeCheck, text: "Licences & invoices in one place" },
  { Icon: Headset, text: "Priority support from our team" },
];

/**
 * Login / register modal shared by the whole site.
 * Open it with `useAuthDialog().openAuth()`, or by linking to any URL with `?auth=login|register[&next=/path]`
 * (used by server redirects for signed-out visitors).
 */
export function AuthDialogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [next, setNext] = useState<string | null>(null);
  const [reason, setReason] = useState<AuthReason>(null);

  const openAuth = useCallback((opts: OpenOptions = {}) => {
    setMode(opts.mode ?? "login");
    setNext(opts.next ? safeNext(opts.next) : null);
    setReason(opts.reason ?? null);
    setOpen(true);
  }, []);
  const closeAuth = useCallback(() => setOpen(false), []);

  // Open from ?auth=… (server redirects, old /login and /register links), then clean the URL.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const auth = sp.get("auth");
    if (auth !== "login" && auth !== "register") return;
    const r = sp.get("reason");
    /* eslint-disable react-hooks/set-state-in-effect -- sync dialog state from the URL after navigation */
    openAuth({ mode: auth, next: sp.get("next"), reason: r === "buy" || r === "cart" ? r : null });
    /* eslint-enable react-hooks/set-state-in-effect */
    ["auth", "next", "reason"].forEach((k) => sp.delete(k));
    const qs = sp.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
  }, [pathname, openAuth]);

  // Sync React state with the native <dialog> (focus trap, Esc, top layer).
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // Start in the first field rather than on the logo link.
      requestAnimationFrame(() => d.querySelector<HTMLInputElement>("form input")?.focus());
    }
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const value = useMemo(() => ({ openAuth, closeAuth }), [openAuth, closeAuth]);
  const titleId = "auth-dialog-title";

  return (
    <AuthCtx.Provider value={value}>
      {children}
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // Click on the backdrop (outside the panel) closes the dialog.
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="auth-dialog m-auto w-[calc(100%-1.5rem)] max-w-[960px] overflow-visible bg-transparent p-0 backdrop:bg-brand-900/70 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="relative flex max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-20px_rgb(7_11_46/0.6)]">
            {/* Brand panel */}
            <aside className="relative isolate hidden w-[340px] shrink-0 overflow-hidden bg-gradient-to-br from-brand-900 via-brand-900 to-brand-900 p-8 text-white md:flex md:flex-col">
              <div aria-hidden="true" className="absolute -top-20 -right-20 -z-10 size-60 rounded-full bg-brand-400/30 blur-3xl" />
              <div aria-hidden="true" className="absolute -bottom-24 -left-16 -z-10 size-64 rounded-full bg-accent-500/30 blur-3xl" />
              <Logo tone="dark" className="h-11 w-auto" />
              <p className="mt-10 text-2xl leading-tight font-semibold">
                {mode === "login" ? "Welcome back to " : "Join "}
                <span className="bg-gradient-to-r from-brand-200 to-accent-400 bg-clip-text text-transparent">Infidec Marketplace</span>
              </p>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Ready-made apps, product kits and expert installation — all in one account.
              </p>
              <ul className="mt-8 space-y-3">
                {perks.map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <div className="mt-auto rounded-2xl bg-white/10 p-4 text-sm ring-1 ring-white/15">
                <p className="font-semibold">24K+ clients · 4.8★ rating</p>
                <p className="mt-1 text-white/70">Trusted by founders in 50+ countries.</p>
              </div>
            </aside>

            {/* Form side */}
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-7 sm:px-9 sm:pt-7 sm:pb-9">
              <div className="flex items-center justify-between gap-4">
                <div className="md:hidden">
                  <Logo className="h-9 w-auto" />
                </div>
                <button
                  type="button"
                  onClick={closeAuth}
                  aria-label="Close"
                  className="ml-auto inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-gray-100 hover:text-ink"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>

              <h2 id={titleId} className="mt-2 text-2xl font-semibold text-ink">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-1 text-[15px] text-body">
                {mode === "login" ? "Log in to buy products and access your downloads." : "It's free and takes less than a minute."}
              </p>

              {mode === "login" ? (
                <LoginForm next={next} reason={reason} onSwitch={() => setMode("register")} onDone={closeAuth} />
              ) : (
                <RegisterForm next={next} onSwitch={() => setMode("login")} onDone={closeAuth} />
              )}
            </div>
          </div>
        )}
      </dialog>
    </AuthCtx.Provider>
  );
}
