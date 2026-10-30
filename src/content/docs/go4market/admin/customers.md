---
title: Customers & Product Requests
description: Find and manage customers, block accounts, adjust wallets, see carts and wishlists, and handle "request a product" submissions.
---

## Customers

**Admin → Customers** (`/customers`) lists every user with the `customer` role: name, e-mail, phone, city, wallet balance, orders and join date. Search and filter by status.

Open a customer (`/customers/:id`) to see their profile, orders and addresses, plus:

- a **Wallet** tab with balance and transactions, and **Adjust wallet** (credit or debit with a reason: admin, cashback, refund, referral). This calls `adjustWallet`, writes a `walletTransactions` entry and notifies the customer;
- a **Cart** tab with what is in their cart right now.

**Block** a customer to stop them using the platform. `setUserRole` with `status: 'blocked'` disables the Auth account and revokes their sessions; **Unblock** reverses it.

:::note Sign-in providers
Customers can sign up with e-mail/password, Google or phone OTP. Phone-only customers start as *Customer* with no e-mail until they complete their profile. The profile shows the providers used (`authProviders`).
:::

## Wishlists

**Customers → Wishlists** (`/customers/wishlists`) lists wishlist entries across all customers (admins can read the `wishlist` collection group). It is useful for planning stock and offers.

## Product requests

Customers can ask for a product you do not stock (**Account → Request a product** in the app and website). Requests are stored in `productRequests` with status `open`.

**Customers → Product requests** (`/customers/product-requests`): read the request, then mark it **added** (after you or a seller list the product) or **rejected**. Sellers can also see open requests and pick up ideas.

## Payment transactions

**Finance → Payment transactions** (`/finance/transactions`) lists every online payment (Razorpay, Stripe, PayPal) with gateway ID, currency, amount and status. Use it to match orders with your gateway dashboard.

**Next:** [Staff, Roles & Permissions →](doc:admin/staff-roles)
