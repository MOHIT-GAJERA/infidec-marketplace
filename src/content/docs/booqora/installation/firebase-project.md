---
title: Create the Firebase Project
description: Create your own Firebase project on the Blaze plan and enable Firestore, Authentication (e-mail/password and anonymous), Storage and the Hosting sites Booqora uses.
---

Every part of Booqora connects to **one Firebase project that you own**. This page creates it and turns on the services the platform uses. Allow about 20 minutes.

## 1. Create the project

:::steps
### Open the Firebase console
Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with the Google account that should own the business.

### Add project
Click **Create a project** and enter a name. Note the **Project ID** shown under the name (for example `myrentals-1a2b3`). These docs call it `<your-project-id>`.

### Google Analytics
Optional; Booqora does not need it.

### Finish
Click **Create project** and wait for the dashboard.
:::

## 2. Upgrade to the Blaze plan

Cloud Functions, Secret Manager and outgoing calls to Razorpay, Stripe, PayPal and your SMTP server need the **Blaze** plan.

1. Click **Upgrade** in the bottom-left of the console.
2. Choose **Blaze** and link a Cloud Billing account.
3. Create a **budget alert** (Google Cloud Console → Billing → Budgets & alerts).

## 3. Create the Firestore database

1. **Build → Firestore Database → Create database**.
2. Choose **Standard edition**, **Native mode**, database ID `(default)`.
3. Location **`asia-south1 (Mumbai)`**. The Cloud Functions run in `asia-south1`, so keep them together.
4. Start in **production mode**; Booqora's rules are deployed later.

:::warning The location is permanent
If you pick another region, change the functions region too. It is set in three places:

- `booqora_platform/functions/index.js`: `setGlobalOptions({ region: 'asia-south1', … })`
- `booqora_platform/lib/data/payments.dart`: `FirebaseFunctions.instanceFor(region: 'asia-south1')`
- `booqora_mobile/lib/data/payments.dart`: the same line in the Mobile App
:::

## 4. Enable Authentication

**Build → Authentication → Get started**, then on **Sign-in method** enable:

| Provider | Used by |
|---|---|
| **Email/Password** | Staff sign-in and sign-up on the Rental Platform and the Mobile App |
| **Anonymous** | The Online Store: a visitor gets an anonymous session when they send a booking request or pay |

Then, on the **Settings** tab → **Authorized domains**: `localhost`, `<your-project-id>.web.app` and `<your-project-id>.firebaseapp.com` are listed by default. Add your platform Hosting site (for example `<your-site-id>.web.app`, see step 6) and every custom domain you use later.

:::note Password reset e-mails
The **Forgot password?** link on `/forgot` uses Firebase's own reset e-mail. Customise its sender name and text under **Authentication → Templates**.
:::

## 5. Enable Cloud Storage

**Build → Storage → Get started**, same location as Firestore, **production mode**. The bucket is `<your-project-id>.firebasestorage.app`. Booqora stores product, bundle and collection images and the logo under `workspaces/{workspaceId}/…` and avatars under `users/{uid}/…`.

:::tip If images do not show on the web
Flutter Web may load images with a cross-origin request. If product photos show a broken-image icon in the platform while the image URL opens fine in a new tab, give the bucket a CORS policy that allows `GET` from your domains:

```json title="cors.json"
[{ "origin": ["*"], "method": ["GET", "HEAD"], "maxAgeSeconds": 3600 }]
```

```bash title="Terminal"
gcloud storage buckets update gs://<your-project-id>.firebasestorage.app --cors-file=cors.json
```
:::

## 6. Create the Hosting sites

Booqora uses two Hosting sites. Site IDs are **globally unique**, so you cannot reuse `booqora-platform` or `booqora-infidec`.

| Site | Serves | Example site ID |
|---|---|---|
| Default site | Marketing Website (target `website`) | `<your-project-id>` (created automatically) |
| Second site | Rental Platform and Online Store (target `platform`) | `<your-project-id>-platform` |

Create the second site in **Build → Hosting → Add another site**, or with the CLI:

```bash title="Terminal"
firebase hosting:sites:create <your-project-id>-platform --project <your-project-id>
```

You can swap them round (platform on the default site, website on a second one); only the target mapping in `.firebaserc` changes.

## 7. Register the apps

You need a **Web** app for the Rental Platform and, if you publish the Mobile App, an **Android** and an **iOS** app. The easiest way is to let the FlutterFire CLI create them in [Connect the Code](doc:installation/connect-your-project). If you prefer the console, use **Project settings → Your apps → Add app**:

| Platform | Identifier in the source | Change it? |
|---|---|---|
| Web | `Booqora` (nickname only) | Any name |
| Android | `io.booqora.booqora_mobile` | Use your own, see [Change Package Name](doc:app/change-package-name) |
| iOS | `io.booqora.booqoraMobile` | Use your own bundle ID |

## 8. Final check

Before moving on, confirm:

- [x] Plan shows **Blaze**
- [x] Firestore exists in `asia-south1`
- [x] Email/Password and Anonymous sign-in are enabled
- [x] Storage bucket exists
- [x] A second Hosting site exists for the platform

**Next:** [Connect the Code to Your Project →](doc:installation/connect-your-project)
