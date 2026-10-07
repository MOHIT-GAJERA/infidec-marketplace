"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleUserRound, LogOut, Menu, Package, ShoppingCart, UserPlus, X } from "lucide-react";
import { Logo } from "./Logo";
import { useStore } from "./store/StoreProvider";
import { nav } from "@/lib/site";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { useAuthDialog } from "./auth/AuthDialog";

function CartLink({ count, className = "" }: { count: number; className?: string }) {
  return (
    <Link
      href="/cart"
      prefetch={false}
      aria-label={count ? `Cart, ${count} item${count > 1 ? "s" : ""}` : "Cart"}
      className={`relative inline-flex size-11 items-center justify-center rounded-lg text-ink hover:bg-brand-50 hover:text-brand-600 ${className}`}
    >
      <ShoppingCart aria-hidden="true" className="size-6" strokeWidth={1.8} />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-accent-600 px-1 text-xs font-bold text-white"
        >
          {count}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { userName, cart, logout } = useStore();
  const { openAuth } = useAuthDialog();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setMenu(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const doLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="container-x flex h-[72px] items-center justify-between lg:h-20">
        <Logo preload className="h-11 w-auto sm:h-12" />

        <nav aria-label="Main" className="hidden items-center md:flex">
          <ul className="flex items-center gap-1 lg:gap-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-base font-medium transition-colors hover:text-brand-600 ${
                    isActive(item.href) ? "text-brand-600" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className="mx-4 h-12 w-px bg-line lg:mx-6" />
          <CurrencySwitcher placement="down" id="currency-menu-header" />
          <CartLink count={cart.length} className="ml-2" />
          {userName ? (
            <div ref={menuRef} className="relative ml-2">
              <button
                type="button"
                aria-expanded={menu}
                aria-controls="user-menu"
                onClick={() => setMenu((v) => !v)}
                className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-base font-medium text-ink hover:text-brand-600"
              >
                <CircleUserRound aria-hidden="true" className="size-5" strokeWidth={1.8} />
                <span className="max-w-32 truncate">Hi, {userName}</span>
                <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${menu ? "rotate-180" : ""}`} />
              </button>
              <div
                id="user-menu"
                hidden={!menu}
                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-float"
              >
                <Link href="/account" prefetch={false} className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-brand-50">
                  <CircleUserRound aria-hidden="true" className="size-4" /> My Account
                </Link>
                <Link href="/account#orders" prefetch={false} className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-brand-50">
                  <Package aria-hidden="true" className="size-4" /> My Orders
                </Link>
                <button
                  type="button"
                  onClick={doLogout}
                  className="flex w-full items-center gap-2 border-t border-line px-4 py-2.5 text-left text-sm text-ink hover:bg-brand-50"
                >
                  <LogOut aria-hidden="true" className="size-4" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuth({ mode: "login" })}
              className="ml-2 inline-flex items-center gap-2 rounded-md px-2 py-2 text-base font-medium text-ink hover:text-brand-600"
            >
              <CircleUserRound aria-hidden="true" className="size-5" strokeWidth={1.8} />
              Login
            </button>
          )}
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <CurrencySwitcher placement="down" id="currency-menu-mobile" compact />
          <CartLink count={cart.length} />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg border border-line text-ink"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto border-t border-line bg-white md:hidden"
      >
        <nav aria-label="Mobile" className="container-x py-4">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block border-b border-line py-4 text-lg font-medium ${
                    isActive(item.href) ? "text-brand-600" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {userName ? (
            <div className="mt-6 space-y-3">
              <p className="text-base font-semibold text-ink">Hi, {userName}</p>
              <Link href="/account" prefetch={false} className="btn-outline w-full py-3 text-base">
                <CircleUserRound aria-hidden="true" className="size-5" /> My Account &amp; Orders
              </Link>
              <button type="button" onClick={doLogout} className="btn-dark w-full py-3 text-base">
                <LogOut aria-hidden="true" className="size-5" /> Logout
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openAuth({ mode: "login" });
                }}
                className="btn-dark w-full py-3 text-base"
              >
                <CircleUserRound aria-hidden="true" className="size-5" /> Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openAuth({ mode: "register" });
                }}
                className="btn-outline w-full py-3 text-base"
              >
                <UserPlus aria-hidden="true" className="size-5" /> Create Account
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
