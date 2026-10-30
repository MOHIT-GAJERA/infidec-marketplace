---
title: FAQs
description: Answers to the most common Go4Market questions about Firebase, deployment, sign-in, payments, SMS, maps and Google Play.
---

## General

### Is the website built with Next.js?
No. The website **and** the Admin, Seller and Delivery panels are **Flutter Web** apps, compiled to static files and hosted on Firebase Hosting. The backend is Firebase only: Cloud Functions (TypeScript), Firestore, Authentication, Storage and Cloud Messaging. There is no Node, PHP or Laravel server to maintain.

### Do I need a VPS or a separate server?
No. Everything runs in your Firebase project. You need the **Blaze** (pay-as-you-go) plan because of Cloud Functions, Secret Manager and outgoing calls to payment gateways and SMTP.

### Can I run only Grocery (or only Food)?
Yes. Disable the other modules in **Admin → Settings → Modules**. See [Modules](doc:admin/modules).

### Are the apps available for iOS?
The Flutter projects include `ios/` folders, but Firebase is pre-configured for **Android** and the web only. iOS needs an iOS Firebase app, `GoogleService-Info.plist`, iOS options in `firebase_options.dart`, and testing of Razorpay and Google sign-in on iOS.

## Installation

### The functions deploy fails with "User code failed to load" or a timeout
Set `FUNCTIONS_DISCOVERY_TIMEOUT=300` and deploy from a fast local disk. See [Deploy Functions, Rules & Indexes](doc:installation/backend-deploy#discovery-timeout).

### The deploy says a secret does not exist
Every secret a function binds must exist, even for services you do not use. Create it with the value `unset` ([Secrets & functions/.env](doc:installation/environment-configuration#2-create-the-secrets)).

### Lists show "The query requires an index"
Deploy the indexes (`firebase deploy --only firestore:indexes`) and wait for them to finish building in the Firebase console.

### Images do not load on the website or panels, but do in the app
Apply `storage.cors.json` to your Storage bucket ([Create the Firebase Project](doc:installation/firebase-project#5-enable-cloud-storage-and-cors)).

### `build_all.ps1` fails looking for logo.png or icons_512.png
The script expects `logo.png` and `icons_512.png` at the **repository root**. Copy your brand files there ([Build & Deploy the Web Apps](doc:installation/hosting#3-build-the-three-panels)).

### How do I create the first admin?
With a small Admin SDK script that sets the `admin` claim ([Create the Super Admin](doc:installation/super-admin)).

## Sign-in

### Google sign-in fails on Android with error 10
Add the **SHA-1 and SHA-256** of the signing key to the Android app in Firebase (debug, upload **and** Play app-signing keys), and make sure the app uses the **web** client ID (`webClientId` / `kGoogleServerClientId`).

### Phone OTP works in debug but not in the Play build
Add the **Play app-signing** SHA-256 to Firebase. Also check the **SMS region policy** allows the user's country.

### Google or phone sign-in fails on my custom domain
Add the domain to **Authentication → Settings → Authorized domains**.

### Can I hide a sign-in method?
Remove its button in the client and disable the provider in Firebase. There is no panel toggle for login methods.

## Payments

### Razorpay payments fail at verification
The Key ID in the panel, `RAZORPAY_KEY_ID` in `functions/.env` and the `RAZORPAY_KEY_SECRET` secret must belong to the same account and mode (test or live). Redeploy the functions after changing the secret.

### After paying with Stripe or PayPal the customer lands on the wrong site
Set `WEBSITE_URL` in `functions/.env` to your domain and redeploy ([Checkout & Payment Return](doc:web/payments)).

### Why are Stripe and PayPal charging in USD?
`STRIPE_CURRENCY` and `PAYPAL_CURRENCY` default to USD, converted from INR with `settings/platform.fx.usd`. Change the currency if your account supports INR.

### Do I need a webhook?
It is strongly recommended. It marks orders paid even if the customer closes the browser before returning. Register `https://asia-south1-<your-project-id>.cloudfunctions.net/paymentWebhook` in each gateway.

## Delivery, SMS and maps

### Riders do not see any orders
They must be **approved**, **online** and serve the order's **city** (same spelling as in Settings → Cities). Only confirmed or packed home-delivery orders without a rider are in the pool.

### Is the SMS gateway needed for OTP login?
No. Sign-in OTP is sent by Firebase Authentication. The SMS gateway (Twilio, MSG91 or Fast2SMS) is optional and sends order updates and the delivery OTP ([SMS Gateway](doc:admin/sms-gateway)).

### SMS show `skipped_no_provider` or `skipped_disabled`
No provider or secrets are configured, or **Send SMS** is off in Settings → Communication.

### Do I need a Google Maps key?
No. All maps use OpenStreetMap tiles and Nominatim geocoding. For heavy traffic, switch to a commercial OSM tile provider ([Maps & Location](doc:app-customer/maps-location)).

## Google Play

### Play rejects the bundle as debug-signed
Create `android/key.properties` with your upload keystore ([Release Build & Keystore](doc:app-customer/deployment)).

### Play asks about background location for the Partner app
Riders share location while online. Submit the declaration and a short video, or remove `ACCESS_BACKGROUND_LOCATION` ([Google Play Listing & Review](doc:app-customer/play-console)).

### How do I force users to update?
Raise **Minimum supported** in Admin → Settings → App versions after the new version is live ([App Versions & Force Update](doc:admin/app-versions)).
