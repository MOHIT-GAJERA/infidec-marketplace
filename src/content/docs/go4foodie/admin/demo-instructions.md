---
title: Demo Instructions
description: Explore Go4Foodie on the hosted demo before you install it. The demo covers the admin panel, the customer website and the mobile app.
---

Use the demo to judge whether Go4Foodie fits your restaurant, or to check how a feature should behave. It is a complete installation on Firebase with sample data.

## Demo links

| Part | Address | How to sign in |
|---|---|---|
| **Admin Panel** | [go4foodies-admin.web.app](https://go4foodies-admin.web.app) | The demo login is shown under the sign-in form. Click the **copy** button to fill it in |
| **Customer Website** | [go4foodies-web--go4foodies.asia-southeast1.hosted.app](https://go4foodies-web--go4foodies.asia-southeast1.hosted.app) | No login needed. Order, book a table or buy a gift card as a guest |
| **Mobile App** (Customer / Restaurant / Owner) | Demo builds on request | Write to [contact@infidec.com](mailto:contact@infidec.com) |

![Admin login with demo hint](/docs/go4foodie/images/admin-login.jpg "The demo credentials sit below the Sign in button. The copy button fills the form")

:::warning The demo is shared
Other visitors use the same demo at the same time, and the data may be reset at any time. Don't enter real personal data. **Never enter real card details.** Payments on the demo are for showing the flow only.
:::

## Suggested tour

If you have fifteen minutes:

1. **Overview (dashboard)**: KPIs, outlet cost vs revenue, top categories, employee status, recent orders, trending item and POS activity. Switch to **dark mode** from the top bar.
2. [Floor](doc:admin/floor): the live floor plan. Open a table, set its state, and watch it update without reloading.
3. [POS](doc:admin/pos): add items, print a KOT, void an item, add a discount, tip or service charge, take a split payment, then **Close & Pay**.
4. On the **website**, place a **take-away order**. Then open [Orders](doc:admin/orders) and move it through the stepper.
5. On the website, open the **Menu**, then a table link (`/order?table=<code>`, from [Tables](doc:admin/tables) → QR code). Place a dine-in order and see the table's session open on the floor.
6. [Reservations](doc:admin/reservations): book a table on the website, then confirm and complete it in the panel.
7. [Table Analytics](doc:admin/table-analytics) and [Reports](doc:admin/reports): busy hours, table rankings, revenue by outlet, CSV / Excel / PDF exports.
8. [Audit Log](doc:admin/audit-log): every floor and POS action you just took, with who did it and when.

## What the demo will and will not do

:::note Your own installation has no such limits
On the demo you see the restaurant's sample menu, sample e-mails and payment test mode. On your own project you add your own menu, SMTP account and gateway keys, and every feature works for real.
:::

- E-mails are only sent when the demo's SMTP account is set up. Don't rely on getting one.
- Admin users can't be created from the panel, on the demo or on your own installation. See [Admin Users](doc:installation/admin-users).
- The demo shows its login on the sign-in screen. On your own installation, remove that hint before going live (see [Admin Panel Installation](doc:installation/admin-panel#2-remove-the-demo-login-hint)).

## Run your own copy

Go4Foodie needs a Firebase project to run. There is no offline sample mode. To try it on your own computer, create a separate *development* Firebase project, then follow [Localhost Setup](doc:installation/localhost-setup).

## Questions

- Email: [contact@infidec.com](mailto:contact@infidec.com)
- [Support](doc:support) · [FAQs](doc:faqs)
