---
title: Setup Guide (First 10 Steps)
description: The first ten things to do in a new Booqora workspace, from company details and taxes to the first order and the Online Store.
---

Your installation is live and you have a workspace. These ten steps turn the empty workspace into a business that can take bookings. Most take a couple of minutes each.

The platform has its own checklist too: the **Setup progress** card in the sidebar opens `/setup`, which tracks eight of these steps (product, customer, order, taxes, store, payments, team and logo) and ticks them off automatically as you complete them. You can also click **Mark as done** on any step.

![Setup guide in the platform](/docs/booqora/images/platform-setup-guide.webp "The in-app checklist at /setup")

:::steps
### 1. Company details and logo
**Settings → General.** Upload your logo, then check the company name, the e-mail shown on documents, phone, website, address, time zone, first day of the week and date format. The logo and address appear on quotes, contracts, invoices, e-mails and the Online Store. See [General & Rental Settings](doc:admin/settings).

### 2. Pricing, deposits and rental period
**Settings → Pricing** sets the currency, reusable pricing structures (tiered prices with a minimum) and the default security deposit. **Settings → Rental period** sets the default pickup and return times and the time interval for date pickers. See [Pricing Structures](doc:admin/pricing).

### 3. Taxes
**Settings → Taxes.** Add tax profiles (for example *GST 18 %*) and choose whether your prices include tax. Assign profiles to products and, if needed, to customers. See [Taxes, Locations & Custom Fields](doc:admin/taxes-locations).

### 4. Locations
**Settings → Locations.** Rename *Main location* to your shop's name and address, choose whether it offers pickup and/or delivery, and add more locations if you have them.

### 5. Payment providers
**Settings → Payment providers** shows Razorpay, Stripe and PayPal with their status (configured, test or live mode, currency). Switch on the ones you set up in [Secrets & Environment](doc:installation/environment-configuration). Manual payments (cash, card, bank, UPI) always work. See [Payment Gateways](doc:admin/payment-gateways).

### 6. E-mails
**Settings → Emails.** Set the *From name*, *Reply-to email*, header and footer text, and an optional address that receives a copy of every e-mail. Review the seven templates. Then send yourself a test by e-mailing a document. See [Email (SMTP) & Templates](doc:admin/email-smtp).

### 7. Your first products
**Inventory → New product.** Add photos, the price per hour, day, week or month (or a pricing structure), the deposit and the quantity you own. Choose **trackable** if each unit has its own identifier or barcode, or **bulk** for interchangeable items. Tick *show in store* for products customers may book online. See [Products](doc:admin/products).

### 8. A customer and a test order
**Customers → New customer**, then **New order**: choose dates, add products and watch the price, deposit and availability update. **Reserve** it, then try **Pick up** and **Return** so you know the flow. See [Orders & Order Flow](doc:admin/orders).

### 9. The Online Store
**Online store.** Set the brand colour, which collections and products appear, pickup or delivery, the checkout payment mode (none, full amount, down payment or deposit only), terms and conditions, and SEO title and description. Open your store link and place a test booking. See [Online Store Overview](doc:store/overview).

### 10. Your team
**Settings → Team → Invite team member.** Add staff as **Admin** or **Member**. They sign up with the invited e-mail and accept the invitation. See [Team, Roles & Security](doc:admin/team-security).
:::

## Before you announce the store

- [ ] Payment providers switched to **live** keys (Razorpay `rzp_live_…`, Stripe `sk_live_…`, `PAYPAL_ENV=live`) and functions redeployed
- [ ] A real test payment made and refunded from the provider's dashboard
- [ ] SMTP e-mails arriving in the inbox, not spam (set up SPF/DKIM for your sending domain)
- [ ] `web/privacy.html` edited with your company's details and redeployed
- [ ] Custom domain connected, see [Custom Domains & SSL](doc:installation/domains)
- [ ] Backups planned, see [Backups & Monitoring](doc:installation/backups)

:::tip Ask Bora
Stuck on a setting? Click **Ask Bora** and type what you want to do, for example "set up taxes" or "connect payments". Bora replies with a short explanation and a button to the right page. See [Bora Assistant](doc:admin/assistant).
:::

**Next:** [Localhost Setup →](doc:installation/localhost-setup)
