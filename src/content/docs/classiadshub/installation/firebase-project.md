---
title: Create the Firebase Project
description: Create your own Firebase project, upgrade it to Blaze and enable Authentication, Firestore, Storage, Cloud Messaging and two Hosting sites for ClassiAds-Hub.
---

Every part of ClassiAds-Hub connects to **one Firebase project that you own**. This page creates it and turns on the services the platform uses. Allow about 30 minutes.

## 1. Create the project

:::steps
### Open the Firebase console
Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with the Google account that should own the business.

### Add project
Click **Create a project**, enter a name (for example `yourcompany-classifieds`) and note the **Project ID** shown under the name (for example `your-project-id`). You will use this ID everywhere.

### Google Analytics
Optional. The mobile app includes Firebase Analytics and works with or without it.

### Finish
Click **Create project** and wait until the project dashboard opens.
:::

## 2. Upgrade to the Blaze plan

Cloud Functions, Secret Manager, the scheduled job and outgoing calls to Stripe, Razorpay and PayPal need the **Blaze (pay-as-you-go)** plan.

1. In the bottom-left of the console click **Upgrade** (or ⚙ → *Usage and billing* → *Details & settings*).
2. Choose **Blaze**, link or create a **Cloud Billing account** and confirm.
3. Create a **budget alert** right away (Google Cloud Console → Billing → Budgets & alerts), for example US$25/month with alerts at 50 / 90 / 100 %.

:::note
Blaze keeps the free quota of the Spark plan. A small marketplace often pays little for Firebase itself. See [Third-Party Service Costs](doc:admin/third-party-costs).
:::

## 3. Enable Authentication

**Build → Authentication → Get started**, then on the **Sign-in method** tab enable:

| Provider | Used by | Required? |
|---|---|---|
| **Email/Password** | Every account the API creates: e-mail logins, phone logins (as the synthetic e-mail `p<digits>@phone.classiadshub.app`), staff and admins | **Yes** |
| **Google** | *Continue with Google* on the website and in the app | Optional |
| **Apple** | *Continue with Apple* in the iOS app | Optional |

You don't need the **Phone** provider. Phone-number accounts sign in with a password, not an SMS code from Firebase.

Then on the **Settings** tab → **Authorized domains**, check that `localhost`, `your-project-id.firebaseapp.com` and `your-project-id.web.app` are listed. You add your own domains and the Admin Panel site later in [Hosting, Domain & SSL](doc:installation/hosting). Google sign-in only works on authorized domains.

:::tip Copy the Web API key now
Project settings (⚙) → **General** → **Web API key**. The `api` function needs it to check passwords (`WEB_API_KEY` in `functions/.env`). See [Keys & Environment](doc:installation/environment-configuration).
:::

## 4. Create the Firestore database

1. **Build → Firestore Database → Create database**.
2. Choose **Standard edition** and **Native mode**, database ID `(default)`.
3. Location: the region closest to your users, for example **`asia-south1 (Mumbai)`** or **`europe-west1`**.
4. Start in **production mode**. ClassiAds-Hub's own rules are deployed on the next page.

:::warning
The database location is permanent. See [Requirements → Choose a region](doc:installation/requirements#choose-a-region).
:::

## 5. Enable Cloud Storage

**Build → Storage → Get started**, choose a location (the same as Firestore where possible) and start in **production mode**. The default bucket is named `your-project-id.firebasestorage.app`. The API stores every upload in this bucket.

## 6. Cloud Messaging

Firebase Cloud Messaging is on by default. Check that **Firebase Cloud Messaging API (V1)** shows *Enabled* under Project settings → **Cloud Messaging**.

For web push, scroll to **Web Push certificates** and click **Generate key pair**. You paste the public key into the Admin Panel later (**Settings → Notification Settings → Web push VAPID key**, or **Settings → Firebase Settings**).

## 7. Register the web app

Project settings → **General** → **Your apps** → **Add app** → **Web** (`</>`). Name it `ClassiAds-Hub Web`. You don't need Firebase Hosting setup in this dialog. Copy the `firebaseConfig` object it shows (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`). Both the website and the Admin Panel use this config.

The mobile app gets its own Android and iOS apps when you run `flutterfire configure`. See [App → Firebase Setup](doc:app/firebase-setup).

:::note The web config is not a secret
The Firebase web configuration identifies your project. It is safe inside the website, the panel and the app. Security comes from the API's checks and the Firestore and Storage **rules** you deploy next.
:::

## 8. Create the two Hosting sites

ClassiAds-Hub publishes two static sites from one project:

1. **Build → Hosting → Get started**. The default site is named `your-project-id` (`https://your-project-id.web.app`). Use it for the **website**.
2. On the Hosting dashboard click **Add another site** and enter a site ID for the **Admin Panel**, for example `your-project-id-admin` (`https://your-project-id-admin.web.app`).

## 9. Point the repository at your project

At the repository root (next to `firebase.json`):

```bash
firebase login
firebase use --add                                         # pick your-project-id, alias it "default"
firebase target:apply hosting web your-project-id
firebase target:apply hosting admin your-project-id-admin
```

This writes `.firebaserc`. The shipped file points at the demo project, so make sure it now shows yours:

```json title=".firebaserc"
{
  "projects": { "default": "your-project-id" },
  "targets": {
    "your-project-id": {
      "hosting": {
        "web": ["your-project-id"],
        "admin": ["your-project-id-admin"]
      }
    }
  }
}
```

The `web` and `admin` target names must stay as they are: `firebase.json` refers to them.

## Checklist

- [x] Project created, Project ID noted
- [x] Blaze plan + budget alert
- [x] Authentication: Email/Password (and Google / Apple if you use them)
- [x] Web API key copied
- [x] Firestore (Native) in the right location
- [x] Storage bucket created
- [x] Cloud Messaging API (V1) enabled, VAPID key generated
- [x] Web app registered, `firebaseConfig` copied
- [x] Two Hosting sites, `.firebaserc` points at your project and sites

**Next:** [Deploy the Backend →](doc:installation/backend-deploy)
