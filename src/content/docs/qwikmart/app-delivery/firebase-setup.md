---
title: Firebase Setup
description: Register the Delivery Boy App in your Firebase project.
---

Exactly like the Customer App, but with the delivery app's package name. Choose the package name first ([Change Package Name](doc:app-delivery/change-package-name)).

```bash
cd delivery_app
flutterfire configure --project=yourstore-1a2b3 --platforms=android,ios,web \
  --android-package-name=com.yourstore.delivery --ios-bundle-id=com.yourstore.delivery
```

This writes `lib/firebase_options.dart`, `android/app/google-services.json` and (iOS) `GoogleService-Info.plist`.

Then add the **SHA-1 and SHA-256** of the debug key, your upload key and the Play App Signing key to the delivery Android app in Firebase (Project settings → Your apps → Add fingerprint).

:::note One google-services.json can hold both apps
If you download `google-services.json` from the console after registering both Android apps, the same file contains both package names and works in both projects.
:::

**Next:** [Change Package Name →](doc:app-delivery/change-package-name)
