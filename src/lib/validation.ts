/** Shared (client + server) validation rules so both sides agree on what's valid. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^[0-9]{6,15}$/;
export const POSTAL_RE = /^[A-Za-z0-9\s-]{3,10}$/;
export const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const PASSWORD_MIN = 8;

/** At least 8 chars with upper, lower, digit and symbol. */
export function passwordIssues(pw: string) {
  const issues: string[] = [];
  if (pw.length < PASSWORD_MIN) issues.push(`at least ${PASSWORD_MIN} characters`);
  if (!/[a-z]/.test(pw)) issues.push("a lowercase letter");
  if (!/[A-Z]/.test(pw)) issues.push("an uppercase letter");
  if (!/[0-9]/.test(pw)) issues.push("a number");
  if (!/[^A-Za-z0-9]/.test(pw)) issues.push("a symbol");
  return issues;
}

export const countries = [
  "India",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Australia",
  "Canada",
  "Singapore",
  "Germany",
  "Saudi Arabia",
  "South Africa",
  "Other",
];

export const countryCodes = [
  { code: "+91", label: "+91 (India)" },
  { code: "+1", label: "+1 (USA/Canada)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+61", label: "+61 (Australia)" },
  { code: "+65", label: "+65 (Singapore)" },
  { code: "+49", label: "+49 (Germany)" },
  { code: "+966", label: "+966 (Saudi Arabia)" },
  { code: "+27", label: "+27 (South Africa)" },
];

export const indianStates = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other",
];

export const paymentMethods = [
  { key: "upi", label: "UPI", hint: "Google Pay, PhonePe, Paytm, BHIM" },
  { key: "card", label: "Credit / Debit Card", hint: "Visa, Mastercard, RuPay, Amex" },
  { key: "netbanking", label: "Net Banking", hint: "All major Indian banks" },
  { key: "razorpay", label: "Razorpay / Stripe", hint: "International cards & wallets" },
] as const;

export const GST_RATE = 0.18;
