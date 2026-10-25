---
title: Hosting, Domain & SSL
description: Put the Go4Ride admin panel on your own domain with Firebase Hosting and free HTTPS, and understand which addresses the apps and payment gateways depend on.
---

Go4Ride has only one thing to host: the **admin panel**, as static files. The apps talk to Firebase directly, and the only public backend URL is the payment return page, which Cloud Functions serves with its own HTTPS address.

| Part | Served by | Free address | Your domain (example) |
|---|---|---|---|
| Admin Panel | **Firebase Hosting** | `https://your-project-id.web.app` | `admin.yourcompany.com` |
| Payment return page | **Cloud Functions** (`paymentReturn`) | `https://us-central1-your-project-id.cloudfunctions.net/paymentReturn` | Not needed |
| Customer & Driver Apps | Google Play / App Store | — | — |

There is no server to patch. Google issues and renews the certificates.

## 1. Admin panel on your domain

You deployed the panel in [Admin Panel Installation](doc:installation/admin-panel). Now connect the domain:

:::steps
### Add the domain
Firebase console → **Hosting** → **Add custom domain**. Enter `admin.yourcompany.com`. Leave *redirect* unticked.

### Verify ownership
At your domain registrar, add the `TXT` record Firebase shows.

### Point the domain
Add the `A` records (or the `CNAME`) Firebase shows. Remove any older `A`/`AAAA` records for the same name.

### Wait for SSL
The status changes to **Connected**, usually within minutes, sometimes a few hours. Firebase issues the **SSL certificate automatically**.
:::

Then add the domain under **Authentication → Settings → Authorized domains**, so Firebase Auth accepts requests from it.

:::tip Several sites
Want the panel on a separate Hosting site (for example to keep `your-project-id.web.app` for a landing page)? Create a second site under Hosting → **Add another site**, then `firebase target:apply hosting admin your-admin-site` and use `"target": "admin"` in the hosting block. Deploy with `firebase deploy --only hosting:admin`.
:::

## 2. The payment return address

When a rider pays online, the gateway (Razorpay, Stripe or PayPal) sends the browser back to:

```text
https://us-central1-your-project-id.cloudfunctions.net/paymentReturn?pid=<payment id>
```

`createPayment` builds this address itself from the project ID (`returnBase()` in `functions/src/payments.ts`). It does not depend on your domain, so changing the admin domain never breaks payments. Don't add it as a webhook in the gateway dashboards: it's a browser redirect, not a webhook, and the backend verifies every payment with the gateway's API itself. See [Payment Flow](doc:api/payments).

:::warning Changing the functions region
The return address assumes `us-central1`. If you deploy the functions to another region, change `returnBase()` in `functions/src/payments.ts` to the same region before you deploy, or every checkout will return to an address that doesn't exist.
:::

## 3. Nothing to change in the apps

The Customer and Driver apps contain only the Firebase config from `flutterfire configure`. They don't contain the panel's address, so you can move the panel to another domain at any time without new app builds.

## Optional: restrict the browser API key

The Firebase web API key in the panel identifies your project. For extra protection, restrict it to your admin domains: Google Cloud Console → **APIs & Services → Credentials** → the *Browser key (auto created by Firebase)* → **Application restrictions → Websites**: add `https://admin.yourcompany.com/*`, `https://your-project-id.web.app/*` and, for local work, `http://localhost:*/*`.

:::warning Keep the mobile keys separate
The Android and iOS Firebase apps have their own API keys. Don't apply a website restriction to them, or phone login stops working in the apps.
:::

## Checklist

- [x] Panel deployed and reachable at `https://your-project-id.web.app`
- [x] Custom domain **Connected** with SSL
- [x] Domain added to Authorized domains
- [x] Functions still in `us-central1` (or `returnBase()` updated)

**Next:** [Setup Guide (First 10 Steps) →](doc:installation/setup-guide)
