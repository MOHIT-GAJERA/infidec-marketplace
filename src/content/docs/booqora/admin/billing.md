---
title: Plans & Billing
description: The 14-day trial, the Starter, Pro and Business plans with monthly and yearly prices, seat limits, billing information and usage in Settings → Account and billing.
---

**Settings → Account and billing** (`/settings/billing`, file `billing_settings.dart`) shows the workspace's subscription, lets an owner or admin pick a plan and stores the billing details used on your subscription invoices.

![Account and billing](/docs/booqora/images/platform-settings-billing.webp "Current plan card, monthly / yearly toggle, plan cards, billing information and usage")

## The trial

Every new workspace starts on the **trial** plan, with `trialEndsAt` set to **14 days** after it is created.

- The **Current plan** card shows "Free trial", the days left and the end date, plus a bar with "N of 14 trial days used".
- While on the trial, the app shell shows a banner: "Your free trial ends in N days. Upgrade now and save 20% with a yearly plan." with a **Choose a plan** button.
- When the date has passed the card reads "Your trial has ended — choose a plan to continue".

:::note No automatic lock-out
The code does not block a workspace when the trial ends; it only shows the message. Add your own enforcement if you need it.
:::

## Plans

Prices are defined in `_plans` in `billing_settings.dart`. The numbers are fixed; they are formatted with the workspace's currency symbol, so the table below shows an INR workspace.

| Plan | Monthly | Yearly (−20%) | Seats | Tagline |
|---|---|---|---|---|
| **Starter** | ₹1,499 | ₹14,390 | 3 | For new rental shops getting organised |
| **Pro** (most popular) | ₹3,999 | ₹38,390 | 10 | For growing businesses taking bookings online |
| **Business** | ₹8,999 | ₹86,390 | 25 | For multi-location operations at scale |

The yearly price is `monthly × 12 × 0.8`, rounded. With **Yearly** selected each card also shows the equivalent monthly price "billed yearly". A **Save 20%** badge sits next to the Monthly / Yearly switch.

### What each plan lists

| Starter | Pro | Business |
|---|---|---|
| Up to 3 team members | Up to 10 team members | Up to 25 team members |
| Orders, inventory and customers | Everything in Starter | Everything in Pro |
| Invoices, quotes and contracts | Pricing structures and custom fields | Security controls (2FA, IP allow-lists, SSO) |
| Online store with your branding | Multiple locations | Advanced permissions |
| Email support | Reports and app integrations | Dedicated onboarding manager |
| | Priority support | |

The trial allows **5 seats**. Seat limits are applied when inviting people ([Team & Security](doc:admin/team-security)). The feature lists are marketing text: the code does not switch features on or off by plan.

## Choosing a plan

Owners and admins see a **Choose plan** button on every plan except the current one ("Current plan"). Confirming "Switch to <plan>?" writes `plan: starter | pro | business` to the workspace and shows "Plan updated to <plan>".

:::warning No card is captured
The page says "Billing is handled by the Booqora team. No card is captured in the app." Choosing a plan only changes the `plan` field. There is no subscription checkout. As the operator, you invoice your customers yourself, or connect a subscription service of your own.
:::

## Billing information

Saved as `settings.billing`:

| Field | Default |
|---|---|
| Billing email | The signed-in user's email |
| Company name | The workspace name |
| Address | |
| GST / VAT number | e.g. `22AAAAA0000A1Z5` |
| Purchase order reference | Optional |

## Usage

The **API usage** card ("Records stored in this workspace") counts **Orders**, **Products** and **Customers**, with a **Refresh** button.

## Changing the prices

To sell your own plans:

1. Edit the `_plans` list in `lib/features/settings/billing_settings.dart` (names, prices, seats, feature lines).
2. Keep the seat numbers in `_seats` in `team_settings.dart` in line (it also holds the trial's 5 seats).
3. Change the 14-day trial length in `createWorkspace` in `lib/data/session.dart`.
4. Update the public pricing page of the Marketing Website, whose plans live in `booqora_website/src/content/catalog.ts`.

Rebuild and redeploy the Rental Platform after the change.

**Next:** [Bora Assistant →](doc:admin/assistant)
