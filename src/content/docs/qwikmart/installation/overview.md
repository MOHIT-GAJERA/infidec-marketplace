---
title: Installation Overview
description: QwikMart is delivered as five folders. They are installed in a fixed order, because each one needs the Firebase project created by the one before it.
---

QwikMart is delivered as **five separate folders**. They are installed in a fixed order, because every part connects to the **same Firebase project**.

| # | Folder | Technology | Where it runs |
|---|---|---|---|
| 1 | `firebase/` — **Backend** | Cloud Functions (TypeScript), Firestore & Storage rules, indexes | Your Firebase project |
| 2 | `admin/` — **Admin Panel** | Next.js 15 | Firebase App Hosting (or any Node.js server) |
| 3 | `web/` — **Web Portal** | Next.js 15 | Firebase App Hosting (or any Node.js server) |
| 4 | `customer_app/` — **Customer App** | Flutter | Android & iOS |
| 5 | `delivery_app/` — **Delivery Boy App** | Flutter | Android & iOS |

:::note This section covers the backend and the panel
The **Installation** menu sits under Admin Panel because it creates the Firebase project and installs the backend and the panel — the parts every other piece talks to. The website and the two apps have their own sections and are set up after the panel is live.
:::

## Install in this order

The order is not a preference. Each step produces something the next step needs.

| Step | Page | What it achieves |
|---|---|---|
| 1 | [Requirements](doc:installation/requirements) | Install Node.js, Java, Firebase CLI and Flutter; open the accounts you need |
| 2 | [Create the Firebase Project](doc:installation/firebase-project) | Blaze plan, Firestore, Authentication, Storage, web app config |
| 3 | [Deploy the Backend](doc:installation/backend-deploy) | Cloud Functions, security rules and indexes go live |
| 4 | [Admin Panel Installation](doc:installation/admin-panel) | Install dependencies and run the panel |
| 5 | [Environment Configuration](doc:installation/environment-configuration) | Point the panel at your Firebase project |
| 6 | [Create the Super Admin](doc:installation/super-admin) | Your first login with full permissions |
| 7 | [Hosting, Domain & SSL](doc:installation/hosting) | Panel online at `admin.yourstore.com` with HTTPS |
| 8 | [Setup Guide](doc:installation/setup-guide) | The ten in-panel steps that make the store usable |
| 9 | [Localhost Setup](doc:installation/localhost-setup) | Optional — run everything on your own computer |
| 10 | [Backups & Monitoring](doc:installation/backups) | Put backups and alerts in place before you go live |

Once the panel is running, the other three parts point at the same Firebase project:

- **Web Portal** — add your Firebase web config and deploy. See [Web Portal](doc:web/overview).
- **Customer & Delivery Boy apps** — change the package name, register them in Firebase, add `google-services.json` and build. See [Customer App](doc:app-customer/prerequisites).

:::warning Choose your Firebase project once
The Firebase project ID is written into the panel and website configuration and compiled into both apps. Moving to a different project later means re-configuring and re-publishing everything — decide on the production project first and keep it.
:::

## No server to rent

Unlike classic PHP scripts, QwikMart does **not** need a VPS, PHP, MySQL, cron jobs or a queue worker:

- The **backend** runs as Cloud Functions that scale automatically.
- The **database** is Cloud Firestore with automatic replication.
- The **panel and website** run on Firebase App Hosting (managed Cloud Run with HTTPS and CDN).

If you prefer your own server for the panel or the website, any machine that runs Node.js 22 works — see [Web Portal deployment](doc:web/deployment#option-b-your-own-vps).

## What you need before starting

- A Google account for the Firebase / Google Cloud project, with a **billing account** (credit/debit card) for the Blaze plan
- A domain name (optional but recommended), with access to its DNS settings
- An e-mail address for the Super Admin account
- A Google Play developer account (for the Android apps)
- Accounts for any third-party service you plan to use — see [Third-Party Service Costs](doc:admin/third-party-costs)

## Typical layout

| Address | Part |
|---|---|
| `https://yourstore.com` | Web Portal |
| `https://admin.yourstore.com` | Admin Panel (`/admin`, `/store`, `/delivery`) |
| Google Play | Customer App and Delivery Boy App |

Keeping the panel and storefront on separate hostnames lets you update, secure and monitor them independently.

**Next:** [Requirements →](doc:installation/requirements)
