---
title: Gift Cards & Coupons
description: Gift cards and coupons bought on the website or app. Look up a code, mark it redeemed (with a customer email), expire or cancel it, edit it and export to CSV.
---

**Admin → Gift Cards** (topbar **Gift Card & Coupon Management**, *"Purchases, codes, and coupon status."*) lists every gift card and coupon your guests have bought. Guests buy them on the website's gift-card page or in the Customer App. You **can't create** one in the admin panel.

![Gift cards](/docs/go4foodie/images/admin-gift-cards.jpg "Admin → Gift Cards")

**Permission:** `manage:coupons` (**OWNER** and **MANAGER**).

## How a purchase arrives

| | Gift card | Coupon |
|---|---|---|
| Code | `GIFT-7K3QMA` | `COUPON-X9P2RT` |
| Expiry | None | 1 year after purchase |
| Status after purchase | **Active**, payment **Paid** | **Active**, payment **Paid** |

When a payment gateway is configured, the purchase is only saved after the payment is verified (Razorpay, Stripe or PayPal). If the buyer gave an email, they receive the **gift card / coupon purchased** email with the code, and a customer profile is created or updated in [Customers](doc:admin/customers). See [Payment gateways](doc:admin/payment-gateways) and [Emails](doc:admin/emails).

:::note Redemption is manual
Codes are **not** applied automatically at website or POS checkout. When a guest presents a code, look it up here, take it off the bill (for example as a **Discount** in the [POS](doc:admin/pos)) and mark it **Redeemed**.
:::

## Stats

| Tile | Value |
|---|---|
| **Total Purchases** | All gift cards and coupons |
| **Total Value** | Sum of amounts with payment **Paid** |
| **Active** | Status *Active* |
| **Redeemed** | Status *Redeemed* |

## Filters

- Status pills: **All, Pending Payment, Paid, Active, Redeemed, Expired, Cancelled**
- Type: **All types / Gift Cards / Coupons**
- **Search code, name, email…**
- **Export** (download icon)

## List

| Column | Shows |
|---|---|
| **Code** | Monospace code |
| **Customer** | Name + email (or —) |
| **Type** | Gift Card / Coupon |
| **Amount** | Value |
| **Payment** | Pending / Paid / Failed |
| **Status** | Badge |
| **Created** | `Oct 22, 2026` |
| **Actions** | View, Edit, Delete |

Redeemed, expired and cancelled rows are shown at 50 % opacity. If nothing matches you see *"No purchases match your filters."*

## Statuses

| Status | Label | Colour |
|---|---|---|
| `PENDING_PAYMENT` | Pending Payment | Amber |
| `PAID` | Paid | Blue |
| `ACTIVE` | Active | Green |
| `REDEEMED` | Redeemed | Orange |
| `EXPIRED` | Expired | Grey |
| `CANCELLED` | Cancelled | Red |

## Redeem a gift card

:::steps
### Find the code
Type the code (or the guest's name or email) in the search box.

### Check it
Click the eye. The modal shows the code and amount in a gold **CODE** panel, plus **Customer**, **Email**, **Payment**, **Expiry** (*"No expiry"* for gift cards), **Created**, the gateway payment ID (*Stripe / PayPal / Razorpay Payment*) and the buyer's **Message**. Check the status is **Active** and the expiry date hasn't passed.

### Mark it redeemed
Under **Update status**, click **Mark Redeemed**. If the card has an email, the buyer receives the **gift card redeemed** email. The status changes even if the email fails.
:::

The other quick actions (each hidden when it's the current status) are **Activate**, **Expire** and **Cancel** (red). If the server refuses a change, the status goes back and an error toast appears.

:::warning Expiry isn't enforced automatically
A coupon's status doesn't change by itself when its expiry date passes. Check the **Expiry** before redeeming, and use **Expire** to retire old codes.
:::

## Edit or delete

**Edit** opens **Edit GIFT-…**:

| Field | Rule |
|---|---|
| **Customer name** | At least 2 characters: *"Name is required"* |
| **Customer email** | Optional; if filled, valid: *"Invalid email"* |
| **Type** | Gift Card / Coupon |
| **Amount ($)** | Greater than 0: *"Amount must be positive"* |
| **Status** | Any of the six statuses |
| **Payment** | Pending / Paid / Failed |
| **Expiry date** | Optional date |

Saving from **Edit** doesn't send any email. Only **Mark Redeemed** does.

**Delete** asks *"Delete GIFT-…?"* and removes the code permanently.

## Export to CSV

**Export** downloads the **currently filtered** rows as `gift-cards-2026-10-22.csv`:

```text title="gift-cards-YYYY-MM-DD.csv"
"Code","Type","Customer","Email","Amount","Payment","Status","Expiry","Created"
"GIFT-7K3QMA","Gift Card","Jane Doe","jane@example.com","50.00","Paid","Active","","2026-10-22"
```

Amounts have 2 decimals and dates are `YYYY-MM-DD`. Every cell is quoted, so the file opens cleanly in Excel or Google Sheets.

**Next:** [Inventory →](doc:admin/inventory)
