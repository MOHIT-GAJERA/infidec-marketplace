---
title: About, Policy & Contact Pages
description: About Us, Privacy Policy, Terms, FAQ, blog and support contact inside the app.
---

The app reads its content pages from Firestore — edit them in the Admin Panel and they update immediately:

| In the app (Profile) | Edit in |
|---|---|
| About Us | Admin → Pages → About Us |
| Privacy Policy | Admin → Pages → Privacy Policy |
| Terms & Conditions | Admin → Pages → Terms & Conditions |
| FAQ | Admin → FAQs |
| Blog | Admin → Blog |
| Chat with Support | Admin → Chat |

See [Pages, Blog & FAQs](doc:admin/pages).

## Support e-mail and phone

The **Help** shortcuts (call / e-mail) use `supportEmail` and `supportPhone` in `lib/core/config.dart`:

```dart title="lib/core/config.dart"
static const String supportPhone = '+919876500000';
static const String supportEmail = 'support@yourstore.com';
```

Use the same address as **Admin → System Settings → General → Support Email** and the Play Store listing.

**Next:** [App Version & Store Links →](doc:app-customer/app-version)
