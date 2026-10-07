"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Field, fieldClass } from "./forms/Field";
import { useStore } from "./store/StoreProvider";
import { SocialLogin } from "./auth/SocialLogin";
import { countryCodes, EMAIL_RE, passwordIssues, PHONE_RE } from "@/lib/validation";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  acceptTerms: boolean;
};

const initial: Form = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+91",
  phone: "",
  password: "",
  acceptTerms: false,
};

function validate(f: Form) {
  const e: Record<string, string> = {};
  if (f.firstName.trim().length < 2) e.firstName = "Enter your first name.";
  if (!f.lastName.trim()) e.lastName = "Enter your last name.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (!PHONE_RE.test(f.phone.replace(/[\s-]/g, ""))) e.phone = "Enter a valid phone number (6–15 digits).";
  const issues = passwordIssues(f.password);
  if (issues.length) e.password = `Password needs ${issues.join(", ")}.`;
  if (!f.acceptTerms) e.acceptTerms = "You must accept the terms to continue.";
  return e;
}

type Props = {
  /** Where to go after registering; stays on the current page when null. */
  next: string | null;
  /** Switch the dialog to the login tab. */
  onSwitch: () => void;
  /** Close the dialog. */
  onDone: () => void;
};

export function RegisterForm({ next, onSwitch, onDone }: Props) {
  const router = useRouter();
  const { onLogin } = useStore();
  const [f, setF] = useState<Form>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
    if (formError) setFormError("");
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length) {
      setFormError("Please fix the highlighted fields.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        errors?: Record<string, string>;
        user?: { firstName: string };
      };
      if (!res.ok || !json.ok || !json.user) {
        if (json.errors) setErrors(json.errors);
        throw new Error(json.error || "Registration failed. Please try again.");
      }
      onLogin(json.user.firstName);
      onDone();
      if (next) router.push(next);
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Registration failed. Please try again.");
      setBusy(false);
    }
  }

  return (
    <>
      <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First Name" required error={errors.firstName}>
            {(a) => (
              <input {...a} name="firstName" autoComplete="given-name" value={f.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Jack" className={fieldClass(errors.firstName)} />
            )}
          </Field>
          <Field label="Last Name" required error={errors.lastName}>
            {(a) => (
              <input {...a} name="lastName" autoComplete="family-name" value={f.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Williams" className={fieldClass(errors.lastName)} />
            )}
          </Field>
        </div>

        <Field label="Email" required error={errors.email}>
          {(a) => (
            <input {...a} name="email" type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="example@gmail.com" className={fieldClass(errors.email)} />
          )}
        </Field>

        <Field label="Phone" required error={errors.phone}>
          {(a) => (
            <div className={`flex rounded-lg border ${errors.phone ? "border-red-600" : "border-line"} focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100`}>
              <select
                aria-label="Country code"
                name="countryCode"
                value={f.countryCode}
                onChange={(e) => set("countryCode", e.target.value)}
                autoComplete="tel-country-code"
                className="rounded-l-lg border-r border-line bg-white py-3 pr-2 pl-3 text-[15px] text-ink focus:outline-none"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                {...a}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={f.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="98765 43210"
                className="min-w-0 flex-1 rounded-r-lg bg-white px-4 py-3 text-[15px] text-ink placeholder:text-gray-500 focus:outline-none"
              />
            </div>
          )}
        </Field>

        <Field label="Password" required error={errors.password}>
          {(a) => (
            <div className="relative">
              <input
                {...a}
                name="password"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                value={f.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Create a strong password"
                className={`${fieldClass(errors.password)} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-muted hover:text-ink"
              >
                {show ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
              </button>
            </div>
          )}
        </Field>

        <div className="space-y-3">
          <div>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                checked={f.acceptTerms}
                onChange={(e) => set("acceptTerms", e.target.checked)}
                aria-invalid={errors.acceptTerms ? true : undefined}
                aria-describedby={errors.acceptTerms ? "terms-err" : undefined}
                className="mt-0.5 size-4 shrink-0 accent-brand-600"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms-and-conditions" target="_blank" className="font-medium text-brand-600 underline underline-offset-2">
                  Terms and Conditions
                </Link>
                ,{" "}
                <Link href="/license-terms" target="_blank" className="font-medium text-brand-600 underline underline-offset-2">
                  License Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" target="_blank" className="font-medium text-brand-600 underline underline-offset-2">
                  Privacy Policy
                </Link>
                .<span aria-hidden="true" className="text-sale"> *</span>
              </span>
            </label>
            {errors.acceptTerms && (
              <p id="terms-err" className="mt-1.5 text-sm text-red-700">
                {errors.acceptTerms}
              </p>
            )}
          </div>
        </div>

        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {formError}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn-gradient w-full py-3.5 text-base">
          {busy && <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />}
          {busy ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <SocialLogin />

      <p className="mt-6 text-center text-[15px] text-body">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-brand-600 hover:underline">
          Log in
        </button>
      </p>
    </>
  );
}
