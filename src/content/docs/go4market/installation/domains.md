---
title: Custom Domains & SSL
description: Put the website and the three panels on your own domain with free SSL from Firebase Hosting, and update the URLs the platform uses.
---

The default `*.web.app` addresses work out of the box. For a real business, connect your own domain. Firebase Hosting issues and renews the SSL certificates for free.

## Suggested layout

| Site | Hosting target | Example domain |
|---|---|---|
| Website | `website` | `yourmarket.com` and `www.yourmarket.com` |
| Admin panel | `admin` | `admin.yourmarket.com` |
| Seller panel | `seller` | `seller.yourmarket.com` |
| Delivery panel | `delivery` | `delivery.yourmarket.com` |

## 1. Connect each domain

:::steps
### Open the site in Hosting
Firebase console → **Hosting**. Each of the four sites is listed; click the one to connect.

### Add custom domain
Click **Add custom domain** and enter the domain (for example `admin.yourmarket.com`). For the website, also add `www` and redirect it to the apex domain.

### Add the DNS records
Firebase shows **A** records (apex) or a **CNAME**/TXT record (sub-domains). Add them at your DNS provider and remove any old A/AAAA records for the same name.

### Wait for SSL
Verification and certificate issuance usually take minutes, sometimes up to 24 hours. The status changes to **Connected**.
:::

## 2. Allow the domains in Authentication

Firebase console → **Authentication → Settings → Authorized domains** → add every custom domain. Without this, Google sign-in and phone OTP fail on that domain with `auth/unauthorized-domain`.

## 3. Update the URLs in the platform

| Where | Change |
|---|---|
| `functions/.env` | `WEBSITE_URL`, `ADMIN_URL`, `SELLER_URL`, `DELIVERY_URL`. Then redeploy the functions; Stripe and PayPal return to `WEBSITE_URL/payment/return`, and push and e-mail links use these |
| `functions/src/seo/index.ts` | `SITE` for the sitemap |
| Website sources | `kSiteUrl` in `apps/website/lib/core/web_bridge.dart`, `kSellerUrl`/`kDeliveryUrl` in `apps/website/lib/ui/shell.dart`, `web/index.html`, `web/robots.txt`. Rebuild and redeploy |
| Panel sources | `_registerUrl` in `apps/panel/lib/features/seller/seller_pages.dart`. Rebuild the seller panel |
| Admin → Settings → SEO | Default title, description and OG image for the new domain |
| Payment dashboards | Allowed domains / redirect URLs for Stripe and PayPal if you restricted them |

The complete list of hard-coded URLs is in [Connect the Code](doc:installation/connect-your-project#5-site-urls).

:::tip Restrict the browser API key
Once the domains work, go to Google Cloud → APIs & Services → Credentials → the **Browser key**, and add HTTP referrer restrictions for your domains and `*.web.app`.
:::

**Next:** [Setup Guide (First 10 Steps) →](doc:installation/setup-guide)
