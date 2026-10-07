"use client";

import Link from "next/link";
import { useStore } from "./store/StoreProvider";

/** First-visit cookie banner. Analytics/marketing stay off until the visitor accepts. */
export function CookieConsent() {
  const { ready, consent, setConsent } = useStore();
  if (!ready || consent) return null;

  return (
    <section
      aria-labelledby="cookie-title"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-5 sm:pb-5"
    >
      <div className="mx-auto flex max-w-[1480px] flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_8px_40px_-8px_rgb(0_0_0/0.25)] sm:p-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h2 id="cookie-title" className="text-sm font-medium tracking-[0.18em] text-ink uppercase">
            Cookies on this site
          </h2>
          <p className="mt-2 text-sm leading-6 text-body">
            We use analytics and marketing cookies to understand how the site is used and to measure our campaigns. They stay
            off until you accept. Read our{" "}
            <Link href="/cookies-policy" className="font-medium text-accent-600 underline underline-offset-2">
              Cookies Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setConsent("declined")}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-line bg-white px-6 text-base font-medium text-ink hover:bg-gray-50 md:flex-none"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-ink px-7 text-base font-semibold text-white hover:bg-brand-800 md:flex-none"
          >
            Accept
          </button>
        </div>
      </div>
    </section>
  );
}
