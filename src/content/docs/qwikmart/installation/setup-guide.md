---
title: Setup Guide (First 10 Steps)
description: The ten things to configure in the Admin Panel, in order, so the apps and website have something to show and can take orders.
---

A new installation is empty: no country, no delivery area, no store, no products. Work through these ten steps in order — each one depends on the one before.

:::steps
### General settings
**System Settings → General**: app name, tagline, support e-mail/phone, company name and address, logo, favicon, default currency, timezone, social links. Keep **Demo Mode** off. → [General Settings](doc:admin/general-settings)

### Country & currency
**Countries → Add**: name, ISO code, dial code (e.g. `+91`), currency code (`INR`), symbol (`₹`), timezone. Mark it as default. → [Countries & Currency](doc:admin/countries)

### Delivery zone
**Zones → Add Zone**: draw the delivery area on the map, set delivery time, delivery charges (fixed or per km, free above an amount) and optional surge hours. → [Delivery Zones](doc:admin/zones)

### Store
**Stores → Add Store**: name, address and map pin inside the zone, opening hours, commission, and a store owner login. Set it as the zone's **default store**. → [Stores](doc:admin/stores)

### Taxes, categories & brands
**Taxes** (e.g. GST 5 % / 12 % / 18 %), then **Categories** (with images and the Quick / eCommerce flags) and **Brands**. → [Catalogue & Products](doc:admin/catalog)

### Products
**Products → Add Product** (or **Bulk Upload** a CSV): images, variants (size/weight), price, MRP, stock per store, tax, return window. → [Catalogue & Products](doc:admin/catalog)

### Home screen
**Home Builder**: build the Quick and eCommerce home layouts for the zone (banners, category rows, product sliders, brands) and click **Publish**. → [Home Builder](doc:admin/home-builder)

### Payments
**System Settings → Payment Gateways**: keep **Cash on Delivery** and **Wallet** on; add Razorpay (or another gateway) keys and enable it. → [Payment Gateways](doc:admin/payment-gateways)

### E-mail, SMS and push
**System Settings → SMTP** (order and contact e-mails), **SMS Gateway** (optional), **Firebase** (push). → [SMTP](doc:admin/smtp-settings) · [SMS](doc:admin/sms-settings) · [Push](doc:admin/push-notifications)

### Content pages
**Pages**: About Us, Privacy Policy, Terms & Conditions, Refund Policy and Delete Account. **FAQs** and **Blog** are optional. These URLs are required by Google Play. → [Pages, Blog & FAQs](doc:admin/pages)
:::

## Test an order end-to-end

When the ten steps are done:

1. Open the website (or the customer app), choose your zone, add a product and **place a Cash on Delivery order**.
2. In **Orders**, open it, mark it *Processed* and **assign a delivery boy** (register one in the Delivery Boy app and approve it first — see [Delivery Boys](doc:admin/delivery-boys)).
3. In the Delivery Boy app: accept → picked up → out for delivery → enter the **delivery OTP** shown to the customer → delivered.
4. Check that the order is *Delivered*, the rider's earning and cash-in-hand are recorded and the dashboard updated.

:::tip
Then repeat with an **online payment** in test mode (Razorpay test UPI `success@razorpay`) and with a **cancellation** to see the wallet refund.
:::

**Next:** [Localhost Setup →](doc:installation/localhost-setup)
