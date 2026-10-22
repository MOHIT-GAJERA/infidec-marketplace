---
title: Settings
description: Restaurant profile, change your password, see the admin team and the read-only roles & permissions matrix. Owner only.
---

**Admin → Settings** is where you set the restaurant's profile and change your own password. It also lists the admin team and shows what each role can access. You open it from the **user menu** (your initials, top right) → **Settings**. It has no sidebar icon.

![Settings](/docs/go4foodie/images/admin-settings.jpg "Admin → Settings")

:::warning Owner only
The page and every action on it require the `manage:settings` permission, and only the **OWNER** role has it. The user menu shows the **Settings** link to every role, but a Manager or Staff user who clicks it goes back to the dashboard and sees *"You do not have permission for that page."* This means Managers and Staff **cannot change their own admin password** in the panel. The owner can reset it for them (see [Admin users](doc:installation/admin-users)).
:::

The page has four cards in a two-column grid. On screens narrower than 1024 px they stack into one column.

## Restaurant Profile

*"Brand name, currency, and contact details."*

| Field | Placeholder / default | Validation |
|---|---|---|
| **Restaurant name** | Go4Foodie | At least 2 characters: *"Restaurant name is required"* |
| **Currency** | `USD` | Required |
| **Timezone** | `America/New_York` | Required |
| **Address** | — | Optional |
| **Phone** | — | Optional |
| **Email** | — | Optional; if filled it must be valid: *"Enter a valid email"* |

Click **Save changes**. The button shows a spinner while it saves, and a green **✓ Saved** appears next to it when the save succeeds. Errors appear as a red toast. The profile is stored in the `restaurantProfile/default` document.

:::note Currency and timezone are informational
The admin panel always shows amounts in **US dollars, rounded to whole dollars** (for example `$12.50` shows as `$13`), and it stores amounts with cents. It ignores the *Currency* field for formatting. Times in analytics, the dashboard's peak hour, notifications and the audit log follow the backend's `LOCAL_TZ` setting, not the *Timezone* field. See [Environment configuration](doc:installation/environment-configuration). Website and mobile payment currencies come from the gateway settings (`RAZORPAY_CURRENCY`, `STRIPE_CURRENCY`, `PAYPAL_CURRENCY`). See [Payment gateways](doc:admin/payment-gateways).
:::

## Change Password

*"Update your account password."* This changes the password of the admin account you are signed in with.

:::steps
### Enter your current password
**Current password**. If it's empty you see *"Current password is required"*.

### Enter the new password
**New password**, at least 6 characters: *"New password must be at least 6 characters"*. Press <kbd>Enter</kbd> or click **Update password**.

### Check the result
A green banner **"Password updated"** means the change worked, and the form clears. A red banner shows the error instead.
:::

| Message | Cause |
|---|---|
| Password updated | Success. Use the new password at your next sign-in |
| Current password is incorrect | The current password doesn't match |
| User not found | The admin user record no longer exists |
| Unauthorized | You are not signed in as an admin user |
| Something went wrong | Network or server error |

The new password is saved as a bcrypt hash in the locked `credentials` collection. Nobody can read it back.

## Team

*"Signed in as {name} ({ROLE})."* This card lists every **admin login user** (the `users` collection) with name, email and a role badge: **OWNER** (orange), **MANAGER** (blue), **STAFF** (grey).

The list is read-only. You can't invite, edit or remove admin users anywhere in the panel. Create them as described in [Admin users](doc:installation/admin-users). Restaurant employees (waiters, cashiers…) are a separate list managed in [Staff](doc:admin/staff).

## Roles & Permissions

*"What each role can access."* A read-only matrix with a check mark (✓) or **—** for each module and role:

| Module | OWNER | MANAGER | STAFF |
|---|---|---|---|
| Dashboard | ✓ | ✓ | ✓ |
| Orders | ✓ | ✓ | ✓ |
| Menu | ✓ | ✓ | — |
| Reservations | ✓ | ✓ | ✓ |
| Outlets | ✓ | ✓ | — |
| Staff | ✓ | ✓ | — |
| Customers | ✓ | ✓ | — |
| Inventory | ✓ | ✓ | — |
| Reports | ✓ | ✓ | — |
| Settings | ✓ | — | — |

:::tip The matrix shows 10 of the 13 permissions
The card leaves out `manage:tables` (Tables & Floor), `operate:floor` (open/close table sessions) and `manage:coupons` (Gift Cards). The full role × permission matrix and the sidebar each role sees are on [Roles & Permissions](doc:admin/roles-permissions). Roles are defined in code (`functions/src/lib/rbac.ts`), so you can't edit them from this card.
:::

**Next:** [Outlets →](doc:admin/outlets)
