---
title: Create Your First Workspace
description: Sign up on your new Booqora installation, create the first workspace, and understand how owners, invites and workspaces relate.
---

Booqora does not have a separate super-admin account or a seed script. The first person to sign up on your installation simply creates the first **workspace** and becomes its **owner**. Every later sign-up does the same, unless they were invited to an existing workspace.

## 1. Sign up

:::steps
### Open the sign-up page
Go to `https://<your-platform-site-id>.web.app/signup` (or click **Start free trial** on the sign-in page).

### Enter your details
**Full name**, **Work email** and a **Password**. Tick *I agree to the Terms of Service and Privacy Policy* and continue. This creates a Firebase Authentication user and a `users/{uid}` profile document.

### You land on Set up your workspace
Because you are signed in but not yet a member of any workspace, the router sends you to `/welcome`.
:::

![Sign-up page](/docs/booqora/images/platform-signup.webp "Start your 14-day free trial: name, work e-mail and password")

## 2. Create the workspace

On **Set up your workspace** fill in:

| Field | Options | Where it ends up |
|---|---|---|
| **Company name** | Free text, e.g. *Lensly Rentals* | Workspace name, document header, store name, store address (slug) |
| **Industry** | AV / Camera, Bikes / Scooters, Event / Party, Sports / Activities, Boats / Kayaks, Tools / Construction, Vehicles / Trailers, Technology / IT, House / Storage, Clothing, Medical / Healthcare, Baby / Child care, Other | `industry` on the workspace |
| **Currency** | INR, USD, EUR, GBP, AED, AUD, CAD, SGD | *Settings → Pricing*, the Online Store and payment providers |

Click **Create workspace**.

![Create workspace](/docs/booqora/images/platform-create-workspace.webp "The onboarding screen: company name, industry and currency")

## What gets created

`Session.createWorkspace()` in `lib/data/session.dart` writes everything in **one batch**, so you never end up with half a workspace:

| Document | Contents |
|---|---|
| `workspaces/{wid}` | Name, unique `slug`, industry, `ownerId`, `plan: trial`, `trialEndsAt` (14 days), counters and default settings (general, pricing, taxes, rental period, documents, store, checkout, fulfilment, SEO, security) |
| `workspaces/{wid}/members/{uid}` | You, with `role: owner` |
| `workspaces/{wid}/collections/all-products` | The system collection *All products* |
| `workspaces/{wid}/locations/main` | *Main location*, pickup enabled, default |
| `workspaces/{wid}/emailTemplates/*` | Seven templates: order confirmation and cancellation, send quote, contract and invoice, invoice due soon and overdue |
| `publicStores/{slug}` | The public entry the Online Store uses to find your workspace |
| `users/{uid}` | `workspaceId` set to the new workspace |

The **slug** is made from the company name (`Lensly Rentals` → `lensly-rentals`). If it is taken, Booqora adds `-1`, `-2` and so on. Your store is then at `/s/lensly-rentals`.

The defaults are: timezone `Asia/Kolkata`, date format `dd-MM-yyyy`, metric units, prices exclude tax, rental pickup 09:00 and return 17:00, store enabled with brand colour `#6431DD`, and checkout payment **none** (booking requests without online payment). Change them in **Settings** and **Online store**.

![Empty dashboard](/docs/booqora/images/platform-dashboard-empty.webp "A brand-new workspace, ready for the Setup Guide")

## 3. Invite your team

Go to **Settings → Team → Invite team member**, enter an e-mail and choose **Admin** or **Member**. This writes `invites/{email}`. When that person signs up (or signs in) with the same e-mail, the `/welcome` page shows *You've been invited to join …* with an **Accept invitation** button, so they join your workspace instead of creating a new one. See [Team, Roles & Security](doc:admin/team-security).

## Owners, admins and members

| Role | Can do |
|---|---|
| **Owner** | Everything; the only one who can delete the workspace; cannot be removed |
| **Admin** | Everything in the data, plus invite, change roles and remove members |
| **Member** | Work with all workspace data; cannot manage the team |

:::note Several businesses on one installation
Because every sign-up can create a workspace, one installation can host many rental businesses, each fully isolated by the security rules. If you want a private installation for a single business, keep the sign-up link off your public pages and invite staff instead. The plan only sets the number of team seats (trial 5, Starter 3, Pro 10, Business 25) and the trial banner; nothing locks when the trial ends. See [Plans & Billing](doc:admin/billing).
:::

**Next:** [Custom Domains & SSL →](doc:installation/domains)
