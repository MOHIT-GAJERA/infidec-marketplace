---
title: Earnings & Withdrawals
description: How delivery partners are paid, where they see earnings, cash in hand and salary credits, and how they request withdrawals.
---

## How riders earn

| Salary type | Paid |
|---|---|
| **Per order** | On every delivered order: base amount + per-km bonus × distance + bonus % of the delivery fee |
| **Monthly** | A fixed amount credited on the 1st of each month (09:00 IST) |

The admin (or the owning seller) sets the type and amount; defaults come from **Delivery settings → riderPay**. See [Cash Collection & Salary](doc:admin/cash-salary#rider-pay).

## Earnings screen

**Earnings** in the Partner app, or `/finance/earnings` on the web:

![Rider earnings](/docs/go4market/images/app-partner-delivery-earnings.webp "Earnings: balance, today / 7 days / all time, a 7-day chart and the pay structure")

- **Balance** available to withdraw
- Earnings **today**, in the **last 7 days** and **all time**, with a chart
- **Pay structure** (for example *₹35 per delivered order*)
- **Cash** button: cash in hand and settlements (`/finance/cash` on the web)

## Cash in hand

COD cash you collect is tracked separately from your earnings. It is reduced when the admin or your store records a settlement, and you get a notification for each one. Cash in hand is **not** part of your withdrawable balance.

## Withdrawals

**Withdrawals** → **Request withdrawal**: amount (minimum ₹100), method (**bank**, **UPI** or **cash**) and details. The amount is held from your balance immediately. The admin approves, pays or rejects it; a rejection returns the amount. You get a push notification, an e-mail and, if enabled, an SMS.

**Next:** [Customer App Prerequisites →](doc:app-customer/prerequisites)
