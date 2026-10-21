---
title: Admin Panel Installation
description: Install the Next.js Admin Panel, connect it to your Firebase project and run it.
---

The `admin/` folder contains the **Super Admin**, **Store** and **Delivery Boy** web panels in one Next.js application.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Firebase JS SDK, TanStack Query, ApexCharts, Leaflet (OpenStreetMap), TipTap editor.

## 1. Install dependencies

```bash
cd admin
npm install
```

## 2. Create the environment file

```bash
cp .env.example .env.local
```

Fill it with **your** Firebase web config from [Create the Firebase Project](doc:installation/firebase-project#6-register-the-web-app):

```env title="admin/.env.local"
NEXT_PUBLIC_FIREBASE_API_KEY=AIza…
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourstore-1a2b3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourstore-1a2b3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourstore-1a2b3.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123…
NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION=asia-south1
NEXT_PUBLIC_USE_EMULATORS=false
```

Every variable is explained in [Environment Configuration](doc:installation/environment-configuration).

## 3. Run it

```bash
npm run dev          # http://localhost:3001
```

Open:

| Panel | URL |
|---|---|
| Super Admin | `http://localhost:3001/admin/login` |
| Store panel | `http://localhost:3001/store/login` |
| Delivery Boy panel | `http://localhost:3001/delivery/login` |

![Admin Panel login](/docs/qwikmart/images/admin-login.jpg "The Super Admin login page")

You cannot log in yet — a brand-new project has no admin user. Create one in [Create the Super Admin](doc:installation/super-admin).

## 4. Production build

```bash
npm run build        # also syncs the Firestore index list used by the query planner
npm run start        # serves the build on port 3001
```

Other scripts: `npm run lint`, `npm run typecheck`.

:::tip You rarely run the production build by hand
On Firebase App Hosting the build runs automatically on every push. See [Hosting, Domain & SSL](doc:installation/hosting).
:::

## Folder overview

```text title="admin/"
src/
  app/admin/(panel)/**     Super Admin routes (one-line files that load a module)
  app/store/(panel)/**     Store panel routes
  app/delivery/(panel)/**  Delivery Boy panel routes
  modules/**               Screens: orders, products, settings, home builder, reports…
  components/**            Shared UI: tables, forms, shell, charts
  lib/                     firebase.ts, auth.tsx (roles & permissions), callables.ts, menu.ts
apphosting.yaml            App Hosting runtime + build environment
.env.example               Environment template
```

**Next:** [Environment Configuration →](doc:installation/environment-configuration)
