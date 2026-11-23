---
title: Custom Domains & SSL
description: Put the Booqora Rental Platform, Online Store and Marketing Website on your own domain with free SSL from Firebase Hosting, and update the places that store the address.
---

The free `*.web.app` addresses work, but customers trust a booking link on your own domain more. A common layout is:

| Address | Serves | Hosting target |
|---|---|---|
| `www.yourrentals.com` (and the bare `yourrentals.com`) | Marketing Website | `website` |
| `app.yourrentals.com` | Rental Platform, Online Store (`/s/<slug>`), payment return page | `platform` |

You can of course point the bare domain at the platform instead if you do not use the Marketing Website.

## 1. Connect the domain in Firebase

:::steps
### Open the right site
**Build → Hosting**, find the site (for example `<your-project-id>-platform`) and click **Add custom domain**.

### Enter the domain
For example `app.yourrentals.com`. Leave *Redirect* off unless this domain should forward to another one.

### Add the DNS records
Firebase shows the records to create at your registrar or DNS host: usually a **TXT** record to verify ownership and **A** records (or a CNAME for subdomains on some setups). Copy them exactly.

### Wait for SSL
Firebase verifies the records and issues a free **SSL certificate** automatically. This can take from a few minutes to 24 hours. The status changes from *Pending* to *Connected*.
:::

Repeat for the Marketing Website's site with `www.yourrentals.com` and the bare domain (set the bare domain to redirect to `www`, or the other way round).

:::tip Remove conflicting records
If your registrar added parking-page A records or an old CNAME, delete them. Two sets of A records for the same name make verification fail or flip between servers.
:::

## 2. Authorise the domain for sign-in

In **Authentication → Settings → Authorized domains**, click **Add domain** and add `app.yourrentals.com`. Firebase Authentication refuses some operations from domains that are not listed.

## 3. Allow the domain as a payment return URL

Stripe and PayPal send the customer back to `https://<platform-domain>/pay/return`. `createPayment` only accepts return URLs that start with an origin in `ALLOWED_RETURN`, at the top of `booqora_platform/functions/index.js`:

```js title="booqora_platform/functions/index.js"
const ALLOWED_RETURN = [
  'https://app.yourrentals.com',
  'https://<your-platform-site-id>.web.app',
  'https://<your-platform-site-id>.firebaseapp.com',
  'http://localhost',
];
```

Then redeploy the functions:

```bash title="Terminal"
cd booqora_platform
firebase deploy --only functions --project <your-project-id>
```

The Rental Platform builds the return URL from the address in the browser, so staff and customers using either the `web.app` address or your domain are both covered as long as both are in the list.

## 4. Update the Mobile App

The Mobile App cannot read a browser address, so it has two constants. Set them to your platform domain and release a new build:

| File | Constant | Value |
|---|---|---|
| `booqora_mobile/lib/core/browser.dart` | `Browser.origin` | `https://app.yourrentals.com` |
| `booqora_mobile/lib/data/payments.dart` | `Payments.returnUrl` | `https://app.yourrentals.com/pay/return` |

`Browser.origin` is used for the *Share store link* action, product share links and links inside calendar files.

## 5. Update the Marketing Website

In `booqora_website/src/lib/site.ts` set `PLATFORM_URL` to `https://app.yourrentals.com` (the **Log in**, **Start free trial** and privacy links use it). Build with `NEXT_PUBLIC_SITE_URL=https://www.yourrentals.com` so canonical URLs, `sitemap.xml` and `robots.txt` use your domain. Then build and deploy as in [Build & Deploy](doc:web/deployment).

## 6. Payment provider dashboards

Booqora does not use payment webhooks, so there are no webhook URLs to update. It is still good practice to list your domain in each provider's account settings (for example the website URL in your Razorpay and Stripe business profile), as providers check it during account activation.

## Checklist

- [ ] Domain shows **Connected** in Hosting
- [ ] `https://app.yourrentals.com/login` loads with a padlock
- [ ] Domain added to **Authorized domains**
- [ ] `ALLOWED_RETURN` updated and functions redeployed
- [ ] A Stripe or PayPal test payment returns to `/pay/return` on your domain
- [ ] Mobile App constants updated in the next release
- [ ] Website `PLATFORM_URL` and `NEXT_PUBLIC_SITE_URL` updated

**Next:** [Setup Guide (First 10 Steps) →](doc:installation/setup-guide)
