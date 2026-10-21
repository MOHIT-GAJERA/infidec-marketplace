---
title: Demo Instructions
description: Explore QwikMart with sample data before you install it for real — on the live demo or on your own computer with the Firebase Emulator Suite.
---

Use the demo to explore QwikMart before installing it, or to check how a feature is meant to behave. You can try the hosted demo (link on the product page) or run the **complete platform on your own computer** with the sample data that ships in the package.

## Demo accounts

The sample data (`firebase/tools/emulator-data`) contains these accounts:

| Panel / app | Login URL | Email | Password |
|---|---|---|---|
| **Super Admin** | `/admin/login` | `admin@gmail.com` | `123456` |
| **Store panel** (Mumbai store) | `/store/login` | `mumbai@store.com` | `Mumbai@1` |
| **Delivery boy** (panel + app) | `/delivery/login` | `alex@gmail.com` | `Alex@1234` |
| **Customer** (app + website) | Login screen | `customer@gmail.com` | `123456` |

When the setting **Demo Mode** is on, the panel login form is pre-filled with the demo credentials and the website/apps show a "Use demo account" shortcut.

:::danger Never use these accounts in production
These passwords are public. On your live project create your own Super Admin ([Create the Super Admin](doc:installation/super-admin)), keep **Demo Mode off** (Admin → System Settings → General) and never import the sample data into production.
:::

## Run the demo on your computer

You need Node.js 22, Java 21 and the Firebase CLI — see [Localhost Setup](doc:installation/localhost-setup) for the full guide. The short version:

```bash
# 1. Backend: Firebase Emulator Suite with the sample data
cd firebase
npm install && npm --prefix functions install && npm --prefix functions run build
npx firebase emulators:start --project your-project-id --import tools/emulator-data

# 2. Admin Panel (new terminal)
cd admin && npm install
NEXT_PUBLIC_USE_EMULATORS=true npm run dev        # http://localhost:3001/admin/login

# 3. Website (new terminal)
cd web && npm install
NEXT_PUBLIC_USE_EMULATORS=true npm run dev        # http://localhost:3000
```

The Emulator Suite UI at `http://127.0.0.1:4000` shows the Firestore data, Auth users and function logs.

## What the demo will and will not do

:::warning The demo is a showroom
Everything runs against sample data. Third-party credentials — payment gateways, SMS, SMTP, Gemini — are empty, so online payments do not settle, OTP SMS are not sent (use the test OTP `123456` for `+91 9876543210`) and no e-mails go out.
:::

:::note Your own installation has no such limits
Once you add your own keys in **System Settings**, every feature works for real.
:::

## Suggested tour

If you have fifteen minutes and want to judge whether QwikMart fits your business:

1. **Dashboard** — the operational overview.
2. [Zones](doc:admin/zones) — open a zone and look at the delivery charge rules (fixed, per-km, free above an amount, surge hours).
3. [Stores](doc:admin/stores) — note that stock and price can be overridden per store.
4. [Home Builder](doc:admin/home-builder) — open a layout, reorder sections and publish.
5. [Orders](doc:admin/orders) — open an order, assign a rider, move it through the statuses.
6. [Roles & Permissions](doc:admin/roles-permissions) — check the permission granularity against your team.
7. [Reports](doc:admin/reports) — sales, products, tax, delivery boys and stores.

## Mobile apps

Run the apps against the same emulators so everything you change in the panel shows up instantly:

```bash
cd customer_app && flutter run --dart-define=USE_EMULATORS=true
cd delivery_app && flutter run --dart-define=USE_EMULATORS=true
```

The Android emulator reaches your computer at `10.0.2.2` (the default). For a real phone on Wi-Fi add `--dart-define=EMULATOR_HOST=<your PC's LAN IP>`.

## Questions

- Email: [contact@infidec.com](mailto:contact@infidec.com)
- [Support](doc:support) · [FAQs](doc:faqs)
