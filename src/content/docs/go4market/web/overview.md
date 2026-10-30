---
title: Website Overview
description: The Go4Market customer website, a Flutter Web storefront on Firebase Hosting with modules, search, single-screen checkout, live tracking, wallet, blog, four languages and RTL.
---

The customer website (`apps/website`) is a **Flutter Web** app, not a Node.js server. It is compiled to static files (`build/web`) and served by **Firebase Hosting** at `https://<your-project-id>.web.app` or your own domain. Like the apps, it talks directly to Firestore and the Cloud Functions in `asia-south1`.

![Website in Arabic](/docs/go4market/images/web-home-ar.webp "The website home in Arabic (RTL) with module tabs and the welcome popup")
![Website sign-in in Hindi](/docs/go4market/images/web-login-hi.webp "Sign-in in Hindi: Google, e-mail or phone OTP")

## Pages

| Route | Page |
|---|---|
| `/`, `/m/<module>` | Home (all modules, or one module), with sliders, offers, featured sections and popup |
| `/categories`, `/c/<slug>` | Category tree and category listing with filters |
| `/p/<slug>` | Product with variants, add-ons, reviews, similar products, subscribe |
| `/search?q=…` | Search, including **voice search** for several items |
| `/store/<slug>` | A seller's store page |
| `/cart` | Single-screen cart and checkout |
| `/payment/return` | Return page for Stripe and PayPal |
| `/orders`, `/orders/<id>` | Orders and live tracking with the rider on a map and the delivery OTP |
| `/wallet` | Balance, top-up, history |
| `/account` | Profile, addresses, membership, subscriptions, notifications, refer & earn, returns |
| `/wishlist` | Saved products |
| `/blog`, `/blog/<slug>`, `/faq`, `/page/<slug>` | Content |
| `/login`, `/signup`, `/forgot-password` | E-mail, Google and phone OTP sign-in; `?ref=<code>` pre-fills a referral code |

Short links such as `/about`, `/privacy`, `/membership` and `/refer` redirect to the right page.

## Highlights

- **Four languages** (English, Hindi, Gujarati, Arabic) with a full **RTL** layout ([Languages & RTL](doc:web/languages-rtl)).
- **Guest cart** with an anonymous session, merged into the account at sign-in.
- **Payments**: Razorpay Checkout.js, Stripe Checkout, PayPal, Wallet, COD ([Checkout & Payment Return](doc:web/payments)).
- **Web push** for order updates ([Web Push & SEO](doc:web/push-seo)).
- **SEO**: static meta tags and JSON-LD in `index.html`, dynamic titles, `/sitemap.xml` from a Cloud Function.
- Links to the **Seller** and **Delivery** panels ("Sell on Go4Market", "Join as a rider").

**Next:** [File Structure →](doc:web/file-structure)
