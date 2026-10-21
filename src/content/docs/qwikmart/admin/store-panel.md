---
title: Store Panel
description: A dedicated panel for store owners and their staff, scoped to their own store.
---

Every store gets its own panel at **`/store/login`**. The store owner signs in with the account created in **Stores → Add Store** (or **Store Users**).

![Store panel](/docs/qwikmart/images/store-dashboard.jpg "Store panel dashboard")

## What a store owner can do

| Area | Access |
|---|---|
| Dashboard & reports | Own store only |
| Orders | View and process own orders, mark ready, self-pickup |
| Products | Add products (may need admin **approval**), manage own stock and prices |
| Promo codes | Codes valid in their store |
| Home Builder | Draft layouts for their zone (admin publishes) |
| Notifications | Send to their own customers |
| Chat | Conversations about their orders |
| Store users & roles | Add staff with limited permissions |

Data from other stores, platform settings, payment keys, customers' full list and payouts are never visible in the Store panel — Firestore security rules enforce this on the server, not only in the menu.

## Product approval

When a store adds a product it can be set to **Pending Approval**. Admins review it in **Products → Pending Approvals** (permission `product.approve`).
