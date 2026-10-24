---
title: Setup Guide (First 10 Steps)
description: The ten things to do after installation, in order, so the Customer and Driver apps have services, vehicles, fares and documents to show and can complete a real ride.
---

A new installation is empty: no services, no vehicle types, no document types, no settings documents. The apps show empty pickers until you fill them. Work through these ten steps in order. Steps 1–8 happen in the admin panel, steps 9–10 in the apps.

:::steps
### Sign in and check the basics
Sign in with the admin you created in [Create the First Admin](doc:installation/super-admin). Switch between light and dark mode in the top bar to check that everything loads. If a list stays empty with an error, recheck that `firebase_options.dart` points at your project and that the rules were deployed.

### General settings
**Settings → General**: platform name, legal company name, GSTIN, website, default country code (`+91`), currency code (`INR`), time zone (`Asia/Kolkata`) and distance unit. Click **Save** on every settings page you open: the backend reads these documents, and a page that was never saved has no document yet. → [General & App Settings](doc:admin/settings)

![Settings](/docs/go4ride/images/admin-settings.jpg "Settings: one page per settings document")

### Load the default catalogue
While a page is empty it shows a **Load N defaults** button. Load them in this order: **Services** (Cab, Intercity Sharing, Intercity Personal, Rental, Parcel), **Vehicle types** (Bike, Auto, Mini, Sedan, SUV with their own fares), **Brands**, **Driver documents**, **Onboarding**, **Badges**, **Subscription plans** and **Email templates**. In **Settings**, do the same for **Languages**, **Currencies**, **Taxes**, **Cancellation reasons** and **Help reasons**. In **Roles**, click **Create default roles**. Then edit what doesn't fit your business. → [Services](doc:admin/services) · [Vehicle Types, Brands & Models](doc:admin/vehicles)

### Zones and rental packages
**Zones**: draw your service areas on the map and set local fares and surge. **Rental packages**: hourly packages (hours, km, price, extra per km / hour) per vehicle type. → [Zones, Fares & Surge](doc:admin/zones) · [Rental Packages](doc:admin/rental-packages)

### Driver documents and vehicle models
Check **Driver documents** (one or two sides, required, expiry required). Add the **Models** drivers can pick for each brand and vehicle type. → [Driver Documents](doc:admin/driver-documents)

### Business model and driver rules
**Settings → Business model**: commission (percentage or fixed, default 15 %), cancellation charge (default ₹25 fixed), free cancellation window (default 120 s), maximum negative wallet, and whether a ride OTP is required. **Settings → Driver & ride**: search radius (5 km), driver accept window (30 s), auto-cancel unaccepted ride (180 s), minimum driver wallet to accept rides, free waiting minutes and waiting charge per minute. → [Commission, Wallet & Settlement](doc:admin/commission-wallet)

### App settings, contact and maintenance
**Settings → App settings**: referral rewards, emergency number (default `112`), wallet top-up limits (₹50–₹10,000), minimum driver withdrawal, loyalty points. **Settings → Contact us**: the support details shown in both apps. **Settings → App theme & versions**: minimum app versions per platform. Leave **Maintenance mode** off. → [Maintenance Mode & App Versions](doc:admin/maintenance)

### Payments
**Settings → Payment methods**: keep **Cash** and **Go4Ride wallet** on, enable Razorpay, Stripe and/or PayPal with their public keys, then paste the secrets in **Settings → Payment secrets**. Start with **test keys**. → [Payment Gateways](doc:admin/payment-gateways)

### Build the apps against your project
Run `flutterfire configure` in both app folders, create `secret/app_keys.env` with your Maps key, and run both apps on real phones. → [Customer App](doc:app-customer/run-the-app) · [Driver App](doc:app-driver/run-the-app)

### Test the whole flow
Run the end-to-end test below before you invite real drivers.
:::

## Test a ride end-to-end

1. In the **Driver App**, sign in with a test phone number, register a vehicle and upload every required document.
2. In the panel, open **Drivers → Pending approval**, approve each document, then approve the driver. The driver gets *KYC approved*.
3. In the Driver App, go **online**. If you set a minimum wallet to accept rides, the driver needs at least that balance first.
4. In the **Customer App**, sign in with another test number and book a **Cab** ride near the driver, paying **Cash**. The driver gets the request card and accepts it within the accept window.
5. Driver: *Navigate to pickup* → *I've arrived* → *Start trip* (enter the rider's 4-digit OTP) → *Complete trip*.
6. Check the settlement: the ride shows `commission` and `driverEarning`. With a ₹215 fare and 10 % commission the driver's wallet goes down by ₹21.50 for a cash ride; for a wallet or online ride it goes up by ₹193.50.
7. Book a second ride, let the driver accept, wait past the free cancellation window and cancel as the rider. The rider's wallet is charged the cancellation fee and the driver's wallet receives it.
8. Top up the rider's wallet online with a gateway test card. The **payments** document becomes *paid*, the wallet is credited and a `topup` row appears in the ledger.
9. As the driver, request a withdrawal. Approve it in **Payout requests**.
10. Raise an **SOS** from an active ride and resolve it in **SOS alerts**. Open a support ticket with a photo and answer it in **Tickets**.

:::tip Clean up the test data
Delete the test accounts in Firebase **Authentication → Users** and their `users` / `drivers` documents in the Firestore console, and remove the test phone numbers from Authentication → Phone numbers for testing. Rides and ledger rows stay as test history unless you delete them in the Firestore console before going live.
:::

**Next:** [Localhost & Emulators →](doc:installation/localhost-setup)
