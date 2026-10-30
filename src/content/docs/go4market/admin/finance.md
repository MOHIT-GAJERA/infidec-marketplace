---
title: "Finance: Withdrawals & Transfers"
description: Wallet transactions, withdrawal requests from sellers and riders, fund transfers and payouts, and online payment transactions.
---

The **Finance** menu brings together every money movement that is not an order total. All balances are changed **only by Cloud Functions**; clients can read but never write them.

| Page | Route | What it shows |
|---|---|---|
| Wallet transactions | `/finance/wallet` | Every customer wallet credit and debit, with reason: `topup`, `order`, `refund`, `referral`, `cashback`, `admin`, `membership` |
| Withdrawal requests | `/finance/withdrawals` | Payout requests from sellers and riders |
| Fund transfers | `/finance/transfers` | Payouts and credits you have sent |
| Seller payouts | `/finance/payouts` | Balance owed to each seller, with commission |
| Payment transactions | `/finance/transactions` | Online payments through Razorpay, Stripe and PayPal |

## Withdrawal requests

Sellers and riders request a payout from their panel or the Partner app: amount (minimum **₹100**), method (`bank`, `upi` or `cash`) and details. `requestWithdrawal` **holds the amount immediately**: it is deducted from their balance so it cannot be requested twice.

Process requests at **Finance → Withdrawal requests**:

| Action | Effect |
|---|---|
| **Approve** | Accepted; pay it outside the platform |
| **Mark paid** | Paid, with an optional transaction reference. Allowed directly from `pending` |
| **Reject** | The held amount is returned to the balance |

Each step calls `processWithdrawal`, notifies the requester by push, sends the `withdrawal` e-mail and, if enabled, an SMS.

## Fund transfers

**Finance → Fund transfers → New transfer** (`transferFunds`):

| Type | Use it for | Effect |
|---|---|---|
| `payout` (default) | Paying out earnings | Debits the seller's or rider's earnings balance, never below zero. Any excess (for example a monthly salary larger than the balance) is recorded as `direct` |
| `credit` | Bonus, incentive, correction | Adds to the balance |

Choose the person, the role (seller or delivery) when needed, the amount and a note. Every transfer is recorded in `fundTransfers` and the recipient is notified.

## Seller payouts

**Finance → Seller payouts** lists each seller's current balance (net of commission), total sales and commission. Use **Pay out** to record a transfer after paying the seller from your bank.

:::tip Reconcile weekly
Once a week, compare **Payment transactions** with your gateway dashboards, then pay out sellers from **Seller payouts**. Pending withdrawals are already deducted from balances, so they cannot be paid twice.
:::

**Next:** [Coupons & Abandoned Carts →](doc:admin/coupons)
