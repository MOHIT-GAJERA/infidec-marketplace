"use client";

import { useState } from "react";
import { siEnvato } from "simple-icons";

const GoogleIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

const providers = [
  { key: "google", label: "Google", icon: <GoogleIcon /> },
  {
    key: "envato",
    label: "Envato",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]" fill="#81B441">
        <path d={siEnvato.path} />
      </svg>
    ),
  },
] as const;

/**
 * "or continue with Google / Envato" row shared by the login and register forms.
 * OAuth is not wired up yet, so the buttons explain that instead of failing silently.
 */
export function SocialLogin() {
  const [note, setNote] = useState("");
  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted">or continue with</span>
        {providers.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setNote(`${p.label} sign-in is coming soon. Please use your email for now.`)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            {p.icon}
            {p.label}
          </button>
        ))}
      </div>
      {note && (
        <p role="status" className="mt-3 rounded-lg bg-brand-50 px-4 py-2.5 text-sm text-brand-800">
          {note}
        </p>
      )}
    </>
  );
}
