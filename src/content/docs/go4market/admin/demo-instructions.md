---
title: Demo Instructions
description: Demo logins for every panel and app, what the demo data contains, and a suggested 15-minute tour of Go4Market.
---

Use the demo to explore Go4Market before installing it, or to check how a feature is meant to behave. The [seed script](doc:installation/seed-data) creates the same accounts in **your own project**, so you can follow this tour on your installation too.

## Demo credentials

| Role | Where to sign in | E-mail | Password |
|---|---|---|---|
| **Admin** (Super Admin) | Admin panel `/login` | `admin@go4market.com` | `Go4Market@123` |
| **Seller** (Go4 Fresh Mart) | Seller panel, or Partner app → *Seller* | `seller@go4market.com` | `Go4Market@123` |
| **Delivery partner** | Delivery panel, or Partner app → *Delivery* | `delivery@go4market.com` | `Go4Market@123` |
| **Customer** | Website or Customer app | `customer@go4market.com` | `Go4Market@123` |

The seed also creates three more sellers (`urbantrend@`, `mediplus@` and `spiceroute@go4market.com`) and two riders (`rider.mahesh@` and `rider.salim@go4market.com`), all with the same demo password.

When **Demo mode** is on (Admin → Settings → Demo & maintenance), the login screens show a *Demo accounts* shortcut that fills these credentials in.

![Partner app login with demo shortcuts](/docs/go4market/images/app-partner-login-seller.webp "Partner app: choose Seller or Delivery. Demo mode adds quick-fill buttons")

:::danger These are public demo credentials
Anyone who reads this page knows these passwords. On a live business, create your own Super Admin ([Create the Super Admin](doc:installation/super-admin)). Then delete the demo users in Firebase Authentication or change their passwords, and switch **Demo mode off**.
:::

## What the demo data contains

- The four **modules** with nested categories, brands, global attributes, GST tax classes (0/5/12/18/28 %) and four countries (IN, AE, US, GB).
- Four **sellers**, each with WebP product photos and EAN-13 barcodes:
  - Go4 Fresh Mart (Grocery);
  - Spice Route Kitchen (Food, with add-ons);
  - MediPlus Pharmacy;
  - UrbanTrend Lifestyle (Shopping).
- **Home sliders, offer banners, featured sections and a popup**, coupons (`WELCOME50`, `FREESHIP`, `G4MSAVE20` and more), membership plans, blogs, FAQs and policy pages.
- A customer with ₹500 in the wallet, saved addresses, a paused milk subscription and two product requests.
- `settings/platform` with delivery fees, slots, quick-delivery radius, COD limit and referral rewards.

## What the demo will not do

:::warning Third-party keys are yours to add
Online payments, SMTP e-mail, SMS and Gemini need **your** keys (see [Secrets & functions/.env](doc:installation/environment-configuration)). Without them, Cash on Delivery and Wallet still work, e-mails and SMS are skipped, and AI descriptions fall back to a template.
:::

## Suggested tour (15 minutes)

1. **Admin → Dashboard.** Use the module switcher in the top bar and watch the panel re-theme.
2. **Customer app or website.** Sign in as the customer and add Toned Milk and Chakki Atta to the cart. Choose **30 min** delivery, apply `WELCOME50` and place a **COD** order.
3. **Seller panel or Partner app (Seller).** The order appears under *New*. **Accept** it, then **Mark as packed**.
4. **Admin → Orders → the order.** Click **Auto-assign nearest online rider** or **Choose rider**.
5. **Partner app (Delivery).** Go **Online** and open the active delivery. Swipe to confirm the pickup; the order moves to *on the way*.
6. **Customer app.** Open the order. The rider moves on the OpenStreetMap map, and the 4-digit **delivery OTP** is shown.
7. **Partner app (Delivery).** Enter the OTP, tick **Cash collected** and mark the order delivered.
8. **Admin → Delivery → Cash collection.** Settle the rider's cash. Then open **Finance → Seller payouts** to see the seller's net after commission.

![Assigning a rider from the Admin panel](/docs/go4market/images/admin-choose-rider.webp "Admin → order → Choose a rider, or auto-assign the nearest online partner")

## Questions

- E-mail: [contact@infidec.com](mailto:contact@infidec.com)
- [Support](doc:support) · [FAQs](doc:faqs)
