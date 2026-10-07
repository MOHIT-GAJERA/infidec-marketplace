export type Plan = { key: string; name: string; oldPrice: number; price: number; note: string; support: string };

export const plans: Plan[] = [
  { key: "basic", name: "Basic", oldPrice: 29990, price: 21999, note: "Best for website launching setup", support: "None" },
  { key: "standard", name: "Standard", oldPrice: 54990, price: 44999, note: "Best for Android OR iOS App Setup", support: "3 Months" },
  { key: "advanced", name: "Advanced", oldPrice: 109990, price: 64999, note: "Best for Android + iOS Setup (Combo)", support: "3 Months" },
  { key: "premium", name: "Premium", oldPrice: 139990, price: 74999, note: "Best for Android + iOS + Website Setup", support: "3 Months" },
  { key: "super", name: "Super", oldPrice: 155990, price: 89999, note: "Best for Android + iOS + Web Setup", support: "6 Months" },
];

/** Feature matrix – booleans map to plans in the same order as `plans`. */
export const planFeatures: { label: string; values: boolean[] }[] = [
  { label: "VPS / Server Setup (AWS/GCP/Azure)", values: [true, true, true, true, true] },
  { label: "Database Setup", values: [true, true, true, true, true] },
  { label: "Setup Admin Panel", values: [true, true, true, true, true] },
  { label: "SSL Installation", values: [true, true, true, true, true] },
  { label: "DNS Setup", values: [true, true, true, true, true] },
  { label: "Firebase Configuration", values: [true, true, true, true, true] },
  { label: "Change Theme Colors", values: [true, true, true, true, true] },
  { label: "Live Website on Server", values: [true, false, false, true, true] },
  { label: "Change App & Package Name", values: [false, true, true, true, true] },
  { label: "Push Notifications Configuration (If Applicable)", values: [false, true, true, true, true] },
  { label: "In-App Purchase Configuration (If Applicable)", values: [false, true, true, true, true] },
  { label: "Advertisement Configuration (If Applicable)", values: [false, true, true, true, true] },
  { label: "Live over Play Store", values: [false, false, true, true, true] },
  { label: "Live over App Store", values: [false, false, true, true, true] },
  { label: "Customised Screenshot + Feature Graphic", values: [false, false, false, false, true] },
];
