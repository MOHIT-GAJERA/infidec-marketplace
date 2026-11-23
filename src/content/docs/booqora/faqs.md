---
title: FAQs
description: Answers to the most common Booqora questions about Firebase, deployment, the Rental Platform, the Online Store, payments, e-mail, the Mobile App, Google Play and the Marketing Website.
---

## General

### What exactly do I get?
Four parts that share one Firebase project: the **Rental Platform** (Flutter Web, `booqora_platform/`), the **Online Store** booking page built into the platform at `/s/<workspace-slug>`, the **Mobile App** for Android and iOS (`booqora_mobile/`) and the **Marketing Website** (Next.js, `booqora_website/`). The backend is Firestore, Authentication, Storage and five Cloud Functions ([Introduction](doc:intro)).

### Do I need a VPS or my own server?
No. Everything runs on Firebase: Hosting serves the platform and the website, and Cloud Functions handle payments and e-mail. You need the **Blaze** (pay-as-you-go) plan because Cloud Functions, Secret Manager and outgoing calls to payment gateways and SMTP require it ([Third-Party Service Costs](doc:admin/third-party-costs)).

### Is Booqora for one business or many?
Many. Every person who signs up on the Rental Platform creates their own **workspace** with its own products, orders, customers, settings and Online Store. You can run it for your own rental business or offer it to other rental businesses.

### Does the platform charge workspaces for their plan automatically?
No. **Settings → Account and billing** shows the 14-day trial and lets a workspace choose Starter, Pro or Business, which updates the workspace's `plan` field. It does not take a subscription payment. Collecting subscription fees is up to you ([Plans & Billing](doc:admin/billing)).

## Installation & Firebase

### The package points at someone else's Firebase project. What do I change?
Replace the author's project (`booqora-infidec`) with yours everywhere: `booqora_platform/.firebaserc` and the platform's Firebase options, `booqora_mobile/lib/firebase_options.dart`, `google-services.json` and `GoogleService-Info.plist`, and `booqora_website/.firebaserc` ([Connect the Code to Your Project](doc:installation/connect-your-project)).

### The functions deploy fails because a secret does not exist
Every secret the functions bind must exist in Secret Manager, even for a provider you will not use ([Secrets & Environment](doc:installation/environment-configuration)). Then turn the unused provider off in **Settings → Payment providers** so it is never offered.

### The functions deploy times out during discovery
Deploy from a fast local disk and raise the timeout, for example `FUNCTIONS_DISCOVERY_TIMEOUT=60`, then run `firebase deploy --only functions` again ([Deploy Functions, Rules & Indexes](doc:installation/backend-deploy)).

### Can GitHub Actions deploy the functions too?
The included workflow analyses and builds the Rental Platform, then deploys **Hosting** (security rules best-effort). Deploy the functions from your own machine with `firebase deploy --only functions` ([Auto-Deploy with GitHub Actions](doc:installation/ci-cd)).

### Why do the Storage rules not check workspace membership?
They check the uploader instead: each file records `uploadedBy` in its metadata, and only that staff member can replace or delete it. Uploads are limited to images and PDFs. This avoids `firestore.exists()` calls, which need extra IAM permissions for the Storage service agent ([Security Rules](doc:api/security-rules)).

### Can I change the Cloud Functions region?
Yes, in three places: `setGlobalOptions({ region })` in `functions/index.js`, and `FirebaseFunctions.instanceFor(region: …)` in `lib/data/payments.dart` of both the platform and the Mobile App. Redeploy the functions and rebuild both clients.

## Rental Platform

### Which sign-in methods are supported?
E-mail and password, with password reset. Enable **Email/Password** in Firebase Authentication. The Mobile App uses the same accounts.

### How do I invite my staff?
From **Settings → Team**. Seats depend on the plan: 5 during the trial, 3 on Starter, 10 on Pro and 25 on Business ([Team, Roles & Security](doc:admin/team-security)).

### Can I change the wording or language of the platform?
**Settings → Translations** lets each workspace override the default English text. Clearing the overrides restores the defaults ([Documents & Translations](doc:admin/documents-translations)).

### Does Bora use an AI service or API key?
No. Bora is a rule-based assistant that recognises questions and answers with live data from the workspace. There is no external AI provider to configure ([Bora Assistant](doc:admin/assistant)).

## Online Store

### Where is my Online Store?
At `https://<your-platform-domain>/s/<workspace-slug>`. Set it up under **Online store** in the platform ([Online Store Overview](doc:store/overview)).

### Customers cannot place a booking on the Online Store
The store signs visitors in anonymously before it creates the order. Enable the **Anonymous** provider in Firebase Authentication, and make sure your platform domain is listed in **Authentication → Settings → Authorized domains**.

### What happens when a customer books online?
The booking arrives as an order in **Orders**. The customer gets a "We received your booking request" e-mail and the store e-mail from **Settings → General** gets a new-booking notification. Review the order and reserve it ([Customer Booking Flow](doc:store/booking-flow)).

