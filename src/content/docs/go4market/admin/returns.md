---
title: Returns & Refunds
description: How customers request returns, how admins and sellers approve, pick up and refund them to the wallet or the original payment, and what happens to stock and seller balances.
---

## How a return starts

After delivery, the customer opens the order on the website or in the app and taps **Request return**. They choose the items and quantities (default: the whole order), a reason and optional photos. This calls `requestReturn`, which creates a document in `returns` with status `requested` and notifies the sellers involved.

Returns are allowed within `settings/platform.returnWindowDays` (default **7 days**) of delivery.

## Process returns

**Admin → Orders → Return requests** (`/returns`). Sellers have the same page for returns on their items.

| Status | Meaning |
|---|---|
| `requested` | Waiting for review |
| `approved` | Accepted; arrange pickup |
| `rejected` | Declined, with a note to the customer |
| `picked` | The item has been collected |
| `refunded` | Money returned; stock restored and seller balance debited |

Moving a return calls `processReturn`:

| Option | Rules |
|---|---|
| **Refund amount** | Admins may set any amount up to the order total; sellers may only **lower** the suggested amount |
| **Refund to** | `wallet` (instant, default) or `source` |

:::note Refund to source
`source` refunds the original **Razorpay, Stripe or PayPal** payment through the gateway (idempotent per return). The part paid from the wallet, and any COD or wallet-only order, always goes back to the **wallet**. The return records `walletRefund` and `sourceRefund {provider, id, status, amount}`.
:::

On refund, the returned quantities are restocked, the order's `returnedQty` and `refundAmount` are updated, and the seller's balance is debited for the refunded items. The customer gets push and inbox notifications at every step.

**Next:** [Sellers →](doc:admin/sellers)
