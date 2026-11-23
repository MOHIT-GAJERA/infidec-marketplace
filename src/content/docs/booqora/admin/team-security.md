---
title: Team & Security
description: Invite team members, the owner, admin and member roles, seat limits per plan, and the Security settings for two-factor authentication, IP restrictions and SSO.
---

A workspace can have several people working in it. Each person signs in with their own account and is stored as a **member** in `workspaces/<id>/members/<uid>`.

## Roles

| Role | How you get it | Can do |
|---|---|---|
| **Owner** | Created the workspace | Everything, including changing roles and removing members |
| **Admin** | Invited or promoted | "Full access, including settings and team management": invite and revoke invites, open Security settings, choose a plan |
| **Member** | Invited | "Can manage orders, customers and inventory" |

Only the **owner** can change another person's role (Admin or Member) or remove them. Nobody can change or remove the owner or themselves from this screen.

## Team

**Settings → Team** (`/settings/team`).

![Team settings](/docs/booqora/images/platform-settings-team.webp "Seat usage, the members table and pending invites")

The header shows "Team — N active, X seats left" and a seat bar ("N of M seats used"). Seats are counted as **active members plus pending invites**.

| Plan | Seats |
|---|---|
| Trial | 5 |
| Starter | 3 |
| Pro | 10 |
| Business | 25 |

### Inviting someone

:::steps
### Click Invite team member
Available to admins and the owner. If no seats are left you see "No seats left on your plan. Upgrade to invite more people."

### Enter the email and pick a role
Choose **Member** or **Admin** and click **Send invite**.

### The invite is stored
An `invites/<email>` document is created with the workspace ID, workspace name, role and who invited them. No email is sent by this step: tell the person to sign up or sign in with that exact address.

### They accept
When they sign in, Booqora finds the invite. The onboarding page shows "You've been invited to join <workspace>" with the role and an **Accept invitation** button. Accepting adds them as a member and deletes the invite.
:::

Pending invites are listed under **Pending invites** with the role, who invited them and when. Admins can **Revoke** an invite.

The **members table** shows name and email, role, joined date and a **You** badge on your own row. The owner gets a role menu and a remove button on other rows ("They will immediately lose access to this workspace.").

## Security

**Settings → Security** (`/settings/security`, saved as `settings.security`). Only admins and the owner can open it; members see an "admin only" message.

| Section | Setting | Default |
|---|---|---|
| Authentication | **Require two-factor authentication for all users** | Off |
| Authentication | **Require email confirmation on new devices** | On |
| IP restrictions | **Enable IP restrictions** plus a list of allowed addresses or ranges (e.g. `203.0.113.4` or `10.0.0.0/24`) | Off |
| Single sign-on (SSO) | **Require SSO**, **Identity provider login URL**, **X.509 certificate** | Off |

The SSO card also shows two read-only values to copy into your identity provider: **ACS URL (Reply URL)** `<origin>/__/auth/sso/acs` and **Entity ID (Audience)** `<origin>/sso/metadata`.

Validation on save:

- IP restrictions cannot be enabled with an empty list.
- With **Require SSO** on, the login URL must be a valid `https://` address.

:::warning These are stored preferences
In the current code the Security settings are **saved to the workspace only**. Sign-in uses Firebase Authentication with email and password, and no part of the Rental Platform, Firestore rules or Cloud Functions reads `require2fa`, `emailConfirmNewDevices`, `ipRestrictions`/`allowedIps` or the SSO fields. Turning them on does **not** enforce 2FA, block IP addresses or redirect to an identity provider. If you need these controls, they must be implemented (for example with Firebase Authentication multi-factor or Identity Platform SAML) before you rely on them.
:::

## Your own profile

Each person manages their own name and password under **Profile** (`/profile`). Password resets use the Firebase Authentication email from the **Forgot password** page (`/forgot`).

**Next:** [Apps & Integrations →](doc:admin/apps)
