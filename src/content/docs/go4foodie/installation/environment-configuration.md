---
title: Environment Configuration
description: Every setting that connects the backend, the admin panel, the website and the mobile app to your Firebase project, and where each secret lives.
---

Go4Foodie has **no settings screen for keys**. Gateways, SMTP and the token secret are set on the backend, and each client is told where the API is. There are four places:

| Where | What | Who can read it |
|---|---|---|
| **Secret Manager** (`firebase functions:secrets:set`) | Token secret, SMTP password, gateway secret keys | Only the `api` function |
| **`firebase/functions/.env.<project-id>`** | Time zone, website URL, SMTP host/user, public gateway keys, currencies | Deployed with the function. Not visible to clients |
| **Admin panel** (`firebase_options.dart`, `--dart-define`) | Firebase web config, optional API base | Public, compiled into the browser |
| **Website / mobile app** (`apphosting.yaml`, `--dart-define`) | API host address, public site URL | Public |

After you change a secret or the `.env` file, **deploy the function again** (`firebase deploy --only functions`). Changes take effect only then.

## Secrets (Secret Manager)

| Secret | Required | Used for |
|---|---|---|
| `AUTH_SECRET` | **Yes** | HS256 key for the mobile app's 30-day login tokens. Mobile login fails with *AUTH_SECRET is not set* when it's missing |
| `MAIL_PASSWORD` | For e-mail | SMTP password. Spaces are removed, so you can paste a Gmail app password as shown |
| `RAZORPAY_KEY_SECRET` | For Razorpay | Creates Razorpay orders and verifies the checkout signature |
| `STRIPE_SECRET_KEY` | For Stripe | Creates and checks PaymentIntents |
| `PAYPAL_CLIENT_SECRET` | For PayPal | OAuth client-credentials for the Orders v2 API |

```bash
firebase functions:secrets:set STRIPE_SECRET_KEY     # set or change a value
firebase functions:secrets:get STRIPE_SECRET_KEY     # show versions (not the value)
firebase functions:secrets:prune                     # destroy versions no function uses
```

:::danger Every declared secret must exist
`functions/src/index.ts` lists all five secrets. If one has never been set, the deploy fails. Set unused ones to a placeholder (for example `unused`) and leave the partner key in `.env` empty, so the feature stays switched off.
:::

## Plain configuration (`functions/.env.<project-id>`)

The file name must match your project ID exactly, for example `.env.yourrestaurant-1a2b3`.

| Variable | Default in code | Notes |
|---|---|---|
| `LOCAL_TZ` | `Asia/Kolkata` | The restaurant's time zone, for "today", busy hours, pickup times, slots, analytics and labels. Use an IANA name such as `Europe/London` or `America/New_York` |
| `WEBSITE_URL` | — | Your public website, for example `https://yourrestaurant.com`. Table QR codes open `WEBSITE_URL/order?table=<code>` |
| `MAIL_HOST` | — | SMTP server. E-mail is skipped when empty |
| `MAIL_PORT` | `2525` | `587` (STARTTLS) or `465` (SSL) |
| `MAIL_SCHEME` | empty | `smtps` = SSL from the first byte. Empty = SSL on port 465, otherwise STARTTLS when the server offers it |
| `MAIL_USERNAME` | — | SMTP login. E-mail is skipped when empty |
| `MAIL_FROM_ADDRESS` | `MAIL_USERNAME` | The *From* address. The sender name is always **Go4Foodie** (see [SMTP](doc:admin/smtp-settings)) |
| `RAZORPAY_KEY_ID` | — | `rzp_test_…` / `rzp_live_…` |
| `RAZORPAY_CURRENCY` | `INR` | ISO code |
| `STRIPE_PUBLISHABLE_KEY` | — | `pk_test_…` / `pk_live_…` |
| `STRIPE_CURRENCY` | `usd` | ISO code, any case |
| `PAYPAL_CLIENT_ID` | — | REST app client ID |
| `PAYPAL_ENV` | `sandbox` | `live` for real payments |
| `PAYPAL_CURRENCY` | `USD` | ISO code |

:::warning Back up this file
`firebase/functions/.gitignore` ignores `.env.*`, so the file is **not** committed to Git. Keep a copy in your password manager. Without it, the next deploy runs without your SMTP and gateway settings.
:::

## Admin panel

| Setting | Where | Default |
|---|---|---|
| Firebase web config | `admin-app/lib/firebase_options.dart` | Fill in your project's values, see [Create the Firebase Project](doc:installation/firebase-project#6-register-the-admin-web-app) |
| `API_BASE` | `--dart-define=API_BASE=…` at build/run time | Empty, so the panel calls `/api/admin/*` on its own origin. That's right for Firebase Hosting, because the admin site rewrites `/api/**` to the function. Only set it for local development |

## Website

Set in `website/apphosting.yaml` (App Hosting) or `website/.env.local` (local):

| Variable | Example | Notes |
|---|---|---|
| `ADMIN_API_URL` | `https://yourrestaurant-1a2b3.web.app` | The API host. The website's own `/api/*` routes forward to it. Runtime only |
| `NEXT_PUBLIC_SITE_URL` | `https://yourrestaurant.com` | Canonical URLs, sitemap, metadata. Build and runtime |

See [Web Portal → Configuration](doc:web/configuration).

## Mobile app

| Define | Default | Notes |
|---|---|---|
| `API_BASE_URL` | The shipped API host | Set to your API host, for example `--dart-define=API_BASE_URL=https://yourrestaurant-1a2b3.web.app`, or change the default in `mobile-app/lib/core/api.dart` |
| `SITE_ORIGIN` | The shipped website | Your public website address |

See [Mobile App → API Configuration](doc:app/api-configuration).

## Changing the region

Everything ships for `asia-south1` (Mumbai). To use another region (for example `europe-west1`), change it **before the first deploy**, in all of these places:

1. **Firestore**: create the database in the new location, and set `"location"` in the `firestore` block of `firebase/firebase.json`.
2. **Function**: `firebase/functions/src/index.ts` → `setGlobalOptions({ region: 'europe-west1' })`.
3. **Hosting rewrites**: `firebase/firebase.json` has **four** `"region": "asia-south1"` entries (`/api/**` and `/up` on both the `admin` and the `api` targets). Change all four.
4. **Website**: pick the nearest App Hosting region when you create the backend (see [Web Portal → Deployment](doc:web/deployment)).

:::warning
If a rewrite region doesn't match the function's region, Hosting answers every `/api/…` call with an error, and the panel, website and app all stop loading data. Keep the four places in sync.
:::

**Next:** [Admin Panel Installation →](doc:installation/admin-panel)
