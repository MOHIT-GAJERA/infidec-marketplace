---
title: Hosting, Domain & SSL
description: Put the Admin Panel (and the website) online with Firebase App Hosting, connect your own domain and get free HTTPS.
---

**Firebase App Hosting** builds and serves Next.js apps on Google Cloud (Cloud Run + CDN) with automatic HTTPS. It is the recommended home for both the Admin Panel and the Web Portal — no server to patch.

:::note Prefer your own server?
The panel and the website are standard Next.js apps. Any machine with Node.js 22 can run them with `npm run build && npm run start` behind Nginx — see [Web Portal → Deployment Guide](doc:web/deployment#option-b-your-own-vps). The steps are the same for the panel (`admin/`, port 3001).
:::

## 1. Put the code in GitHub

App Hosting builds from a Git repository.

```bash
git init
git add -A
git status          # make sure no .env.local, keystores or service-account keys are listed
git commit -m "QwikMart initial import"
git remote add origin git@github.com:<your-org>/yourstore.git
git push -u origin main
```

## 2. Create the App Hosting backends

Create one backend per app. Pick the region closest to your Firestore location (App Hosting is not available in every region — `asia-southeast1` (Singapore) is the nearest to Mumbai).

```bash
cd firebase
npx firebase apphosting:backends:create --project yourstore-1a2b3
#  → connect GitHub, choose the repository
#  → app root directory: admin     · live branch: main   · backend id: yourstore-admin
npx firebase apphosting:backends:create --project yourstore-1a2b3
#  → app root directory: web       · live branch: main   · backend id: yourstore-web
```

Or use the console: **Build → App Hosting → Get started**.

Each push to `main` now builds and deploys automatically. You can also roll out manually:

```bash
npx firebase apphosting:rollouts:create yourstore-admin --project yourstore-1a2b3
```

:::tip Deploy from your computer without GitHub
Add the backends to the root `firebase.json` and deploy local source:

```json title="firebase.json (repository root)"
{
  "apphosting": [
    { "backendId": "yourstore-admin", "rootDir": "admin", "ignore": ["node_modules", ".next", ".git", ".env.local"] },
    { "backendId": "yourstore-web", "rootDir": "web", "ignore": ["node_modules", ".next", ".git", ".env.local"] }
  ]
}
```

```bash
npx firebase deploy --only apphosting --project yourstore-1a2b3
```
:::

When the rollout finishes you get a free address such as `https://yourstore-admin--yourstore-1a2b3.asia-southeast1.hosted.app`.

## 3. Connect your domain

1. App Hosting → your backend → **Settings → Domains → Add custom domain** → `admin.yourstore.com`.
2. Add the DNS records Firebase shows (usually an `A` record and a `TXT` verification record) at your domain registrar.
3. Wait for verification (minutes to a few hours). Firebase issues the **SSL certificate automatically**.
4. Repeat for the website (`yourstore.com` and `www.yourstore.com`) on the web backend.

## 4. Authorize the domains

Firebase Authentication only works on allowed domains (password reset links, phone reCAPTCHA).

**Authentication → Settings → Authorized domains → Add domain** for each of:

- `admin.yourstore.com`
- `yourstore.com` and `www.yourstore.com`
- the `*.hosted.app` addresses of both backends

## 5. Smoke test

- `https://admin.yourstore.com/admin/login` loads, you can log in, the dashboard shows data.
- Login is **not** pre-filled (Demo Mode is off).
- Change an order status — the change appears instantly.

## Rolling back

App Hosting → backend → **Rollouts** → choose a previous rollout → **Roll back**.

**Next:** [Setup Guide (First 10 Steps) →](doc:installation/setup-guide)
