---
title: Reports & Analytics
description: Sales, product, category, seller, commission and POS reports for any date range, filtered by channel and module.
---

**Admin → Reports** offers six reports. Each takes a date range and, where useful, a channel (`web`, `app`, `pos`) and a module. Sellers get the sales, product and POS reports for their own items.

| Report | Route | Shows |
|---|---|---|
| **Sales** | `/reports/sales` | Totals, revenue and orders per day, by status, by channel, by payment method, by module |
| **Product sales** | `/reports/products` | Top products and **slow movers** (best and worst sellers) with quantity and revenue |
| **Category** | `/reports/categories` | Revenue by root category |
| **Seller** | `/reports/sellers` | Revenue and orders per seller |
| **Commission** | `/reports/commission` | Gross, commission and net per seller |
| **POS** | `/reports/pos` | Counter sales only (`channel: pos`) |

Lists can be exported to CSV like every other table in the panel.

## Where the numbers come from

Reports use the `salesReport` callable, which reads the orders in the range on the server and returns `totals`, `byDay`, `byStatus`, `byChannel`, `byPaymentMethod`, `byModule`, `topProducts` and `slowProducts`. Admins can filter by seller; sellers automatically see only their own items. The dashboard uses the pre-aggregated `stats/daily_*` documents instead, so it loads instantly.

:::note Which orders count
Unpaid (`pending`) orders are excluded. Cancelled and returned orders appear in the counts and in *by status*, but add no revenue.
:::

## Tips

- Compare **Product sales → slow movers** with **Stock management** to decide what to discount or stop stocking.
- Use the **Commission** report together with **Finance → Seller payouts** for monthly seller statements.

**Next:** [Seller Panel Overview →](doc:seller/overview)
