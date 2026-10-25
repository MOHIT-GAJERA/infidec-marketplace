---
title: Demo Instructions
description: Explore Go4Ride on the hosted demo before you install it. The demo covers the admin panel, the Customer App and the Driver App.
---

Use the demo to judge whether Go4Ride fits your business, or to check how a feature should behave. It is a complete installation on Firebase with sample data: services, vehicle types, documents, drivers, rides, tickets and test-mode payment gateways.

## Demo access

| Part | How to get it | How to sign in |
|---|---|---|
| **Admin Panel** | The link is on the product page, or ask us at [contact@infidec.com](mailto:contact@infidec.com) | E-mail `admin@go4ride.app`. The password is shared on request |
| **Customer App** (Android) | Demo build on request | Phone OTP. We share a test phone number and code with the build |
| **Driver App** (Android) | Demo build on request | Phone OTP with a test driver account that is already approved |

![Admin login](/docs/go4ride/images/admin-login.jpg "Sign in with the demo e-mail and the password we send you")

:::warning The demo is shared
Other visitors use the same demo at the same time, and the data may be reset at any time. Don't enter real personal data. **Never enter real card or bank details.** The gateways run in **test mode**: no real money moves.
:::

## Suggested tour

If you have fifteen minutes:

1. **Dashboard**: total revenue with a 7-day chart, completed and active rides, online drivers, customers, ride mix by service and the fleet & KYC meters. Switch to **dark mode** from the top bar.
2. [Bookings → Cab](doc:admin/bookings): filter by **Placed / Ongoing / Completed / Cancelled** and **Paid / Unpaid**, then open a completed ride to see its timeline and fare breakdown.
3. [Drivers → Pending approval](doc:admin/drivers): open **Review documents**, look at the front and back images, approve or reject a single document, then **Approve KYC**.
4. [Online drivers](doc:admin/online-drivers): the live map of drivers who are online, with the time each one was last seen.
5. [Zones](doc:admin/zones): draw a zone on the map and set its local rates.
6. [Settings → Business model](doc:admin/commission-wallet): commission and cancellation charge. Then **Fare & pricing**: the fare preview updates as you type.
7. [Tickets](doc:admin/support): accept a ticket, reply in the chat, mark it resolved.
8. [Payout requests](doc:admin/payouts) and [Subscriptions](doc:admin/subscriptions): driver withdrawals and plans.

### With the mobile demo builds

1. In the **Customer App**, book a **Cab**. In the **Driver App** (online), accept the request before the timer runs out.
2. Tap **Navigate to pickup**, then **I've arrived**. The waiting timer starts.
3. The rider's ride screen shows a **4-digit OTP**. Enter it in the Driver App to **Start trip**, then **Complete trip**.
4. Back in the admin panel, open the ride in **Bookings**: it shows the timeline and the fare breakdown. The driver's **Wallet** and **Earnings** in [Drivers](doc:admin/drivers) change by the settlement amounts.
5. In the Customer App, top up the **wallet** online with a test card (see [Payment Gateways](doc:admin/payment-gateways#test-cards-and-accounts)).

## What the demo will and will not do

:::note Your own installation has no such limits
On the demo you see sample data and test-mode gateways. On your own project you add your own catalogue, Maps key and gateway keys, and every feature works for real.
:::

- Payments only use **test** keys: Stripe test cards, Razorpay test mode and a PayPal sandbox buyer.
- Push notifications reach only the demo builds.
- The login screen has a **First time? Create an admin account** link, but an account made there has **no access** until it carries the `admin` claim. On your own project, create the first admin as described in [Create the First Admin](doc:installation/super-admin).

## Run your own copy

You can run the whole platform on your computer with the **Firebase Emulator Suite**, with no cloud project and no billing. See [Localhost & Emulators](doc:installation/localhost-setup).

## Questions

- Email: [contact@infidec.com](mailto:contact@infidec.com)
- [Support](doc:support) · [FAQs](doc:faqs)
