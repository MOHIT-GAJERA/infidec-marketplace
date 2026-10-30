---
title: Setup Guide (First 10 Steps)
description: The first ten things to configure in the Admin panel after installation, in the right order, before you take real orders.
---

You have a working installation. Work through these ten steps in the Admin panel before you invite sellers or customers. Each step links to its detailed page.

:::steps
### 1. Platform basics
**Settings → Platform settings**: app name, tagline, currency and symbol, contact e-mail and phone, address, minimum order, tax mode and return window. See [Platform Settings](doc:admin/platform-settings).

### 2. Modules
**Settings → Modules**: enable the modules you sell (Grocery, Food, Pharmacy, Shopping), set their order, tagline and theme colour. See [Modules](doc:admin/modules).

### 3. Cities and delivery rules
**Settings → Cities & zones**: add each city you serve with a map centre and radius. Then go to **Delivery → Delivery settings**: fees, free-delivery threshold, quick 15/30-minute radius, scheduled slots, pickup, auto-assign and rider pay. See [Cities](doc:admin/cities-countries) and [Delivery Settings](doc:admin/delivery-settings).

### 4. Payments
**Settings → Payment gateways**: enable Razorpay, Stripe, PayPal and/or COD with the **public** keys, matching the secrets you stored. See [Payment Gateways](doc:admin/payment-gateways).

### 5. Communication
**Settings → Communication**: sender name, reply-to, admin copy of order e-mails, SMS toggles and per-event switches. Check **Content → Email templates**. See [Email](doc:admin/email-smtp) and [SMS](doc:admin/sms-gateway).

### 6. Catalogue structure
**Catalogue → Categories, Brands, Attributes, Custom fields, Taxes**. Delete demo data you do not need. See [Categories, Brands & Attributes](doc:admin/catalog).

### 7. Sellers and their policies
**Sellers → Seller policies**: write the terms sellers accept at registration. Approve the first sellers under **Sellers → Seller requests** and set their commission. See [Sellers](doc:admin/sellers).

### 8. Delivery partners
**Delivery → Partner policies**, then approve riders under **Partner requests**, with cities and salary type. See [Delivery Partners](doc:admin/delivery-partners).

### 9. Storefront content
**Marketing → Home sliders, Offer banners, Featured sections, Popups**, and **Content → Pages & policies** (about, terms, privacy, refund, shipping, cancellation). See [Homepage](doc:admin/homepage) and [Blogs, FAQs & Pages](doc:admin/content-pages).

### 10. Go live
**Settings → Demo & maintenance**: turn **Demo mode off**. Open **System health** and check that every integration you need is green. Place one real order end to end with each payment method. See [Demo, Maintenance & System Health](doc:admin/system).
:::

:::tip Test the whole loop once
Place an order on the website, accept and pack it in the Seller panel, deliver it with the Partner app using the OTP, settle the cash in Admin, and check the seller's net payout. If that works, everything is connected.
:::

**Next:** [Localhost Setup →](doc:installation/localhost-setup)
