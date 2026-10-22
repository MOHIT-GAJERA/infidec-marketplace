---
title: Hosting, Domain & SSL
description: Put the admin panel and the API on your own domains with Firebase Hosting, run the website on Firebase App Hosting, and get free HTTPS for all of them.
---

Go4Foodie uses two Firebase hosting products, both with automatic HTTPS:

| Part | Product | Free address | Your domain (example) |
|---|---|---|---|
| Admin Panel | **Firebase Hosting**, site *admin* | `https://yourrestaurant-admin.web.app` | `admin.yourrestaurant.com` |
| API host | **Firebase Hosting**, site *api* | `https://yourrestaurant-1a2b3.web.app` | `api.yourrestaurant.com` (optional) |
| Customer Website | **Firebase App Hosting** (Next.js SSR) | `https://yourrestaurant-web--yourrestaurant-1a2b3.asia-southeast1.hosted.app` | `yourrestaurant.com`, `www.yourrestaurant.com` |

There's no server to patch. Certificates are issued and renewed by Google.

## 1. Admin panel on your domain

You deployed the admin site in [Admin Panel Installation](doc:installation/admin-panel). Now connect the domain:

1. Firebase console → **Hosting** → choose the site **yourrestaurant-admin** → **Add custom domain**.
2. Enter `admin.yourrestaurant.com`. Leave *redirect* unticked.
3. At your domain registrar, add the DNS records Firebase shows (a `TXT` record for ownership, then `A` records or a `CNAME`).
4. Wait for **Connected** (minutes to a few hours). Firebase issues the **SSL certificate automatically**.

The admin site serves `/api/**` itself, so the panel works on any domain you connect without any rebuild.

Then point the API host's root redirect at the new address and redeploy the api target:

```json title="firebase/firebase.json (api target)"
"redirects": [{ "source": "/", "destination": "https://admin.yourrestaurant.com", "type": 302 }]
```

```bash
cd firebase && firebase deploy --only hosting:api
```

## 2. API host on your domain (optional)

The website and the mobile app call the **api** site. Its free `yourrestaurant-1a2b3.web.app` address works fine. A custom domain such as `api.yourrestaurant.com` only makes it easier to move later. To add one, repeat step 1 on the site **yourrestaurant-1a2b3**.

:::warning Decide before you publish the app
The API address is compiled into the mobile app (`API_BASE_URL`). If you change it after release, everyone needs to install an update. Choose the final address first, then build the app ([Mobile App → API Configuration](doc:app/api-configuration)).
:::

## 3. Website on App Hosting

Short version. The full guide is [Web Portal → Deployment](doc:web/deployment).

:::steps
### Point the website at your project and API
`website/.firebaserc` → `"default": "yourrestaurant-1a2b3"`. In `website/firebase.json` rename `backendId` (for example `yourrestaurant-web`). In `website/apphosting.yaml`, set `ADMIN_API_URL` to your API host and `NEXT_PUBLIC_SITE_URL` to your public website address.

### Create the backend
```bash
cd website
firebase apphosting:backends:create --project yourrestaurant-1a2b3
```
Use the same backend ID as in `firebase.json` and the region **`asia-southeast1`** (App Hosting has no Mumbai region). Connecting GitHub is optional, because you can deploy from your computer.

### Deploy
```bash
firebase deploy --only apphosting
```
After the rollout you get the free `*.hosted.app` address.

### Connect the domain
App Hosting → your backend → **Settings → Domains → Add custom domain** → `yourrestaurant.com` (and `www.yourrestaurant.com`). Add the DNS records shown, then wait for the certificate.
:::

## 4. Update the addresses everywhere

Once the domains are live, update every setting that holds an address:

| Setting | Where | Value |
|---|---|---|
| `WEBSITE_URL` | `firebase/functions/.env.<project-id>` | `https://yourrestaurant.com`. Table QR codes point here (`/order?table=<code>`) |
| API redirect `/` | `firebase/firebase.json` (api target) | Your admin address |
| `ADMIN_API_URL` | `website/apphosting.yaml` | Your API host |
| `NEXT_PUBLIC_SITE_URL` | `website/apphosting.yaml` | `https://yourrestaurant.com` |
| `API_BASE_URL`, `SITE_ORIGIN` | Mobile app build | API host and website |

Then redeploy: `firebase deploy --only functions,hosting:api` in `firebase/`, `firebase deploy --only apphosting` in `website/`.

:::tip Re-print the QR codes after changing `WEBSITE_URL`
QR codes are made from `WEBSITE_URL` when you open **Tables**. If you printed them while it still pointed at a test address, print them again.
:::

## 5. Authorized domains

**Authentication → Settings → Authorized domains → Add domain**: add `admin.yourrestaurant.com`. Custom-token sign-in doesn't depend on this list, but keeping your admin domains there means any Firebase Auth feature you add later works without surprises. If you restrict the browser API key (Google Cloud → Credentials → *Website restrictions*), add the admin domains **there**. That restriction *does* block sign-in.

## 6. Smoke test

- `https://admin.yourrestaurant.com` loads, you can sign in, and the Overview shows data.
- The login screen **doesn't** show the demo hint ([removed in step 2 of the install](doc:installation/admin-panel#2-remove-the-demo-login-hint)).
- `https://your-api-host/up` answers `ok`. `https://your-api-host/` redirects to the admin panel.
- On `https://yourrestaurant.com`, the menu loads and a test take-away order shows up in **Orders**.

## Rolling back

- **Admin / API site**: Hosting → the site → **Release history** → choose an earlier release → **Roll back**.
- **Website**: App Hosting → backend → **Rollouts** → an earlier rollout → **Roll back**.

**Next:** [Setup Guide (First 10 Steps) →](doc:installation/setup-guide)
