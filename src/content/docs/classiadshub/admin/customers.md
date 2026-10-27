---
title: Customers & User Queries
description: Search and manage marketplace users, suspend or ban accounts, auto-approve trusted sellers, assign or remove packages, and read contact messages.
---

**Admin → Customers & Roles** holds four pages. This one covers **Customers** and **User Queries**. **Role** and **Staff Management** are in [Roles, Staff & Permissions](doc:admin/roles-permissions).

## Customers

**Admin → Customers & Roles → Customers** lists every marketplace account (buyers and sellers). Admin, super-admin and staff accounts are left out (`GET /admin/users?customers=1`), and deleted accounts are hidden. Newest first.

![Customers](/docs/classiadshub/images/admin-customers.jpg "Admin → Customers & Roles → Customers")

### Toolbar

- **Status** filter: *All*, *Active*, *Suspended*, *Banned*.
- **Search...**: matches name, email or phone.
- **Refresh**, **Columns**, **Export CSV** (`customers.csv`).
- You can open the page pre-filtered with `?q=…` (other pages link here that way).

### Columns

| Column | Shows |
|---|---|
| **Name** | Avatar and name. A green **✓** badge means the seller is verified (see [Seller Verification](doc:admin/seller-verification)) |
| **Email** | Email, or `-` for phone-only accounts |
| **Mobile** | Phone number |
| **Type** | Login type: `email`, `phone` or `google` |
| **Address** | Profile address |
| **Total Post** | Number of ads the user has posted |
| **Status** | Toggle: on = `active`, off = `suspended` |
| **Auto Approve Advertisement** | Toggle (see below) |
| **Action** | Assign package, Remove packages, View ads |

### Suspend or activate a customer

Turning **Status** off asks *"Suspend {name}? They will be signed out and can't log in."* The API (`POST /admin/users/{id}/status`):

- sets `status` to `suspended`;
- revokes the user's Firebase refresh tokens (they are signed out);
- disables the Firebase Auth account, so they cannot sign in again;
- writes `user.status` to the [Log Viewer](doc:admin/system-status#log-viewer).

Any API call from a non-active account is refused with *"Your account is suspended."* Turning the toggle on re-enables the account. The API also accepts `banned` (same effect, different label), which you can filter by. Super-admin accounts cannot be changed.

The user's ads are not touched. To hide them, use [Ads & Moderation](doc:admin/ads).

### Auto Approve Advertisement

When **Require admin approval for new ads** is on in [General settings](doc:admin/settings#advertisement-settings), every new or edited ad waits as `pending`. Turn **Auto Approve Advertisement** on for a trusted seller and their ads go live instantly (*"Ads by this customer go live instantly."*). It sets `auto_approve_ads` on the user.

### Assign a package (free)

Click the **⊕** icon. In **Assign package to {name}**, choose a **Package** (every package except discontinued ones, shown as *Name (10 ads)* or *Name (unlimited)*) and click **Assign**.

*"The package is activated immediately at no charge and recorded as an admin transaction."* The API creates a `0` transaction with gateway `admin`, an active subscription and an invoice, and the user gets a *"Payment successful"* notification. It appears in [Subscriptions & Transactions](doc:admin/transactions).

### Remove packages

Click the **⊖** icon and confirm *"Cancel all active packages of {name}?"*. All the user's active subscriptions become `cancelled`. The toast tells you how many: *"2 package(s) removed."* No refund is recorded.

### View ads

The ads icon opens [Ads & Moderation](doc:admin/ads) filtered to this user (`/ads?user_id=…`).

:::note Deleting accounts
There is no delete button for customers in the Admin Panel. Users delete their own account from the app or website (see [Profile, Verification & Account Deletion](doc:app/profile)). To block someone, suspend them.
:::

## User Queries

**Admin → Customers & Roles → User Queries**. Subtitle: *"Messages sent through the Contact Us form"*. Data: the `user_queries` collection (read-only in the API).

![User Queries](/docs/classiadshub/images/admin-user-queries.jpg "Admin → Customers & Roles → User Queries")

| Column | Shows |
|---|---|
| **Name** | Sender name |
| **Email** | Sender email |
| **Subject** | Subject |
| **Message** | First two lines |
| **Received** | Date and time |
| **Action** | **Reply by e-mail**: opens your mail client with `Re: {subject}` |

Search covers name, email, subject and message. **Export CSV** downloads `user_queries.csv`. Messages cannot be edited or deleted here.

Messages arrive through the public endpoint `POST /contact` with `name`, `email`, `subject` and `message` (all required). The reply is *"Thanks! We'll get back to you soon."*

:::note Contact form
The shipped website and app show the **Contact Us** page as content only (edit it in [CMS Pages](doc:admin/pages)); neither has a form that calls `POST /contact`. Queries imported from the earlier version appear here. To collect new ones, add a small form that posts to `/api/v1/contact`, or put your support email on the Contact Us page.
:::

**Next:** [Roles, Staff & Permissions →](doc:admin/roles-permissions)
