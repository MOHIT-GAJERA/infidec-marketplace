---
title: Admin Panel Installation
description: Connect the Next.js Admin Panel to your Firebase project, build it as a static site and publish it to its own Firebase Hosting site.
---

`admin/` is the ClassiAds-Hub Admin Panel, a **Next.js 16** application exported as static files (`output: "export"`). It has no server code: it signs in with Firebase Authentication and calls the REST API for everything else. Firebase Hosting serves it from the `admin` target, and forwards `/api/**` to the `api` function, so the panel calls the API on its own domain.

**Stack:** Next.js 16.2, React 19, Tailwind CSS 4, Firebase JS SDK 12 (Auth only), Leaflet with OpenStreetMap tiles for the location picker, Nunito font.

## 1. Connect it to your project

If you haven't done it on the previous page, edit two files:

| File | Change |
|---|---|
| `admin/src/lib/firebase.ts` | Replace the `config` object with your Firebase web config |
| `admin/src/lib/api.ts` | Replace `classiadshub` in the `localhost` fallback URL with `your-project-id` |

With the old values the panel signs in to the demo project and every login fails. See [Keys & Environment](doc:installation/environment-configuration#4-firebase-web-config).

## 2. Try it locally

```bash
cd admin
npm install
npm run dev          # next dev -p 3001
```

Open `http://localhost:3001/login`. On `localhost` the panel calls your deployed function directly (`https://us-central1-your-project-id.cloudfunctions.net/api/v1`). The API allows any origin (`cors({ origin: true })`), so this works without extra setup. You can't sign in yet, because a new project has no admin. That is the next page.

![Admin login](/docs/classiadshub/images/admin-login.jpg "The Admin Panel sign-in screen")

## 3. Build for production

```bash
cd admin
npm run build        # next build && node scripts/flatten-segments.mjs
```

The output goes to `admin/out`. The build script runs two steps:

| Step | What it does |
|---|---|
| `next build` | Static export of every page to `admin/out` |
| `scripts/flatten-segments.mjs` | Copies Next's nested segment-prefetch files (`__next.<segment>/__PAGE__.txt`) to the dotted names the client router requests, so in-app navigation works on static hosting instead of falling back to full page reloads |

Always build with `npm run build`, not `next build` alone.

## 4. The Hosting target

The shipped `firebase.json` already contains the `admin` site. Nothing to add:

```json title="firebase.json (hosting, admin target)"
{
  "target": "admin",
  "public": "admin/out",
  "cleanUrls": true,
  "trailingSlash": false,
  "ignore": ["firebase.json", "**/.*", "**/debug.log", "**/node_modules/**"],
  "rewrites": [
    { "source": "/api/**", "function": { "functionId": "api", "region": "us-central1" } }
  ],
  "headers": [
    { "source": "/_next/static/**", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```

`cleanUrls` serves `/ads` from `ads.html`. The `/api/**` rewrite sends API calls to the function. Static assets under `/_next/static/` are cached for a year: their file names change on every build.

The `admin` target must be mapped to your second Hosting site in `.firebaserc` (`firebase target:apply hosting admin your-project-id-admin`). See [Create the Firebase Project](doc:installation/firebase-project#9-point-the-repository-at-your-project).

## 5. Deploy

```bash
firebase deploy --only hosting:admin
```

Open `https://your-project-id-admin.web.app`. Custom domains are on [Hosting, Domain & SSL](doc:installation/hosting).

Add the panel's address to **Authentication → Settings → Authorized domains** (`your-project-id-admin.web.app`, and later `admin.yourcompany.com`). The panel signs in with e-mail and password, which works without it, but keeping the list complete avoids surprises.

:::tip Another static host
`admin/out` is plain static files, but the panel expects `/api/v1` on its own domain. On another host, either proxy `/api/*` to `https://us-central1-your-project-id.cloudfunctions.net/api/*`, or build with `NEXT_PUBLIC_API_BASE=https://us-central1-your-project-id.cloudfunctions.net/api/v1`. You also need clean URLs (`/ads` → `ads.html`).
:::

## Deploy everything at once

After the first install, this is the full redeploy of the backend and both sites:

```bash
(cd admin && npm run build)
(cd web && npm run build)
firebase deploy --only functions,firestore:rules,firestore:indexes,storage,hosting
```

## Branding

| What | File |
|---|---|
| Browser title and description | `admin/src/app/layout.tsx` (`title: { default: "ClassiAds-Hub Admin", template: "%s · ClassiAds-Hub Admin" }`) |
| Favicon | `admin/public/icon.png` |
| Logos (sidebar, login) | `admin/public/logo.png`, `admin/public/logo-light.png`, `admin/public/app-icon.png` (keep the file names) |
| Colours | `admin/src/app/globals.css`: `--brand` (`#272757`), `--secondary`, `--accent` and the other tokens |
| Font | Nunito, loaded in `admin/src/app/layout.tsx`; `--font-sans` in `globals.css` |
| Login screen texts | `admin/src/app/login/page.tsx` |
| *Visit website* link in the top bar | `admin/src/components/shell.tsx` |
| Sidebar menu | `NAV` and `SETTINGS_NAV` in `admin/src/components/shell.tsx` |

Rebuild and redeploy after each change.

## Folder overview

```text title="admin/src/"
app/login/                 Sign-in screen
app/(panel)/               Every panel page: dashboard, ads, categories, custom-fields, jobs,
                           content, chat, packages, sellers, blogs, customers, locations,
                           reports, notifications, settings/[section]
components/shell.tsx       Sidebar (NAV), top bar, permission-aware menu
components/                Shared UI: tables, forms, modals, map-picker (Leaflet)
lib/api.ts                 API client (adds the Firebase ID token, unwraps the envelope)
lib/auth.tsx               Login flow, /admin/me permissions, can(module)
lib/firebase.ts            Your Firebase web config
lib/settings-config.ts     Every settings page and its setting keys
lib/constants.ts           Field types, banner pages
scripts/flatten-segments.mjs   Post-build fix for static hosting
```

**Next:** [Create the First Admin →](doc:installation/super-admin)
