---
title: Create the Firebase Project
description: Create your own Firebase project, upgrade it to Blaze, enable Firestore, Authentication and Storage, register the admin web app and create the two Hosting sites.
---

Every part of Go4Foodie connects to **one Firebase project that you own**. This page creates it and turns on the services the platform uses. Allow about 30 minutes.

Throughout these docs the example project ID is `yourrestaurant-1a2b3`. Replace it with yours everywhere.

## 1. Create the project

:::steps
### Open the Firebase console
Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with the Google account that should own the business.

### Add project
Click **Create a project** and enter a name (for example `yourrestaurant`). Note the **Project ID** shown under the name (for example `yourrestaurant-1a2b3`). You will use this ID everywhere.

### Google Analytics
Optional. Go4Foodie doesn't use it, so you can turn it off.

### Finish
Click **Create project** and wait until the project dashboard opens.
:::

## 2. Upgrade to the Blaze plan

Cloud Functions, Secret Manager, App Hosting and outgoing calls to payment gateways and SMTP need the **Blaze (pay-as-you-go)** plan.

1. At the bottom left of the console, click **Upgrade** (or ⚙ → *Usage and billing* → *Details & settings*).
2. Choose **Blaze**, link or create a **Cloud Billing account**, and confirm.
3. Create a **budget alert** straight away (Google Cloud Console → Billing → Budgets & alerts), with alerts at 50 / 90 / 100 %.

:::note
Blaze keeps the Spark plan's free quota, so a single restaurant often pays little or nothing. See [Third-Party Service Costs](doc:admin/third-party-costs).
:::

## 3. Create the Firestore database

1. **Build → Firestore Database → Create database**.
2. Choose **Standard edition** and **Native mode**, database ID `(default)`.
3. Location: **`asia-south1` (Mumbai)**. This is what `firebase/firebase.json` (`"location": "asia-south1"`) and the function expect.
4. Start in **production mode**. Go4Foodie's own rules are deployed on the next page.

:::warning The location is permanent
You can't change a Firestore database's location later. To use a region other than `asia-south1`, also change the function region and `firebase.json` **before you deploy**. See [Changing the region](doc:installation/environment-configuration#changing-the-region).
:::

## 4. Turn on Authentication

**Build → Authentication → Get started.**

That's all. **No sign-in provider needs to be enabled.** The admin panel signs in with **custom tokens** that the `api` function mints after checking the password against Firestore. The mobile app uses its own tokens and doesn't use Firebase Authentication. Clicking *Get started* turns on the Identity Toolkit API that custom-token sign-in needs.

The **Users** tab fills up by itself. Each admin login appears there as `user:<id>` the first time that person signs in.

## 5. Turn on Cloud Storage

**Build → Storage → Get started**, choose a location (the same region as Firestore if it's offered) and start in **production mode**. The default bucket is named `<project-id>.firebasestorage.app`. Menu image uploads are stored under `uploads/` and served by the function at `/api/uploads/<name>`. The Storage rules deny all direct access.

## 6. Register the admin web app

The admin panel uses the Firebase **web** configuration to sign in and listen to live data.

1. Project Overview → **Add app** → **Web** (`</>`).
2. Nickname: `Go4Foodie Admin`. You don't need to tick *Firebase Hosting* here. **Register app**.
3. Copy the values from `firebaseConfig` into `admin-app/lib/firebase_options.dart`:

```dart title="admin-app/lib/firebase_options.dart"
import 'package:firebase_core/firebase_core.dart';

class DefaultFirebaseOptions {
  static const FirebaseOptions currentPlatform = FirebaseOptions(
    apiKey: 'AIza…',
    appId: '1:123456789012:web:abc123…',
    messagingSenderId: '123456789012',
    projectId: 'yourrestaurant-1a2b3',
    authDomain: 'yourrestaurant-1a2b3.firebaseapp.com',
    storageBucket: 'yourrestaurant-1a2b3.firebasestorage.app',
  );
}
```

You can also generate the file with the FlutterFire CLI (`dart pub global activate flutterfire_cli`, then `flutterfire configure --project=yourrestaurant-1a2b3 --platforms=web` inside `admin-app/`). The generated class has the same `DefaultFirebaseOptions.currentPlatform` name that `lib/main.dart` uses.

:::tip These values are not secrets
The Firebase web config only identifies your project, so it's safe in the browser. Access is enforced by the Firestore rules and by the `api` function. If you restrict the API key later (Google Cloud → APIs & Services → Credentials), allow your admin domains and the **Identity Toolkit API**, or sign-in stops working.
:::

The mobile app doesn't need a Firebase app registration. It only talks to the API (see [Mobile App → API Configuration](doc:app/api-configuration)).

## 7. Point the source code at your project

Open `firebase/.firebaserc` and replace the shipped project with yours. Remove the old `targets` entry:

```json title="firebase/.firebaserc"
{
  "projects": { "default": "yourrestaurant-1a2b3" }
}
```

Do the same in `website/.firebaserc`.

## 8. Create the two Hosting sites

`firebase/firebase.json` deploys two Hosting **targets**:

| Target | Serves | Public folder |
|---|---|---|
| `admin` | The Flutter admin panel, `/api/**` and `/up` → function, everything else → `index.html` | `firebase/public` (filled by `scripts/copy-admin.js`) |
| `api` | `/api/**` and `/up` → function. `/` redirects to the admin site | `firebase/api-public` |

Every project already has a default site named after the project ID (`yourrestaurant-1a2b3.web.app`). Use it as the **api** site, and create one more site for the admin panel. Site names are global, so pick a unique one:

```bash
cd firebase
firebase use yourrestaurant-1a2b3
firebase hosting:sites:create yourrestaurant-admin
firebase target:apply hosting admin yourrestaurant-admin
firebase target:apply hosting api yourrestaurant-1a2b3
```

`target:apply` writes the mapping into `.firebaserc`:

```json title="firebase/.firebaserc (after target:apply)"
{
  "projects": { "default": "yourrestaurant-1a2b3" },
  "targets": {
    "yourrestaurant-1a2b3": {
      "hosting": {
        "admin": ["yourrestaurant-admin"],
        "api": ["yourrestaurant-1a2b3"]
      }
    }
  }
}
```

Then fix the redirect of the API site in `firebase/firebase.json` so that `/` goes to **your** admin site:

```json title="firebase/firebase.json (api target)"
"redirects": [
  { "source": "/", "destination": "https://yourrestaurant-admin.web.app", "type": 302 }
]
```

## Checklist

- [x] Project created, Project ID noted
- [x] Blaze plan + budget alert
- [x] Firestore (Native) in `asia-south1` (or your region, with the code changed to match)
- [x] Authentication: *Get started* clicked (no providers needed)
- [x] Storage bucket created
- [x] Web app registered, `admin-app/lib/firebase_options.dart` updated
- [x] `firebase/.firebaserc` and `website/.firebaserc` point at your project
- [x] Admin site created, `admin` and `api` targets applied, API redirect updated

**Next:** [Deploy the Backend →](doc:installation/backend-deploy)
