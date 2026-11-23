---
title: Apps & Integrations
description: The Booqora app catalogue with all 16 apps, their categories, pricing labels and configuration fields, plus how installing, configuring and uninstalling an app works.
---

**Apps** (`/apps`) is a catalogue of integrations for analytics, marketing, payments, accounting, fulfilment, communication and your website. The list is defined in code in `lib/features/apps/app_catalog.dart`; installed apps and their settings are stored per workspace in `workspaces/<id>/apps/<appId>`.

![Apps](/docs/booqora/images/platform-apps.webp "The Installed and App store tabs with category filters, search and app cards")

## The page

- **Installed** and **App store** tabs. The Installed tab is empty until you install something and offers a button to browse the store.
- **Search apps…** box, **Categories** filter (Accounting, CRM, Fulfillment, Marketing, Payment, Analytics, Communication, Website) and **Sort A-Z**.
- Each card shows the icon, name, category, a short description, the pricing label and an **Install** button. Apps marked **BETA** carry a badge.
- **Request an app** opens a pre-filled email to `support@booqora.app`. Change this address in `apps_page.dart` to your own support address.

## Catalogue

| App | Category | Pricing | Configuration fields |
|---|---|---|---|
| Google Analytics | Analytics | Free | Measurement ID |
| Meta Pixel | Marketing | Free | Pixel ID |
| Mailchimp | Marketing | Free | Audience ID, Server prefix (e.g. us21) |
| WhatsApp Business (beta) | Communication | Free | Phone number ID, Business phone number |
| Razorpay | Payment | Processing fees | Key ID |
| Stripe | Payment | Processing fees | Publishable key |
| PayPal | Payment | Processing fees | Client ID |
| Zapier (beta) | CRM | Free | Webhook URL |
| QuickBooks | Accounting | Free | Company ID |
| Xero | Accounting | Free | Organisation (tenant) ID |
| Tally | Accounting | Free | Tally company name, Sales ledger |
| Shiprocket | Fulfillment | Processing fees | Account email, Pickup location name |
| Google Calendar | CRM | Free | Calendar ID |
| Slack | Communication | Free | Incoming webhook URL, Channel |
| Weglot | Website | Free | Public API key, Languages (comma separated) |
| Tawk.to chat | Website | Free | Property ID, Widget ID |

### What each app is described as

| App | Description in the catalogue |
|---|---|
| Google Analytics | Connect GA4 to report page views, product views, cart activity and completed bookings |
| Meta Pixel | Measure Facebook and Instagram ad results and build audiences from store visitors |
| Mailchimp | Keep your audience in sync with customers who agreed to marketing |
| WhatsApp Business | Order confirmations, pickup and return reminders over WhatsApp |
| Razorpay | UPI, cards, netbanking and wallets in India |
| Stripe | Card payments and security deposits worldwide |
| PayPal | PayPal balance or linked cards at checkout |
| Zapier | Post new orders to a spreadsheet, create CRM contacts and more |
| QuickBooks | Export finalised invoices and payments to QuickBooks Online |
| Xero | Send invoices and payments to Xero |
| Tally | Sales vouchers with GST details for Tally Prime |
| Shiprocket | Create and track shipments for delivery orders |
| Google Calendar | Publish pickups and returns to a calendar |
| Slack | Message a channel for new online orders or overdue orders |
| Weglot | Translate the online store |
| Tawk.to chat | Live chat widget on the online store |

:::warning Catalogue entries store configuration only
Installing an app saves its configuration in the workspace. In the current code no app is connected to an external service: nothing reads the stored IDs to load Google Analytics, the Meta Pixel, a chat widget or Weglot, and nothing posts to Slack, Zapier, Mailchimp or an accounting system. Treat the catalogue as the place to record settings, and build the integration you need on top of `workspaces/<id>/apps/<appId>.config`.

**Online payments do not use this page.** They use the server secrets described in [Payment Gateways](doc:admin/payment-gateways). The Razorpay, Stripe and PayPal entries only store a public key for reference.
:::

## Install, configure, uninstall

:::steps
### Install
Click **Install** on a card. Booqora creates `apps/<appId>` with `status: needs_attention`, an empty `config` and `installedAt`, then opens the app page `/apps/<appId>`.

### Configure
The app page has the tabs **Needs attention** (until configured), **Configure**, **Description** and **Manage**. On **Configure**, fill in every field and click **Save configuration**. When all fields are filled the status becomes `configured`; otherwise you see "Saved — fill in all fields to finish setup".

### Uninstall
On **Manage**, click **Uninstall** and confirm. The app document and its configuration are deleted and you return to `/apps`. You can install it again at any time.
:::

:::danger Never paste secret keys
The configure screen warns: "Never paste secret keys here — they belong on your server." App configuration is readable by every workspace member.
:::

## Adding your own app to the catalogue

Add an `AppDef` entry to `appCatalog` in `app_catalog.dart` with an `id`, `name`, one of the `appCategories`, `short` and `long` text, a `pricing` label, an icon, a brand colour, optional `beta: true` and a list of `configFields` as `(key, label)` pairs. Rebuild and redeploy the Rental Platform.

**Next:** [Plans & Billing →](doc:admin/billing)
