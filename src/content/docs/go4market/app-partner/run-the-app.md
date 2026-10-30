---
title: Run the App
description: Run the Partner app, sign in as a seller or a delivery partner, and fix common problems with location, camera and sign-in.
---

```bash
cd apps/partner_app
flutter pub get
flutter run
```

After the splash and onboarding, the login screen offers **Seller** and **Delivery** tabs. Sign in with the demo seller or delivery account from [Demo Instructions](doc:admin/demo-instructions). With Demo mode on, the *Demo accounts* buttons fill them in.

![Partner onboarding](/docs/go4market/images/app-partner-onboarding.webp "Onboarding: Run your store from your pocket")
![Seller login](/docs/go4market/images/app-partner-login-seller.webp "Login with the Seller role and demo shortcuts")
![Delivery login](/docs/go4market/images/app-partner-login-delivery.webp "Login with the Delivery role")

New users tap **Create account**, choose a role and complete the seller or rider registration. Users with a pending application see a waiting screen until they are approved.

## Troubleshooting

| Problem | Fix |
|---|---|
| "This account is not a seller / delivery partner" | The user has another role claim. Sign in on the matching tab, or register for that role |
| Stuck on "pending approval" | Approve the seller or rider in the Admin panel; the app refreshes the token on the next start |
| Location never updates | Allow location **all the time** (or at least while in use), allow notifications (for the foreground notification), and disable battery optimisation for the app |
| Camera scanner black screen | Grant the camera permission; test on a real device |
| Google sign-in error 10 | Add SHA-1/SHA-256 for the signing key and use the **web** client ID in `kGoogleServerClientId` |
| Orders list stays empty for riders | The rider must be **approved** and **online**, and serve the order's city |

**Next:** [Change Package Name →](doc:app-partner/change-package-name)
