---
title: Installation Steps
description: Install the Go4Foodie website, point it at your backend and run it locally.
---

## Requirements

- **Node.js 22** and npm
- A deployed backend: the `api` Cloud Function behind your API Hosting site ([Deploy the Backend](doc:installation/backend-deploy)), or the local API server on port 8787 ([Localhost Setup](doc:installation/localhost-setup))

## 1. Install

```bash
cd website
npm install
```

## 2. Environment variables

The website needs only two variables. Neither of them is a secret.

```env title="website/.env.local"
# Backend API host — the Firebase Hosting site that rewrites /api/** to the `api` function.
# Host only: no /api suffix, no trailing slash.
ADMIN_API_URL=https://yourrestaurant-1a2b3.web.app

# Public origin of this website — canonical URLs, Open Graph images, sitemap, robots.
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Variable | Required | Read by | Notes |
|---|---|---|---|
| `ADMIN_API_URL` | Yes | `lib/admin-api.ts` (server only) | If unset, the code falls back to the default host written in `lib/admin-api.ts`. Change that default to your API host too. For a local API use `http://127.0.0.1:8787` |
| `NEXT_PUBLIC_SITE_URL` | Yes in production | `lib/site.ts` | Your real domain, e.g. `https://www.yourrestaurant.com`. Trailing slashes are removed. Without it the site uses `VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:3000`. It is **inlined at build time** |

There are **no payment keys** in the website. Gateways are configured on the backend ([Payment Gateways](doc:admin/payment-gateways)), and the browser receives only public keys at checkout.

:::warning NEXT_PUBLIC_ values are baked into the build
Changing `NEXT_PUBLIC_SITE_URL` needs a new `next build`. `ADMIN_API_URL` is read when a request runs, so a restart is enough.
:::

## 3. Run

```bash
npm run dev                    # http://localhost:3000
npm run build && npm start     # production build — `next start -p 20133` → http://localhost:20133
```

Change the port of `npm start` in `package.json` (`"start": "next start -p 20133"`) if you need another one.

## 4. First check

1. `/menu` shows **your** dishes and categories from Admin → Menu, not the sample menu.
2. `/order` → **Take Away** → add a dish → **Schedule Now** → enter your details → **Place Order**. The order appears in Admin → Orders.
3. In Admin → Tables, open a table's QR (or copy its code) and visit `/order?table=<code>`. The banner shows the table number. Send an order, and the table becomes occupied on the Live Floor.
4. `/table-reservation` → **Table Booking** → confirm. The reservation appears in Admin → Reservations as *Requested*.
5. Home → gift card → buy one. It appears in Admin → Gift Cards.

If no payment gateway is configured, these orders go through without payment (demo mode). See [Payments](doc:web/payments).

:::tip The website and the QR codes must agree
Table QR codes encode `<WEBSITE_URL>/order?table=<code>`, where `WEBSITE_URL` is set on the **backend** (`functions/.env.<project-id>`). Set it to the website's public domain, or scanned QR codes will open the wrong site ([Environment Configuration](doc:installation/environment-configuration)).
:::

**Next:** [File Structure →](doc:web/file-structure)
