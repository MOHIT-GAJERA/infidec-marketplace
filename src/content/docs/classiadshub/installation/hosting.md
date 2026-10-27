---
title: Hosting, Domain & SSL
description: Put the ClassiAds-Hub website and Admin Panel on your own domains with Firebase Hosting and free HTTPS, and set the checkout return address the payment gateways send buyers back to.
---

ClassiAds-Hub hosts two static sites on **Firebase Hosting**. Both forward `/api/**` to the `api` Cloud Function, so the API is always reachable on the site's own domain. Google issues and renews the certificates. There is no server to patch.

| Part | Hosting target | Free address | Your domain (example) |
|---|---|---|---|
| Website | `web` → `web/out` | `https://your-project-id.web.app` | `www.yourcompany.com` |
| Admin Panel | `admin` → `admin/out` | `https://your-project-id-admin.web.app` | `admin.yourcompany.com` |
| API | Rewrite `/api/**` → function `api` (`us-central1`) | `https://<either site>/api/v1/…` | Comes with each domain |
| Mobile App | Google Play / App Store | Calls `https://us-central1-your-project-id.cloudfunctions.net/api/v1` | — |

## 1. Deploy both sites

Build and deploy (see [Admin Panel Installation](doc:installation/admin-panel) and [Website Deployment](doc:web/deployment)):

```bash
(cd web && npm run build)
(cd admin && npm run build)
firebase deploy --only hosting            # both targets
firebase deploy --only hosting:web        # website only
firebase deploy --only hosting:admin      # panel only
```

The website's `firebase.json` block also maps the dynamic pages to their exported placeholder files, so deep links work on a static host:

| Source | Served file |
|---|---|
| `/ad/**` | `/ad/_.html` |
| `/category/**` | `/category/_.html` |
| `/blog/**` | `/blog/_.html` |
| `/jobs/**` | `/jobs/_.html` |
| `/seller/**` | `/seller/_.html` |
| `/page/**` | `/page/_.html` |
| `/dashboard/ads/**` | `/dashboard/ads/_/edit.html` |

The page reads the real slug or id from the address bar. Keep these rewrites if you move the site.

## 2. Connect your domains

Do this once per site:

:::steps
### Add the domain
Firebase console → **Hosting** → pick the site (`your-project-id` for the website, `your-project-id-admin` for the panel) → **Add custom domain**. Enter `www.yourcompany.com` or `admin.yourcompany.com`. Optionally redirect the bare `yourcompany.com` to `www`.

### Verify ownership
At your domain registrar, add the `TXT` record Firebase shows.

### Point the domain
Add the `A` records (or the `CNAME`) Firebase shows. Remove any older `A`/`AAAA` records for the same name.

### Wait for SSL
The status changes to **Connected**, usually within minutes, sometimes a few hours. Firebase issues the **SSL certificate automatically**.
:::

Then add both domains under **Authentication → Settings → Authorized domains**. *Continue with Google* only works on authorized domains.

## 3. The checkout return address

When a buyer pays with Stripe, Razorpay or PayPal, the gateway sends the browser back to the **website**:

```text
<frontend_url>/checkout/result?txn=<transaction id>             (paid or still processing)
<frontend_url>/checkout/result?txn=<transaction id>&cancelled=1 (cancelled on the gateway page)
```

The API builds this address itself from the setting **`settings/general.frontend_url`** (default `https://classiadshub.web.app`, see `returnUrls()` in `functions/src/lib/payments.ts`). The Admin Panel has no field for it, so set it in the Firestore console:

1. **Firestore Database** → `settings` → document `general`.
2. Add or edit the string field `frontend_url` = `https://www.yourcompany.com` (no trailing slash needed).

The API caches settings for about 30 seconds. On the result page the website calls `POST /payments/{id}/confirm`, and the server asks the gateway for the real status. Don't register this address as a webhook in the gateway dashboards: it's a browser redirect, and the hourly `housekeeping` job settles payments whose buyer never came back. See [Billing & Payments](doc:api/billing).

:::warning Update it whenever the website moves
If `frontend_url` still points at the demo or at an old domain, buyers land on the wrong site after paying. Their payment is still settled by the hourly job, but they don't see the result page.
:::

## 4. Tell the website its own address

The website uses `SITE_URL` for canonical links, `robots.txt` and `sitemap.xml`. Set it before you build:

```env title="web/.env.local"
NEXT_PUBLIC_SITE_URL=https://www.yourcompany.com
```

Then rebuild and redeploy the website. See [SEO & Sitemap](doc:web/seo).

## 5. The mobile app

The app calls the function URL directly, not the website, so moving the website or the panel to another domain needs **no new app build**. Two places in the app copy a website link to the clipboard (the ad share link in `ad_detail_screen.dart` and the profile screen). Change them to your domain before you publish. See [API Configuration](doc:app/api-configuration).

## Optional: restrict the browser API key

The Firebase web API key in the website and the panel identifies your project. For extra protection, restrict it to your domains: Google Cloud Console → **APIs & Services → Credentials** → the *Browser key (auto created by Firebase)* → **Application restrictions → Websites**: add `https://www.yourcompany.com/*`, `https://admin.yourcompany.com/*`, `https://your-project-id.web.app/*`, `https://your-project-id-admin.web.app/*` and, for local work, `http://localhost:*/*`.

:::warning Keep the server key unrestricted by website
The `api` function calls the Identity Toolkit REST API with `WEB_API_KEY` from `functions/.env` to check passwords. If that is the same browser key, a website restriction makes every login fail (the server sends no browser referrer). Either leave the key without application restrictions, or create a second key for `WEB_API_KEY` restricted to the **Identity Toolkit API** only.
:::

## Checklist

- [x] Website deployed to `hosting:web`, panel to `hosting:admin`
- [x] Custom domains **Connected** with SSL
- [x] Both domains added to Authorized domains
- [x] `settings/general.frontend_url` set to your website address
- [x] `NEXT_PUBLIC_SITE_URL` set and the website rebuilt
- [x] Functions still in `us-central1` (or every rewrite and API address updated)

**Next:** [Setup Guide (First 10 Steps) →](doc:installation/setup-guide)
