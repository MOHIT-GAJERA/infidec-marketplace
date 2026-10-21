---
title: Firebase Setup
description: Authentication, authorized domains, phone reCAPTCHA and optional web push for the website.
---

The website uses the **web app** you registered in [Create the Firebase Project](doc:installation/firebase-project#6-register-the-web-app) — the same config as the Admin Panel.

## Authentication

| Setting | Value |
|---|---|
| Sign-in providers | **Anonymous** (guest cart), **Email/Password**, **Phone** |
| Authorized domains | `localhost`, `yourstore.com`, `www.yourstore.com`, the App Hosting `*.hosted.app` domain |
| SMS region policy | Only the countries you sell in |

### How sign-in works

- First visit: an **anonymous** session is created so the cart works immediately.
- **Phone OTP**: invisible reCAPTCHA → SMS → the phone login is **linked** to the guest session (same user, cart kept). If the number already has an account the site signs in to it and merges the guest cart.
- **E-mail register** links the e-mail to the guest session; **e-mail login** signs in and merges the guest cart.
- After sign-in `syncProfile` creates/updates the customer profile.

:::warning "auth/unauthorized-domain"
If phone login or password reset fails with this error, the domain is missing from **Authentication → Settings → Authorized domains**.
:::

## Firestore rules and indexes

The website relies on the rules and composite indexes deployed from `firebase/` — see [Deploy the Backend](doc:installation/backend-deploy). Listing, search and order pages show an error until every index is *Enabled*.

## Web push (optional)

1. Firebase console → Project settings → **Cloud Messaging → Web Push certificates → Generate key pair**.
2. Put the public key in `NEXT_PUBLIC_FIREBASE_VAPID_KEY` (local `.env.local` and `web/apphosting.yaml`) and in Admin → System Settings → Firebase.
3. Redeploy. The service worker `public/firebase-messaging-sw.js` receives notifications; the token is saved in the user's profile and removed at logout.

**Next:** [File Structure →](doc:web/file-structure)
