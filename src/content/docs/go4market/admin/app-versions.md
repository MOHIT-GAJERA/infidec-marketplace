---
title: App Versions & Force Update
description: Block old versions of the Customer and Partner apps until users update, and record the latest version for both apps.
---

**Admin → Settings → App versions** (`/settings/app-versions`) controls update prompts for both Android apps. Values are stored in `settings/platform.appVersions`.

| Field | Key | Effect |
|---|---|---|
| Minimum supported (force update) | `appVersions.customer.min` / `partner.min` | Users **below** this version see a blocking "Update required" screen |
| Latest version | `appVersions.customer.latest` / `partner.latest` | Recorded for reference and read by the Partner app |
| Play Store URL / App Store URL | `…playStoreUrl`, `…appStoreUrl` | Stored for reference |
| Message shown on the update screen | `appVersions.message` | Stored for reference |

The apps compare `min` with their own `version` from `pubspec.yaml` (the part before `+`), read with `package_info_plus`:

| App | Where the check lives | Update button opens |
|---|---|---|
| Customer app | `apps/customer_app/lib/screens/shell/main_shell.dart` (`_checkVersion`) | `market://details?id=com.go4market.customer`, falling back to the Play web URL |
| Partner app | `apps/partner_app/lib/features/common/version_gate.dart` | `playStoreUrl` in `apps/partner_app/lib/core/device.dart` |

:::warning Update the Play links when you change the package name
The update buttons use hard-coded Play URLs with the default package IDs. After [changing the package name](doc:app-customer/change-package-name), update them in `main_shell.dart` and `device.dart` too.
:::

## Releasing an update

1. Raise `version:` in the app's `pubspec.yaml`, for example `1.0.1+2`. The build number after `+` must go up with every Play upload.
2. Build and upload the AAB (see [Release Build & Keystore](doc:app-customer/deployment)).
3. When the release is live on Play, set **Latest version** to `1.0.1`.
4. Raise **Minimum supported** only when old versions must stop working, for example after a breaking backend change.

:::danger Never set the minimum above what is on Play
If **Minimum supported** is higher than the version users can download, nobody can use the app. Wait until the new version is live in every country you target.
:::

The Partner app also shows a yellow banner while **Maintenance mode** is on (see [Demo, Maintenance & System Health](doc:admin/system)).

**Next:** [Demo, Maintenance & System Health →](doc:admin/system)
