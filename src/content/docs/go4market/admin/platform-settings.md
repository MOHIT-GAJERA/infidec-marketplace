---
title: Platform Settings
description: The settings/platform document behind Admin → Settings → Platform settings, covering business details, currency, fees, tax, COD, wallet and referral rewards.
---

Almost every business rule lives in one Firestore document, `settings/platform`. Cloud Functions read it on every quote and order, and the clients read it for display. Edit it at **Admin → Settings → Platform settings** (`/settings/platform`), or open the **All settings** hub (`/settings`).

## Business

| Field | Key | Used for |
|---|---|---|
| App name, Tagline | `appName`, `tagline` | Website header, e-mails, SEO defaults |
| Contact e-mail and phone | `contactEmail`, `contactPhone` | Footer, help screens, e-mails, Play listing |
| Business address | `address` | Footer, invoices |
| Currency code and symbol | `currency`, `currencySymbol` | Display (default `INR` / `₹`) |
| INR → USD rate | `fx.usd` | Converting INR totals when Stripe or PayPal charge in USD (default `0.012`) |

## Money rules

| Field | Key | Behaviour (enforced by `getCheckoutQuote` / `placeOrder`) |
|---|---|---|
| Minimum order value | `minOrder` | Below it the quote returns `minOrderError` and checkout is blocked |
| Tax | `taxPct` | Added on top of `subtotal − discount`. Keep **0** when your prices already include GST (the demo prices are GST-inclusive) |
| Accept cash on delivery | `codEnabled` | Shows or hides COD |
| Max COD order value | `codMax` | Above it the quote returns `codAllowed: false` |
| Customer wallet | `walletEnabled` | Wallet screens and partial wallet payment |
| Referrer / new user reward | `referralReward`, `refereeReward` | Credited to both wallets on the referred user's **first delivered** order |

## Delivery fees (summary)

The fee fields (`deliveryFee`, `freeDeliveryAbove`, `quickDeliveryFee`, `perKmFee`, `maxDeliveryKm`) and the speed toggles appear here and on **Delivery → Delivery settings**. Both pages edit the same document. How the fee is calculated is explained in [Delivery Settings & Slots](doc:admin/delivery-settings).

## Other keys in `settings/platform`

Some keys have no field on this page; set them on the page listed:

| Key | Set on | Purpose |
|---|---|---|
| `slots`, `quick15MaxKm`, `quick30MaxKm`, `baseKm`, `autoAssign`, `riderPay`, `sellerRidersEnabled` | [Delivery Settings](doc:admin/delivery-settings) | Delivery behaviour |
| `seo`, `social` | [SEO & Social](doc:admin/seo-social) | Meta tags, sitemap, footer icons |
| `appVersions`, `storeUrls` | [App Versions](doc:admin/app-versions) | Force update |
| `demoMode`, `demo`, `maintenance`, `maintenanceMessage` | [Demo & Maintenance](doc:admin/system) | Demo logins, maintenance mode |
| `theme` | Settings → Theme | Stored brand colours (see the note below) |
| `returnWindowDays` | Firestore console | Days after delivery a return can be requested (default 7) |
| `autoApproveProducts` | Firestore console | `true` lets seller products go live without approval |
| `maps` | Firestore console | `{provider: 'osm', tileUrl}` reference value |

:::note Theme colours
**Settings → Theme** saves `theme.primary` and `theme.accent` and previews them. The shipped clients take their base palette from `packages/g4m_core/lib/src/theme/brand.dart` at build time, and the per-module colours from **Modules**. To change the brand colour everywhere, edit `brand.dart` and rebuild. See [Theme Colours & Font](doc:app-customer/change-theme).
:::

:::tip Changes apply immediately
Settings are read live. A new fee or COD limit is used by the very next checkout quote; no deploy or rebuild is needed.
:::

**Next:** [Delivery Settings & Slots →](doc:admin/delivery-settings)
