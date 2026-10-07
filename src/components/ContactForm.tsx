"use client";

import { useEffect, useState } from "react";
import { CircleArrowRight, CircleCheck, LoaderCircle } from "lucide-react";

const inquiryTypes = [
  "Product Purchase",
  "Installation Service",
  "Customization Request",
  "Server Setup",
  "Technical Support",
  "Extended License",
  "Other",
];

const countryCodes = [
  { code: "+91", label: "+91 (India)" },
  { code: "+1", label: "+1 (USA)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+61", label: "+61 (Australia)" },
  { code: "+65", label: "+65 (Singapore)" },
];

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [context, setContext] = useState("");

  // Pre-fill from ?product= / ?plan= links elsewhere on the site.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const product = sp.get("product");
    const plan = sp.get("plan");
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from the URL after hydration */
    if (plan && plan !== "none") {
      setInquiry("Installation Service");
      setContext(`Installation plan: ${plan}${product ? ` · Product: ${product}` : ""}`);
    } else if (product) {
      setInquiry("Product Purchase");
      setContext(`Product: ${product}${sp.get("license") ? ` · License: ${sp.get("license")}` : ""}`);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
      setInquiry("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const req = (
    <span aria-hidden="true" className="text-sale">
      {" "}
      *
    </span>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="overflow-hidden rounded-3xl border border-white bg-white shadow-float">
      <div className="border-b border-line bg-gradient-to-r from-brand-50 to-white px-5 py-5 sm:px-8">
        <h2 className="text-lg font-semibold text-ink sm:text-xl">Send Us a Message</h2>
        <p className="mt-1 text-sm text-muted">Share your installation details &amp; requirements. Fields marked * are required.</p>
      </div>

      <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
        <div>
          <label htmlFor="inquiry" className="text-[15px] font-medium text-ink">
            Inquiry Type{req}
          </label>
          <select
            id="inquiry"
            name="inquiry"
            required
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
            className={`field mt-2 ${inquiry ? "text-ink" : "text-gray-500"}`}
          >
            <option value="" disabled>
              Please share your server, domain, access details, or any specific requirements...
            </option>
            {inquiryTypes.map((t) => (
              <option key={t} value={t} className="text-ink">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-[15px] font-medium text-ink">
              Full Name{req}
            </label>
            <input id="name" name="name" required minLength={2} autoComplete="name" placeholder="Mr. Jack Williams" className="field mt-2" />
          </div>
          <div>
            <label htmlFor="email" className="text-[15px] font-medium text-ink">
              Email{req}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="example@gmail.com"
              className="field mt-2"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="phone" className="text-[15px] font-medium text-ink">
              Phone{req}
            </label>
            <div className="mt-2 flex rounded-lg border border-line focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
              <label htmlFor="country" className="sr-only">
                Country code
              </label>
              <select
                id="country"
                name="country"
                defaultValue="+91"
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
                id="phone"
                name="phone"
                type="tel"
                required
                inputMode="tel"
                pattern="[0-9\s\-]{6,15}"
                autoComplete="tel-national"
                placeholder="Phone Number"
                className="min-w-0 flex-1 rounded-r-lg bg-white px-4 py-3 text-[15px] text-ink placeholder:text-gray-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="text-[15px] font-medium text-ink">
            Requirements <span className="text-muted">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            defaultValue={context}
            key={context}
            placeholder="Tell us about your server, domain, access details, or any specific requirements…"
            className="field mt-2 resize-y"
          />
        </div>

        {status === "sent" && (
          <p role="status" className="flex items-center gap-2 rounded-lg bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
            <CircleCheck aria-hidden="true" className="size-5" />
            Thank you! Your request has been received. Our experts will get back to you within 1-2 business days.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse items-start gap-3 border-t border-line bg-gray-50/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-muted">We never share your details. Response within 24 hours.</p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-900 to-brand-800 px-6 py-3 text-base font-semibold text-white transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-110 disabled:translate-y-0 disabled:opacity-70"
        >
          {status === "sending" ? "Sending…" : "Submit Request"}
          {status === "sending" ? (
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          ) : (
            <CircleArrowRight aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>
    </form>
  );
}
