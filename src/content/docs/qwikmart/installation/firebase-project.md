---
title: Create the Firebase Project
description: Create your own Firebase project, upgrade it to Blaze and enable Firestore, Authentication, Storage and the web app QwikMart needs.
---

Every part of QwikMart connects to **one Firebase project that you own**. This page creates it and turns on the services the platform uses. Allow about 20 minutes.

## 1. Create the project

:::steps
### Open the Firebase console
Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with the Google account that should own the business.

### Add project
Click **Create a project**, enter a name (for example `yourstore`) and note the **Project ID** shown under the name (for example `yourstore-1a2b3`). You will use this ID everywhere.

### Google Analytics
Optional. QwikMart does not need it — you can disable it.

### Finish
Click **Create project** and wait until the project dashboard opens.
:::

## 2. Upgrade to the Blaze plan

Cloud Functions and outgoing calls (payment gateways, e-mail, AI) need the **Blaze (pay-as-you-go)** plan.

1. In the bottom-left of the console click **Upgrade** (or ⚙ → *Usage and billing* → *Details & settings*).
2. Choose **Blaze**, link or create a **Cloud Billing account** and confirm.
3. Create a **budget alert** right away (Google Cloud Console → Billing → Budgets & alerts), for example ₹5,000/month with alerts at 50 / 90 / 100 %.

:::note
Blaze keeps the free quota of the Spark plan — a small store often pays little or nothing. See [Third-Party Service Costs](doc:admin/third-party-costs).
:::

## 3. Create the Firestore database

1. **Build → Firestore Database → Create database**.
2. Choose **Standard edition** and **Native mode**.
3. Location: pick the region closest to your customers — for India choose **`asia-south1 (Mumbai)`**.
4. Start in **production mode** (QwikMart's own rules are deployed in the next page).

:::warning
The database location is permanent. If you choose a region other than `asia-south1`, also change the Cloud Functions region — see [Environment Configuration](doc:installation/environment-configuration#functions-region).
:::

## 4. Enable Authentication

**Build → Authentication → Get started**, then on the **Sign-in method** tab enable:

| Provider | Why |
|---|---|
| **Email/Password** | Panel users, riders and customers who log in with e-mail |
| **Phone** | Customer OTP login |
| **Anonymous** | Guest browsing — the cart works before the customer logs in |

Then on the **Settings** tab:

- **SMS region policy** → *Allow* only the countries you sell in (for example India). This prevents SMS fraud.
- **Authorized domains** → you will add your panel and website domains here after [hosting](doc:installation/hosting).
- Optional: under **Sign-in method → Phone → Phone numbers for testing** add a test number such as `+91 9876543210` with code `123456` for development and app review. Remove it before launch.

## 5. Enable Cloud Storage

**Build → Storage → Get started**, choose the same location as Firestore and start in **production mode**. The default bucket is named `<project-id>.firebasestorage.app`.

## 6. Register the web app

The Admin Panel and the Web Portal use the Firebase **web** configuration.

1. Project Overview → **Add app** → **Web** (`</>`).
2. Nickname: `QwikMart Web` (no Firebase Hosting needed) → **Register app**.
3. Copy the `firebaseConfig` values — you need them in [Environment Configuration](doc:installation/environment-configuration):

```js title="firebaseConfig (example)"
const firebaseConfig = {
  apiKey: "AIza…",
  authDomain: "yourstore-1a2b3.firebaseapp.com",
  projectId: "yourstore-1a2b3",
  storageBucket: "yourstore-1a2b3.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123…",
};
```

:::tip These values are not secrets
The Firebase web config identifies your project; it is safe in the browser. Security comes from the Firestore and Storage **rules** you deploy next. For extra protection restrict the API key to your domains later (Google Cloud → APIs & Services → Credentials).
:::

The Android apps are registered later, in [Customer App → Firebase Setup](doc:app-customer/firebase-setup), after you have chosen their package names.

## 7. Point the source code at your project

In the downloaded package, set your project ID as the default project:

```json title="firebase/.firebaserc and .firebaserc (repository root)"
{ "projects": { "default": "yourstore-1a2b3" } }
```

## Checklist

- [x] Project created, Project ID noted
- [x] Blaze plan + budget alert
- [x] Firestore (Native) in the right region
- [x] Authentication: Email/Password, Phone, Anonymous; SMS region policy set
- [x] Storage bucket created
- [x] Web app registered, config copied
- [x] `.firebaserc` updated

**Next:** [Deploy the Backend →](doc:installation/backend-deploy)
