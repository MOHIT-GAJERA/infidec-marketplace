---
title: Wallet, Refer & Earn, Membership
description: The customer wallet with top-ups and partial payment, Refer & Earn rewards, paid membership plans and recurring product subscriptions.
---

## Digital wallet

Every customer has a wallet (`users/{uid}.walletBalance`). The balance is changed only by Cloud Functions, and every change is a `walletTransactions` entry.

| Money in | Money out |
|---|---|
| **Top-up** via Razorpay, Stripe or PayPal (₹10–₹50,000; `walletTopup`) | Paying for an order (fully or partly) |
| Refunds for cancellations and returns | Buying a membership |
| Referral rewards, cashback, admin credits | Admin debits |

![Wallet balance at checkout](/docs/go4market/images/app-customer-cart.webp "Cart: free-delivery progress, delivery type and speed, coupons and the Use wallet balance switch")

**Partial payment**: at checkout the customer switches on **Use wallet balance**. The quote returns `walletUsed`, and the rest (`payable`) is paid with any method, including COD. If the wallet covers everything, the order is placed immediately.

Turn the wallet off with **Platform settings → Customer wallet**. Credit or debit a customer from **Customers → customer → Wallet**.

## Refer & Earn

Each user gets a `referralCode` when their account is created. A new customer enters a friend's code at sign-up (or later in *Complete your profile*, if they have no orders yet). When the new customer's **first order is delivered**, `onOrderWritten` credits:

- the **referrer** with `referralReward` (default ₹50);
- the **new user** with `refereeReward` (default ₹50).

Both amounts are in **Platform settings**. Customers share their code from **Account → Refer & earn**.

## Membership plans

**Admin → Marketing → Membership plans** (`/marketing/membership`), stored in `membershipPlans`:

| Field | Effect |
|---|---|
| Plan name, Price, Strike-through price | Display and price |
| Duration (days) | Plan length |
| Free delivery | Delivery fee becomes 0 on every order while the plan is active |
| Extra discount | Percentage off the subtotal on every order |
| Benefits | Bullet list shown to customers |
| Active | Show or hide the plan |

Customers buy a plan from **Account → Membership**. It is **paid from the wallet** (`purchaseMembership`); if the balance is short, the app asks them to top up. The plan is stored on `users/{uid}.membership`, and `getCheckoutQuote` applies its benefits automatically until `expiresAt`.

## Product subscriptions

Customers can subscribe to everyday items such as milk or bread. On a product page they tap **Subscribe & never run out** and choose quantity, frequency (**daily**, **weekly** or **monthly**) and address. Subscriptions are stored in `subscriptions` and can be paused, resumed or cancelled by the customer.

Every day at **07:00 IST**, `runSubscriptions` places an order for each subscription that is due. It pays from the **wallet first**, with the rest as **COD**. If an order cannot be placed (for example the item is out of stock), the customer gets a notification.

**Admin → Marketing → Subscriptions** (`/marketing/subscriptions`) lists all subscriptions, where you can change the quantity, frequency, next delivery or status.

**Next:** [Reports & Analytics →](doc:admin/reports)
