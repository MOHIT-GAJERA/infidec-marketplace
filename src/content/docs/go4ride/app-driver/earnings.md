---
title: Earnings, Wallet & Payouts
description: How the driver wallet works in Go4Ride (cash commission, online earnings, cancellation fees, subscriptions), the Earnings screen and withdrawal requests approved by your team.
---

## One wallet per driver

Every driver has a `walletBalance` and lifetime `earnings` on `drivers/{uid}`. Only Cloud Functions and admins can change them. The security rules block the driver app from writing money fields.

| Event | Wallet | Lifetime earnings | Ledger row (`transactions`) |
|---|---|---|---|
| **Cash** ride completed | − commission | + driver earning | *Trip payment* (+earning), *Platform commission* |
| **Wallet / Card** ride completed | + driver earning | + driver earning | *Trip payment*, *Platform commission* |
| Rider cancels late | + cancellation fee | + fee | *Cancellation fee* |
| Paid subscription bought | − plan price | | *Subscription* |
| Withdrawal approved | − amount | | *Payout* |

Example (10 % commission, ₹215 fare): a cash ride moves the wallet **−₹21.50**. A wallet or card ride moves it **+₹193.50**. Earnings grow by ₹193.50 in both cases.

Commission comes from **Admin → Settings → Business model → Admin commission** (percentage or fixed amount, on or off; default 15 %). An active **paid** subscription with rides left waives it entirely ([Commission, Wallet & Settlement](doc:admin/commission-wallet)).

:::tip Cash-heavy markets
With mostly cash rides the wallet goes negative over time (the driver owes you commission). Set **Minimum driver wallet to accept rides** in Driver & ride settings. Below it the driver cannot go online and is not offered new rides until the balance is settled.
:::

## Earnings screen

Home → wallet icon, or Account → **Earnings & wallet**:

| Block | Content |
|---|---|
| Header card | **Wallet balance**, **Lifetime earnings**, **Rating** (— until the driver has ratings) |
| **Request withdrawal** | Opens the withdrawal sheet |
| **Payout requests** | Every request with amount, date and status (requested, approved, rejected) |

## Withdrawals

:::steps
### Request
**Request withdrawal** → *Available: ₹1,250.00 · min ₹100* → enter an amount → **Submit request**. The amount must be at least **Minimum driver withdrawal** (Admin → Settings → App settings → Wallet, default ₹100) and not more than the balance (*Amount exceeds your balance.*). A `withdrawals` document is created with status `requested`. The wallet is not touched yet.

### Admin decision
Your team opens **Payout requests** ([Payout Requests](doc:admin/payouts)) and approves or rejects. `approveWithdrawal` re-checks the balance, debits the wallet, marks the request `approved` and writes a *Payout* transaction in one transaction. Rejecting leaves the wallet unchanged.

### Pay out
Transfer the money to the driver yourself (bank transfer, UPI…). The app does not collect bank details and does not send money. Agree on how drivers share their payout details, for example through a support ticket or your onboarding process.
:::

## Adding money to the wallet

The Driver App has no top-up screen, and the Admin Panel shows the driver wallet ([Drivers & KYC](doc:admin/drivers)) but has no button to adjust it. The balance only grows from wallet / card rides and cancellation fees. When a driver pays you to clear a negative balance or to buy a paid plan, you can:

- edit `walletBalance` on `drivers/{uid}` in the Firebase console (Firestore) as an admin, and add a matching row in `transactions` for your records, or
- extend the Driver App with the rider top-up flow: `createPayment` with `purpose: topup` ([Wallet & Payments](doc:app-customer/payments)). Today that function credits `users/{uid}`, so it needs a driver variant.

The **Low wallet balance** sheet (when going online is blocked) has an **Open wallet** button that opens this Earnings screen.

## Ratings

The header shows `rating` from the driver profile. The current rider app has no rating screen, so new drivers show **—** until ratings are added by another channel.

**Next:** [Subscription Plans →](doc:app-driver/subscriptions)
