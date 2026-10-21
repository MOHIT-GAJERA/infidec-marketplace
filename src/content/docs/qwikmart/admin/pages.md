---
title: Pages, Blog & FAQs
description: Edit the About, Privacy, Terms, Refund and Delete Account pages, and manage the blog and FAQs shown in the apps and on the website.
---

## CMS pages

**Admin → Pages** lists the static pages used by the apps and the website. Click **Edit**, write the content in the rich-text editor (per language) and save — it is live immediately.

![Pages](/docs/qwikmart/images/admin-pages.jpg "Admin → Pages")

| Page | Website URL | Required by Google Play? |
|---|---|---|
| About Us | `/pages/about` | No |
| Privacy Policy | `/pages/privacy` | **Yes** — Privacy policy URL |
| Terms & Conditions | `/pages/terms` | Recommended |
| Return & Refund Policy | `/pages/refund` | Recommended |
| Delete Account | `/pages/delete-account` | **Yes** — Data safety "delete account URL" |

The Customer App shows the same pages under **Profile → About / Privacy / Terms**.

:::warning Write your own legal text
Use your **real company name, address and GST number**, describe the data your business collects (see the Data safety answers in [Release & Play Store](doc:app-customer/deployment)) and name a grievance officer as required by Indian e-commerce rules. Have a lawyer review it — sample text is only a starting point.
:::

### Delete Account page

Google Play requires a public web page explaining how users delete their account. QwikMart supports deletion in the apps (**Profile → Delete account**); your page should explain:

- how to delete in the customer app and in the delivery app,
- how to request deletion by e-mail without the app,
- what is deleted (profile, addresses, cart, login) and what is kept (order and payment records for tax law) and for how long.

## Blog

**Blog → Posts / Categories**: articles with a cover image, category, rich text and SEO fields. They appear in the app (**Profile → Blog**) and on the website (`/blog`).

## FAQs

**FAQs**: question/answer pairs (per language) with sort order. Shown on the website (`/faq`) and in the app.

## Footer and contact details

The website footer and the Contact Us popup use **System Settings → General**: support e-mail, phone, WhatsApp, company name and address, social links. Messages sent through the Contact Us form arrive in **Contact Messages** — see [Chat & Contact Messages](doc:admin/chat-contact).

**Next:** [General Settings →](doc:admin/general-settings)
