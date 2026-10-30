---
title: Demo, Maintenance & System Health
description: Switch demo mode and maintenance mode, and use the System health page to check integrations, counts, backups and missing indexes.
---

## Demo mode

**Admin → Settings → Demo & maintenance** (`/settings/system-mode`):

| Field | Key | Effect |
|---|---|---|
| Demo mode | `demoMode` | Login screens on the website, panels and apps show a *Demo accounts* shortcut |
| Customer / Seller / Delivery e-mail and password | `demo.*` | The credentials the shortcut fills in |

:::danger Turn demo mode off on a live business
Demo mode shows passwords on public login screens. Keep it on only for a showcase install or while Google Play reviewers test your app (Play Console → App access). Turn it off afterwards and change those passwords.
:::

## Maintenance mode

| Field | Key | Effect |
|---|---|---|
| Maintenance mode | `maintenance` | `placeOrder` refuses new orders with `unavailable` |
| Maintenance message | `maintenanceMessage` | The message customers see, e.g. *"We are upgrading Go4Market. Back shortly!"* |

Browsing, carts, panels, deliveries in progress and payouts keep working. Use it during a data migration or a price update.

## System health

**Admin → System health** (`/system`) calls `getSystemStatus` and shows:

| Block | What it tells you |
|---|---|
| **Integrations** | Whether Razorpay, Stripe, PayPal, SMTP, SMS (with the active provider) and Gemini are configured on the server |
| **Stats** | Totals from `stats/overview`: orders, revenue, customers, sellers, products |
| **Flags** | Demo mode, maintenance, auto-assign and other switches |
| **Last backup** | Result of the weekly `backupFirestore` export |
| **Runtime** | Functions region, Node version, server time and round-trip latency |
| **Indexes** | Queries that failed because an index is missing, with the console link to create it |

:::tip After every deploy
Open System health once after each backend deploy. A red integration means a secret is `unset` or a function was not redeployed after you changed it.
:::

**Next:** [Dashboard →](doc:admin/dashboard)
