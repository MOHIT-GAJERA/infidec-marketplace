---
title: Point of Sale & Barcode
description: Ring up counter sales with a barcode scanner in the Admin or Seller panel or the Partner app, take cash, card or UPI, and report POS sales separately.
---

Go4Market includes a **Point of Sale** for walk-in customers. It is available to admins (`/pos` in the Admin panel), sellers (`/pos` in the Seller panel) and sellers in the **Partner app** (POS tab).

![POS in the Partner app](/docs/go4market/images/app-partner-seller-pos.webp "Quick sale in the Partner app: search or scan, tap to add, then charge")

## Make a sale

:::steps
### Add products
Search by name, brand or barcode, or **scan** a barcode:
- **Web panels**: a USB or Bluetooth barcode scanner works like a keyboard. Click the search box, scan, and the scanner's *Enter* adds the product.
- **Partner app**: tap the scan icon to use the phone camera (`mobile_scanner`).

### Adjust the cart
Change quantities, pick variants and apply a discount amount.

### Customer (optional)
Enter a name, phone or e-mail for the receipt.

### Charge
Choose **cash**, **card** or **UPI** and confirm. The panel prints a receipt.
:::

## What the server does

The `posCheckout` callable (admin or seller):

- looks products up by `productId` or `barcode`, **ignores client prices and names**, and recomputes everything server-side;
- decrements stock;
- creates an order with `channel: 'pos'`, `userId: 'pos'`, payment method `cash`/`card`/`upi`, the cashier's ID and the discount, already **`delivered`**;
- updates stats (`byChannel.pos`, `revenueByChannel.pos`).

Sellers can only sell their own products. POS orders appear under **Orders → POS orders**.

## Barcodes

Each product and variant has a `barcode` field (EAN-13 recommended). The seed generates valid EAN-13 codes starting with `890`. Print labels from your own label software using these values.

## POS reports

**Reports → POS report** (Admin and Seller) shows POS revenue, orders, payment-method split and top products for a date range. It uses `salesReport` with `channel: 'pos'`.

**Next:** [Live Rider Map →](doc:admin/live-map)
