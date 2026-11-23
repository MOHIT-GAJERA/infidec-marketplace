---
title: Demo Instructions
description: Live demo links for the Booqora Rental Platform, Online Store and Marketing Website, how to get a demo login, and a suggested 15-minute tour.
---

Use the live demo to explore Booqora before installing it, or to check how a feature is meant to behave. Everything you see in the demo is the same code that ships in the package.

## Live demo links

| What | URL |
|---|---|
| **Rental Platform** (sign in) | [booqora-platform.web.app/login](https://booqora-platform.web.app/login) |
| **Start a free trial** (creates your own workspace) | [booqora-platform.web.app/signup](https://booqora-platform.web.app/signup) |
| **Online Store** | `https://booqora-platform.web.app/s/<store-slug>`, shared with the demo login |
| **Marketing Website** | [booqora-infidec.web.app](https://booqora-infidec.web.app) |
| **Privacy policy** | [booqora-platform.web.app/privacy](https://booqora-platform.web.app/privacy) |

## Getting a demo login

There are two ways in:

1. **Create your own workspace.** Open `/signup`, enter your name, e-mail and a password, then create a workspace on the onboarding screen. You become the **owner** of an empty workspace with a 14-day trial and can try every feature. Nothing you do affects anyone else.
2. **Ask for the shared demo workspace.** A pre-filled demo account (with products, customers and orders) is shared **on request**. E-mail [contact@infidec.com](mailto:contact@infidec.com) and we will send the login. We do not publish its password, so it stays usable for everyone.

:::warning The demo is shared
The live demo runs on the author's Firebase project. Do not enter real customer data, and expect online payments to run in **test mode** only. Your own installation uses **your** Firebase project and **your** payment keys.
:::

## What the demo will not do

- **Online payments** use test or sandbox keys. Razorpay test cards and UPI test IDs work; no real money moves.
- **PayPal** is configured for USD, so it is unavailable for stores that use INR. See [Payment Gateways](doc:admin/payment-gateways).
- **Plan changes** under *Settings → Account and billing* only record the chosen plan. No card is collected; billing is arranged by the platform operator.

## Suggested tour (15 minutes)

1. **Dashboard.** Look at *Revenue this month*, *Active rentals*, *Going out* and *Coming back*, then open the **Setup Guide** from the sidebar.
2. **Inventory → New product.** Create a rental product, for example *Sony A7 IV*, priced **per day** with a quantity of 3. Tick *show in store*.
3. **Customers → New customer.** Add a customer with an e-mail address.
4. **New order.** Pick the customer, choose pickup and return dates, add the camera and a coupon if you made one. Watch the price, tax and deposit update, then click **Reserve**.
5. **Calendar.** The order appears on its pickup and return dates.
6. **The order again.** Click **Pick up** (the status becomes *started*), add a cash payment, then click **Return**.
7. **Create invoice.** From the order, create an invoice, open it under **Documents** and use **Print** or **Send**.
8. **Online store.** Open the store link from the dashboard in a private window. Choose dates, add the product to the cart and send a booking request.
9. **Orders.** The online booking arrives as a **draft** with source *online*. Reserve it.
10. **Ask Bora.** Ask "What is due back today?" and follow the links in the answer.
11. **Reports → Performance.** See the orders you just created in the charts.

![Order editor](/docs/booqora/images/platform-order.webp "An order: dates, lines, totals, payments and the Reserve / Pick up / Return actions")

![Online store](/docs/booqora/images/store-home.webp "The customer-facing Online Store")

## The Mobile App demo

A demo build of the Android app (**Booqora – Rental Management**) is available on request. Sign in with the same demo login to see the same workspace on your phone. See [App Features Tour](doc:app/features-tour).

## Questions

- E-mail: [contact@infidec.com](mailto:contact@infidec.com)
- [Support](doc:support) · [FAQs](doc:faqs)

**Next:** [Third-Party Service Costs →](doc:admin/third-party-costs)
