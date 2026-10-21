---
title: Installation Steps
description: Install the website, configure its environment and run it locally.
---

## 1. Install

```bash
cd web
npm install          # Node.js 22
```

## 2. Environment variables

```bash
cp .env.example .env.local
```

```env title="web/.env.local"
NEXT_PUBLIC_USE_MOCK=false

# Firebase web app config (Project settings → Your apps → Web)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza…
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourstore-1a2b3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourstore-1a2b3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourstore-1a2b3.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123…

# Optional — web push (Cloud Messaging → Web Push certificates)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# Local emulators (development only)
NEXT_PUBLIC_USE_EMULATORS=false

# Public URL of the site — used for share images (Open Graph) and canonical links
NEXT_PUBLIC_SITE_URL=https://yourstore.com
```

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Yes | Same web app config as the Admin Panel |
| `NEXT_PUBLIC_USE_MOCK` | Yes | `false` in production |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your real domain, no trailing slash |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | No | Enables browser push notifications |
| `NEXT_PUBLIC_USE_EMULATORS` + `NEXT_PUBLIC_*_EMULATOR_PORT` | No | Development against the Emulator Suite |

:::danger Do not remove the Firebase config
Without the Firebase variables a development build falls back to demo data. Always check that a fresh deployment shows **your** zones and products, not sample data.
:::

## 3. Run

```bash
npm run dev                    # http://localhost:3000
npm run build && npm start     # production build
```

## 4. First check

1. Choose your city on the location popup — your zones are listed.
2. Products from your catalogue appear on the home page.
3. Log in with phone OTP (add `localhost` / your domain under Firebase → Authentication → Authorized domains).
4. Place a COD order and see it in Admin → Orders.

**Next:** [Firebase Setup →](doc:web/firebase-setup)
