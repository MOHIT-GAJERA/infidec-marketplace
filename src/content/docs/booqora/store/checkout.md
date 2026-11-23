---
title: Checkout & Fulfillment
description: The Online Store checkout settings (form fields, payments in checkout, terms and conditions, after-checkout options) and the fulfillment settings for pickup and delivery.
---

Two sections decide what happens when a customer requests a booking: **Checkout** (what they fill in and pay) and **Fulfillment** (pickup or delivery). Both are saved in the workspace (`settings.checkout`, `settings.fulfillment`) and the public parts are mirrored to `publicStores/<slug>`.

![Checkout settings](/docs/booqora/images/platform-store-checkout.webp "Checkout form fields, payments in checkout, terms and after-checkout settings")

## Checkout

**Online store → Checkout** (`/online-store/checkout`).

### Checkout form fields

A list of **Name**, **Email**, **Phone** and **Address**. Drag to reorder and switch **Required** on or off. Name and email are always required and cannot be switched off.

### Payments in checkout

A banner reminds you that online payments need a provider in **Settings → Payment providers** ([Payment Gateways](doc:admin/payment-gateways)). Choose one mode:

| Mode | Stored as | Amount the customer pays after requesting |
|---|---|---|
| **Charge the full amount** | `full` | The order total (minus anything already paid) |
| **Charge a down payment (%)** | `down` | The percentage you enter (default **25%**) of the total |
| **Only charge the security deposit** | `deposit` | The deposit of the products in the cart |
| **Do not show payment options** | `none` (default) | Nothing: request only, you collect payment later |

The amount is always recalculated on the server by `createPayment` from the order and this setting, so the browser cannot change it. The payment step is shown only when at least one provider is available and the amount is at least 1. See [Online Store Payments](doc:store/payments).

Two text fields go with this section (up to 500 characters each): **Terms for amounts due later** and **Security deposit explanation**.

### Terms and conditions

| Setting | Effect in the store |
|---|---|
| **Require customers to accept terms** | A checkbox must be ticked before **Request booking** works ("Please accept the terms to continue.") |
| **Checkbox label** | Default "I accept the Terms and conditions" |
| **Terms text** | Shown in a scrollable box behind a **Read terms** / **Hide terms** link |

### After checkout

- **Back to website URL**, e.g. `https://yourwebsite.com`.
- **Order confirmation message**.

:::warning Fields that are stored only
The public store applies the **payment mode** and the **terms** settings. The form-field order and required switches, the two payment text fields, the back-to-website URL and the confirmation message are saved but not yet used by the store. The checkout form always asks for name, phone and email (all required), and the address only for delivery. The success screen always shows "Booking request received" and a **Continue browsing** button.
:::

## Fulfillment

**Online store → Fulfillment** (`/online-store/fulfillment`).

| Section | Settings |
|---|---|
| **Default fulfillment method** | **Pickup** (customers collect from your location) or **Delivery** (you deliver). Pre-selected in checkout; customers can still choose the other |
| **Pickup** | **Default pickup location**, chosen from locations with Pickup on. With none you see "No pickup locations yet." and a **Manage locations** link ([Locations](doc:admin/taxes-locations#locations)) |
| **Delivery** | **Delivery countries** (starts with your General country), *Require delivery address when selecting a rental period*, **Delivery fee** and **Free delivery over** |

In the store, the checkout offers **Pickup** and **Delivery** buttons with the default pre-selected. Choosing **Delivery** shows the address fields: **Address** and **City** (required), **State / region**, **Postal code** and **Country**. The chosen method and address are saved on the order (`fulfillment`, `deliveryAddress`).

:::note Delivery fee and countries
The default method is the only fulfillment setting the store reads today. The delivery fee, free-delivery threshold, country list and pickup location are stored for your team; add any delivery charge to the order when you confirm it in [Orders](doc:admin/orders).
:::

## What the customer sees

The **Request booking** dialog contains, in order:

1. A summary box with the rental period, item count and subtotal (if prices are shown).
2. **Your details**: Full name, Phone, Email.
3. **Fulfillment**: Pickup or Delivery, with address fields for delivery.
4. **Notes** ("Anything we should know?").
5. The terms checkbox, if required.
6. The **Total** and the **Request booking** button.

After submitting, the payment card appears if a payment mode is set. Walk through it in [The Booking Flow](doc:store/booking-flow).

**Next:** [The Booking Flow →](doc:store/booking-flow)
