---
title: Billing & Payments
description: Subscription packages and featured-ad checkout, the hosted Stripe, Razorpay and PayPal flow, Sandbox and Bank Transfer, fulfilment, invoices, refunds and the posting quota.
---

Billing lives in `functions/src/routes/billing.ts`, the gateway calls in `functions/src/lib/payments.ts`. Buyers pay **on the website only**: the mobile app has no purchases.

## What can be bought

| Purchase | Endpoint | Grants |
|---|---|---|
| **Subscription package** | `POST /subscriptions/checkout` | A subscription with `ad_limit` (or unlimited) for `duration_days`, valid for the package's categories (all categories when none are set) |
| **Featured-ad plan** | `POST /ads/{id}/feature/checkout` | `is_featured: true` on your ad until `featured_until` (+ the plan's `duration_days`, added to any featured time left) |

## Gateways

| `code` | Kind | How it works |
|---|---|---|
| `stripe` | Hosted | Creates a **Checkout Session** (`mode: payment`, one line item, `Idempotency-Key: txn_<id>`). Verified with `payment_status == "paid"`, the exact `amount_total` and the currency |
| `razorpay` | Hosted | Creates a **Payment Link** (`reference_id: txn_<id>`, `callback_method: get`). Verified with `status == "paid"`, `amount_paid` ≥ total and the currency |
| `paypal` | Hosted | Creates an **Orders v2** order (`intent: CAPTURE`, `PayPal-Request-Id: txn_<id>`). On return, an `APPROVED` order is captured; verified with `COMPLETED`, the exact value and the currency. `PAYPAL_ENV=live` selects the live API |
| `bank_transfer` | Manual | Returns a reference `bt_XXXXXXXXXX`, your `config.instructions` and `config.bank_details`. The buyer uploads a receipt; an admin confirms |
| `sandbox` | Test | Returns a reference `sbx_…`. `POST /payments/{id}/confirm` completes it (or fails it with `simulate: "fail"`) |
| `paystack`, `phonepe`, `flutterwave`, `paytabs`, `dpo` | — | Listed, **no integration**: checkout answers `422` *… is not configured.* or *… live integration is not enabled yet.* |

Only rows of `payment_gateways` with `is_active` are offered (`GET /payment-gateways`). Hosted gateways read their keys from Secret Manager and `functions/.env` ([Keys & Environment](doc:installation/environment-configuration)), not from the row's `config`.

## The hosted checkout flow

:::steps
### Start the checkout
The website calls `POST /subscriptions/checkout` (`package_id`, `gateway`) or `POST /ads/{id}/feature/checkout` (`plan_id`, `gateway`). The API creates a `pending` transaction (and, for packages, a `pending` subscription), adds tax, and asks the gateway for a checkout page.

### Redirect the buyer
The answer contains `payment.checkout_url`. The website sends the browser there.

### The buyer returns
The gateway redirects to `<frontend_url>/checkout/result?txn=<id>` (or `…&cancelled=1`). `frontend_url` comes from `settings/general.frontend_url`.

### Confirm on the server
The result page calls `POST /payments/{id}/confirm` (with `cancelled`). The API asks the gateway for the real status. **Completed**: the purchase is fulfilled. **Failed** or cancelled with nothing paid: the transaction is `failed`. Otherwise it stays `pending` (*Payment is still processing.*).

### Safety net
If the buyer never comes back, the hourly `housekeeping` job checks every `pending` hosted transaction of the last 2 days with the gateway and settles it. See [Scheduled Jobs](doc:api/scheduled-jobs).
:::

The client's word is never trusted: only the gateway's answer completes a payment. Fulfilment is idempotent: a completed transaction is never fulfilled twice.

## Endpoints

| Method | Path | Auth | Body / query | Returns |
|---|---|---|---|---|
| `POST` | `/subscriptions/checkout` | Signed in | `package_id` (required), `gateway` (required code) | `201` `{ transaction, subscription, payment }`. A package with total `0` is activated at once: *Subscription activated.* |
| `POST` | `/ads/{id}/feature/checkout` | Ad owner | `plan_id` (required), `gateway` (required) | `201` `{ transaction, payment }`. `403` *You can only feature your own ads.* |
| `POST` | `/payments/{id}/confirm` | Buyer | `cancelled` (hosted), `simulate` (`fail`, sandbox only) | The transaction with package, ad and invoice. Manual gateways: `422` *This payment must be confirmed by an administrator.* |
| `POST` | `/payments/{id}/receipt` | Buyer | Multipart `receipt` (image ≤ 5 MB, required) | Stores it in `receipts/{userId}/`, sets `payment_status: under_review`. Only while `pending` |
| `GET` | `/payments/{id}` | Buyer | — | One transaction |
| `GET` | `/transactions` | Signed in | `status`, `page` | Your transactions, newest first |
| `GET` | `/subscriptions` | Signed in | — | All your subscriptions with their package |
| `GET` | `/subscriptions/active` | Signed in | — | The newest live subscription, or `null` |
| `GET` | `/invoices` | Signed in | `page` | Your invoices |
| `GET` | `/invoices/{id}` | Owner | — | One invoice |
| `POST` | `/webhooks/payments/{gateway}` | **Public**, no signature | `transaction_id` or `reference`, `status` (`completed` · `failed`) | Handled only for `sandbox` (any transaction it finds). Unknown code: `404`; other gateways: `422` *Unhandled webhook.* See the warning below |

The `payment` object of a checkout:

| Field | Meaning |
|---|---|
| `status` | `pending` (or `completed` for free packages) |
| `requires_action` | `true` while the buyer must pay |
| `reference` | The gateway's id (`cs_…`, `plink_…`, the PayPal order id, `bt_…`, `sbx_…`) |
| `checkout_url` | Hosted gateways only |
| `instructions`, `bank_details` | Bank Transfer only |
| `message` | For example *Redirecting to PayPal…* or *Awaiting manual confirmation by an administrator.* |

## Amounts, tax and invoices

- `amount` is the package's `final_price` (price minus `discount_percent`) or the plan's `price`, in minor units.
- `tax_amount` = `amount` × **Settings → General → Tax (%)** (`commerce.tax_percent`), rounded. `total` = `amount` + `tax_amount`. The gateway charges `total` in the package's or plan's `currency_code`.
- On fulfilment the API writes an **invoice** `INV-YYYYMMDD-000123` (date + transaction id), status `paid`, and notifies the buyer (*Payment successful*).
- A **refund** (admin) sets the transaction and the invoice to `refunded`, cancels the subscription or removes the featured flag, and notifies the buyer. It does **not** send money back through the gateway: refund the payment in the gateway dashboard as well.

## Posting quota

`resolveSubscriptionForPosting()` runs on every new ad. When **Require an active package to post** is on, or **Free Ad Listing** is off, the poster needs an `active` subscription that is not past `ends_at`, covers the ad's category and has quota left (`is_unlimited`, or `ads_used < ad_limit`). Each non-draft ad adds 1 to `ads_used`.

## Sandbox and the public webhook

:::danger Remove the Sandbox gateway in production
The **Sandbox (Test)** gateway completes payments without any money: the buyer only has to call `POST /payments/{id}/confirm`.

The public `POST /webhooks/payments/sandbox` endpoint is more sensitive. It has no signature or token check, and it works as long as a `payment_gateways` row with `code: "sandbox"` **exists**, even when that row is switched off. It accepts `{ "transaction_id": …, "status": "completed" }` for **any** transaction, including a pending Stripe, Razorpay, PayPal or Bank Transfer one, and fulfils it.

On a live marketplace, switching Sandbox off (which `tools/payments/setup-payments.mjs` does) is **not enough**. Delete the `sandbox` document from `payment_gateways` in the Firestore console, or remove the webhook route from `functions/src/routes/billing.ts` and redeploy.
:::

**Next:** [Jobs Endpoints →](doc:api/jobs)
