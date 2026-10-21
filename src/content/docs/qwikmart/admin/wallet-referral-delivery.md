---
title: Wallet, Referral & Delivery
description: Wallet limits and withdrawals, Refer & Earn rewards, rider assignment, commission and delivery OTP.
---

## Wallet

**System Settings → Wallet**

| Field | Example | Notes |
|---|---|---|
| Enable Wallet | On | Wallet payment method, top-ups and refunds to wallet |
| Minimum / Maximum Recharge | ₹100 / ₹10,000 | Limits for adding money with an online gateway |
| Allow Withdrawals | On | Customers can request money they added back to their bank |
| Minimum Withdraw | ₹100 | |

The Wallet holds refunds, cashback, referral rewards and top-ups. It is a **closed-loop** balance usable only in your store. Withdrawal requests are approved in **Wallet & Withdrawals → Withdrawal Requests** (see [Customers & Wallet](doc:admin/customers)).

## Refer & Earn

**System Settings → Referral**

| Field | Example | Notes |
|---|---|---|
| Enable Referral Program | On | Shows *Refer & Earn* in the app and website |
| Referrer Reward | ₹50 | Credited to the customer who shared the code |
| Referred User Reward | ₹25 | Credited to the new customer |
| Minimum First Order | ₹199 | Rewards are released after the new customer's first order of at least this amount |

## Delivery

**System Settings → Delivery**

| Field | Notes |
|---|---|
| Default Delivery Radius (km) | Fallback radius when a store has no zone polygon match |
| **Auto-assign delivery boy** | On: quick orders are assigned to the **nearest online, approved** rider of the zone as soon as they are placed. Off: assign manually in Orders, or riders accept from the *Available* list |
| Rider location interval (sec) | How often online riders send their GPS position (default 10 s). Lower = smoother tracking, more Firestore writes |
| Default Commission Type / Value | Rider earning per delivered order: fixed amount or percent of the order (can be overridden per rider) |
| Delivery OTP required | The rider must enter the customer's 6-digit OTP to complete delivery |

:::tip Delivery OTP
Keep the OTP on. It proves the order reached the right person and protects you against "not received" disputes. The customer sees the OTP in **My Orders → order**; riders never can.
:::

## Cash on Delivery

COD is switched on/off and limited by a maximum order amount in **System Settings → Payment Gateways → Cash on Delivery**; individual products can disallow COD (product form → *Cash on Delivery* toggle).
