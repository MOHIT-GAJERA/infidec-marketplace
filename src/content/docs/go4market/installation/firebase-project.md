---
title: Create the Firebase Project
description: Create your own Firebase project on the Blaze plan and enable Authentication (including phone OTP), Firestore, Storage with CORS, the web app and the two Android apps.
---

Every part of Go4Market connects to **one Firebase project that you own**. This page creates it and turns on the services the platform uses. Allow about 30 minutes.

## 1. Create the project

:::steps
### Open the Firebase console
Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with the Google account that should own the business.

### Add project
Click **Create a project** and enter a name. Note the **Project ID** shown under the name (for example `yourmarket-1a2b3`). These docs call it `<your-project-id>`.

### Google Analytics
Optional; Go4Market does not need it.

### Finish
Click **Create project** and wait for the dashboard.
:::

## 2. Upgrade to the Blaze plan

Cloud Functions, Secret Manager, scheduled jobs and outgoing calls (payment gateways, SMTP, SMS, Gemini) need the **Blaze** plan.

1. Click **Upgrade** in the bottom-left of the console.
2. Choose **Blaze** and link a Cloud Billing account.
3. Create a **budget alert** (Google Cloud Console → Billing → Budgets & alerts).

## 3. Create the Firestore database

1. **Build → Firestore Database → Create database**.
2. Choose **Standard edition**, **Native mode**.
3. Location **`asia-south1 (Mumbai)`** for India. All Cloud Functions run in `asia-south1`, so keep them together.
4. Start in **production mode**; Go4Market's rules are deployed later.

:::warning The location is permanent
If you pick another region, change the functions region too. It is set in `functions/src/index.ts` (`setGlobalOptions({ region: 'asia-south1', … })`), in `kFunctionsRegion` in `packages/g4m_core/lib/src/firebase_options.dart`, and in the `sitemap` rewrite in `firebase.json`.
:::

## 4. Enable Authentication

**Build → Authentication → Get started**, then on **Sign-in method** enable:

| Provider | Used by |
|---|---|
| **Email/Password** | Every panel and app; the Admin panel uses only this |
| **Google** | Website, Customer app, Partner app, Seller and Delivery panels |
| **Phone** | OTP sign-in on the website, both apps and the Seller/Delivery panels |
| **Anonymous** | Guest browsing and cart on the website and Customer app |

When you enable **Google**, open the provider again and copy the **Web client ID** (`<number>-<hash>.apps.googleusercontent.com`). The Android apps need it as `serverClientId` (see [Connect the Code](doc:installation/connect-your-project#4-google-sign-in-client-id)).

Then, on the **Settings** tab:

- **SMS region policy** → *Allow* only the countries you sell in (for example India). This blocks SMS-pumping fraud on phone sign-in.
- **Authorized domains** → `localhost`, `<your-project-id>.web.app` and `<your-project-id>.firebaseapp.com` are there by default. Add `<your-project-id>-admin.web.app`, `-seller.web.app`, `-delivery.web.app` and every custom domain you use later. Google and phone sign-in fail on domains that are not listed.
- **Phone numbers for testing** (Sign-in method → Phone): add a test number such as `+91 99999 00001` with code `123456`. It works on the web and Android without a real SMS, and is ideal for Play review. Remove it before launch if you do not need it.

:::note Phone sign-in on Android needs SHA fingerprints
Phone OTP and Google sign-in on Android only work after you add the app's **SHA-1 and SHA-256** fingerprints in step 7. On the web, phone sign-in uses an invisible reCAPTCHA and needs no extra setup.
:::

## 5. Enable Cloud Storage and CORS

1. **Build → Storage → Get started**, same location as Firestore, **production mode**. The bucket is `<your-project-id>.firebasestorage.app`.
2. Flutter Web downloads images with XHR, so the bucket needs **CORS**. The package ships `storage.cors.json` (GET/HEAD from any origin). Apply it once:

```bash
gcloud storage buckets update gs://<your-project-id>.firebasestorage.app --cors-file=storage.cors.json
# or, with the older tool:
gsutil cors set storage.cors.json gs://<your-project-id>.firebasestorage.app
```

:::warning Images missing on the website or panels?
If product images show in the apps but not in the browser, CORS has not been applied to the bucket. Run the command above from the repository root and hard-refresh the page.
:::

## 6. Register the web app

1. Project Overview → **Add app** → **Web** (`</>`). Nickname `Go4Market Web`. You do not need to tick Hosting here.
2. Copy the `firebaseConfig` values (`apiKey`, `appId`, `messagingSenderId`, `projectId`, `authDomain`, `storageBucket`). The website and all three panels share this one web app.

:::tip The web config is not a secret
It only identifies your project. Security comes from the Firestore and Storage rules. You can still restrict the API key to your domains later (Google Cloud → APIs & Services → Credentials).
:::

## 7. Register the two Android apps

| App | Package name (default) | Folder |
|---|---|---|
| Customer app | `com.go4market.customer` | `apps/customer_app` |
| Partner app | `com.go4market.partner` | `apps/partner_app` |

:::warning Decide your package names first
If you will publish under your own package names (for example `com.yourmarket.customer`), [change them](doc:app-customer/change-package-name) **before** registering the apps in Firebase, because `google-services.json` is tied to the package name.
:::

For each app: **Add app → Android**, enter the package name and add the **SHA-1** and **SHA-256** of your debug key (and later your upload key and the Play app-signing key):

```bash
# debug key (development)
keytool -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore -storepass android -keypass android
```

Download each `google-services.json`. You will place them in [Customer App → Firebase Setup](doc:app-customer/firebase-setup) and [Partner App → Firebase Setup](doc:app-partner/firebase-setup). Also note the **Android app ID** of each app (`1:<number>:android:<hash>`) and the **Android API key**; they go into `firebase_options.dart`.

## 8. Enable the Google Cloud APIs used by Functions

The first deploy enables most APIs automatically. Make sure these are on (Google Cloud Console → APIs & Services):

- Cloud Functions, Cloud Build, Artifact Registry, Cloud Run, Eventarc, Pub/Sub, Cloud Scheduler
- **Secret Manager** (payment, SMTP and SMS secrets)
- **Cloud Firestore Admin / Datastore** export (weekly backup)

## Checklist

- [x] Project created, Project ID noted
- [x] Blaze plan and budget alert
- [x] Firestore (Native) in `asia-south1`
- [x] Auth: Email/Password, Google, Phone, Anonymous; SMS region policy; test numbers; authorized domains
- [x] Storage bucket created and CORS applied
- [x] Web app registered, config copied
- [x] Android apps registered with SHA-1/SHA-256, `google-services.json` downloaded

**Next:** [Connect the Code to Your Project →](doc:installation/connect-your-project)
