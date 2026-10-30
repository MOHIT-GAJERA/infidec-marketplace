---
title: Seller Panel Overview
description: The Go4Market Seller Hub on the web, covering who uses it, how sellers sign in, and every menu.
---

The **Seller panel** ("Go4Market Seller Hub") is where store owners run their shop on a computer. It is built from the same Flutter codebase as the Admin panel (`apps/panel`, entrypoint `lib/main_seller.dart`) and hosted at `https://<your-project-id>-seller.web.app`. It uses an orange accent so it is never confused with the Admin panel.

Sellers who prefer their phone can do the same daily work in the **Partner app** (Seller role). See [Seller Mode](doc:app-partner/seller-mode).

## Sign in

![Seller panel login](/docs/go4market/images/seller-login.webp "Seller Hub login: e-mail and password, Google or Phone OTP, and Become a seller")

| Method | Notes |
|---|---|
| E-mail and password | Includes *Forgot password?* |
| **Google** | Pop-up sign-in (`signInWithPopup`) |
| **Phone OTP** | Invisible reCAPTCHA, +91 by default; test numbers from Firebase work |

New users who sign in with Google or phone are sent to `/register` to create their store. Sellers whose request is still pending see `/pending` until an admin approves them.

![Phone OTP on the Seller panel](/docs/go4market/images/seller-login-phone.webp "Seller sign-in with mobile number and OTP")

## Menu

| Group | Routes | Docs |
|---|---|---|
| Overview | `/dashboard` (today's revenue, orders, balance, order status, sales chart), `/pos` | [POS](doc:admin/pos) |
| Orders | `/orders`, `/orders/pickup`, `/orders/pos`, `/orders/:id`, `/returns`, `/print/invoice/:id` | [Orders](doc:seller/orders) |
| Catalogue | `/catalog/products`, `products/new`, `products/:id/edit`, `attributes`, `stock`, `reviews`, `bulk` | [Products](doc:seller/products) |
| Growth | `/marketing/coupons`, `/marketing/abandoned-carts`, `/riders` | [Coupons](doc:seller/finance-reports), [Own Riders](doc:seller/riders) |
| Money | `/finance/earnings`, `/finance/withdrawals` | [Earnings](doc:seller/finance-reports) |
| Reports | `/reports/sales`, `/reports/products`, `/reports/pos` | [Reports](doc:seller/finance-reports#reports) |
| Store | `/store` (profile, logo, banner, location, bank, policy) | [Registration](doc:seller/registration#store-settings) |

The panel offers the same conveniences as the Admin panel: English, Hindi, Gujarati and Arabic (RTL), dark mode, card or table views, notifications in the bell and optional browser push.

## What sellers can and cannot do

| Can | Cannot |
|---|---|
| Create and edit **their own** products (pending approval unless auto-approved) and update stock at any time | Change commission, store status or balance |
| See orders that contain **their** items and move them confirmed → packed → ready for pickup / assign a rider | See other sellers' orders, or customer data beyond their orders |
| Create coupons that apply only to their items | Create platform-wide coupons |
| Run their own rider fleet (if the admin allows it) | Approve their own store |
| Request withdrawals of their balance | Edit wallet or payment records |

These limits are enforced by Firestore rules and Cloud Functions, not just hidden in the menu.

**Next:** [Seller Registration & Approval →](doc:seller/registration)
