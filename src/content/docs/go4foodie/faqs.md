---
title: FAQs
description: Quick answers to common Go4Foodie questions about setup, Firebase, logins, payments, QR ordering and the Play Store.
---

## General

### Do I need a server or VPS?
No. Go4Foodie runs on Firebase: Cloud Functions, Firestore, Storage, Hosting and App Hosting. You need a Google account with billing enabled (Blaze plan). A VPS is optional, only if you prefer to host the website yourself ([Deployment](doc:web/deployment)).

### Do I need PHP, MySQL or cron jobs?
No. The previous version ran on Laravel and MySQL. Version 1.0.0 is fully serverless. If you used the old version, import its database with the migration tool ([Data Migration](doc:installation/data-migration)).

### Are the Customer, Restaurant and Owner apps three separate apps?
No. It is **one** Flutter app with **one** package name. The user picks Customer App, Restaurant App or Owner App on the first screen. You publish one app on Google Play.

### Is iOS supported?
Yes, the Flutter app builds for iOS 13+. Before your first iOS build, add `NSCameraUsageDescription` to `Info.plist` for the QR scanner ([details](doc:app/deployment#ios-camera-permission)), then build and publish from a Mac with Xcode.

### Can I use Go4Foodie outside India?
Yes. Set your currency in Admin → Settings, the gateway currencies on the backend, and `LOCAL_TZ` to your restaurant's timezone. Use Stripe or PayPal where Razorpay is not available. The backend region is `asia-south1` by default ([Requirements](doc:installation/requirements)).

## Firebase

### Why is the Blaze plan required?
Cloud Functions, App Hosting and outgoing calls (payment gateways, SMTP) are only available on Blaze. You still get the free quota. See [Third-Party Costs](doc:admin/third-party-costs).

### Why is the website in asia-southeast1 and the API in asia-south1?
App Hosting has no Mumbai region. The website runs in Singapore (`asia-southeast1`) and calls the API server-to-server, so guests do not notice.

### The admin login fails right after the first deploy.
The function mints Firebase custom tokens. It needs the **IAM Service Account Credentials API** enabled and the **Service Account Token Creator** role on its service account ([Deploy the Backend](doc:installation/backend-deploy)).

### The deploy fails because a secret is missing.
Every secret (`AUTH_SECRET`, `MAIL_PASSWORD`, `RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY`, `PAYPAL_CLIENT_SECRET`) must exist, even for a gateway you do not use. Set unused ones to an empty value ([Environment Configuration](doc:installation/environment-configuration)).

## Logins

### Which account do I use in which app?
| App | Account |
|---|---|
| Admin Panel | Admin user (OWNER, MANAGER or STAFF) |
| Owner App | Admin user with role **OWNER** only |
| Restaurant App | Any admin user, or an **employee** with an app password |
| Customer App | Customer account (register in the app) |

### A staff member cannot sign in to the Restaurant App.
Set a password for them in Admin → Staff (min 6 characters) and make sure they are **Active**. Employees without a password cannot sign in ([Restaurant App](doc:app/restaurant#who-can-sign-in)).

### A customer gets "This account is inactive".
Their status is INACTIVE in Admin → Customers. Set it back to ACTIVE.

### How do I create the first admin?
Follow [Admin Users](doc:installation/admin-users).

## Ordering & QR

### QR codes open the wrong website.
QR codes encode `<WEBSITE_URL>/order?table=<code>`. Set `WEBSITE_URL` on the backend to your website domain and redeploy the function, then print the codes again.

### A scanned QR shows the normal order page instead of the table.
The table is **Inactive** or the code is wrong. Activate the table in Admin → Tables.

### Why are some pickup or booking times missing?
Slots run every 30 minutes from 10:00 to 21:30 in `LOCAL_TZ`, must be at least 30 minutes ahead, and hold up to 6 table bookings each. A wrong `LOCAL_TZ` shifts all slots ([Ordering Flows](doc:web/ordering#business-rules)).

## Payments

### Orders go through without paying.
No gateway is configured. In that case orders and gift cards are accepted without payment (demo mode). Configure Razorpay, Stripe or PayPal on the backend ([Payment Gateways](doc:admin/payment-gateways)).

### Why is PayPal not offered in the app?
PayPal's button flow does not work inside the app's WebView. The app offers Razorpay, Stripe and *Pay at restaurant*. The website offers all three gateways.

### Orders fail with "Payment verification failed".
The keys do not match (for example a test key ID with a live secret), or the payment did not complete. Check the keys and `PAYPAL_ENV`, and look at the Functions logs.

## E-mail

### No confirmation emails arrive.
Set the `MAIL_*` values and the `MAIL_PASSWORD` secret, then redeploy. Mail errors never block an order, so check the Functions logs. Gmail needs an **App Password** ([SMTP / Email](doc:admin/smtp-settings)).

## Mobile app & Google Play

### The app shows the demo restaurant.
The build still uses the default `API_BASE_URL`. Change it in `lib/core/api.dart` or pass `--dart-define=API_BASE_URL=…`. If a tester saved a server address in the app, tap **Use default server** in Server settings ([API Configuration](doc:app/api-configuration)).

### "This package name is already in use".
Another developer owns that application ID. Choose a different one before your first upload ([Change Package Name](doc:app/change-package-name)).

### Which URLs does Google Play need?
A privacy policy (`/privacy` on your website) and an account-deletion option: in the app, plus a public web page. The app does not include account deletion yet, so add it before you submit ([Release & Play Store](doc:app/deployment)).

### Does a personal developer account need a closed test?
Yes. Personal accounts created after November 2023 need 12 testers for 14 days before production. Organisation accounts do not.

### Does the app have push notifications?
No. Staff screens refresh automatically (floor every 8 s, orders every 10 s, dashboard every 30 s), and customers see status changes in the order detail. Customers also get emails.

## Customisation

### Where do I change colours, logo and app name?
App: [App Name, Icon & Splash](doc:app/branding) and [Theme](doc:app/change-theme). Website: [Configuration & Theming](doc:web/configuration).
