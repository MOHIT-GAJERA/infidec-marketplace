---
title: Employees, Roles & Permissions
description: Create staff accounts for the admin console, and roles that decide which admin pages each employee or dispatch user can view, edit and delete in.
---

Go4Ride has two kinds of console users besides you, the **admin**:

| Account type | Claim | Created in | Typical use |
|---|---|---|---|
| **Employee** | `staff` | **Access → Employees** | Support agents, operations, finance |
| **Dispatch user** | `dispatcher` | **Dispatch → Dispatch users** ([guide](doc:admin/dispatch#dispatch-users)) | Call-centre staff watching bookings and the live map |

Both sign in to the same admin console with e-mail and password. What they see depends on their **role**.

## Roles

**Admin → Access → Roles** (*"Permissions per role"*).

![Roles](/docs/go4ride/images/admin-roles.jpg "Admin → Access → Roles")

On a new project the page is empty: *"Roles decide which admin pages staff can view, edit or delete in. Start with the defaults (Admin, Support and Dispatcher) or add your own."* Click **Create default roles**:

| Role | Type | Permissions |
|---|---|---|
| **Admin** | Admin, protected | View, edit and delete on every module |
| **Support** | System, protected | View + edit: Support dashboard, Support tickets, SOS alerts |
| **Dispatcher** | System, protected | View + edit: Dispatch monitor, Cab / Intercity / Rental / Parcel bookings, Online drivers |

**Protected** roles can't be renamed, changed or deleted (*"This is a built-in role. Its name and permissions can't be changed."*). Their edit icon opens them read-only.

### Role table

| Column | Shows |
|---|---|
| **Role** | Name, and a *Protected* badge |
| **Type** | *Admin*, *System* or *Custom* |
| **Access** | *Editable* or protected |
| **Permissions** | *Full access* or *N modules* and *N permissions* |

### Add a custom role

:::steps
### Name it
Click **Add role**. **Role name**, e.g. *Finance team*. Names must be unique: *"A role with this name already exists."*

### Tick the permissions
The matrix lists every admin module, grouped like the sidebar, with **View**, **Edit**, **Delete** and **All** columns. **Select all** ticks everything. Ticking Edit or Delete also ticks View.

### Save
Click **Create role**. You need at least one permission: *"Grant at least one permission."*
:::

Roles are stored in `roles/{id}` as `{name, type, protected, permissions: {moduleId: ["view", "edit", "delete"]}}`. A role that is assigned to staff can't be deleted: *"Finance team" is assigned to staff. Reassign them before deleting it.*

### Module ids

| Group | Modules |
|---|---|
| Overview | `dashboard` |
| Bookings | `bookings_city`, `bookings_intercity`, `bookings_rental`, `bookings_parcel` |
| People | `customers`, `drivers_all`, `drivers_approved`, `drivers_pending`, `online_drivers` |
| Dispatch | `dispatch_monitor`, `dispatch_users` |
| Support | `support_dashboard`, `support_tickets`, `sos_alerts` |
| Operations | `services`, `zones`, `rental_packages`, `vehicle_types`, `vehicle_brands`, `vehicle_models`, `document_types` |
| Growth | `offers`, `banners`, `onboarding`, `push_notifications`, `email_templates`, `achievement_badges` |
| Finance | `subscription_plans`, `subscription_history`, `payout_requests` |
| Access | `roles`, `employees` |
| System | `settings` |

## What a permission actually does

| Layer | What is enforced |
|---|---|
| **Sidebar and pages** | A staff user sees the **Dashboard** plus every module where their role has **View**. Other pages are hidden, and the panel falls back to the dashboard |
| **Firestore rules** | Staff and dispatchers can **read** operational data (users, drivers, rides, transactions, payments, tickets, SOS…). They can **update** support tickets, ticket messages and SOS alerts. Everything else (catalogue, settings, roles, staff, blocking users) is writable by **admin only** |
| **Cloud Functions** | `reviewKyc`, `approveWithdrawal`, `sendBroadcast`, `setUserRole` and the staff functions require the **admin** claim |

:::warning Edit and Delete are not enforced on their own in v1.0
The panel uses the **View** permission to show or hide pages. **Edit** and **Delete** are stored with the role but don't unlock anything beyond what the security rules allow. In practice a staff user can work **tickets and SOS alerts**; on catalogue, settings, KYC and payout pages they can look but every save fails with a permission error. Give write-heavy work to an admin account.
:::

## Employees

**Admin → Access → Employees** (*"Staff accounts"*).

![Employees](/docs/go4ride/images/admin-employees.jpg "Admin → Access → Employees")

*"Employees sign in to this console with the permissions of their role."* The table, filters and actions are the same as for dispatch users:

| Column | Shows |
|---|---|
| **Name** | Avatar and name |
| **Email** | Sign-in e-mail |
| **Phone** | Phone or — |
| **Role** | Role pill, or *No role* |
| **Created** | Date and time |
| **Active** | Switch. Off disables the sign-in account and signs the employee out at once |

### Add an employee

:::steps
### Create a role first
If the role list is empty the form says *"No roles yet. Create one under Access → Roles first."*

### Fill in the form
Click **Add employee**. **Full name** (required), **Email** (required, can't be changed later), **Phone** (optional, `+91 90000 00001` format), **Password** (at least 8 characters), **Role** (required).

### Create
**Create employee**. The `createStaffUser` function creates the Firebase Auth user, sets `{role: "staff", roleId}` and writes `staff/{uid}`. If anything fails, the half-created account is removed.
:::

Share the e-mail and password with the employee. They sign in at your admin URL.

| Action | Effect |
|---|---|
| **Edit** | Change name, phone or role. A new role re-issues the claims; the employee picks it up at their next sign-in or token refresh |
| **Deactivate** (Active off) | `updateStaff` disables the Auth user and revokes sessions |
| **Delete** | `deleteStaff` removes the Auth user and the profile. You can't delete yourself |

:::tip Changing a password
The panel can't reset a staff password. Use Firebase Console → **Authentication → Users** → the user → **Reset password**, or delete and recreate the account.
:::

**Next:** [Offers & Coupons →](doc:admin/offers)