## Payments

### Why is PayPal not offered in my store?
PayPal charges in `PAYPAL_CURRENCY` (default **USD**). If the store currency is different, for example INR, PayPal is unavailable with the reason "PayPal is set up for USD; this store uses INR." Razorpay works the same way with `RAZORPAY_CURRENCY` (default INR). Stripe charges in the store currency ([Payment Gateways](doc:admin/payment-gateways)).

### Settings → Payment providers says "Not configured"
The keys for that provider are missing on the server. Create the secrets (`RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY`, or `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`) and redeploy the functions.

### How do I switch from test to live payments?
Replace the secrets with live keys and redeploy the functions. Razorpay and Stripe are detected as live from the key prefix (`rzp_live_…`, `sk_live_…`); for PayPal set `PAYPAL_ENV=live` in `functions/.env`.

### Stripe or PayPal fails with "returnUrl is not allowed"
`createPayment` only accepts return URLs that start with an address in `ALLOWED_RETURN` in `functions/index.js`. The package lists the author's platform domains and `http://localhost`. Add your own platform domain (and custom domain) and redeploy the functions ([Payment Flow](doc:api/payment-flow)).

### Does Booqora take a commission?
No. The code adds no fee. Razorpay, Stripe and PayPal charge their own processing fees.

## Email

### Which e-mail service do I need?
Any SMTP server. Set `MAIL_HOST` and `MAIL_PORT` in `functions/.env` (defaults `smtp.gmail.com` and `587`; port `465` uses SSL) and the secrets `MAIL_USERNAME`, `MAIL_PASSWORD` and `MAIL_FROM_ADDRESS`. With Gmail, use an **app password** ([Email (SMTP) & Templates](doc:admin/email-smtp)).

### E-mails are not arriving
Check the Functions logs and the workspace's `emailLog` collection in Firestore: failed sends are stored with `status: "failed"` and the error. For new-booking notifications, also check that **Settings → General** has a store e-mail.

### Can I change "Sent by … via Booqora" at the bottom of e-mails?
That line is the fallback footer in `emailHtml()` in `functions/index.js`, used when the workspace has no `settings.emails.footer` value. Change the text there and redeploy the functions.

## Mobile App & Play Store

### Does the Mobile App need its own backend?
No. It uses the same Firebase project, accounts and data as the Rental Platform, and the same Cloud Functions for payments ([App Prerequisites](doc:app/prerequisites)).

### Can I publish on iOS?
The project includes the iOS app and an iOS Firebase configuration (bundle `io.booqora.booqoraMobile`). You need a Mac with Xcode and an Apple Developer account to build and submit it ([iOS Build & App Store](doc:app/ios)).

### The release build crashes on launch on Android 16
Keep the pinned `path_provider_android: 2.2.23` in `dependency_overrides` in `pubspec.yaml`. Version 2.3 crashes release builds on Android 16.

### Play rejects the bundle or says it is debug-signed
Create `android/key.properties` pointing at your upload keystore; `build.gradle.kts` signs the release with it. Raise `version:` in `pubspec.yaml` (for example `1.0.0+1` → `1.0.1+2`) for every upload ([Release Build & Keystore](doc:app/deployment)).

### Why can I not publish to production straight away?
New **personal** Google Play developer accounts must run a closed test with at least 12 testers for 14 days first. Organisation accounts are exempt. Google also needs a working demo account under **App content → App access** ([Google Play Listing & Review](doc:app/play-console)).

### Why does the app ask for the camera?
Only for barcode scanning. Frames are processed on the device and not collected ([Barcode Scanning](doc:app/barcode-scanning)).

## Website

### Do I have to use the Marketing Website?
No. It is optional. The Rental Platform and Online Store work without it.

### The Log in and Start free trial buttons open the author's platform
Change `PLATFORM_URL` in `booqora_website/src/lib/site.ts`, update the hard-coded links listed in [Branding, Images & SEO](doc:web/branding-seo), then rebuild and deploy.

### Does the contact form send e-mail?
No. The site is a static export with no backend, so the form opens the visitor's e-mail app with the message addressed to `site.email` ([Website Overview](doc:web/overview)).

## Customisation & Licence

### Can I rename Booqora and use my own brand?
Yes. Change the name, logo, colours and fonts in each part: [Change App Name](doc:app/change-app-name) and [Theme Colours & Fonts](doc:app/change-theme) for the Mobile App, [Website & Branding](doc:store/website) for the Online Store and [Branding, Images & SEO](doc:web/branding-seo) for the Marketing Website.

### Do I have to change the app's package name?
Yes, before your first Play upload. `io.booqora.booqora_mobile` is the author's package name ([Change Package Name](doc:app/change-package-name)).

### What does my licence allow?
The licence terms are on the product page where you bought Booqora. If you are unsure whether your use is covered, ask us before you launch ([Support](doc:support)).
