---
title: App Version & Store Links
description: Set the version name and code for every release, and the store links used by the website.
---

## Version

The version is set in `pubspec.yaml`:

```yaml title="customer_app/pubspec.yaml"
version: 1.0.1+2
#        │     └─ versionCode / build number — must increase with EVERY upload
#        └─────── versionName shown to users
```

| Release | `version:` |
|---|---|
| First upload | `1.0.0+1` |
| Bug fix | `1.0.1+2` |
| New features | `1.1.0+3` |

Google Play rejects a bundle whose versionCode is not higher than the last one uploaded (on any track).

## Store links

**Admin → System Settings → App**:

| Field | Example |
|---|---|
| Play Store URL | `https://play.google.com/store/apps/details?id=com.yourstore.customer` |
| App Store URL | `https://apps.apple.com/app/id…` |
| Delivery App Play Store URL | `https://play.google.com/store/apps/details?id=com.yourstore.delivery` |

The website's "Get it on Google Play" / App Store badges use these links.

:::note Minimum version and force update
The panel also stores a minimum version and a force-update switch. In v1.0.1 the apps do not enforce them yet — encourage updates through Google Play (in-app update prompts come from Play automatically for most users).
:::

**Next:** [Run the App →](doc:app-customer/run-the-app)
