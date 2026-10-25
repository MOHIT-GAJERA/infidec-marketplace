---
title: Create the Firebase Project
description: Create your own Firebase project, upgrade it to Blaze and enable Authentication, Firestore, Realtime Database, Storage and Cloud Messaging for Go4Ride.
---

Every part of Go4Ride connects to **one Firebase project that you own**. This page creates it and turns on the services the platform uses. Allow about 30 minutes.

## 1. Create the project

:::steps
### Open the Firebase console
Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with the Google account that should own the business.

### Add project
Click **Create a project**, enter a name (for example `yourcompany-taxi`) and note the **Project ID** shown under the name (for example `your-project-id`). You will use this ID everywhere.

### Google Analytics
Optional. Go4Ride does not need it.

### Finish
Click **Create project** and wait until the project dashboard opens.
:::

## 2. Upgrade to the Blaze plan

Cloud Functions, outgoing calls to the payment gateways and new Storage buckets need the **Blaze (pay-as-you-go)** plan.

1. In the bottom-left of the console click **Upgrade** (or ⚙ → *Usage and billing* → *Details & settings*).
2. Choose **Blaze**, link or create a **Cloud Billing account** and confirm.
3. Create a **budget alert** right away (Google Cloud Console → Billing → Budgets & alerts), for example ₹5,000/month with alerts at 50 / 90 / 100 %.

:::note
Blaze keeps the free quota of the Spark plan. A small fleet often pays little for Firebase itself. Google Maps and SMS for phone login are billed separately. See [Third-Party Service Costs](doc:admin/third-party-costs).
:::

## 3. Enable Authentication

**Build → Authentication → Get started**, then on the **Sign-in method** tab enable:

| Provider | Used by |
|---|---|
| **Phone** | Customer App and Driver App (OTP login) |
| **Email/Password** | Admin panel, staff and dispatch users |

Then on the **Settings** tab:

- **SMS region policy** → *Allow* only the countries you operate in (for example India). This prevents SMS fraud.
- Optional: **Sign-in method → Phone → Phone numbers for testing**: add test numbers such as `+91 90000 00001` with code `123456` for development and store review. Remove them before launch.

:::tip Phone login on real devices
Android phone auth needs your app's **SHA-1 and SHA-256** fingerprints in the Firebase Android app, and iOS needs an **APNs key** uploaded under Project settings → Cloud Messaging. You add both when you register the apps in [Customer App → Firebase Setup](doc:app-customer/firebase-setup) and [Driver App → Firebase Setup](doc:app-driver/firebase-setup).
:::

## 4. Create the Firestore database

1. **Build → Firestore Database → Create database**.
2. Choose **Standard edition** and **Native mode**, database ID `(default)`.
3. Location: the region closest to your riders, for example **`asia-south1 (Mumbai)`** for India.
4. Start in **production mode**. Go4Ride's own rules are deployed on the next page.

:::warning
The database location is permanent. See [Requirements → Choose a region](doc:installation/requirements).
:::

## 5. Create the Realtime Database

Go4Ride streams live driver positions through the Realtime Database (`driver_locations/{driverId}`).

1. **Build → Realtime Database → Create Database**.
2. Location: `us-central1`, `europe-west1` or `asia-southeast1` (closest to India).
3. Start in **locked mode**. The rules in `firebase/database.rules.json` are deployed next.

Create it **before** you run `flutterfire configure`, so the generated config contains the `databaseURL` (`https://your-project-id-default-rtdb.<region>.firebasedatabase.app` or `https://your-project-id-default-rtdb.firebaseio.com`).

## 6. Enable Cloud Storage

**Build → Storage → Get started**, choose a location (the same as Firestore where possible) and start in **production mode**. The default bucket is named `your-project-id.firebasestorage.app`.

## 7. Cloud Messaging

Firebase Cloud Messaging is on by default. Check that **Firebase Cloud Messaging API (V1)** shows *Enabled* under Project settings → **Cloud Messaging**. The functions send notifications to device tokens (`fcmToken` on `users` / `drivers`) and to the topics `all`, `customers` and `drivers`.

## 8. Register the apps

You need one Firebase app per Go4Ride app and platform. The FlutterFire CLI creates them for you in [Keys & Environment](doc:installation/environment-configuration):

| Go4Ride app | Firebase app | Default ID |
|---|---|---|
| Admin Panel | Web | — |
| Customer App | Android + iOS | `com.go4ride.customer` |
| Driver App | Android + iOS | `com.go4ride.driver` |

:::tip Change the package names first
If you will publish under your own package names (for example `com.yourcompany.rider`), change them **before** registering the mobile apps. See [Customer App → Change Package Name](doc:app-customer/change-package-name) and [Driver App → Change Package Name](doc:app-driver/change-package-name).
:::

:::note The web config is not a secret
The Firebase web and app configuration identifies your project. It is safe inside the apps. Security comes from the Firestore, Storage and Realtime Database **rules** you deploy next.
:::

## 9. Point the repository at your project

At the repository root (next to `firebase.json`):

```bash
firebase login
firebase use --add      # pick your-project-id, alias it "default"
```

This writes `.firebaserc`:

```json title=".firebaserc"
{ "projects": { "default": "your-project-id" } }
```

## Checklist

- [x] Project created, Project ID noted
- [x] Blaze plan + budget alert
- [x] Authentication: Phone and Email/Password; SMS region policy set
- [x] Firestore (Native) in the right location
- [x] Realtime Database created
- [x] Storage bucket created
- [x] Cloud Messaging API (V1) enabled
- [x] `.firebaserc` points at your project

**Next:** [Deploy the Backend →](doc:installation/backend-deploy)
