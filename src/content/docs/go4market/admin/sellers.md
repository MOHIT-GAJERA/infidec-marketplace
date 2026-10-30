---
title: Sellers
description: Approve seller requests, add sellers yourself, set commission and modules, suspend stores, manage seller wallets and the seller policy.
---

Go4Market is multi-vendor: every product belongs to a seller (`sellers/{uid}`), and every order lists its sellers in `sellerIds[]`. Each seller gets the **Seller panel** and the **Seller** role of the Partner app.

![All sellers](/docs/go4market/images/admin-sellers.webp "Sellers: store, owner, commission, products, balance, sales and rating")

## Seller requests

New sellers register themselves (Seller panel `/register`, the Partner app, or *Sell on Go4Market* on the website). `registerSeller` creates `sellers/{uid}` with status **pending**, gives the user the `seller` claim and notifies admins. See [Seller Registration](doc:seller/registration).

**Admin → Sellers → Seller requests** (`/sellers/requests`):

1. Open the request and check the store name, owner, phone, city, address, modules, GSTIN and bank details.
2. Set the **commission %** for this seller.
3. **Approve**, **Reject** (with a note), or leave pending. This calls `reviewSeller`. The seller is notified and can start adding products.

## Add a seller yourself

**Sellers → All sellers → Add seller**: owner name, e-mail, mobile, password, store name, city, commission, modules, address, GSTIN, logo and **Auto-approve products**. The account is created ready to use.

## Manage a seller

Open `/sellers/:id` to edit the store profile, location (latitude and longitude for distance and ETA), logo and banner, bank details, modules and commission. You can also see their products, orders, balance and ratings.

| Status | Effect |
|---|---|
| `approved` | Store and products visible; can sell |
| `pending` | Registered, waiting for review |
| `rejected` | Not allowed to sell |
| `suspended` | Store and products hidden from customers; panel access limited |

## Commission and settlement

When an order is delivered, each seller's share is settled automatically:

```text
gross      = seller's item total
commission = gross × commissionPct / 100
net        = gross − commission − seller-funded coupon discount
```

The net is added to `sellers/{uid}.balance` and recorded in `orders.settlement.sellers`. Sellers withdraw it through [withdrawal requests](doc:admin/finance#withdrawal-requests).

## Seller wallet and payouts

- **Sellers → Seller wallet** (`/sellers/wallet`): every credit and debit on seller balances.
- **Finance → Seller payouts** (`/finance/payouts`): balances owed per seller, with commission totals, and a **Pay out** action (`transferFunds`).

## Seller policies

**Sellers → Seller policies** edits `pages/seller-policy`. Sellers must accept it at registration (`policiesAccepted: true`) and can re-read it in their store settings.

:::tip Product approval per seller
Turn on **Auto-approve products** for trusted sellers so their new products go live without review. For everyone else, review them under **Catalogue → Product approvals**.
:::

**Next:** [Delivery Partners →](doc:admin/delivery-partners)
