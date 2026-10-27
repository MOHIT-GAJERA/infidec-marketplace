---
title: Demo Instructions
description: Explore ClassiAds-Hub on the hosted demo before you install it. The demo covers the website, the Admin Panel and the Android app.
---

Use the demo to judge whether ClassiAds-Hub fits your business, or to check how a feature should behave. It is a complete installation on Firebase with sample data: categories with custom fields, locations, demo ads with photos, sellers, chats, packages, featured-ad plans, blog posts and CMS pages.

## Demo access

| Part | Address | How to sign in |
|---|---|---|
| **Website** | [classiadshub.web.app](https://classiadshub.web.app) | Browse without an account. Register your own test account, or ask for a demo buyer / seller login |
| **Admin Panel** | [classiadshub-admin.web.app](https://classiadshub-admin.web.app) | Demo admin login shared on request through the [Infidec contact page](/contact-us?product=classiadshub) |
| **Mobile App** (Android) | Demo build on request | The same accounts as the website |

![Website home](/docs/classiadshub/images/web-home.jpg "The demo website: slider, categories and feature sections")
![Admin login](/docs/classiadshub/images/admin-login.jpg "Sign in to the demo Admin Panel with the login we send you")

:::warning The demo is shared
Other visitors use the same demo at the same time, and the data may be reset at any time. Don't post real personal data, and **never enter real card or bank details**. Payment gateways on the demo run with **test keys**: no real money moves.
:::

## Suggested tour

If you have fifteen minutes:

1. **Website home**: the slider, the category grid and the feature sections are all managed in the Admin Panel under **Content Management**.
2. **Search and filters**: open a category such as Cars, filter by price, location and the category's own fields, then switch the sort order.
3. **Ad details**: photos, the custom-field values (*Specifications*), the seller card, related ads, and the actions to start a chat, make an offer, save the ad to favourites or **Report this ad**.
4. **Post an ad** (signed in): pick a category and watch the form change to that category's custom fields. With moderation on, the ad waits for approval.
5. In the Admin Panel, open [Ads Listing → All Ads](doc:admin/ads), find the ad on the *Requested* tab and approve it. The seller gets an *Ad approved* notification.
6. [Package Management](doc:admin/packages): the subscription packages and featured-ad plans that the website sells on **Plans & checkout**.
7. [Seller Management → Seller Verification](doc:admin/seller-verification): review a KYC request and grant the verified badge.
8. **Settings**: open **General**, **Payment Gateways** and **System Status**.

### Try a test payment

1. On the website, open the dashboard and buy a subscription package or feature one of your ads.
2. Pick **Card (Stripe)** and pay with the Stripe test card `4242 4242 4242 4242`, any future expiry date and any CVC.
3. You come back to `/checkout/result`. The server asks Stripe for the payment status and activates the package or the featured flag.
4. In the Admin Panel, the payment appears in **Package Management → Payment Transactions** as *completed*, with an invoice number.

Gateways on the demo may change. If Stripe isn't offered, use the gateway that is listed with its own test details.

## What the demo will and will not do

:::note Your own installation has no such limits
On the demo you see sample data and test-mode gateways. On your own project you add your own catalogue, gateway keys and branding, and every feature works with live keys.
:::

- Payments use **test** keys only.
- OTP codes are shown on screen (the OTP provider is in *Test mode*). See [Login, OTP & Notification Settings](doc:admin/otp-notifications).
- Push notifications reach only devices with the demo app installed.

## Questions

- [Infidec contact page](/contact-us?product=classiadshub)
- [Support](doc:support) · [FAQs](doc:faqs)

**Next:** [Third-Party Service Costs →](doc:admin/third-party-costs)
